# 8. IPv4 addressing and subnets

*IP is the internet's single shared layer. This chapter takes apart the IPv4 header, explains prefixes and subnet masks, works through subnetting by hand, and covers fragmentation and the address shortage.*

!!! abstract "In this chapter"
    **You will learn:** the IPv4 header field by field; dotted-quad notation; network prefixes, masks and CIDR;
    how to subnet a block; special addresses; fragmentation and path MTU discovery; how addresses are allocated.

    **You need:** [Chapter 2](02-Layers-and-Protocols.md); binary ([Math, chapter 1](../math/01-Bits-Binary-and-Masks.md)).

## 8.1 The IPv4 header

| Field | Bits | Purpose |
| --- | --- | --- |
| Version | 4 | 4 |
| IHL | 4 | header length in 32-bit words (5 = 20 bytes, no options) |
| DSCP / ECN | 6 + 2 | priority class; explicit congestion notification (Chapter 17) |
| Total length | 16 | whole packet in bytes, at most 65,535 |
| Identification, flags, fragment offset | 16 + 3 + 13 | fragmentation (8.6) |
| Time to live (TTL) | 8 | decremented by each router; at 0 the packet is dropped and an ICMP error sent |
| Protocol | 8 | what is inside: 1 ICMP, 6 TCP, 17 UDP, 50 ESP |
| Header checksum | 16 | Internet checksum of the header only, recomputed at every hop (TTL changes) |
| Source address, destination address | 32 + 32 | |
| Options | variable | rarely used; often dropped by routers |

TTL stops packets circling forever if routing loops; `traceroute` exploits it (Chapter 11).

## 8.2 Addresses and prefixes

An IPv4 address is 32 bits, written as four bytes in decimal: `192.168.10.37`. It belongs to an **interface**, not a
host: a router with four interfaces has four addresses.

An address has two parts: a **network prefix** shared by every interface on the same subnet, and a **host part**. The
split is written in **CIDR** notation (Classless Inter-Domain Routing, RFC 4632) as a prefix length: `192.168.10.37/24`
means the first 24 bits are the network. The same thing as a **subnet mask** has 24 ones followed by 8 zeros:
`255.255.255.0`.

To find the network, AND the address with the mask:

```
address  192.168.10.37   11000000.10101000.00001010.00100101
mask     255.255.255.0   11111111.11111111.11111111.00000000
network  192.168.10.0    11000000.10101000.00001010.00000000
```

Hosts on the same network talk directly over the link; anything else goes to the **default gateway** (a router).

Before 1993 the prefix length was fixed by the first bits (**classes**: A = /8, B = /16, C = /24). Class B gave 65,534
hosts, far too many for most organisations and class C too few, which wasted addresses; CIDR allows any length.

## 8.3 Subnetting by hand

A /$n$ block has $2^{32-n}$ addresses. The first (all host bits 0) names the network and the last (all 1) is the
**broadcast address**, so $2^{32-n} - 2$ are usable for hosts (a /31 point-to-point link is the exception, RFC 3021).

| Prefix | Mask | Addresses | Usable hosts |
| --- | --- | --- | --- |
| /24 | 255.255.255.0 | 256 | 254 |
| /25 | 255.255.255.128 | 128 | 126 |
| /26 | 255.255.255.192 | 64 | 62 |
| /27 | 255.255.255.224 | 32 | 30 |
| /28 | 255.255.255.240 | 16 | 14 |
| /30 | 255.255.255.252 | 4 | 2 |

**Example.** You have `10.20.0.0/22` (1,024 addresses) and need subnets for 400 staff, 200 guests, 100 cameras and
two point-to-point router links. Allocate largest first, each on a boundary that is a multiple of its size:

| Need | Size | Subnet | Range | Broadcast |
| --- | --- | --- | --- | --- |
| 400 staff | /23 (510 hosts) | 10.20.0.0/23 | 10.20.0.1 – 10.20.1.254 | 10.20.1.255 |
| 200 guests | /24 (254) | 10.20.2.0/24 | 10.20.2.1 – .254 | 10.20.2.255 |
| 100 cameras | /25 (126) | 10.20.3.0/25 | 10.20.3.1 – .126 | 10.20.3.127 |
| link 1 | /30 | 10.20.3.128/30 | .129 – .130 | .131 |
| link 2 | /30 | 10.20.3.132/30 | .133 – .134 | .135 |

Different sizes for different subnets is called **variable-length subnet masking (VLSM)**. The reverse, combining
neighbouring blocks into one shorter prefix, is **aggregation** (or supernetting): the four /24s `10.20.0.0` to
`10.20.3.0` can be announced to the world as one route, `10.20.0.0/22`. Aggregation is what keeps the global routing
table to about a million entries instead of billions.

## 8.4 Special addresses

| Block | Use |
| --- | --- |
| 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 | **private** (RFC 1918): not routed on the internet, used behind NAT |
| 100.64.0.0/10 | carrier-grade NAT shared space (RFC 6598) |
| 127.0.0.0/8 | loopback: the host itself |
| 169.254.0.0/16 | link-local, self-assigned when DHCP fails |
| 224.0.0.0/4 | multicast |
| 0.0.0.0/0 | the default route: "everything" |
| 255.255.255.255 | limited broadcast |
| 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 | documentation examples (RFC 5737) |

## 8.5 Who hands out addresses

IANA gives blocks to five **regional internet registries** (ARIN for North America, RIPE NCC, APNIC, LACNIC, AFRINIC),
which assign them to ISPs and organisations. IANA's free pool ran out in February 2011, and the registries ran out
between 2011 and 2019 (APNIC first). Addresses are now traded and leased, typically tens of dollars each. The fixes are
NAT (Chapter 9) for the short term and IPv6 (Chapter 10) for the long term.

## 8.6 Fragmentation and path MTU discovery

If a packet is bigger than the next link's MTU, an IPv4 router may split it into **fragments**, each with the same
identification, an offset (in 8-byte units) and a "more fragments" flag; only the destination reassembles them. Losing
one fragment loses the whole packet, reassembly costs memory (and has been attacked), and firewalls cannot see port
numbers in later fragments. So hosts avoid it: they set the **Don't Fragment** bit and use **path MTU discovery**: a
router that cannot forward replies with ICMP "fragmentation needed" giving the smaller MTU, and the sender shrinks its
packets. When firewalls block that ICMP message, connections hang mysteriously after the handshake (a **PMTU black
hole**); tunnels and VPNs, which shrink the MTU, are the usual victims. IPv6 routers never fragment at all.

## Check yourself

??? question "1. What network, broadcast address and usable host range does 172.16.45.200/27 belong to?"
    A /27 is blocks of 32 in the last byte. 200 lies in 192–223. Network 172.16.45.192, broadcast 172.16.45.223, hosts .193 to .222.

??? question "2. Can 10.1.4.0/24, 10.1.5.0/24, 10.1.6.0/24 and 10.1.7.0/24 be aggregated, and into what?"
    Yes: they share the first 22 bits (4 = 000001 00 … 7 = 000001 11), so 10.1.4.0/22.

??? question "3. Why does each router recompute the IPv4 header checksum?"
    The TTL field changes at every hop, so the checksum of the header changes too.

??? info "Sources"
    - RFC 791 (IPv4), RFC 4632 (CIDR), RFC 1918 (private addresses), RFC 6890 (special-purpose registry), RFC 1191 (path MTU discovery), RFC 3021 (/31 links).
    - NRO and IANA statements on IPv4 exhaustion (2011, and RIR announcements to 2019).
    - Kurose and Ross, *Computer Networking*, 8th ed., section 4.3.
