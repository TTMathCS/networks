# 2. Probability for networks

*Traffic is random: users come and go, packets are lost, radios collide. This chapter gives the probability needed to reason about it: the binomial law behind packet switching, the geometric law of retransmissions, Poisson arrivals and the exponential law, and expected values.*

!!! abstract "In this chapter"
    **You will learn:** independent events; the binomial distribution and the 35-users example; the geometric
    distribution and expected retransmissions; Poisson processes and exponential gaps; expectation and variance; ALOHA's
    efficiency; when independence fails.

    **You need:** [Chapter 1](01-Bits-Binary-and-Masks.md); fractions and powers.

## 2.1 Events and independence

A probability is a number from 0 to 1. Two events are **independent** when one tells you nothing about the other; then
$P(A \text{ and } B) = P(A)\,P(B)$. If each of 10 links loses a packet with probability 0.01, independently, a packet
crosses all 10 with probability $0.99^{10} \approx 0.904$: about 9.6% are lost somewhere. Small per-hop losses add up.

## 2.2 The binomial law and packet switching

$N$ users are each active with probability $p$, independently. The number active, $K$, is **binomial**:

$$P(K = k) = \binom{N}{k} p^k (1 - p)^{N - k}, \qquad \binom{N}{k} = \frac{N!}{k!\,(N - k)!}$$

The networks book (Chapter 1) claimed that 35 users, each active 10% of the time and needing 1 Mbit/s, can share a
10 Mbit/s link with almost no trouble. Trouble means $K \ge 11$:

$$P(K \ge 11) = 1 - \sum_{k=0}^{10} \binom{35}{k} (0.1)^k (0.9)^{35 - k} \approx 0.0004$$

On average $E[K] = Np = 3.5$ users are active, with standard deviation $\sqrt{Np(1-p)} \approx 1.8$; eleven is more
than four standard deviations above. Circuit switching would reserve capacity for every user's peak; packet switching
bets on the average, which is **statistical multiplexing**.

```python
from math import comb
print(1 - sum(comb(35, k) * 0.1**k * 0.9**(35 - k) for k in range(11)))   # 0.000424...
```

## 2.3 The geometric law: retries

A packet (or a Wi-Fi frame) gets through with probability $s$ on each try, independently. The number of tries $T$ until
the first success is **geometric**:

$$P(T = t) = (1 - s)^{t - 1} s, \qquad E[T] = \frac{1}{s}$$

With 20% loss ($s = 0.8$), a packet needs on average 1.25 transmissions; with 50% loss, 2. The chance that $r$ tries all
fail is $(1 - s)^r$: with 20% loss and a limit of 7 tries, $0.2^7 \approx 1.3 \times 10^{-5}$. That is why Wi-Fi
retries at the link layer: a few quick local retries hide most radio loss from TCP.

**Proof of $E[T] = 1/s$.** $E[T] = \sum_{t \ge 1} t (1-s)^{t-1} s$. With $q = 1 - s$ and $\sum_{t\ge1} t q^{t-1} =
1/(1-q)^2$ (differentiate the geometric series $\sum q^t = 1/(1-q)$), $E[T] = s / s^2 = 1/s$.

## 2.4 Poisson arrivals

When very many independent users each send rarely, the number of arrivals in an interval follows the **Poisson** law
with rate $\lambda$ per second:

$$P(k \text{ arrivals in time } t) = \frac{(\lambda t)^k e^{-\lambda t}}{k!}$$

It is the limit of the binomial as $N \to \infty$ with $Np = \lambda t$ fixed. Mean and variance are both $\lambda t$.
The gaps between arrivals are **exponential**: $P(\text{gap} > x) = e^{-\lambda x}$, with mean $1/\lambda$, and
**memoryless**: having waited 5 ms tells you nothing about the remaining wait. Poisson arrivals make queues solvable
(Chapter 3).

Real traffic is burstier than Poisson: Leland, Taqqu, Willinger and Wilson showed in 1994 that Ethernet traffic is
**self-similar**: bursty at every time scale, from milliseconds to hours, caused by heavy-tailed file and flow sizes.
Session arrivals (users starting things) remain close to Poisson.

## 2.5 Expectation and variance

The **expected value** $E[X] = \sum x\,P(X = x)$ is the long-run average; **variance** $\text{Var}(X) = E[(X - E[X])^2]$
measures spread. Two facts carry most calculations:

- **Linearity**: $E[X + Y] = E[X] + E[Y]$ always, even when $X$ and $Y$ are dependent.
- For **independent** variables, variances add: $\text{Var}(X + Y) = \text{Var}(X) + \text{Var}(Y)$.

Example: a path of 5 hops, each with mean queueing delay 2 ms, has mean total queueing delay 10 ms whatever the
dependence between hops.

## 2.6 ALOHA's 37%

In **slotted ALOHA**, $N$ stations each send in a time slot with probability $p$. A slot is useful when exactly one
sends:

$$P(\text{success}) = N p (1 - p)^{N - 1}$$

Maximise over $p$: the derivative is zero at $p = 1/N$, giving $(1 - 1/N)^{N - 1} \to 1/e \approx 0.37$ as $N$ grows.
At best, 37% of slots carry data; the rest are empty or collisions. Unslotted ALOHA gets half that, $1/(2e) \approx
18\%$, because a frame is vulnerable for two frame times. CSMA does better by listening first (networks book,
Chapter 5).

## 2.7 Birthday collisions

How many random 16-bit IDs before two coincide? Among $n$ random values from $M$ possibilities, a collision becomes
likely when $n \approx \sqrt{M}$; more exactly $P(\text{collision}) \approx 1 - e^{-n^2 / 2M}$. For $M = 65{,}536$ that
is only a few hundred. This **birthday bound** explains why 16-bit DNS IDs were too few against cache poisoning, and
why randomised MAC addresses and IPv6 interface IDs use 46 and 64 random bits.

## Check yourself

??? question "1. A link drops 2% of frames. What is the probability a frame needs more than 3 tries?"
    All first three fail: 0.02³ = 8×10⁻⁶.

??? question "2. Arrivals are Poisson at 100 per second. What is the probability of no arrival in 10 ms?"
    λt = 1, so e⁻¹ ≈ 0.37.

??? question "3. Show that p = 1/N maximises Np(1 − p)^(N−1)."
    Differentiate: N(1−p)^(N−2)(1 − p − (N−1)p) = 0 gives 1 − Np = 0, so p = 1/N.

??? info "Sources"
    - Kurose and Ross, *Computer Networking*, 8th ed., sections 1.3 and 6.3 (packet switching, ALOHA).
    - D. Bertsekas and R. Gallager, *Data Networks*, 2nd ed., 1992, chapters 3–4.
    - W. Leland, M. Taqqu, W. Willinger, D. Wilson, "On the Self-Similar Nature of Ethernet Traffic", *IEEE/ACM ToN*, 1994.
    - V. Paxson and S. Floyd, "Wide-Area Traffic: The Failure of Poisson Modeling", *IEEE/ACM ToN*, 1995.
