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
