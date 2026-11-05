# 12. Routing algorithms

*How does each router decide the next hop to every destination? Two families of algorithms answer it: link-state, where every router learns the whole map and runs Dijkstra, and distance-vector, where routers only tell their neighbours their distances. This chapter explains both, their failure modes, and path-vector routing.*

!!! abstract "In this chapter"
    **You will learn:** the network as a weighted graph; link-state routing with Dijkstra; distance-vector routing with
    Bellman-Ford; count-to-infinity and its fixes; convergence; path-vector; equal-cost multipath.

    **You need:** [Chapter 11](11-Routers-and-Forwarding.md). Shortest paths are explained on
    [cs.akadian.ca](https://cs.akadian.ca/graphs/dijkstra/); the math is in [Math, chapter 4](../math/04-Graphs-and-Flows.md).

## 12.1 The network as a graph

Routers are **nodes**, links are **edges**, and each edge has a **cost** set by the operator: often inversely related
to bandwidth, sometimes reflecting distance or price. The goal: for each destination, the least-cost path. A key fact
makes this tractable: any sub-path of a shortest path is itself a shortest path, so each router only needs the **first
hop** of its best path to each destination.

## 12.2 Link-state routing

Every router:

1. discovers its neighbours and link costs (hello messages);
2. **floods** a **link-state advertisement** (LSA) describing its links to every router in the network, with a sequence
   number so old news is ignored;
3. collects all LSAs into an identical **link-state database**: the whole map;
4. runs **Dijkstra's algorithm** from itself to compute shortest paths to all destinations, and installs first hops.

Dijkstra keeps a set of nodes whose distance is final; each step adds the closest remaining node and updates its
neighbours. With a heap it runs in $O(E \log V)$, milliseconds for thousands of routers.

**Example.** Routers u, v, w, x, y, z with costs u–v 2, u–x 1, u–w 5, v–x 2, v–w 3, x–w 3, x–y 1, w–y 1, w–z 5, y–z 2.
From u:

| Step | Finalised | D(v) | D(w) | D(x) | D(y) | D(z) |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | u | 2 | 5 | **1** | ∞ | ∞ |
| 1 | u x | **2** | 4 | | 2 | ∞ |
| 2 | u x v | | 4 | | **2** | ∞ |
| 3 | u x v y | | **3** | | | 4 |
| 4 | u x v y w | | | | | **4** |

So u reaches z at cost 4 via x then y; its forwarding entry for z is "next hop x".

Link-state converges fast after a change (one flood, one recomputation) and every router can check the map. Costs:
flooding and memory for the database, and every router must agree. **OSPF** and **IS-IS** are link-state (Chapter 13).

## 12.3 Distance-vector routing

Each router keeps only a **distance vector**: its current best cost to every destination. Periodically, and whenever
it changes, it sends the vector to its neighbours. On receiving neighbours' vectors, router $x$ updates by the
**Bellman-Ford equation**:

$$D_x(y) = \min_{v \in \text{neighbours}(x)} \big( c(x, v) + D_v(y) \big)$$

Repeat until nothing changes. No router ever sees the map; each trusts its neighbours' claims. It is simple and
distributed, used by RIP (1988) and, in modern form, EIGRP and Babel.

## 12.4 Count to infinity

Distance-vector has a famous flaw: **good news travels fast, bad news travels slowly**. Take a line x – y – z with
costs 1 and the link y–z failing. Before: $D_y(z) = 1$, $D_x(z) = 2$. After the failure y looks at x's vector, which
still says "I reach z at 2", and concludes $D_y(z) = 1 + 2 = 3$ via x. Then x updates to 4 via y, y to 5, and so on:
they count up together, while packets for z loop between them. RIP stops at 16 ("infinity"), after minutes.

Fixes:

- **Split horizon**: never advertise a route back to the neighbour you learned it from.
- **Poisoned reverse**: advertise it back with infinite cost. Fixes two-node loops, not larger ones.
- **Triggered updates and hold-downs**: spread bad news immediately; ignore good news for a while after a route fails.
- **Feasibility conditions** (EIGRP's DUAL, Babel): only accept a new path if it is provably loop-free.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 395" role="img" aria-labelledby="sk-nb-infinity-t"><title id="sk-nb-infinity-t">In the line x, y, z the link from y to z breaks; y and x keep raising their distances to z, 3, 4, 5 and on, until RIP's infinity of 16</title><defs><filter id="sk-nb-infinity-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nb-infinity-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nb-infinity-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nb-infinity-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nb-infinity-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="395" filter="url(#sk-nb-infinity-paper)"/><g filter="url(#sk-nb-infinity-pen)"><text x="30" y="44" class="h">Bad news travels slowly</text><circle cx="120" cy="110" r="24" class="p room"/><text x="120" y="117" text-anchor="middle" class="l">x</text><circle cx="300" cy="110" r="24" class="p room"/><text x="300" y="117" text-anchor="middle" class="l">y</text><circle cx="480" cy="110" r="24" class="p gold"/><text x="480" y="117" text-anchor="middle" class="l">z</text><path class="p" d="M146 110 L274 110"/><path class="p red" d="M326 110 L454 110"/><path class="p red" d="M378 94 L402 126 M402 94 L378 126"/><text x="210" y="96" text-anchor="middle" class="s">1</text><text x="300" y="175" text-anchor="middle" class="s">y's distance to z</text><text x="120" y="175" text-anchor="middle" class="s">x's distance to z</text><text x="120" y="200" text-anchor="middle" class="s">2</text><text x="300" y="200" text-anchor="middle" class="s">1</text><text x="120" y="224" text-anchor="middle" class="s">2</text><text x="300" y="224" text-anchor="middle" class="s">3</text><text x="120" y="248" text-anchor="middle" class="s">4</text><text x="300" y="248" text-anchor="middle" class="s">3</text><text x="120" y="272" text-anchor="middle" class="s">4</text><text x="300" y="272" text-anchor="middle" class="s">5</text><text x="120" y="296" text-anchor="middle" class="s">6</text><text x="300" y="296" text-anchor="middle" class="s">5</text><text x="120" y="320" text-anchor="middle" class="s">…</text><text x="300" y="320" text-anchor="middle" class="s">…</text><text x="120" y="344" text-anchor="middle" class="s">16</text><text x="300" y="344" text-anchor="middle" class="s">16</text><text x="40" y="200" class="s">before</text><text x="40" y="344" class="s">“infinity”</text><text x="380" y="230" class="s">y trusts x's old “2”, which</text><text x="380" y="250" class="s">was really a path through y.</text><text x="380" y="280" class="s">They count up together,</text><text x="380" y="300" class="s">and packets loop meanwhile.</text><text x="40" y="380" class="s">Fix: split horizon, never tell a neighbour about a route you learned from it.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## 12.5 Link-state or distance-vector?

| | Link-state | Distance-vector |
| --- | --- | --- |
| Knows | the whole map | only neighbours' distances |
| Messages | flood to all on change | to neighbours, periodically and on change |
| Convergence | fast | can be slow, with loops |
| Errors | a bad LSA misleads but every router computes itself | a bad vector spreads through everyone's calculations |
| CPU and memory | more | less |

## 12.6 Path-vector

Between organisations (Chapter 13) neither works. Link-state would reveal every network's internal map; plain
distance-vector cannot express policy ("never carry my competitor's traffic") and loops badly. **Path-vector** routing
(BGP) advertises, for each destination, the **whole list of networks** the route passes through. A router rejects any
path that already contains itself (loop-free by construction) and chooses among the rest by **policy**, not just length.

## 12.7 Equal-cost multipath

If several paths have the same lowest cost, a router can use them all: **ECMP**. Packets are spread by hashing each
flow's addresses and ports, so a flow stays on one path (no reordering) while many flows share the load. Data centres
rely on it to use hundreds of paths at once (Chapter 21).

## 12.8 Convergence and loops

After any change, routers briefly disagree, and packets can loop or be dropped until all have updated: **convergence
time**. Link-state networks converge in well under a second with fast hellos (BFD, a millisecond-scale liveness check)
and **fast reroute**: precomputed backup next hops (loop-free alternates, TI-LFA) switched on in hardware within 50 ms of
a failure.

## Check yourself

??? question "1. In the example, what is u's least cost to w and its next hop?"
    Cost 3 (u–x 1, x–y 1, y–w 1), next hop x.

??? question "2. What problem does split horizon fix, and which does it not?"
    It stops two neighbours counting to infinity through each other; loops through three or more routers can still count up.

??? question "3. How does BGP avoid routing loops?"
    Each route carries the list of networks (AS path) it has passed through; a router rejects routes containing its own AS number.

??? info "Sources"
    - E. Dijkstra, "A note on two problems in connexion with graphs", *Numerische Mathematik*, 1959; R. Bellman, "On a routing problem", 1958; L. Ford and D. Fulkerson, 1962.
    - J. McQuillan, I. Richer, E. Rosen, "The New Routing Algorithm for the ARPANET", *IEEE Trans. Comm.*, 1980 (first link-state).
    - RFC 2453 (RIP v2), RFC 8966 (Babel), RFC 7868 (EIGRP), RFC 5880 (BFD), RFC 5286 (loop-free alternates).
    - Kurose and Ross, *Computer Networking*, 8th ed., section 5.2.
