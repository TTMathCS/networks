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

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 385" role="img" aria-labelledby="sk-nm-aloha-t"><title id="sk-nm-aloha-t">Share of useful slots against attempts per slot: slotted ALOHA peaks at 37 percent at one attempt per slot, unslotted ALOHA at 18 percent at half an attempt</title><defs><filter id="sk-nm-aloha-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nm-aloha-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nm-aloha-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nm-aloha-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nm-aloha-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="385" filter="url(#sk-nm-aloha-paper)"/><g filter="url(#sk-nm-aloha-pen)"><text x="30" y="44" class="h">At best, 37 slots in 100 carry data</text><path class="p" d="M80 320 L580 320 M80 320 L80 80"/><text x="80" y="340" text-anchor="middle" class="s">0</text><text x="163" y="340" text-anchor="middle" class="s">0.5</text><text x="247" y="340" text-anchor="middle" class="s">1</text><text x="413" y="340" text-anchor="middle" class="s">2</text><text x="580" y="340" text-anchor="middle" class="s">3</text><text x="72" y="265" text-anchor="end" class="s">10%</text><text x="72" y="205" text-anchor="end" class="s">20%</text><text x="72" y="145" text-anchor="end" class="s">30%</text><path class="p blue" d="M80.0 320.0 L82.5 311.1 L85.0 302.5 L87.5 294.2 L90.0 286.1 L92.5 278.3 L95.0 270.6 L97.5 263.3 L100.0 256.1 L102.5 249.2 L105.0 242.5 L107.5 236.1 L110.0 229.8 L112.5 223.7 L115.0 217.9 L117.5 212.2 L120.0 206.7 L122.5 201.4 L125.0 196.3 L127.5 191.4 L130.0 186.7 L132.5 182.1 L135.0 177.7 L137.5 173.4 L140.0 169.3 L142.5 165.4 L145.0 161.6 L147.5 157.9 L150.0 154.4 L152.5 151.1 L155.0 147.8 L157.5 144.8 L160.0 141.8 L162.5 139.0 L165.0 136.2 L167.5 133.7 L170.0 131.2 L172.5 128.8 L175.0 126.6 L177.5 124.5 L180.0 122.4 L182.5 120.5 L185.0 118.7 L187.5 117.0 L190.0 115.3 L192.5 113.8 L195.0 112.3 L197.5 111.0 L200.0 109.7 L202.5 108.5 L205.0 107.4 L207.5 106.4 L210.0 105.5 L212.5 104.6 L215.0 103.8 L217.5 103.1 L220.0 102.4 L222.5 101.8 L225.0 101.3 L227.5 100.8 L230.0 100.5 L232.5 100.1 L235.0 99.8 L237.5 99.6 L240.0 99.5 L242.5 99.3 L245.0 99.3 L247.5 99.3 L250.0 99.3 L252.5 99.4 L255.0 99.5 L257.5 99.7 L260.0 99.9 L262.5 100.2 L265.0 100.5 L267.5 100.9 L270.0 101.2 L272.5 101.7 L275.0 102.1 L277.5 102.6 L280.0 103.1 L282.5 103.7 L285.0 104.3 L287.5 104.9 L290.0 105.6 L292.5 106.2 L295.0 106.9 L297.5 107.7 L300.0 108.4 L302.5 109.2 L305.0 110.0 L307.5 110.8 L310.0 111.7 L312.5 112.6 L315.0 113.5 L317.5 114.4 L320.0 115.3 L322.5 116.2 L325.0 117.2 L327.5 118.2 L330.0 119.2 L332.5 120.2 L335.0 121.2 L337.5 122.3 L340.0 123.3 L342.5 124.4 L345.0 125.5 L347.5 126.5 L350.0 127.6 L352.5 128.8 L355.0 129.9 L357.5 131.0 L360.0 132.1 L362.5 133.3 L365.0 134.4 L367.5 135.6 L370.0 136.8 L372.5 137.9 L375.0 139.1 L377.5 140.3 L380.0 141.5 L382.5 142.7 L385.0 143.9 L387.5 145.1 L390.0 146.3 L392.5 147.5 L395.0 148.7 L397.5 149.9 L400.0 151.1 L402.5 152.3 L405.0 153.5 L407.5 154.8 L410.0 156.0 L412.5 157.2 L415.0 158.4 L417.5 159.6 L420.0 160.8 L422.5 162.1 L425.0 163.3 L427.5 164.5 L430.0 165.7 L432.5 166.9 L435.0 168.1 L437.5 169.3 L440.0 170.5 L442.5 171.7 L445.0 172.9 L447.5 174.1 L450.0 175.3 L452.5 176.5 L455.0 177.7 L457.5 178.9 L460.0 180.1 L462.5 181.3 L465.0 182.4 L467.5 183.6 L470.0 184.8 L472.5 185.9 L475.0 187.1 L477.5 188.2 L480.0 189.4 L482.5 190.5 L485.0 191.6 L487.5 192.8 L490.0 193.9 L492.5 195.0 L495.0 196.1 L497.5 197.2 L500.0 198.3 L502.5 199.4 L505.0 200.5 L507.5 201.6 L510.0 202.7 L512.5 203.8 L515.0 204.8 L517.5 205.9 L520.0 207.0 L522.5 208.0 L525.0 209.1 L527.5 210.1 L530.0 211.1 L532.5 212.2 L535.0 213.2 L537.5 214.2 L540.0 215.2 L542.5 216.2 L545.0 217.2 L547.5 218.2 L550.0 219.1 L552.5 220.1 L555.0 221.1 L557.5 222.0 L560.0 223.0 L562.5 223.9 L565.0 224.9 L567.5 225.8 L570.0 226.7 L572.5 227.7 L575.0 228.6 L577.5 229.5 L580.0 230.4"/><path class="p red" d="M80.0 320.0 L82.5 311.3 L85.0 303.0 L87.5 295.3 L90.0 288.1 L92.5 281.3 L95.0 274.9 L97.5 268.9 L100.0 263.4 L102.5 258.2 L105.0 253.3 L107.5 248.8 L110.0 244.7 L112.5 240.8 L115.0 237.2 L117.5 233.9 L120.0 230.9 L122.5 228.1 L125.0 225.6 L127.5 223.3 L130.0 221.2 L132.5 219.3 L135.0 217.7 L137.5 216.2 L140.0 214.9 L142.5 213.7 L145.0 212.7 L147.5 211.9 L150.0 211.2 L152.5 210.7 L155.0 210.2 L157.5 209.9 L160.0 209.7 L162.5 209.6 L165.0 209.7 L167.5 209.8 L170.0 210.0 L172.5 210.3 L175.0 210.6 L177.5 211.1 L180.0 211.6 L182.5 212.1 L185.0 212.8 L187.5 213.5 L190.0 214.2 L192.5 215.0 L195.0 215.8 L197.5 216.7 L200.0 217.6 L202.5 218.6 L205.0 219.6 L207.5 220.6 L210.0 221.7 L212.5 222.7 L215.0 223.8 L217.5 224.9 L220.0 226.1 L222.5 227.2 L225.0 228.4 L227.5 229.6 L230.0 230.7 L232.5 231.9 L235.0 233.1 L237.5 234.3 L240.0 235.6 L242.5 236.8 L245.0 238.0 L247.5 239.2 L250.0 240.4 L252.5 241.6 L255.0 242.9 L257.5 244.1 L260.0 245.3 L262.5 246.5 L265.0 247.7 L267.5 248.9 L270.0 250.0 L272.5 251.2 L275.0 252.4 L277.5 253.5 L280.0 254.7 L282.5 255.8 L285.0 256.9 L287.5 258.1 L290.0 259.2 L292.5 260.3 L295.0 261.4 L297.5 262.4 L300.0 263.5 L302.5 264.5 L305.0 265.6 L307.5 266.6 L310.0 267.6 L312.5 268.6 L315.0 269.6 L317.5 270.5 L320.0 271.5 L322.5 272.4 L325.0 273.4 L327.5 274.3 L330.0 275.2 L332.5 276.1 L335.0 277.0 L337.5 277.8 L340.0 278.7 L342.5 279.5 L345.0 280.3 L347.5 281.1 L350.0 281.9 L352.5 282.7 L355.0 283.5 L357.5 284.2 L360.0 285.0 L362.5 285.7 L365.0 286.4 L367.5 287.1 L370.0 287.8 L372.5 288.5 L375.0 289.2 L377.5 289.8 L380.0 290.5 L382.5 291.1 L385.0 291.7 L387.5 292.4 L390.0 293.0 L392.5 293.5 L395.0 294.1 L397.5 294.7 L400.0 295.2 L402.5 295.8 L405.0 296.3 L407.5 296.8 L410.0 297.4 L412.5 297.9 L415.0 298.3 L417.5 298.8 L420.0 299.3 L422.5 299.8 L425.0 300.2 L427.5 300.7 L430.0 301.1 L432.5 301.5 L435.0 302.0 L437.5 302.4 L440.0 302.8 L442.5 303.2 L445.0 303.5 L447.5 303.9 L450.0 304.3 L452.5 304.6 L455.0 305.0 L457.5 305.3 L460.0 305.7 L462.5 306.0 L465.0 306.3 L467.5 306.7 L470.0 307.0 L472.5 307.3 L475.0 307.6 L477.5 307.9 L480.0 308.1 L482.5 308.4 L485.0 308.7 L487.5 309.0 L490.0 309.2 L492.5 309.5 L495.0 309.7 L497.5 310.0 L500.0 310.2 L502.5 310.4 L505.0 310.7 L507.5 310.9 L510.0 311.1 L512.5 311.3 L515.0 311.5 L517.5 311.7 L520.0 311.9 L522.5 312.1 L525.0 312.3 L527.5 312.5 L530.0 312.7 L532.5 312.9 L535.0 313.0 L537.5 313.2 L540.0 313.4 L542.5 313.5 L545.0 313.7 L547.5 313.8 L550.0 314.0 L552.5 314.1 L555.0 314.3 L557.5 314.4 L560.0 314.6 L562.5 314.7 L565.0 314.8 L567.5 314.9 L570.0 315.1 L572.5 315.2 L575.0 315.3 L577.5 315.4 L580.0 315.5"/><circle cx="247" cy="99" r="5" class="p gold"/><text x="259" y="91" class="s">slotted: 37% when, on average, one tries per slot</text><circle cx="163" cy="210" r="5" class="p gold"/><text x="173" y="236" class="s">unslotted: 18%</text><text x="330.0" y="366" text-anchor="middle" class="s">attempts per slot, on average</text><text x="30" y="80" class="s">useful slots</text><text x="380" y="250" class="s">Try more and collisions win.</text></g></svg><figcaption>Sketched for this page. To scale, for many stations.</figcaption></figure>

<figure class="play" data-play="aloha"><span class="ai-tag">AI-created</span><figcaption><b>Watch it.</b> Slotted ALOHA: each slot works only if exactly one station sends. Set the average load G and press Play to run 200 random slots; the useful share follows G·e<sup>−G</sup>, best at G = 1, about 37%. The slots are simulated.</figcaption></figure>

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
