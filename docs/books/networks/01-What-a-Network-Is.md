# 1. What a network is

*A computer network moves bits between programs on different machines. This chapter gives the vocabulary used in the rest of the book: hosts and links, the edge and the core, circuit and packet switching, and how the internet grew into a network of about 75,000 independently run networks.*

!!! abstract "In this chapter"
    **You will learn:** hosts, links, switches and routers; the edge and the core; circuit versus packet switching
    and why the internet chose packets; what an autonomous system and an ISP are; who writes the rules.

    **You need:** [Start](../../start/index.md), or general computer use.

## 1.1 Hosts, links and the boxes between

A **host** (or end system) runs the programs that use the network: a laptop, a phone, a web server, a thermostat.
Hosts are joined by **links**: copper, fibre or radio, each with a **bandwidth** (bits per second it can carry) and a
**propagation delay** (how long one bit takes to cross it). Between hosts sit **packet switches** that take packets in on
one link and send them out on another. There are two kinds you will meet constantly:

- a **switch** forwards within one local network, using hardware (MAC) addresses (Chapter 6);
- a **router** forwards between networks, using IP addresses (Chapter 11).

<figure class="play" data-play="fullmesh"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> Join every pair of hosts directly, or each host to one switch: the first grows as n(n−1)/2, the second as n.</figcaption></figure>

## 1.2 The edge and the core

Picture the internet as a city. The **network edge** is the houses: hosts and the **access networks** that join them
to the first router: DSL or cable over old telephone and TV wires, fibre to the home, Wi-Fi, 4G and 5G cellular, and
Ethernet in offices. The **network core** is the motorways: a mesh of routers joined by high-capacity fibre, run by
**internet service providers (ISPs)** and by large content companies with their own global networks.

## 1.3 Circuit switching and packet switching

The telephone network was built on **circuit switching**: before a call, the network reserves a fixed path with fixed
capacity (originally a 64 kbit/s slot) for the whole conversation. Quality is guaranteed, but the reservation sits idle
during silences.

**Packet switching** reserves nothing. Messages are cut into packets that share every link with everyone else's. Each
switch uses **store and forward**: it receives a whole packet, checks it, then sends it on. When packets arrive faster
than a link can send them, they wait in a **queue** (a buffer); if the buffer fills, packets are dropped.

Why did the internet choose packets? Because data is **bursty**. Suppose a 10 Mbit/s link is shared by users who
each need 1 Mbit/s while active but are active only 10% of the time.

- Circuit switching can admit exactly 10 users.
- Packet switching can admit 35: the chance that more than 10 of 35 are active at the same moment is about 0.0004
  (a binomial sum; [Math foundations, chapter 2](../math/02-Probability-for-Networks.md) works it out).

This gain from sharing is called **statistical multiplexing**. The price is that delay and loss are no longer
guaranteed, which is what most of the rest of the book deals with.

## 1.4 A network of networks

No single company could wire the world, so the internet is a federation. Each independently run network (an ISP, a
university, a cloud provider) is an **autonomous system (AS)** with a number. In 2026 about 75,000 ASes are visible
in the global routing table. They connect in two ways:

- **Transit**: a smaller network pays a larger one to reach the whole internet.
- **Peering**: two networks exchange their own customers' traffic for free, often at an **internet exchange point
  (IXP)**, a building full of switches where hundreds of networks meet.

The largest ISPs, which reach everything without paying anyone, are called **tier 1**. Content providers such as
video and cloud companies now run their own worldwide fibre and peer directly with access ISPs, so much traffic never
touches a tier-1 network at all.

<figure class="mars-fig">
<svg viewBox="0 0 560 220" width="560" role="img" aria-label="Hosts in access networks connect to regional ISPs, which connect to tier-1 ISPs and to an internet exchange point">
<g fill="none" stroke="currentColor" stroke-width="2">
<ellipse cx="200" cy="40" rx="70" ry="22" class="soft"/><ellipse cx="370" cy="40" rx="70" ry="22" class="soft"/>
<ellipse cx="120" cy="120" rx="65" ry="20"/><ellipse cx="285" cy="125" rx="55" ry="20" class="soft-acc"/><ellipse cx="450" cy="120" rx="65" ry="20"/>
<line x1="270" y1="40" x2="300" y2="40" stroke-width="3"/><line x1="150" y1="58" x2="130" y2="100"/><line x1="410" y1="58" x2="440" y2="100"/>
<line x1="185" y1="122" x2="230" y2="125" class="na"/><line x1="340" y1="125" x2="385" y2="122" class="na"/>
<line x1="90" y1="140" x2="60" y2="190"/><line x1="150" y1="140" x2="170" y2="190"/><line x1="440" y1="140" x2="420" y2="190"/><line x1="480" y1="140" x2="510" y2="190"/></g>
<g font-size="13" fill="currentColor" text-anchor="middle">
<text x="200" y="45">tier-1 ISP</text><text x="370" y="45">tier-1 ISP</text><text x="120" y="125">regional ISP</text>
<text x="285" y="130">IXP</text><text x="450" y="125">content network</text>
<text x="60" y="207">homes</text><text x="170" y="207">school</text><text x="420" y="207">data centre</text><text x="510" y="207">cache</text></g>
</svg>
<figcaption>The internet's shape: access networks pay regional ISPs, which buy transit from tier-1 ISPs; networks also peer directly at exchange points (orange links).</figcaption>
</figure>

## 1.5 A short history

| Year | Event |
| --- | --- |
| 1961–1965 | Kleinrock (queueing theory), Baran (RAND) and Davies (NPL) independently develop packet switching |
| 1969 | ARPANET connects four sites: UCLA, SRI, UC Santa Barbara and Utah |
| 1974 | Cerf and Kahn publish the design that becomes TCP/IP |
| 1 Jan 1983 | ARPANET switches to TCP/IP ("flag day") |
| 1989–1991 | Berners-Lee invents the World Wide Web at CERN |
| 1990s | Commercial ISPs; the web goes public |
| 2007 onward | Smartphones make most internet access wireless |

## 1.6 Who writes the rules

Internet protocols are written by the **Internet Engineering Task Force (IETF)** as numbered **RFCs** ("Request for
Comments"); anyone can join a working group by email. The **IEEE** writes the standards for links (802.3 Ethernet,
802.11 Wi-Fi). **3GPP** writes the cellular standards. **IANA** hands out the numbers (addresses, ports, AS numbers)
through regional registries. The motto of the IETF, from David Clark (1992), sums up the culture: "rough consensus and
running code".

## Check yourself

??? question "1. A switch and a router both forward packets. What is the difference?"
    A switch forwards inside one local network using MAC addresses; a router forwards between networks using IP addresses.

??? question "2. Give one advantage and one cost of packet switching compared with circuit switching."
    Advantage: idle capacity is shared, so many more bursty users fit (statistical multiplexing). Cost: no guaranteed delay or bandwidth; packets can queue or be dropped.

??? question "3. What is the difference between transit and peering?"
    Transit is paid access to the whole internet through a bigger network; peering is a (usually free) exchange of each other's customers' traffic only.

??? info "Sources"
    - J. Kurose and K. Ross, *Computer Networking: A Top-Down Approach*, 8th ed., Pearson, 2021, chapter 1.
    - A. Tanenbaum, N. Feamster, D. Wetherall, *Computer Networks*, 6th ed., Pearson, 2021, chapter 1.
    - V. Cerf and R. Kahn, "A Protocol for Packet Network Intercommunication", *IEEE Trans. Communications*, 1974.
    - CIDR Report and APNIC statistics on visible autonomous systems (checked November 2026).
    - RFC 2026 (the Internet standards process).
