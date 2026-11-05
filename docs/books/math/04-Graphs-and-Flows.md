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

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 405" role="img" aria-labelledby="sk-nm-cut-t"><title id="sk-nm-cut-t">A small network from s to t with capacities; the flow of 14 shown fills the two edges into t, whose capacities 4 and 10 form the minimum cut</title><defs><filter id="sk-nm-cut-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nm-cut-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nm-cut-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nm-cut-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nm-cut-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="405" filter="url(#sk-nm-cut-paper)"/><g filter="url(#sk-nm-cut-pen)"><text x="30" y="44" class="h">The narrowest cut sets the limit</text><path class="p " d="M104 189 L254 121" marker-end="url(#sk-nm-cut-ah)"/><text x="192" y="147" class="s">10 of 10</text><path class="p " d="M104 211 L254 279" marker-end="url(#sk-nm-cut-ah)"/><text x="192" y="237" class="s">4 of 5</text><path class="p " d="M280 136 L280 262" marker-end="url(#sk-nm-cut-ah)"/><text x="294" y="192" class="s">6 of 15</text><path class="p " d="M304 120 L474 189" marker-end="url(#sk-nm-cut-ah)"/><text x="402" y="147" class="s">4 of 4</text><path class="p " d="M304 280 L474 211" marker-end="url(#sk-nm-cut-ah)"/><text x="402" y="237" class="s">10 of 10</text><circle cx="80" cy="200" r="24" class="p gold"/><text x="80" y="207" text-anchor="middle" class="l">s</text><circle cx="280" cy="110" r="24" class="p room"/><text x="280" y="117" text-anchor="middle" class="l">a</text><circle cx="280" cy="290" r="24" class="p room"/><text x="280" y="297" text-anchor="middle" class="l">b</text><circle cx="500" cy="200" r="24" class="p gold"/><text x="500" y="207" text-anchor="middle" class="l">t</text><path class="p red dash" d="M400 70 Q370 200 410 330"/><text x="420" y="320" class="s">cut: 4 + 10 = 14</text><text x="30" y="370" class="s">Every unit from s to t must cross the red line, so 14 is the most possible,</text><text x="30" y="390" class="s">and the flow shown (each edge: used of capacity) reaches it.</text></g></svg><figcaption>Sketched for this page. A made-up example.</figcaption></figure>

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
