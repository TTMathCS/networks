# 3. Queues and Little's law

*Every router port, server and Wi-Fi channel is a queue: work arrives, waits, is served. Queueing theory, founded for telephone exchanges by Agner Erlang in 1909 and applied to packet networks by Leonard Kleinrock, explains why delay explodes near full load. This chapter derives the key results.*

!!! abstract "In this chapter"
    **You will learn:** the parts of a queue and Kendall's notation; Little's law and why it always holds; the M/M/1
    queue derived from a birth-death chain; delay versus load; M/D/1 and M/G/1; finite buffers and loss; Erlang's
    formulas; what queueing says about network design.

    **You need:** [Chapter 2](02-Probability-for-Networks.md).

## 3.1 What a queue is

A queue has **arrivals** (rate $\lambda$, customers per second), a **service** process (each server handles $\mu$
customers per second when busy), a number of **servers**, and a **buffer**. **Kendall's notation** A/S/c/K names it:
arrival law / service law / servers / capacity, with M for Markovian (Poisson arrivals, exponential service), D for
deterministic and G for general. A router output port with random arrivals and packets of random size is roughly
M/M/1; one with fixed-size packets, M/D/1.

The **load** (utilisation) of a single server is $\rho = \lambda / \mu$. It must be below 1 or the queue grows forever.

## 3.2 Little's law

For any stable system, in the long run:

$$L = \lambda W$$

where $L$ is the average number of customers in the system, $\lambda$ the arrival rate, and $W$ the average time each
spends there. It holds for any arrival and service laws, any number of servers and any scheduling order.

**Sketch of proof.** Plot the number in the system over a long time $T$. The area under the curve, divided by $T$, is
$L$. The same area is the sum of all customers' times in the system: about $\lambda T$ customers, each contributing on
average $W$. So $L T \approx \lambda T W$, and dividing by $T$ gives $L = \lambda W$.

Uses: a router port sends 100,000 packets per second and on average holds 500 packets: each waits $W = 500 / 100{,}000
= 5$ ms. TCP's window is Little's law too: data in flight = rate × RTT (the bandwidth-delay product).

## 3.3 The M/M/1 queue

Let $p_n$ be the long-run probability of $n$ packets in the system. With Poisson arrivals and exponential service, the
state moves up by one at rate $\lambda$ and down by one at rate $\mu$ (a **birth-death chain**). In balance, the flow
across the boundary between states $n$ and $n + 1$ is equal both ways:

$$\lambda\, p_n = \mu\, p_{n+1} \quad\Rightarrow\quad p_{n+1} = \rho\, p_n \quad\Rightarrow\quad p_n = \rho^n p_0$$

Probabilities sum to 1: $p_0 \sum \rho^n = p_0/(1 - \rho) = 1$, so $p_0 = 1 - \rho$ and

$$p_n = (1 - \rho)\,\rho^n$$

The mean number in the system is $L = \sum n p_n = \dfrac{\rho}{1 - \rho}$, and by Little's law

$$W = \frac{L}{\lambda} = \frac{1}{\mu - \lambda} = \frac{1/\mu}{1 - \rho}$$

The time in the system is the bare service time $1/\mu$ stretched by $1/(1 - \rho)$:

| Load $\rho$ | 0.5 | 0.8 | 0.9 | 0.95 | 0.99 |
| --- | --- | --- | --- | --- | --- |
| Delay ÷ service time | 2 | 5 | 10 | 20 | 100 |

This curve is the most important picture in network performance: delay is gentle up to about 70% load and then
explodes. It is why operators upgrade links at 70–80% peak utilisation.

<figure class="mars-fig">
<svg viewBox="0 0 480 200" width="480" role="img" aria-label="Delay grows like 1/(1-rho), slowly at first and steeply near rho = 1">
<g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="40" y1="170" x2="460" y2="170"/><line x1="40" y1="170" x2="40" y2="10"/></g>
<path class="na" fill="none" stroke-width="3" d="M40 162 L82 161 L124 160 L166 158 L208 156 L250 152 L292 146 L334 134 L355 122 L376 98 L397 50 L405 20"/>
<g font-size="12" fill="currentColor"><text x="430" y="188">ρ = 1</text><text x="40" y="188">0</text><text x="230" y="188">0.5</text><text x="48" y="20">delay</text></g>
<line x1="418" y1="10" x2="418" y2="170" stroke="currentColor" stroke-dasharray="4 4"/>
</svg>
<figcaption>Average delay in an M/M/1 queue against load: almost flat at first, then shooting up as the load approaches 1.</figcaption>
</figure>

## 3.4 Other service laws

With deterministic service (fixed packet size), the **Pollaczek-Khinchine formula** for M/G/1 gives the mean waiting
time (before service):

$$W_q = \frac{\lambda\, E[S^2]}{2(1 - \rho)}$$

where $S$ is the service time. For exponential service $E[S^2] = 2/\mu^2$; for deterministic $E[S^2] = 1/\mu^2$, so
M/D/1 waits are exactly half of M/M/1's. Variability itself costs delay: a mix of tiny ACKs and full 1,500-byte packets
waits longer than uniform traffic at the same load.

## 3.5 Finite buffers and loss

A real port holds at most $K$ packets (M/M/1/K). Arrivals that find it full are dropped. The same balance argument
gives $p_n = \rho^n (1 - \rho)/(1 - \rho^{K+1})$ for $n \le K$, and the **loss probability** is $p_K$. With $\rho = 0.9$
and $K = 50$, $p_K \approx 0.0005$; at $\rho = 1.1$ the loss is about 9% and almost unaffected by $K$. A bigger buffer
only helps short bursts; under sustained overload it just adds delay (bufferbloat), which is why congestion control
must slow the senders down.

## 3.6 Erlang's formulas

Telephone networks asked: with $c$ lines and offered traffic $A = \lambda/\mu$ (in **erlangs**), what fraction of calls
are blocked? **Erlang B** (no waiting):

$$B(c, A) = \frac{A^c / c!}{\sum_{k=0}^{c} A^k / k!}$$

Ten erlangs of traffic on 15 lines blocks about 3.6% of calls; on 18 lines, about 0.7%. The same formula sizes call
centres, cellular channels and licence pools. **Erlang C** gives the probability of waiting when calls can queue.

## 3.7 Networks of queues

A packet crosses many queues. **Jackson's theorem** (1957) says that in a network of M/M/1-like queues with random
routing, each queue behaves as if independent, with its own load, so delays add up. Kleinrock used a version of this
(with his "independence approximation") to design ARPANET's links. Real internet traffic is burstier than Poisson
(Chapter 2), so measured delays are worse than these formulas predict at the same average load, but the shape of the
curve holds.

## Check yourself

??? question "1. A web server handles 2,000 requests per second and on average 50 are in progress. What is the mean response time?"
    W = L/λ = 50/2000 = 25 ms.

??? question "2. An M/M/1 link serves 10,000 packets/s. At 9,000 packets/s arriving, what is the mean time in the system?"
    W = 1/(μ − λ) = 1/1000 s = 1 ms (ten times the 0.1 ms service time).

??? question "3. Why does an M/D/1 queue wait less than an M/M/1 queue at the same load?"
    Waiting time grows with the variance of service time (E[S²]); fixed service has the smallest variance, halving the wait.

??? info "Sources"
    - L. Kleinrock, *Queueing Systems, Vol. 1: Theory*, Wiley, 1975; *Communication Nets*, 1964.
    - J. Little, "A Proof for the Queuing Formula L = λW", *Operations Research*, 1961.
    - A. K. Erlang, "The Theory of Probabilities and Telephone Conversations", 1909; J. Jackson, "Networks of Waiting Lines", *Operations Research*, 1957.
    - M. Harchol-Balter, *Performance Modeling and Design of Computer Systems*, Cambridge, 2013.
