# 21. Data centres and SDN

*A large data centre holds hundreds of thousands of servers that talk to each other far more than to the outside world. Its network is built from many small identical switches in a Clos fabric, controlled by software. This chapter covers fabric design, load balancing, data-centre transport, virtual networks and software-defined networking.*

!!! abstract "In this chapter"
    **You will learn:** east-west traffic; leaf-spine (Clos) topologies and oversubscription; ECMP and flowlets; load
    balancers; incast and DCTCP; RDMA; overlays with VXLAN and EVPN; SDN, OpenFlow and P4; network virtualisation in clouds.

    **You need:** [Chapters 7, 12 and 17](07-VLANs-and-Spanning-Tree.md).

## 21.1 East-west traffic

One web search or social-media page can fan out to hundreds of servers inside the data centre (index shards, caches,
databases, machine-learning models) before one reply goes out. Traffic between servers (**east-west**) dwarfs traffic
to users (**north-south**), and AI training clusters, where thousands of accelerators exchange gradients every step,
push this to extremes.

## 21.2 From trees to Clos fabrics

The classic design was a tree: servers → top-of-rack switch → aggregation → a pair of huge core routers. The top is a
bottleneck and a single point of failure, and spanning tree blocks half the links.

Modern data centres use a **leaf-spine** fabric, a folded **Clos network** (Charles Clos designed it for telephone
exchanges in 1953):

- Every server rack has a **leaf** (top-of-rack) switch.
- Every leaf connects to **every spine** switch.
- Any two servers are at most leaf → spine → leaf apart, and there are as many equal paths as spines.

<figure class="mars-fig">
<svg viewBox="0 0 560 190" width="560" role="img" aria-label="Leaf-spine fabric: four spines, each connected to every one of six leaves">
<g stroke="currentColor" stroke-width="1" stroke-opacity=".55">
<line x1="130" y1="40" x2="60" y2="130"/><line x1="130" y1="40" x2="148" y2="130"/><line x1="130" y1="40" x2="236" y2="130"/><line x1="130" y1="40" x2="324" y2="130"/><line x1="130" y1="40" x2="412" y2="130"/><line x1="130" y1="40" x2="500" y2="130"/>
<line x1="230" y1="40" x2="60" y2="130"/><line x1="230" y1="40" x2="148" y2="130"/><line x1="230" y1="40" x2="236" y2="130"/><line x1="230" y1="40" x2="324" y2="130"/><line x1="230" y1="40" x2="412" y2="130"/><line x1="230" y1="40" x2="500" y2="130"/>
<line x1="330" y1="40" x2="60" y2="130"/><line x1="330" y1="40" x2="148" y2="130"/><line x1="330" y1="40" x2="236" y2="130"/><line x1="330" y1="40" x2="324" y2="130"/><line x1="330" y1="40" x2="412" y2="130"/><line x1="330" y1="40" x2="500" y2="130"/>
<line x1="430" y1="40" x2="60" y2="130"/><line x1="430" y1="40" x2="148" y2="130"/><line x1="430" y1="40" x2="236" y2="130"/><line x1="430" y1="40" x2="324" y2="130"/><line x1="430" y1="40" x2="412" y2="130"/><line x1="430" y1="40" x2="500" y2="130"/></g>
<g fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.5">
<rect x="105" y="25" width="50" height="22" rx="4"/><rect x="205" y="25" width="50" height="22" rx="4"/><rect x="305" y="25" width="50" height="22" rx="4"/><rect x="405" y="25" width="50" height="22" rx="4"/>
<rect x="38" y="128" width="44" height="22" rx="4"/><rect x="126" y="128" width="44" height="22" rx="4"/><rect x="214" y="128" width="44" height="22" rx="4"/><rect x="302" y="128" width="44" height="22" rx="4"/><rect x="390" y="128" width="44" height="22" rx="4"/><rect x="478" y="128" width="44" height="22" rx="4"/></g>
<g font-size="12" fill="currentColor" text-anchor="middle"><text x="280" y="16">spines</text><text x="280" y="175">leaves (one per rack of servers)</text></g>
</svg>
<figcaption>A two-tier leaf-spine fabric: every leaf connects to every spine, so every pair of racks has as many equal paths as there are spines.</figcaption>
</figure>

Growing the fabric means adding identical switches: more spines for more bandwidth, more leaves for more racks, and a
third tier (super-spines) for very large sites. Google's Jupiter, Meta's F16 and Microsoft's designs all follow this
pattern. Recent Jupiter generations also use **optical circuit switches** that rewire links with tiny mirrors as traffic
changes.

**Oversubscription** is the ratio of server-facing to fabric-facing capacity on a leaf: 48 × 25 Gbit/s down and
6 × 100 Gbit/s up is 1,200 : 600, or 2 : 1. AI clusters are built at 1 : 1 (**non-blocking**).

## 21.3 Routing the fabric

Fabrics usually run plain **BGP** (one AS per switch tier or per switch, RFC 7938) or a link-state IGP, with **ECMP**
spreading flows over all spines by hashing the 5-tuple. Hash collisions can put two big flows on one link while others
idle, so some designs split flows at pauses longer than the path-delay difference (**flowlets**), spray packets per
packet with reorder-tolerant transports, or adapt to measured congestion. Any switch can fail and traffic simply uses
the others.

## 21.4 Load balancers

A service's one public address fronts thousands of servers. A **layer 4 load balancer** spreads connections by 5-tuple
(often with consistent hashing, so a server failure moves only its own connections); a **layer 7** one reads HTTP and
routes by URL or cookie, terminates TLS and retries failures. At scale they are software on ordinary servers (Google
Maglev, Meta Katran), announcing the service address by anycast and BGP, often with **direct server return**: replies
go straight from server to client.

## 21.5 Transport inside the data centre

RTTs inside a data centre are tens of microseconds, and buffers in switch chips are small. Two problems:

- **Incast**: a request fans out to 100 servers; all reply at once into one switch port; the buffer overflows, packets
  drop, and TCP's minimum timeout (200 ms) stalls the request a thousand times longer than its normal time.
- **Queue build-up**: long background transfers fill buffers and delay short, latency-critical messages.

**DCTCP** (2010, RFC 8257) has switches mark packets with ECN as soon as a queue passes a small threshold, and senders cut
their window in proportion to the *fraction* of marked packets rather than halving, keeping queues short with full
throughput. Successors (Swift, HPCC) use precise delay or in-network telemetry.

**RDMA** (remote direct memory access) lets one machine's network card read or write another machine's memory with no
CPU involvement, at microsecond latency; **RoCEv2** carries it over Ethernet/UDP and is the backbone of AI training
clusters, alongside InfiniBand. RoCE traditionally needs a lossless network (priority flow control, PFC), which brings
its own risks (pause storms, deadlocks); the **Ultra Ethernet** specification (1.0, 2025) defines a transport for AI
and HPC that sprays packets over all paths and tolerates loss.

## 21.6 Virtual networks and overlays

Each cloud customer wants private networks with their own addresses, possibly overlapping other customers'. Clouds
build **overlays**: the physical fabric routes between hosts, and each host's virtual switch (in software, or offloaded
to a "SmartNIC" / DPU) wraps tenant packets in an outer header: **VXLAN** (24-bit network ID over UDP), **Geneve**
(RFC 8926, extensible), or proprietary formats. **EVPN** (BGP) distributes which tenant MAC and IP addresses live behind
which host. Security groups (per-VM firewalls) are enforced in the same virtual switch.

## 21.7 Software-defined networking

In a classic network every router runs its own control plane and is configured box by box. **Software-defined
networking (SDN)** separates the two: a logically central **controller** with a global view computes forwarding
rules and installs them in simple switches through an open interface.

- **OpenFlow** (2008) defined switch tables of match (header fields) → action (forward, drop, rewrite, send to
  controller) rules.
- **P4** (2014) goes further: it programs *how* the switch parses packets and what tables exist, so new protocols and
  telemetry need no new chips.
- Production successes: **Google B4**, the private WAN between Google's data centres, run near 100% utilisation by
  central traffic engineering since 2012; cloud virtual networks; and campus and SD-WAN products (Chapter 22).

SDN's lasting ideas (central policy, programmable data planes, network-wide verification) are now everywhere, even
where pure OpenFlow is not.

## Check yourself

??? question "1. A leaf has 32 × 100 Gbit/s server ports and 8 × 400 Gbit/s uplinks. What is the oversubscription?"
    3,200 : 3,200 = 1 : 1, non-blocking.

??? question "2. What is incast, and why does TCP handle it badly?"
    Many servers replying to one requester at once overflow one switch port's buffer; the lost packets wait for TCP's retransmission timeout (hundreds of ms), far longer than the microsecond RTTs.

??? question "3. What is the difference between OpenFlow and P4?"
    OpenFlow installs match-action rules in switches with a fixed parser and table layout; P4 programs the parser and pipeline itself.

??? info "Sources"
    - C. Clos, "A Study of Non-Blocking Switching Networks", *Bell System Technical Journal*, 1953.
    - A. Singh et al., "Jupiter Rising", SIGCOMM 2015; L. Poutievski et al., "Jupiter Evolving", SIGCOMM 2022; S. Jain et al., "B4", SIGCOMM 2013.
    - M. Alizadeh et al., "Data Center TCP (DCTCP)", SIGCOMM 2010; RFC 8257; D. Eisenbud et al., "Maglev", NSDI 2016.
    - N. McKeown et al., "OpenFlow", *CCR*, 2008; P. Bosshart et al., "P4", *CCR*, 2014.
    - RFC 7938 (BGP in data centres), RFC 7348 (VXLAN), RFC 8926 (Geneve); Ultra Ethernet Consortium, *UE 1.0 Specification*, 2025.
