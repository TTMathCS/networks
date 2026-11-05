# Lab 7. A network on one laptop

*Linux can split one machine into many isolated network stacks, called namespaces, and join them with virtual cables, switches and routers. In this lab you build a small two-subnet network with three hosts, a switch and a router, all inside your VM, and watch packets cross it.*

!!! abstract "In this lab"
    **You will:** create network namespaces (virtual hosts); connect them with veth pairs (virtual cables); build a
    bridge (virtual switch); turn a namespace into a router; add default routes; test with ping and traceroute; watch
    ARP and forwarding with tcpdump; clean up.

    **You need:** a Linux VM ([Lab 1](01-Your-Lab.md)) with root; [networks book, chapters 6 and 11](../books/networks/06-Ethernet-and-Switches.md). Time: 40 minutes.

## 1. The plan

<figure class="mars-fig">
<svg viewBox="0 0 640 180" role="img" aria-label="Lab topology: h1 and h2 on a bridge, router r, h3 on a second subnet">
<rect x="10" y="20" width="110" height="44" rx="8" class="na-f"/><text x="65" y="40" text-anchor="middle">h1</text><text x="65" y="56" text-anchor="middle" font-size="11">10.0.1.11</text>
<rect x="10" y="116" width="110" height="44" rx="8" class="na-f"/><text x="65" y="136" text-anchor="middle">h2</text><text x="65" y="152" text-anchor="middle" font-size="11">10.0.1.12</text>
<rect x="190" y="68" width="100" height="44" rx="8" class="nb-f"/><text x="240" y="95" text-anchor="middle">br0</text>
<rect x="360" y="68" width="110" height="44" rx="8" class="nd-f"/><text x="415" y="88" text-anchor="middle">router r</text><text x="415" y="104" text-anchor="middle" font-size="10">.1 | .1</text>
<rect x="530" y="68" width="100" height="44" rx="8" class="nc-f"/><text x="580" y="88" text-anchor="middle">h3</text><text x="580" y="104" text-anchor="middle" font-size="11">10.0.2.13</text>
<line x1="120" y1="42" x2="190" y2="82" stroke="currentColor" stroke-width="2"/><line x1="120" y1="138" x2="190" y2="98" stroke="currentColor" stroke-width="2"/>
<line x1="290" y1="90" x2="360" y2="90" stroke="currentColor" stroke-width="2"/><line x1="470" y1="90" x2="530" y2="90" stroke="currentColor" stroke-width="2"/>
<text x="150" y="172" text-anchor="middle" font-size="12">10.0.1.0/24</text><text x="500" y="135" text-anchor="middle" font-size="12">10.0.2.0/24</text>
</svg>
<figcaption>Hosts h1 and h2 share a switch (bridge); router r joins subnet 10.0.1.0/24 to 10.0.2.0/24, where h3 lives.</figcaption>
</figure>

A **network namespace** has its own interfaces, addresses, routes and firewall, like a separate computer. A **veth
pair** is a virtual cable: what goes in one end comes out the other. A **bridge** is a software Ethernet switch.

## 2. Create hosts, router and switch

Run these as root (`sudo -i`), in order:

```bash
for n in h1 h2 h3 r; do ip netns add $n; done
ip link add br0 type bridge
ip link set br0 up

# cables: h1 - br0, h2 - br0, r - br0, r - h3
ip link add h1-eth0 type veth peer name br-h1
ip link add h2-eth0 type veth peer name br-h2
ip link add r-eth0  type veth peer name br-r
ip link add r-eth1  type veth peer name h3-eth0

# put each end in its place
ip link set h1-eth0 netns h1
ip link set h2-eth0 netns h2
ip link set r-eth0  netns r
ip link set r-eth1  netns r
ip link set h3-eth0 netns h3
for p in br-h1 br-h2 br-r; do ip link set $p master br0; ip link set $p up; done
```

## 3. Addresses and links up

```bash
ip -n h1 addr add 10.0.1.11/24 dev h1-eth0
ip -n h2 addr add 10.0.1.12/24 dev h2-eth0
ip -n r  addr add 10.0.1.1/24  dev r-eth0
ip -n r  addr add 10.0.2.1/24  dev r-eth1
ip -n h3 addr add 10.0.2.13/24 dev h3-eth0
for n in h1 h2 h3 r; do ip -n $n link set lo up; done
ip -n h1 link set h1-eth0 up; ip -n h2 link set h2-eth0 up; ip -n h3 link set h3-eth0 up
ip -n r link set r-eth0 up;   ip -n r link set r-eth1 up
```

`ip -n h1 ...` runs the command inside namespace h1. Test the switch:

```bash
ip netns exec h1 ping -c 2 10.0.1.12     # h1 -> h2 through br0: works
ip netns exec h1 ping -c 2 10.0.2.13     # h1 -> h3: "Network is unreachable"
```

h1 has no route to 10.0.2.0/24. Look: `ip -n h1 route` shows only its own subnet.

## 4. Make r a router

Two things are needed: hosts must send off-subnet traffic to r (a **default route**), and r must **forward** packets
between its interfaces.

```bash
ip -n h1 route add default via 10.0.1.1
ip -n h2 route add default via 10.0.1.1
ip -n h3 route add default via 10.0.2.1
ip netns exec r sysctl -w net.ipv4.ip_forward=1

ip netns exec h1 ping -c 3 10.0.2.13          # now works
ip netns exec h1 traceroute -n 10.0.2.13       # two hops: 10.0.1.1, then 10.0.2.13
```

Look at the TTL in the ping replies: 63 instead of 64, because the router lowered it by one.

## 5. Watch it work

In a second terminal, capture on the router's two sides while h1 pings h3 (clear h1's ARP cache first with
`ip -n h1 neigh flush all`):

```bash
ip netns exec r tcpdump -n -e -i r-eth0     # terminal 2
ip netns exec r tcpdump -n -e -i r-eth1     # terminal 3
```

`-e` shows MAC addresses. On r-eth0 you will see h1's ARP request "who-has 10.0.1.1", r's reply, then ICMP from h1's
MAC to r's MAC. On r-eth1, the same IP packet leaves with **new MAC addresses** (r-eth1 to h3) but the **same IP
addresses**: routers rewrite layer 2 and keep layer 3, exactly as in
[networks book, chapter 11](../books/networks/11-Routers-and-Forwarding.md).

Also look at the switch learning MAC addresses: `bridge fdb show br br0`.

## 6. Experiments

- Measure throughput across the router: `ip netns exec h3 iperf3 -s &` then `ip netns exec h1 iperf3 -c 10.0.2.13`.
- Add delay and loss to one link with `tc`, then ping again:
  `ip netns exec r tc qdisc add dev r-eth1 root netem delay 50ms loss 2%`. The RTT rises by 50 ms and some pings go
  missing; repeat the iperf3 test to see TCP slow down
  ([networks book, chapter 17](../books/networks/17-Congestion-Control.md)).
- Turn forwarding off (`net.ipv4.ip_forward=0`) and watch traffic stop at r.

## 7. Clean up

Deleting a namespace deletes its interfaces and the veth pairs with them:

```bash
for n in h1 h2 h3 r; do ip netns del $n; done
ip link del br0
```

Keep a copy of the commands in a script (`lab7.sh`); labs 8, 10 and 11 build on the same idea.

## Check yourself

??? question "1. Why could h1 reach h2 before any routes were added?"
    They are on the same subnet, joined by the bridge; delivery is by ARP and Ethernet switching, no router needed.

??? question "2. What two changes turned r into a working router?"
    Hosts got default routes pointing to r, and IP forwarding was enabled in r.

??? question "3. Which addresses change as the ping crosses r, and which stay the same?"
    The Ethernet (MAC) source and destination change on each link; the IP source and destination stay the same (only TTL and the checksum change).

??? question "4. After adding 50 ms of delay on r-eth1, how much does the ping RTT from h1 to h3 grow?"
    By about 50 ms: netem delays packets leaving r towards h3 once per round trip (replies leaving h3 are not delayed).

??? info "Sources"
    - `ip-netns(8)`, `veth(4)`, `bridge(8)`, `tc-netem(8)` manual pages; Linux kernel documentation, *IP sysctl* (ip_forward).
    - B. Lantz, B. Heller, N. McKeown, "A Network in a Laptop: Rapid Prototyping for Software-Defined Networks" (Mininet), HotNets 2010.
