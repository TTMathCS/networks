# Lab 3. Interfaces and routes

*Your computer already is a small router: it has interfaces, addresses, a routing table and a neighbour cache. In this lab you read all of them with the modern Linux tools, and see how your computer decides where each packet goes.*

!!! abstract "In this lab"
    **You will:** list interfaces and addresses (IPv4 and IPv6); read the routing table and ask which route a packet
    uses; see the ARP / neighbour cache; list listening and connected sockets with `ss`; add and remove an address and
    a route.

    **You need:** [Lab 1](01-Your-Lab.md); [networks book, chapters 8–11](../books/networks/08-IPv4-Addressing-and-Subnets.md). Time: 25 minutes.

## 1. Interfaces and addresses

```bash
ip -br link        # interfaces and their state
ip -br addr        # with addresses
ip addr show dev enp0s1   # details for one (use your interface name)
```

You will see `lo` (loopback, `127.0.0.1` and `::1`) and one or more real interfaces (names like `enp0s3`, `eth0`,
`wlan0`). In the detail view, `inet 10.0.2.15/24` is an IPv4 address with a /24 prefix (subnet mask 255.255.255.0);
`inet6 fe80::.../64 scope link` is an IPv6 **link-local** address every IPv6 interface makes for itself; `link/ether`
is the MAC address. `mtu 1500` is the largest packet the interface sends.

On macOS use `ifconfig`, on Windows `ipconfig /all`.

## 2. The routing table

```bash
ip route
ip -6 route
```

A typical VM shows:

```
default via 10.0.2.2 dev enp0s3 proto dhcp metric 100
10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.15
```

The second line says the local subnet is reached directly; the first says everything else goes to the **default
gateway** 10.0.2.2. The kernel picks the route with the **longest matching prefix**
([networks book, chapter 11](../books/networks/11-Routers-and-Forwarding.md)). Ask it directly:

```bash
ip route get 1.1.1.1
ip route get 10.0.2.7
```

The first goes `via 10.0.2.2`; the second is delivered directly on the link.

## 3. Neighbours (ARP and NDP)

To send to the gateway on Ethernet, your computer needs its MAC address. It asks with ARP (IPv4) or Neighbor Discovery
(IPv6) and caches the answer:

```bash
ip neigh
```

```
10.0.2.2 dev enp0s3 lladdr 52:54:00:12:35:02 REACHABLE
```

States: `REACHABLE` (recently confirmed), `STALE` (cached but not recently confirmed; it will be checked on next use),
`FAILED` (no answer). Ping another device on your subnet and run `ip neigh` again to see a new entry. Remember that
nothing authenticates these entries ([security book, chapter 5](../books/security/05-Attacks-on-the-Local-Network.md)).

## 4. Sockets

`ss` lists sockets, the endpoints programs use:

```bash
ss -tlnp     # TCP, listening, numeric, with process (needs sudo for others' processes)
ss -ulnp     # UDP listening
ss -tn       # current TCP connections
```

`0.0.0.0:22` or `[::]:22` means the SSH server listens on all addresses; `127.0.0.1:631` listens only locally, so no
other machine can reach it. Each connection shows its local and peer address and port and its TCP state
(`ESTAB`, `TIME-WAIT` ...). Open a web page with `curl -s https://example.com > /dev/null &` and quickly run `ss -tn`
to catch the connection to port 443.

## 5. Change things (in your VM)

Add a second address, a route, then remove both:

```bash
sudo ip addr add 192.0.2.10/24 dev enp0s3      # 192.0.2.0/24 is reserved for documentation
ip -br addr
sudo ip route add 198.51.100.0/24 via 192.0.2.1
ip route get 198.51.100.7                      # now uses your new route
sudo ip route del 198.51.100.0/24
sudo ip addr del 192.0.2.10/24 dev enp0s3
```

Changes made with `ip` disappear on reboot; permanent settings live in Netplan (`/etc/netplan/`) or NetworkManager.

## 6. DHCP and DNS settings

Where did your address come from? `ip addr` shows `dynamic` and a lifetime for DHCP addresses. Your DNS servers:

```bash
resolvectl status       # on systems using systemd-resolved
cat /etc/resolv.conf
```

## Check yourself

??? question "1. Your table has `default via 192.168.1.1` and `10.8.0.0/16 via 10.0.0.1`. Which route does a packet to 10.8.3.4 use?"
    The 10.8.0.0/16 route: it is the longest (most specific) matching prefix.

??? question "2. What does an address starting fe80:: tell you?"
    It is an IPv6 link-local address, valid only on that link; every IPv6 interface has one.

??? question "3. A service shows `127.0.0.1:5432` in `ss -tln`. Can another computer connect to it?"
    No; it listens only on the loopback address.

??? question "4. Why does `ip neigh` show the gateway but not a web server you just visited?"
    Your computer only needs MAC addresses for neighbours on the same link; packets to the web server go to the gateway's MAC.

??? info "Sources"
    - `ip(8)`, `ip-route(8)`, `ip-neighbour(8)`, `ss(8)` manual pages (iproute2).
    - RFC 5737 (documentation addresses), RFC 4291 (IPv6 addressing), RFC 826 (ARP), RFC 4861 (Neighbor Discovery).
