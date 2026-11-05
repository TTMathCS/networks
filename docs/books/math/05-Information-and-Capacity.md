# 5. Information and capacity

*In 1948 Claude Shannon defined information and proved that every noisy channel has a capacity: below it, errors can be made as rare as you like; above it, never. This chapter gives entropy, compression's limit, mutual information, and Shannon's capacity formula, with what they mean for real links.*

!!! abstract "In this chapter"
    **You will learn:** information as surprise; entropy and the compression limit; Huffman coding's relation to entropy;
    channels, mutual information and capacity; the binary symmetric channel; the Shannon-Hartley formula; spectral
    efficiency and the energy-per-bit limit; why modern links come close.

    **You need:** logarithms; [Chapter 2](02-Probability-for-Networks.md).

## 5.1 Information is surprise

An event of probability $p$ carries $\log_2(1/p)$ **bits** of information. A fair coin toss: 1 bit. One of 256
equally likely bytes: 8 bits. A certain event: 0 bits. The definition makes independent information add:
$\log_2(1/(pq)) = \log_2(1/p) + \log_2(1/q)$.

## 5.2 Entropy

The **entropy** of a source with symbol probabilities $p_i$ is the average information per symbol:

$$H = -\sum_i p_i \log_2 p_i \quad \text{bits per symbol}$$

It is largest, $\log_2 N$, when all $N$ symbols are equally likely, and 0 when one symbol is certain. A biased coin with
$p = 0.9$ has $H = -0.9\log_2 0.9 - 0.1 \log_2 0.1 \approx 0.47$ bits.

**Source coding theorem.** No lossless code can use fewer than $H$ bits per symbol on average, and codes exist that
come arbitrarily close (by coding long blocks of symbols together). **Huffman coding** achieves within 1 bit of $H$
per symbol; arithmetic coding gets closer. This is why compressed or encrypted data cannot be compressed again: it
already looks random, at maximum entropy. Networks compress headers (HPACK, QPACK, ROHC on cellular links) because
headers are highly repetitive, low-entropy data.

## 5.3 Channels and mutual information

A **channel** takes an input $X$ and produces an output $Y$, with noise described by $P(Y \mid X)$. How much does
seeing $Y$ tell us about $X$? The **mutual information**

$$I(X; Y) = H(X) - H(X \mid Y)$$

is the uncertainty about $X$ removed by observing $Y$. The **capacity** is the best possible, over all input
distributions:

$$C = \max_{P(X)} I(X; Y) \quad \text{bits per channel use}$$

**Noisy-channel coding theorem** (Shannon, 1948). At any rate $R < C$ there exist codes whose error probability tends
to zero as the block length grows; at any $R > C$, the error probability is bounded away from zero. This was startling:
noise does not force errors, it only limits the rate.

## 5.4 The binary symmetric channel

Each bit is flipped with probability $p$. Its capacity is

$$C = 1 - H_2(p), \qquad H_2(p) = -p \log_2 p - (1 - p) \log_2 (1 - p)$$

With $p = 0.01$, $C \approx 0.919$: about 8% of the bits must be redundancy. With $p = 0.11$, $C \approx 0.5$: half.
With $p = 0.5$, $C = 0$: the output is pure noise.

## 5.5 Shannon-Hartley: bandwidth and noise

For a channel of bandwidth $B$ hertz with additive white Gaussian noise and average signal-to-noise power ratio $S/N$:

$$C = B \log_2\!\left(1 + \frac{S}{N}\right) \quad \text{bits per second}$$

**Why this shape (sketch).** In time $T$ the channel carries about $2BT$ independent samples (Nyquist, Chapter 7). A
received block is a point in a $2BT$-dimensional space, blurred by noise into a small sphere of radius about
$\sqrt{2BT\,N}$. Received signals fill a sphere of radius $\sqrt{2BT\,(S + N)}$. The number of non-overlapping noise
spheres that fit is the ratio of volumes, $\big((S+N)/N\big)^{BT}$, so the number of bits is $BT \log_2(1 + S/N)$.

Two regimes:

- **Bandwidth-limited** (high S/N): each doubling of $S/N$ (3 dB) adds about $B$ bits per second. Wi-Fi close to the
  access point, fibre.
- **Power-limited** (low S/N): capacity grows almost linearly with power, $C \approx B \cdot (S/N)/\ln 2$. Deep space,
  GPS, satellites far from the beam centre.

**Spectral efficiency** $C/B$ in bit/s/Hz: at 30 dB, about 10; Wi-Fi 7's 4096-QAM carries 12 bits per symbol only with
an S/N above roughly 40 dB.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 385" role="img" aria-labelledby="sk-nm-shannon-t"><title id="sk-nm-shannon-t">The Shannon limit in bits per second per hertz against signal-to-noise ratio from minus 10 to 40 decibels; about 10 at 30 decibels</title><defs><filter id="sk-nm-shannon-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nm-shannon-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nm-shannon-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nm-shannon-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nm-shannon-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="385" filter="url(#sk-nm-shannon-paper)"/><g filter="url(#sk-nm-shannon-pen)"><text x="30" y="44" class="h">Bits per hertz against signal over noise</text><path class="p" d="M80 320 L580 320 M80 320 L80 80"/><text x="80" y="340" text-anchor="middle" class="s">-10 dB</text><text x="180" y="340" text-anchor="middle" class="s">0 dB</text><text x="280" y="340" text-anchor="middle" class="s">10 dB</text><text x="380" y="340" text-anchor="middle" class="s">20 dB</text><text x="480" y="340" text-anchor="middle" class="s">30 dB</text><text x="580" y="340" text-anchor="middle" class="s">40 dB</text><text x="72" y="291" text-anchor="end" class="s">2</text><text x="72" y="222" text-anchor="end" class="s">6</text><text x="72" y="154" text-anchor="end" class="s">10</text><text x="72" y="85" text-anchor="end" class="s">14</text><path class="p blue" d="M80.0 317.6 L82.5 317.5 L85.0 317.4 L87.5 317.2 L90.0 317.1 L92.5 316.9 L95.0 316.7 L97.5 316.6 L100.0 316.4 L102.5 316.2 L105.0 316.0 L107.5 315.7 L110.0 315.5 L112.5 315.3 L115.0 315.0 L117.5 314.7 L120.0 314.5 L122.5 314.2 L125.0 313.9 L127.5 313.5 L130.0 313.2 L132.5 312.9 L135.0 312.5 L137.5 312.1 L140.0 311.7 L142.5 311.3 L145.0 310.9 L147.5 310.4 L150.0 310.0 L152.5 309.5 L155.0 309.0 L157.5 308.4 L160.0 307.9 L162.5 307.3 L165.0 306.8 L167.5 306.2 L170.0 305.5 L172.5 304.9 L175.0 304.2 L177.5 303.6 L180.0 302.9 L182.5 302.1 L185.0 301.4 L187.5 300.6 L190.0 299.8 L192.5 299.0 L195.0 298.2 L197.5 297.4 L200.0 296.5 L202.5 295.6 L205.0 294.7 L207.5 293.8 L210.0 292.9 L212.5 291.9 L215.0 290.9 L217.5 289.9 L220.0 288.9 L222.5 287.9 L225.0 286.9 L227.5 285.8 L230.0 284.7 L232.5 283.6 L235.0 282.5 L237.5 281.4 L240.0 280.3 L242.5 279.1 L245.0 278.0 L247.5 276.8 L250.0 275.6 L252.5 274.4 L255.0 273.2 L257.5 272.0 L260.0 270.8 L262.5 269.6 L265.0 268.3 L267.5 267.1 L270.0 265.8 L272.5 264.5 L275.0 263.3 L277.5 262.0 L280.0 260.7 L282.5 259.4 L285.0 258.1 L287.5 256.8 L290.0 255.5 L292.5 254.1 L295.0 252.8 L297.5 251.5 L300.0 250.1 L302.5 248.8 L305.0 247.5 L307.5 246.1 L310.0 244.8 L312.5 243.4 L315.0 242.0 L317.5 240.7 L320.0 239.3 L322.5 237.9 L325.0 236.6 L327.5 235.2 L330.0 233.8 L332.5 232.4 L335.0 231.0 L337.5 229.7 L340.0 228.3 L342.5 226.9 L345.0 225.5 L347.5 224.1 L350.0 222.7 L352.5 221.3 L355.0 219.9 L357.5 218.5 L360.0 217.1 L362.5 215.7 L365.0 214.3 L367.5 212.9 L370.0 211.5 L372.5 210.1 L375.0 208.7 L377.5 207.3 L380.0 205.9 L382.5 204.4 L385.0 203.0 L387.5 201.6 L390.0 200.2 L392.5 198.8 L395.0 197.4 L397.5 196.0 L400.0 194.6 L402.5 193.1 L405.0 191.7 L407.5 190.3 L410.0 188.9 L412.5 187.5 L415.0 186.1 L417.5 184.6 L420.0 183.2 L422.5 181.8 L425.0 180.4 L427.5 179.0 L430.0 177.6 L432.5 176.1 L435.0 174.7 L437.5 173.3 L440.0 171.9 L442.5 170.5 L445.0 169.0 L447.5 167.6 L450.0 166.2 L452.5 164.8 L455.0 163.4 L457.5 161.9 L460.0 160.5 L462.5 159.1 L465.0 157.7 L467.5 156.2 L470.0 154.8 L472.5 153.4 L475.0 152.0 L477.5 150.6 L480.0 149.1 L482.5 147.7 L485.0 146.3 L487.5 144.9 L490.0 143.4 L492.5 142.0 L495.0 140.6 L497.5 139.2 L500.0 137.8 L502.5 136.3 L505.0 134.9 L507.5 133.5 L510.0 132.1 L512.5 130.6 L515.0 129.2 L517.5 127.8 L520.0 126.4 L522.5 124.9 L525.0 123.5 L527.5 122.1 L530.0 120.7 L532.5 119.3 L535.0 117.8 L537.5 116.4 L540.0 115.0 L542.5 113.6 L545.0 112.1 L547.5 110.7 L550.0 109.3 L552.5 107.9 L555.0 106.4 L557.5 105.0 L560.0 103.6 L562.5 102.2 L565.0 100.7 L567.5 99.3 L570.0 97.9 L572.5 96.5 L575.0 95.1 L577.5 93.6 L580.0 92.2"/><circle cx="480" cy="149" r="5" class="p gold"/><text x="470" y="135" text-anchor="end" class="s">30 dB: about 10</text><text x="400" y="251" class="s">high: each +3 dB adds</text><text x="400" y="269" class="s">about 1 bit per hertz</text><text x="90" y="258" class="s">low: capacity grows</text><text x="90" y="276" class="s">almost in step with power</text><text x="330.0" y="366" text-anchor="middle" class="s">signal over noise</text><text x="30" y="66" class="s">bit/s per Hz</text></g></svg><figcaption>Sketched for this page. To scale.</figcaption></figure>

## 5.6 The ultimate limit on energy

Write $E_b$ for energy per bit and $N_0$ for noise power per hertz, so $S = E_b R$ and $N = N_0 B$. Letting the bandwidth
grow without limit, reliable communication at any rate requires

$$\frac{E_b}{N_0} \ge \ln 2 \approx 0.693 \quad (-1.59 \text{ dB})$$

the **Shannon limit**. Deep-space links are designed against it: turbo and LDPC codes on NASA missions operate within
about 1 dB of the limit for their code rate (Chapter 6).

## 5.7 Capacity in practice

Real systems lose some capacity to guard intervals, pilots, headers and imperfect codes, and they adapt: **link
adaptation** measures S/N and chooses the modulation and code rate that best fits (Wi-Fi's MCS index, cellular CQI).
Multiple antennas multiply capacity by creating parallel channels (MIMO, [Wireless, chapter 6](../wireless/06-MIMO-and-Beamforming.md)):
roughly $C \approx \min(N_t, N_r) \, B \log_2(1 + S/N)$ in rich scattering.

## Check yourself

??? question "1. What is the entropy of a source with four symbols of probability 1/2, 1/4, 1/8, 1/8?"
    1/2·1 + 1/4·2 + 2·(1/8·3) = 1.75 bits.

??? question "2. A 20 MHz channel has S/N = 25 dB. What is its Shannon capacity?"
    S/N ≈ 316, log₂(317) ≈ 8.3, so C ≈ 166 Mbit/s.

??? question "3. Why can't encrypted traffic be compressed?"
    Good encryption output is indistinguishable from random, i.e. at maximum entropy; no lossless code can shorten it on average.

??? info "Sources"
    - C. Shannon, "A Mathematical Theory of Communication", *Bell System Technical Journal*, 1948; "Communication in the Presence of Noise", *Proc. IRE*, 1949.
    - T. Cover and J. Thomas, *Elements of Information Theory*, 2nd ed., Wiley, 2006.
    - D. MacKay, *Information Theory, Inference, and Learning Algorithms*, Cambridge, 2003 (free online).
