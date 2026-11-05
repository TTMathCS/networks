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
