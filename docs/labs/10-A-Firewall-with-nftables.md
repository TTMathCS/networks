# Lab 10. A firewall with nftables

*In this lab you write a real stateful firewall with nftables, the Linux packet filter, first for a single server and then for a router between two networks, and test every rule from both sides. You will see connection tracking at work and learn to debug rules with counters, logs and tracing.*

!!! abstract "In this lab"
    **You will:** read the nftables model (tables, chains, hooks, rules); write a default-deny host firewall that
    allows SSH and HTTPS; watch connection tracking; firewall a router between two subnets; add rate limits and
    logging; test from outside with nc and nmap; save the rules.

    **You need:** [Lab 7](07-A-Network-on-One-Laptop.md) (namespaces); [security book, chapter 11](../books/security/11-Firewalls-and-Segmentation.md). Time: 45 minutes.

## 1. The model

nftables organises rules in **tables** (by family: `ip`, `ip6`, or `inet` for both) holding **chains**. A **base
chain** attaches to a **hook** in the kernel's packet path:

| Hook | Sees packets |
| --- | --- |
| `input` | addressed to this machine |
| `output` | sent by this machine |
| `forward` | passing through (routing) |
| `prerouting`, `postrouting` | before and after the routing decision (NAT) |

Each chain has a **policy** (`accept` or `drop`) for packets no rule decides. Rules are read top to bottom.

## 2. A host to protect

Use two namespaces joined by a cable: `srv` (10.9.0.1) and `cli` (10.9.0.2). As root:

```bash
ip netns add srv; ip netns add cli
ip link add v-srv type veth peer name v-cli
ip link set v-srv netns srv; ip link set v-cli netns cli
ip -n srv addr add 10.9.0.1/24 dev v-srv; ip -n cli addr add 10.9.0.2/24 dev v-cli
ip -n srv link set v-srv up; ip -n cli link set v-cli up
ip -n srv link set lo up; ip -n cli link set lo up
# three "services" on srv: 22, 443 and 8080
for p in 22 443 8080; do ip netns exec srv nc -lk -p $p -e /bin/cat 2>/dev/null & done
```

(If your `nc` does not support `-e`, use `ip netns exec srv python3 -m http.server $p &` instead.) Check what is open
before the firewall:

```bash
ip netns exec cli nmap -Pn -p 22,443,8080,9999 10.9.0.1
```

22, 443 and 8080 show **open**; 9999 **closed** (the kernel answers RST).

## 3. Default deny for the server

Save as `host.nft`:

```
flush ruleset
table inet filter {
  chain input {
    type filter hook input priority 0; policy drop;
    ct state established,related accept      # replies to connections we allowed
    ct state invalid drop
    iif lo accept                            # local programs talking to each other
    meta l4proto { icmp, ipv6-icmp } accept  # ping, path MTU, IPv6 neighbour discovery
    tcp dport 22 ct state new limit rate 10/minute accept
    tcp dport 443 accept
    counter log prefix "nft-drop: " drop
  }
  chain output {
    type filter hook output priority 0; policy accept;
  }
}
```

Load it inside `srv` and scan again:

```bash
ip netns exec srv nft -f host.nft
ip netns exec srv nft list ruleset
ip netns exec cli nmap -Pn -p 22,443,8080,9999 10.9.0.1
```

Now 22 and 443 are **open**, but 8080 and 9999 are **filtered**: the packets are dropped silently, so the scanner
gets no answer at all ([security book, chapter 17](../books/security/17-Testing-Your-Own-Network.md)). The service on
8080 is still running; the firewall hides it.

## 4. Connection tracking

Open a connection to port 443 and keep it open: `ip netns exec cli nc 10.9.0.1 443`. In another terminal:

```bash
ip netns exec srv conntrack -L     # install with: apt install conntrack
```

You will see the TCP connection in state `ESTABLISHED` with both directions' addresses and ports. The first rule
(`ct state established,related accept`) lets every later packet of it pass quickly. That is what makes this a
**stateful** firewall: the rules talk only about *new* connections.

## 5. Rate limit and logs

The SSH rule accepts at most 10 new connections a minute (with a small burst); extra attempts fall through to the
drop at the end. Try it:

```bash
for i in $(seq 1 20); do ip netns exec cli nc -z -w1 10.9.0.1 22 && echo ok $i; done
```

The first several succeed, then they stop. Dropped packets are logged by the kernel: `dmesg | grep nft-drop` (logging
from inside a namespace may need `sysctl net.netfilter.nf_log_all_netns=1` on the host). The `counter` keyword counts
packets and bytes: `ip netns exec srv nft list chain inet filter input`.

## 6. Firewall a router

Now use the router `r` from [Lab 7](07-A-Network-on-One-Laptop.md) (rebuild it if you cleaned up). Policy: the user
network 10.0.1.0/24 may start any connection to the server network 10.0.2.0/24, but servers may start nothing towards
users, except ping. Save as `router.nft` and load it in `r`:

```
flush ruleset
table inet filter {
  chain forward {
    type filter hook forward priority 0; policy drop;
    ct state established,related accept
    ct state invalid drop
    iifname "r-eth0" oifname "r-eth1" accept                 # users -> servers: allowed
    iifname "r-eth1" oifname "r-eth0" icmp type echo-request accept
    counter drop
  }
}
```

Test: `ip netns exec h1 ping 10.0.2.13` works (and its replies pass as established); start
`ip netns exec h1 python3 -m http.server 8000` and try `ip netns exec h3 curl -m 3 http://10.0.1.11:8000`: it times out.
This is segmentation ([security book, chapter 11](../books/security/11-Firewalls-and-Segmentation.md)) in a dozen lines.

## 7. Debugging and saving

- `nft monitor trace` with a rule `meta nftrace set 1` in a chain shows every rule a packet meets.
- Watch for rule order: a broad `accept` above a specific `drop` makes the drop useless.
- On a real server, save rules in `/etc/nftables.conf` and enable them at boot: `systemctl enable nftables`.
- When changing a remote server's firewall over SSH, keep a second session open and use a timed undo
  (`sleep 120 && nft flush ruleset &`) in case you lock yourself out.

Clean up with `ip netns del srv; ip netns del cli`.

## Check yourself

??? question "1. Why does port 8080 show 'filtered' rather than 'closed' after the firewall?"
    The firewall drops the SYN silently, so no RST or ICMP comes back; 'closed' means the host answered with RST.

??? question "2. Why do the replies from the server not need their own accept rule?"
    The `ct state established,related accept` rule matches all packets of connections that were allowed to start.

??? question "3. In the router policy, can a server reply to a user's web request? Can it start one?"
    It can reply (established traffic is accepted); it cannot start a new connection to the user network, except ping.

??? question "4. Why keep ICMP and ICMPv6 open on the input chain?"
    Path MTU discovery needs 'packet too big' messages, and IPv6 needs neighbour discovery to work at all; ping helps diagnosis.

??? info "Sources"
    - nftables wiki (wiki.nftables.org): Quick reference, Simple ruleset for a server, Connection tracking, Ruleset debug/tracing; `nft(8)` manual.
    - Netfilter project (netfilter.org), `conntrack(8)`; RFC 4890 (recommendations for filtering ICMPv6).
