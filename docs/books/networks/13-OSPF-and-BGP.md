# 13. OSPF and BGP

*Inside one organisation, routers share a map and find the shortest paths: OSPF or IS-IS. Between the internet's 75,000 networks, BGP carries reachability and policy. This chapter covers both protocols as they are actually run, and the famous ways BGP fails.*

!!! abstract "In this chapter"
    **You will learn:** intra-domain versus inter-domain routing; OSPF areas, neighbours and LSAs; IS-IS; BGP sessions,
    attributes and the decision process; customer, peer and provider policies; route leaks and hijacks; RPKI.

    **You need:** [Chapter 12](12-Routing-Algorithms.md).

## 13.1 Two levels of routing

Routing is split by ownership. Inside an **autonomous system** (AS), one operator wants the best paths: an **interior
gateway protocol** (IGP), link-state in practice. Between ASes, each wants to control what it carries and pays for: the
**exterior** protocol, BGP. Hiding each AS's interior also keeps the global problem small.

## 13.2 OSPF

**Open Shortest Path First** (OSPFv2, RFC 2328; OSPFv3 for IPv6, RFC 5340) runs directly over IP (protocol 89):

- Routers send **hellos** every 10 s (multicast `224.0.0.5`) and declare a neighbour dead after 40 s without one (or
  milliseconds with BFD). Neighbours must agree on area, timers and MTU, a common cause of sessions stuck in
  "ExStart".
- On a shared LAN, routers elect a **designated router** so they each exchange the database with one router instead of
  with every other.
- Neighbours synchronise their link-state databases, then flood changes. Each router runs Dijkstra.
- Link cost defaults to reference bandwidth / interface bandwidth (100 Mbit/s reference, so every link of 100 Mbit/s or
  faster gets cost 1 unless the reference is raised: a classic mistake).

**Areas** make OSPF scale. Area 0 is the **backbone**; every other area attaches to it through **area border routers**,
which pass on summaries of their area's prefixes rather than its full map. A change inside one area triggers Dijkstra
only there. Stub areas receive only a default route.

**IS-IS**, from the OSI world, does the same job with a two-level hierarchy, runs directly on the link layer (no IP
needed, so it carries IPv4 and IPv6 alike) and extends easily with new TLV fields. Most large ISPs run IS-IS; most
enterprises run OSPF.

## 13.3 BGP basics

The **Border Gateway Protocol**, version 4 (RFC 4271), is a path-vector protocol (Chapter 12) that runs over TCP port 179
between configured peers:

- **eBGP** sessions connect routers in different ASes; **iBGP** sessions spread what was learned inside one AS (via route
  reflectors in large networks).
- Messages: OPEN, KEEPALIVE, NOTIFICATION, and UPDATE, which **announces** prefixes with attributes or **withdraws** them.
- Each route carries attributes: **AS_PATH** (the ASes it passed through), **NEXT_HOP**, **LOCAL_PREF** (this AS's
  preference), **MED** (a neighbour's hint about which of its entry points to use), and **communities** (tags such as
  "do not announce to peers").

The global table held about 1 million IPv4 prefixes and over 200,000 IPv6 prefixes in 2026.

## 13.4 Choosing a route

When a router has several routes to the same prefix, it applies these rules in order (vendors add a few):

1. Highest **LOCAL_PREF** (policy first).
2. Shortest **AS_PATH**.
3. Lowest origin type, then lowest **MED** (among routes from the same neighbour AS).
4. eBGP over iBGP.
5. Lowest IGP cost to the NEXT_HOP (**hot-potato routing**: hand the packet to the other network as soon as possible).
6. Tie-breakers: oldest route, lowest router ID.

Note that path length comes second. BGP finds *acceptable* paths by policy, not shortest ones.

## 13.5 Policy: who pays whom

Business relationships decide routing (the Gao-Rexford model):

- From a **customer** you learn its routes and announce them to everyone (it pays you to carry its traffic).
- From a **peer** or a **provider** you learn routes and announce them only to your customers (you don't carry traffic
  between two networks that don't pay you).
- Prefer customer routes over peer routes over provider routes (via LOCAL_PREF), because customer routes earn money.

If every AS follows these rules, BGP is guaranteed to settle into a stable state. Paths therefore look "valley-free":
up through providers, at most one peer link, down through customers.

## 13.6 How BGP goes wrong

BGP believes what neighbours say. Famous incidents:

- **Hijack**: in 2008 Pakistan Telecom, trying to block YouTube inside the country, announced a more specific prefix
  (/24) for YouTube's addresses; its provider passed it on and, by longest-prefix match, much of the world sent YouTube
  traffic to Pakistan for about two hours.
- **Route leak**: in 2019 a small ISP leaked thousands of routes learned from one provider to another, which accepted
  them; traffic for large services crossed a tiny network and was dropped.
- **Self-inflicted withdrawal**: in October 2021 a maintenance command took down Facebook's backbone; its DNS servers,
  designed to withdraw their BGP routes when they lost contact with the data centres, disappeared from the internet,
  and Facebook, Instagram and WhatsApp were unreachable for about six hours.

Defences:

- **Prefix filters** on customer sessions, built from routing registries (IRR) and peering databases.
- **RPKI** (Resource Public Key Infrastructure): address holders sign **ROAs** stating which AS may originate their
  prefixes and how specific; routers drop **invalid** announcements (**route origin validation**). By 2025 roughly half
  of announced IPv4 prefixes were covered by ROAs, and most large networks drop invalids.
- **ASPA** (AS provider authorization) and **BGPsec** extend checking to the rest of the path; ASPA is being deployed,
  BGPsec rarely.
- The **MANRS** norms (filtering, anti-spoofing, coordination, validation) for operators.

See [Security, chapter 6](../security/06-Attacks-on-IP-and-Routing.md).

## 13.7 Anycast

Several sites can announce the **same** prefix; BGP sends each user to the nearest (in BGP terms). This **anycast**
serves all 13 DNS root server identities from over 1,900 sites worldwide, and most CDNs and public DNS resolvers
(1.1.1.1, 8.8.8.8). It spreads load and absorbs denial-of-service floods.

## 13.8 MPLS and segment routing

ISP cores often forward on short **labels** instead of IP addresses: **MPLS** puts a 4-byte label in front of the
packet; each router swaps labels along a pre-set path. This allows **traffic engineering** (steering flows away from the
shortest path to balance load) and VPNs for business customers. **Segment routing** (SR-MPLS, SRv6) puts the list of
waypoints in the packet itself, so no per-path state is kept in the core.

## Check yourself

??? question "1. A router has two routes to a prefix: AS path 3 long with LOCAL_PREF 200, and AS path 1 long with LOCAL_PREF 100. Which wins?"
    The first: LOCAL_PREF is compared before AS path length.

??? question "2. Why did the 2008 YouTube hijack win over YouTube's real announcement?"
    It was more specific (/24 inside YouTube's /22), and forwarding uses longest-prefix match.

??? question "3. What does an RPKI ROA say?"
    That a given AS is authorised to originate a given prefix, up to a maximum prefix length.

??? info "Sources"
    - RFC 2328 (OSPFv2), RFC 5340 (OSPFv3), ISO/IEC 10589 and RFC 1195 (IS-IS), RFC 4271 (BGP-4), RFC 6480 and RFC 6811 (RPKI, origin validation), RFC 7454 (BGP operations and security).
    - L. Gao and J. Rexford, "Stable Internet Routing Without Global Coordination", *IEEE/ACM ToN*, 2001.
    - RIPE NCC, "YouTube Hijacking: A RIPE NCC RIS case study" (2008); Meta Engineering, "More details about the October 4 outage" (2021).
    - CIDR Report, NIST RPKI Monitor and root-servers.org (checked November 2026).
