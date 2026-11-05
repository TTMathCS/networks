# 4. Graphs and flows

*A network is a graph: nodes joined by edges with costs or capacities. This chapter gives the graph theory networks use: shortest paths and why Dijkstra and Bellman-Ford are correct, spanning trees, connectivity and resilience, and the max-flow min-cut theorem that bounds what any network can carry.*

!!! abstract "In this chapter"
    **You will learn:** graphs, degree and paths; the optimal-substructure property; proofs of Dijkstra and
    Bellman-Ford; minimum spanning trees and the cut property; edge and node connectivity, Menger's theorem; flows,
    cuts and max-flow min-cut; multicommodity flow and traffic engineering.

    **You need:** [Networks book, chapter 12](../networks/12-Routing-Algorithms.md). Code for every algorithm is on
    [cs.akadian.ca](https://cs.akadian.ca/graphs/).

## 4.1 Vocabulary

A **graph** $G = (V, E)$ has vertices (nodes) and edges (links), $|V| = n$, $|E| = m$. Edges may be **directed** (one-way)
and **weighted** (a cost $c(u,v)$ or a capacity). A **path** is a sequence of edges joining two nodes; a **cycle**
returns to its start. A graph is **connected** if every pair has a path. A **tree** is connected with no cycles, and has
exactly $n - 1$ edges.

Real networks are **sparse**: $m$ is a small multiple of $n$, not $n^2$. The internet's AS graph has a heavy-tailed
degree distribution: most ASes have one or two neighbours, a few large ones have thousands.

## 4.2 Shortest paths

Write $d(s, v)$ for the least total cost from $s$ to $v$. The key property: **any part of a shortest path is itself a
shortest path**. (If a shorter route existed between two points on it, splicing it in would shorten the whole.) So
shortest paths from one source form a **tree**, and each router only needs its first hop.

**Bellman-Ford.** Start with $d(s) = 0$ and all others $\infty$, then **relax** every edge $(u,v)$ repeatedly:

$$d(v) \leftarrow \min\big(d(v),\; d(u) + c(u,v)\big)$$

After round $k$, $d(v)$ is at most the cost of the best path with at most $k$ edges (induction on $k$). A shortest path
without cycles has at most $n - 1$ edges, so $n - 1$ rounds suffice: $O(nm)$ time. A further round that still changes
something proves a **negative cycle**. Distance-vector routing is this algorithm run in a distributed way, each node
relaxing using its neighbours' reports.

**Dijkstra** (all costs $\ge 0$). Keep a set $S$ of finished nodes. Repeatedly take the unfinished node $u$ with the
smallest tentative $d(u)$, add it to $S$, and relax its edges.

**Why it is correct.** Suppose $u$ is the first node added with $d(u)$ larger than the true distance. Take a true
shortest path to $u$; let $y$ be its first node outside $S$, reached from $x \in S$. Since $x$ was correct and its
edges were relaxed, $d(y)$ equals the true distance to $y$, which is at most the true distance to $u$ (costs are
non-negative), which is less than $d(u)$. So Dijkstra would have chosen $y$ before $u$: a contradiction. With a binary
heap it runs in $O(m \log n)$.

The proof uses non-negative costs exactly once, at "at most the true distance to $u$": with a negative edge further
along, it fails.

## 4.3 Spanning trees

A **spanning tree** of a connected graph touches every node using $n - 1$ edges and no cycles: exactly what the Spanning
Tree Protocol builds to remove Ethernet loops (networks book, Chapter 7). STP builds a **shortest-path tree** from the
root. A **minimum spanning tree** (MST) instead minimises the total edge cost: the cheapest way to connect every site,
used in designing physical networks and in multicast.

**Cut property.** For any division of the nodes into two groups, the cheapest edge crossing between them belongs to some
MST. Kruskal's algorithm (add edges cheapest first, skipping any that would make a cycle) and Prim's (grow one tree,
always adding the cheapest edge leaving it) both follow from it.

## 4.4 How robust is a network?

The **edge connectivity** $\lambda(G)$ is the fewest links whose failure disconnects the graph; **node connectivity**
$\kappa(G)$ the fewest nodes. A ring has $\lambda = 2$: it survives any one cut. **Menger's theorem**: the number of
edge-disjoint paths between $s$ and $t$ equals the fewest edges whose removal separates them. So "survive any $k-1$
link failures between two sites" means "have $k$ edge-disjoint paths", which is how operators plan diverse routes (and
check they don't share one trench or one bridge).

## 4.5 Flows

Give each directed edge a **capacity** $c(u,v)$. A **flow** from source $s$ to sink $t$ assigns $f(u,v)$ with:

- capacity: $0 \le f(u,v) \le c(u,v)$;
- conservation: at every node other than $s$ and $t$, flow in = flow out.

Its value $|f|$ is the net flow out of $s$. How large can it be?

An **$s$-$t$ cut** splits the nodes into $S \ni s$ and $T \ni t$; its capacity is the total capacity of edges from $S$
to $T$. Every unit of flow must cross every cut, so $|f| \le$ capacity of any cut.

**Max-flow min-cut theorem** (Ford and Fulkerson, 1956): the maximum flow equals the minimum cut capacity.

**Idea of the proof.** The **residual graph** has an edge wherever more flow could be pushed (spare capacity forward,
or existing flow that could be cancelled backward). If it contains a path from $s$ to $t$ (an **augmenting path**),
push more flow along it. If not, let $S$ be the nodes reachable from $s$ in the residual graph: every edge from $S$ to
$T$ is full and every edge back is empty, so the flow equals this cut's capacity, which therefore is minimal. Choosing
shortest augmenting paths (Edmonds-Karp) finishes in $O(nm^2)$; modern algorithms are near-linear (Chen and others,
2022).

**What it means for networks.** The throughput between two points can never beat the narrowest cut between them, and
the min cut tells you where to add capacity. It also bounds the total capacity of a data-centre fabric (its **bisection
bandwidth**: the min cut splitting the servers in half).

## 4.6 Many flows at once

Real networks carry many source-destination pairs sharing links: **multicommodity flow**. Choosing routes to minimise
the most loaded link is a **linear program**, solvable in polynomial time if flows can be split fractionally (and
NP-hard if each flow must take one path). ISP and data-centre **traffic engineering** (SDN controllers such as Google's
B4, MPLS tunnels) solves versions of this every few minutes from measured demand.

## Check yourself

??? question "1. Why does Dijkstra fail with a negative edge?"
    It may finalise a node before discovering a cheaper route through a later negative edge; the correctness proof needs non-negative costs.

??? question "2. Two sites are joined by three paths that share one link. How many link failures can separate them?"
    One: the shared link is a cut of size 1, so by Menger there is only one edge-disjoint path.

??? question "3. A network has a cut of capacity 40 Gbit/s between s and t. Can s send 50 Gbit/s to t?"
    No: every flow is at most the capacity of every cut.

??? info "Sources"
    - T. Cormen, C. Leiserson, R. Rivest, C. Stein, *Introduction to Algorithms*, 4th ed., MIT Press, 2022, chapters 22–24.
    - L. Ford and D. Fulkerson, "Maximal flow through a network", *Canadian J. Math.*, 1956; K. Menger, 1927.
    - L. Chen et al., "Maximum Flow and Minimum-Cost Flow in Almost-Linear Time", FOCS 2022.
    - R. Ahuja, T. Magnanti, J. Orlin, *Network Flows*, Prentice Hall, 1993.
