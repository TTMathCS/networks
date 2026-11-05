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

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 395" role="img" aria-labelledby="sk-nb-valley-t"><title id="sk-nb-valley-t">A path from you up through a regional and a big network, across one peer link, then down through a regional network to a website</title><defs><filter id="sk-nb-valley-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nb-valley-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nb-valley-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nb-valley-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nb-valley-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="395" filter="url(#sk-nb-valley-paper)"/><g filter="url(#sk-nb-valley-pen)"><text x="30" y="44" class="h">Up, across once, down</text><path class="p" d="M200 122 L120 178"/><path class="p" d="M120 222 L60 278"/><path class="p" d="M440 122 L520 178"/><path class="p" d="M520 222 L580 278"/><path class="p dash" d="M248 100 L392 100"/><text x="320" y="140" text-anchor="middle" class="s">peers: swap traffic, no money</text><path class="p room" d="M152 78 L248 78 L248 122 L152 122Z"/><text x="200.0" y="106.0" text-anchor="middle" class="s">big network</text><path class="p room" d="M392 78 L488 78 L488 122 L392 122Z"/><text x="440.0" y="106.0" text-anchor="middle" class="s">big network</text><path class="p room" d="M72 178 L168 178 L168 222 L72 222Z"/><text x="120.0" y="206.0" text-anchor="middle" class="s">regional</text><path class="p room" d="M472 178 L568 178 L568 222 L472 222Z"/><text x="520.0" y="206.0" text-anchor="middle" class="s">regional</text><path class="p gold" d="M12 278 L108 278 L108 322 L12 322Z"/><text x="60.0" y="306.0" text-anchor="middle" class="s">you</text><path class="p gold" d="M532 278 L628 278 L628 322 L532 322Z"/><text x="580.0" y="306.0" text-anchor="middle" class="s">a website</text><path class="p red" d="M80 274 L132 226 M144 176 L196 126 M252 116 L388 116 M456 126 L508 176 M532 226 L568 274" opacity=".9"/><text x="30" y="360" class="s">Lines going down run from a provider to the customer that pays it.</text><text x="30" y="380" class="s">The red path climbs, crosses one peer link, then only goes down: no valleys.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

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
