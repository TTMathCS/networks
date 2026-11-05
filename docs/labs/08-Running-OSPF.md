# Lab 8. Running OSPF

*Static routes do not scale and do not react to failures. In this lab you run OSPF, the link-state routing protocol used inside most large networks, on three virtual routers with FRRouting, watch them find each other and build routes, then cut a link and see them reroute in seconds.*

!!! abstract "In this lab"
    **You will:** build a triangle of three router namespaces; run FRR's OSPF daemon in each; see neighbours,
    the link-state database and the routes OSPF computed; change a link cost and watch Dijkstra's choice change; break a
    link and measure convergence.

    **You need:** [Lab 7](07-A-Network-on-One-Laptop.md) done; FRR installed (`sudo apt install frr`);
    [networks book, chapters 12–13](../books/networks/13-OSPF-and-BGP.md). Time: 45 minutes.

## 1. The topology

Three routers in a triangle, each with a "LAN" on a loopback-style dummy interface:

| Link | Subnet | Ends |
| --- | --- | --- |
| r1–r2 | 10.12.0.0/30 | r1 .1, r2 .2 |
| r2–r3 | 10.23.0.0/30 | r2 .1, r3 .2 |
| r1–r3 | 10.13.0.0/30 | r1 .1, r3 .2 |
| LANs | 192.168.1.0/24, .2.0/24, .3.0/24 | on r1, r2, r3 |

## 2. Build it

As root:

```bash
for n in r1 r2 r3; do ip netns add $n; ip -n $n link set lo up; ip netns exec $n sysctl -qw net.ipv4.ip_forward=1; done
link() {  # link nsA ifA addrA nsB ifB addrB
  ip link add $2 type veth peer name $5
  ip link set $2 netns $1; ip link set $5 netns $4
  ip -n $1 addr add $3 dev $2; ip -n $4 addr add $6 dev $5
  ip -n $1 link set $2 up; ip -n $4 link set $5 up
}
link r1 r1-r2 10.12.0.1/30 r2 r2-r1 10.12.0.2/30
link r2 r2-r3 10.23.0.1/30 r3 r3-r2 10.23.0.2/30
link r1 r1-r3 10.13.0.1/30 r3 r3-r1 10.13.0.2/30
for i in 1 2 3; do
  ip -n r$i link add lan type dummy; ip -n r$i addr add 192.168.$i.1/24 dev lan; ip -n r$i link set lan up
done
ip netns exec r1 ping -c 1 192.168.3.1     # fails: no routes yet
```

## 3. Start FRR in each namespace

FRR can run one instance per namespace with the `-N` option. Create a configuration for each:

```bash
for i in 1 2 3; do
  mkdir -p /etc/frr/r$i
  cat > /etc/frr/r$i/frr.conf <<CONF
frr defaults traditional
hostname r$i
router ospf
 ospf router-id $i.$i.$i.$i
 network 10.0.0.0/8 area 0
 network 192.168.$i.0/24 area 0
 passive-interface lan
CONF
  cp /etc/frr/daemons /etc/frr/r$i/daemons
  sed -i 's/^ospfd=no/ospfd=yes/' /etc/frr/r$i/daemons
  echo 'watchfrr_options="--netns"' >> /etc/frr/r$i/daemons
  chown -R frr:frr /etc/frr/r$i
  /usr/lib/frr/frrinit.sh start r$i
done
```

`frrinit.sh start r1` starts FRR's daemons for the instance named r1, and the `--netns` option runs them inside the
namespace of the same name. (If your FRR version
differs, `/usr/lib/frr/frrinit.sh` may be in another place; `dpkg -L frr | grep frrinit` finds it.) `passive-interface`
advertises the LAN without sending hellos onto it.

## 4. Watch OSPF work

Open FRR's shell for r1 and look:

```bash
vtysh -N r1
r1# show ip ospf neighbor
r1# show ip ospf database
r1# show ip route ospf
r1# exit
```

Within about 10 seconds r1 has two neighbours in state **Full** (r2 and r3): they exchanged hellos and synchronised
their **link-state databases**. The database has one **router LSA** per router, describing its links; every router has
the same copy, and each runs Dijkstra's algorithm on it. `show ip route ospf` lists routes such as
`O>* 192.168.3.0/24 [110/2] via 10.13.0.2`: administrative distance 110 (OSPF), then the total cost of the path.
FRR derives each interface's cost from its speed (reference bandwidth 100 Mbit/s divided by the link speed, at least 1),
so fast virtual links usually get cost 1.

```bash
ip netns exec r1 ping -c 2 192.168.3.1     # works now
ip netns exec r1 traceroute -n 192.168.3.1 # one hop, over the direct r1-r3 link
```

## 5. Change a cost

Make the direct r1–r3 link expensive:

```bash
vtysh -N r1 -c "conf t" -c "interface r1-r3" -c "ip ospf cost 100"
vtysh -N r3 -c "conf t" -c "interface r3-r1" -c "ip ospf cost 100"
ip netns exec r1 traceroute -n 192.168.3.1
```

The route now goes r1 → r2 → r3: two cheap links add up to far less than 100. That is shortest-path routing choosing
by cost, not by number of hops.

## 6. Break a link and time convergence

Set the costs back (`no ip ospf cost` on both), then in one terminal start a fast ping and in another bring the
direct link down:

```bash
ip netns exec r1 ping -i 0.2 192.168.3.1         # terminal 1
ip -n r1 link set r1-r3 down                      # terminal 2
```

Pings stop briefly and resume via r2. With a link that goes down cleanly, OSPF notices at once; when a link fails
silently (the far end just stops answering), routers wait for the **dead interval** (40 s by default) before giving up
on a neighbour. Real networks use **BFD** (Bidirectional Forwarding Detection) to detect failures in milliseconds.

## 7. Clean up

```bash
for i in 1 2 3; do /usr/lib/frr/frrinit.sh stop r$i; ip netns del r$i; done
```

## Check yourself

??? question "1. Why does every OSPF router in an area compute consistent routes?"
    They all hold the same link-state database (flooded and synchronised) and run the same algorithm (Dijkstra) on it.

??? question "2. With costs r1–r2 = 10, r2–r3 = 10, r1–r3 = 100, which path does r1 use to reach r3's LAN, and its total link cost?"
    Through r2, total 20 for the two links, cheaper than the direct 100.

??? question "3. Why can a silent failure take much longer to repair than an interface going down?"
    Without a link-down signal, the router waits for the dead interval (40 s by default) before declaring the neighbour lost; BFD shortens this.

??? question "4. What does `passive-interface lan` do?"
    It advertises the LAN's subnet in OSPF but does not send OSPF hellos on it, so no neighbour can form there.

??? info "Sources"
    - RFC 2328 (OSPF version 2), RFC 5880 (BFD); FRRouting documentation (docs.frrouting.org): OSPFv2 and "Running multiple instances in namespaces".
    - J. T. Moy, *OSPF: Anatomy of an Internet Routing Protocol*, Addison-Wesley, 1998.
