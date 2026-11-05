# 9. Feedback and fairness

*Congestion control is a feedback loop: senders measure the network, adjust their rate, and measure again. Control theory says when such loops are stable, and optimisation says what "fair" should mean. This chapter covers both, ending with Kelly's result that TCP-like algorithms solve a global optimisation problem without anyone in charge.*

!!! abstract "In this chapter"
    **You will learn:** feedback loops and delay; why AIMD converges to fairness (Chiu-Jain); max-min fairness and
    water-filling; proportional fairness and utility; network utility maximisation and prices; why TCP's response
    matches a utility function; Jain's fairness index.

    **You need:** [Networks book, chapter 17](../networks/17-Congestion-Control.md); derivatives for 9.5.

## 9.1 A feedback loop with delay

A sender adjusts its rate $x$ based on a congestion signal $p$ (loss or marking) that depends on the total load. The
signal reaches the sender one RTT late. Delay in a feedback loop invites **oscillation**: by the time the sender reacts
to congestion, it has already overshot. A control loop is stable only if it reacts gently enough relative to its delay
(roughly: gain × delay must stay below a limit). That is why TCP increases slowly (one segment per RTT) and why
routers' marking algorithms (RED, PIE, CoDel) are tuned to the expected RTTs.

## 9.2 AIMD converges to fairness

Two flows share a link of capacity $C$. Their rates $(x_1, x_2)$ form a point in the plane. The **efficiency line** is
$x_1 + x_2 = C$; the **fairness line** is $x_1 = x_2$; the goal is where they meet.

- **Additive increase** by $a$: $(x_1, x_2) \to (x_1 + a, x_2 + a)$. Moves at 45°, parallel to the fairness line; the
  difference $x_1 - x_2$ is unchanged.
- **Multiplicative decrease** by $b < 1$: $(x_1, x_2) \to (b x_1, b x_2)$. Moves toward the origin; the difference
  shrinks to $b(x_1 - x_2)$.

Each cycle of increase-then-decrease multiplies the difference by $b$, so it shrinks to zero geometrically, while the
total oscillates around $C$. Chiu and Jain (1989) showed that among linear increase/decrease rules, only AIMD both
converges to efficiency and fairness. (Additive decrease never reduces unfairness; multiplicative increase amplifies
it.)

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 395" role="img" aria-labelledby="sk-nm-aimd-t"><title id="sk-nm-aimd-t">Two flows' rates plotted against each other: repeated equal increases up to the full-link line and halvings zigzag towards the fairness line</title><defs><filter id="sk-nm-aimd-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nm-aimd-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nm-aimd-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nm-aimd-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nm-aimd-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="395" filter="url(#sk-nm-aimd-paper)"/><g filter="url(#sk-nm-aimd-pen)"><text x="30" y="44" class="h">Up together, halve together</text><path class="p" d="M100 360 L380 360 M100 360 L100 80"/><path class="p dash" d="M100.0 100.0 L360.0 360.0"/><path class="p dash" d="M100.0 360.0 L360.0 100.0"/><path class="p red" d="M261.2 339.2 L300.2 300.2 L200.1 330.1 L265.1 265.1 L182.6 312.6 L247.6 247.6 L173.8 303.8 L238.8 238.8 L169.4 299.4 L234.4 234.4 L167.2 297.2 L232.2 232.2 L166.1 296.1"/><circle cx="261" cy="339" r="5" class="p gold"/><text x="271" y="357" class="s">start: flow 1 far ahead</text><text x="321" y="334" class="s">full link</text><text x="365" y="95" class="s">fair</text><text x="230.0" y="384" text-anchor="middle" class="s">flow 1's rate</text><text x="108" y="86" class="s">flow 2's rate</text><text x="420" y="160" class="s">Adding the same to both keeps</text><text x="420" y="180" class="s">the gap; halving both halves it.</text><text x="420" y="220" class="s">So each cycle the path closes</text><text x="420" y="240" class="s">in on the point where the link</text><text x="420" y="260" class="s">is full and the shares equal.</text></g></svg><figcaption>Sketched for this page. Computed with a halving each time the link fills.</figcaption></figure>

## 9.3 What is fair?

With one link, "fair" obviously means equal shares. With many links it is not obvious. Consider a line of two links,
each of capacity 1: flow A crosses both, flow B uses only link 1, flow C only link 2.

- Giving everyone $1/2$ uses both links fully: A = 1/2, B = 1/2, C = 1/2.
- Giving A nothing and B, C one each carries more total traffic (2 instead of 1.5) but starves A.

Different definitions pick different answers.

**Max-min fairness**: no flow can be increased without decreasing a flow that is already smaller or equal. It is found
by **water-filling**: raise all rates together until some link fills; freeze the flows on it; continue raising the
others. In the example every flow hits a full link at 1/2: A = B = C = 1/2.

**Proportional fairness** (Kelly, 1997): maximise $\sum_i \log x_i$. In the example, maximise $\log a + \log(1 - a) +
\log(1 - a)$ over A's rate $a$: setting the derivative $1/a - 2/(1-a)$ to zero gives $a = 1/3$, so A = 1/3, B = C =
2/3. A long flow that uses more resources gets less, but not nothing.

## 9.4 Network utility maximisation

Generalise: each flow $i$ has a **utility** $U_i(x_i)$, increasing and concave (more rate is better, with diminishing
returns), and the network should

$$\max \sum_i U_i(x_i) \quad \text{subject to} \quad \sum_{i \text{ uses } l} x_i \le C_l \text{ for every link } l$$

The **α-fair** family $U(x) = x^{1-\alpha}/(1 - \alpha)$ spans the definitions: $\alpha = 0$ maximises total
throughput, $\alpha = 1$ (the limit, $\log x$) is proportional fairness, $\alpha = 2$ gives a TCP-like delay-weighted
fairness, and $\alpha \to \infty$ approaches max-min fairness.

## 9.5 Prices: solving it without a central planner

Kelly, Maulloo and Tan (1998) showed how to solve this **distributedly**. Give each link a **price** $p_l$ that rises when
the link is overloaded and falls when it has spare capacity. Each flow sees the total price along its path, $q_i =
\sum_{l \in \text{path}} p_l$, and sets its rate to maximise its own utility minus cost:

$$x_i = \arg\max_x \big(U_i(x) - q_i x\big) \quad\Longleftrightarrow\quad U_i'(x_i) = q_i$$

By the theory of Lagrange multipliers, the prices converge to values at which these selfish choices solve the global
problem. The analogy to the internet:

- link price ↔ loss or ECN marking probability at the router;
- the flow's reaction ↔ the congestion control algorithm.

Reverse-engineering TCP Reno's steady state (rate $\propto 1/(\text{RTT}\sqrt{p})$, networks book, Chapter 17) shows it
behaves as if maximising a utility close to $-1/(\text{RTT}^2 x)$: an α = 2 fairness, which also explains why it
favours short-RTT flows. Vegas and FAST TCP, which react to delay, correspond to proportional fairness. This framework
(Low, Srikant and others) is how researchers design and analyse new algorithms.

## 9.6 Measuring fairness

**Jain's fairness index** for $n$ flows with rates $x_i$:

$$J = \frac{\left(\sum x_i\right)^2}{n \sum x_i^2}$$

It is 1 when all rates are equal and $1/n$ when one flow takes everything. Experiments on new congestion controllers
(BBR versus CUBIC, QUIC versus TCP) report it routinely.

<figure class="play" data-play="jain"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> Jain's index for four flows sharing a link. Move the rates: it is 1 when all four are equal and 0.25 when one flow takes everything. The rates are examples.</figcaption></figure>

## Check yourself

??? question "1. Two AIMD flows start at rates 8 and 2 with b = 1/2. After three decreases (and equal increases in between), how big is their difference?"
    The increases leave the difference at 6; each decrease halves it: 6 → 3 → 1.5 → 0.75.

??? question "2. Compute Jain's index for rates 1, 1, 1, 5."
    (8)² / (4 × 28) = 64/112 ≈ 0.57.

??? question "3. In max-min fairness, can a flow be given less than another if it is not limited by any full link?"
    No: water-filling raises every flow until it is stopped by a full link, so a flow below another must be bottlenecked somewhere.

??? info "Sources"
    - D. Chiu and R. Jain, "Analysis of the Increase and Decrease Algorithms for Congestion Avoidance", 1989; R. Jain, D. Chiu, W. Hawe, "A Quantitative Measure of Fairness", DEC TR-301, 1984.
    - F. Kelly, "Charging and rate control for elastic traffic", *European Trans. Telecom.*, 1997; F. Kelly, A. Maulloo, D. Tan, *J. Operational Research Society*, 1998.
    - J. Mo and J. Walrand, "Fair End-to-End Window-Based Congestion Control", *IEEE/ACM ToN*, 2000 (α-fairness).
    - R. Srikant, *The Mathematics of Internet Congestion Control*, Birkhäuser, 2004; S. Low, "A Duality Model of TCP and Queue Management Algorithms", *IEEE/ACM ToN*, 2003.
