# 11. Routers and forwarding

*A router does two jobs: forwarding, moving each packet from an input to the right output in nanoseconds, and routing, working out the table that forwarding uses. This chapter covers forwarding: longest-prefix match, what happens inside a router, traceroute, and quality of service.*

!!! abstract "In this chapter"
    **You will learn:** the data plane and the control plane; forwarding tables and longest-prefix match; how a
    router is built; queueing and scheduling; DiffServ; how traceroute works; multicast in brief.

    **You need:** [Chapters 8–10](08-IPv4-Addressing-and-Subnets.md).

## 11.1 Two planes

- The **data plane** (forwarding) is per packet: look up the destination, pick the output, send. It must keep up with
  line rate, so it is built in hardware.
- The **control plane** (routing) runs routing protocols and computes the **forwarding table**. It runs on an ordinary
  CPU, in seconds rather than nanoseconds.

In a classic router both live in one box. In **software-defined networking** (Chapter 21) the control plane moves to a
central controller.

## 11.2 Longest-prefix match

A forwarding table maps prefixes to next hops:

| Prefix | Next hop | Interface |
| --- | --- | --- |
| 0.0.0.0/0 | 198.51.100.1 | eth0 (default route) |
| 10.0.0.0/8 | 10.255.0.1 | eth1 |
| 10.20.0.0/16 | 10.255.0.2 | eth1 |
| 10.20.3.0/24 | directly connected | eth2 |

A destination may match several entries. The rule: use the **longest** (most specific) matching prefix. `10.20.3.9`
matches /0, /8, /16 and /24, so it goes out eth2; `10.20.9.1` matches up to /16; `8.8.8.8` only the default route.
Longest match is what lets aggregation and exceptions coexist: a /16 for a whole site and a /24 for one part of it
reached another way.

Doing this for hundreds of millions of packets a second over a million prefixes needs special structures: **tries**
(binary trees on the address bits, compressed into multibit or "Patricia" tries) in software, and **TCAM** in hardware,
which compares the address with every entry at once and returns the longest match.

On Linux, `ip route` shows the table; `ip route get 8.8.8.8` shows which entry a destination would use
([Lab 3](../../labs/03-Interfaces-and-Routes.md)).

## 11.3 Inside a router

<figure class="mars-fig">
<svg viewBox="0 0 560 200" width="560" role="img" aria-label="Router: input ports, switching fabric, output ports, routing processor">
<g fill="none" stroke="currentColor" stroke-width="2">
<rect x="20" y="40" width="120" height="34" rx="5"/><rect x="20" y="120" width="120" height="34" rx="5"/>
<rect x="210" y="40" width="140" height="114" rx="8" class="soft"/>
<rect x="420" y="40" width="120" height="34" rx="5"/><rect x="420" y="120" width="120" height="34" rx="5"/>
<rect x="210" y="170" width="140" height="26" rx="5" class="soft-acc"/>
<line x1="140" y1="57" x2="210" y2="57"/><line x1="140" y1="137" x2="210" y2="137"/>
<line x1="350" y1="57" x2="420" y2="57"/><line x1="350" y1="137" x2="420" y2="137"/>
<line x1="280" y1="154" x2="280" y2="170" class="nb"/></g>
<g font-size="13" fill="currentColor" text-anchor="middle">
<text x="80" y="62">input port</text><text x="80" y="142">input port</text><text x="280" y="102">switching fabric</text>
<text x="480" y="62">output port + queue</text><text x="480" y="142">output port + queue</text><text x="280" y="188">routing processor</text>
<text x="80" y="25">lookup here</text><text x="480" y="25">wait and schedule here</text></g>
</svg>
<figcaption>A router: each input port looks up the destination in its copy of the forwarding table; the fabric moves the packet to the output, where it may queue.</figcaption>
</figure>

- **Input ports** terminate the link, check the frame, and do the lookup ("decentralised forwarding": each line card has
  its own copy of the table).
- The **switching fabric** moves packets between ports: once through memory, then over a shared bus, now through a
  crossbar or a multi-stage network that lets many pairs talk at once.
- **Output ports** queue packets and schedule them onto the link.
- The **routing processor** runs routing protocols and management.

If packets for one output arrive faster than it can send them, they queue there. How big should that buffer be? The
old rule was one bandwidth-delay product (RTT × link rate); research in 2004 showed that with many flows,
$\text{RTT} \times R / \sqrt{N}$ suffices for $N$ flows, much less memory.

## 11.4 Scheduling and quality of service

Which queued packet goes next?

- **FIFO**: first in, first out. Simple, and the internet default.
- **Priority**: voice packets (marked by the sender or the edge) always go first. Risk: low priority can starve.
- **Weighted fair queueing** and **deficit round robin**: each class (or flow) gets a guaranteed share of the link,
  in proportion to its weight.

Marking uses the 6-bit **DSCP** field (Chapter 8). The **Differentiated Services** model (RFC 2474) defines classes such
as **EF** (expedited forwarding, DSCP 46) for voice and AF classes for business data. Inside companies and mobile
networks this works well; across the public internet markings are usually ignored or reset.

## 11.5 Traceroute

`traceroute` (Van Jacobson, 1987) shows the path to a host using TTL:

1. Send a packet with TTL 1. The first router decrements it to 0, drops it and returns ICMP **time exceeded**: now we
   know its address and the RTT to it.
2. Send with TTL 2, 3, … until the destination itself replies (ICMP port unreachable for UDP probes, an echo reply for
   ICMP probes, or a TCP reply).

Caveats: you see the *forward* path only (the return path may differ); routers may rate-limit or not reply (`* * *`);
with load balancing, successive probes may take different paths (**Paris traceroute** fixes the flow fields so all
probes follow one path); and a router's reply comes from its *incoming* interface address. `mtr` repeats traceroute
continuously to show loss per hop. [Lab 2](../../labs/02-Ping-and-Traceroute.md).

## 11.6 Multicast in brief

Sending a live video to 10,000 viewers as 10,000 copies wastes the links near the source. **IP multicast** sends one
copy to a group address (`224.0.0.0/4`, `ff00::/8`) and routers copy it only where branches split. Hosts join groups
with IGMP (MLD in IPv6) and routers build distribution trees with PIM. It is used inside ISPs for IPTV and in financial
market data feeds, but not across the public internet, where streaming uses CDNs instead (Chapter 20).

## Check yourself

??? question "1. A table has 0.0.0.0/0 → A, 172.16.0.0/12 → B, 172.16.4.0/22 → C. Where do 172.16.5.9 and 172.20.1.1 go?"
    172.16.5.9 is inside 172.16.4.0/22 (4–7), so C. 172.20.1.1 is inside 172.16.0.0/12 (16–31), so B.

??? question "2. Why might traceroute show a path that the replies never take?"
    It only measures the forward path; internet routing is often asymmetric, so the return path can differ.

??? question "3. What does DSCP 46 (EF) ask routers to do?"
    Treat the packet as expedited forwarding: low delay, low jitter, typically a priority queue; used for voice.

??? info "Sources"
    - Kurose and Ross, *Computer Networking*, 8th ed., chapter 4 (inside a router).
    - G. Appenzeller, I. Keslassy, N. McKeown, "Sizing Router Buffers", SIGCOMM 2004.
    - RFC 2474 and RFC 2475 (DiffServ), RFC 3246 (EF), RFC 3376 (IGMPv3), RFC 7761 (PIM-SM).
    - B. Augustin et al., "Avoiding traceroute anomalies with Paris traceroute", IMC 2006.
