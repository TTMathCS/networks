# 8. Modulation math

*To send bits by radio, a transmitter varies a carrier wave's amplitude and phase. Complex numbers make this simple: each symbol is a point in a plane, the constellation. This chapter covers complex baseband, PSK and QAM, error probability, and the math of OFDM.*

!!! abstract "In this chapter"
    **You will learn:** complex numbers and Euler's formula; in-phase and quadrature components; BPSK, QPSK and
    $M$-QAM constellations; Gray coding; error probability and the Q function; the S/N each QAM order needs; OFDM as an
    inverse FFT; the cyclic prefix.

    **You need:** [Chapter 7](07-Signals-and-Fourier.md).

## 8.1 Complex numbers in one page

A complex number $z = a + jb$ (engineers write $j$ for $\sqrt{-1}$) is a point in a plane: $a$ across, $b$ up. In polar
form $z = r e^{j\theta}$ with length $r = \sqrt{a^2 + b^2}$ and angle $\theta$. **Euler's formula**

$$e^{j\theta} = \cos\theta + j \sin\theta$$

makes multiplication easy: multiply lengths, add angles. Multiplying a signal by $e^{j\theta}$ rotates it by $\theta$:
exactly what a phase shift does.

## 8.2 I and Q

Any carrier with amplitude $A$ and phase $\phi$ can be written as two components at the same frequency, 90° apart:

$$A\cos(2\pi f_c t + \phi) = I \cos(2\pi f_c t) - Q \sin(2\pi f_c t)$$

with $I = A\cos\phi$ (**in-phase**) and $Q = A\sin\phi$ (**quadrature**). So the transmitter's job is to choose a complex
number $s = I + jQ$ for each symbol; the radio hardware multiplies by the carrier. The receiver mixes back down and
recovers $I$ and $Q$. Working with $s$ directly is called **complex baseband**.

## 8.3 Constellations

A modulation scheme is a set of $M$ allowed points, the **constellation**; each carries $\log_2 M$ bits.

- **BPSK**: two points, $\pm 1$. 1 bit per symbol; very robust.
- **QPSK**: four points at $(\pm1 \pm j)/\sqrt{2}$, 2 bits.
- **16-QAM**: a 4 × 4 grid, 4 bits. **64-QAM** (6 bits), **256-QAM** (8, Wi-Fi 5), **1024-QAM** (10, Wi-Fi 6),
  **4096-QAM** (12, Wi-Fi 7).

<figure class="mars-fig">
<svg viewBox="0 0 440 180" width="440" role="img" aria-label="QPSK with four points and 16-QAM with sixteen points">
<g stroke="currentColor" stroke-opacity=".5"><line x1="20" y1="90" x2="180" y2="90"/><line x1="100" y1="10" x2="100" y2="170"/><line x1="240" y1="90" x2="420" y2="90"/><line x1="330" y1="10" x2="330" y2="170"/></g>
<g class="na-f"><circle cx="60" cy="50" r="5"/><circle cx="140" cy="50" r="5"/><circle cx="60" cy="130" r="5"/><circle cx="140" cy="130" r="5"/></g>
<g class="nb-f">
<circle cx="270" cy="30" r="4"/><circle cx="310" cy="30" r="4"/><circle cx="350" cy="30" r="4"/><circle cx="390" cy="30" r="4"/>
<circle cx="270" cy="70" r="4"/><circle cx="310" cy="70" r="4"/><circle cx="350" cy="70" r="4"/><circle cx="390" cy="70" r="4"/>
<circle cx="270" cy="110" r="4"/><circle cx="310" cy="110" r="4"/><circle cx="350" cy="110" r="4"/><circle cx="390" cy="110" r="4"/>
<circle cx="270" cy="150" r="4"/><circle cx="310" cy="150" r="4"/><circle cx="350" cy="150" r="4"/><circle cx="390" cy="150" r="4"/></g>
<g font-size="12" fill="currentColor"><text x="80" y="178">QPSK: 2 bits</text><text x="290" y="178">16-QAM: 4 bits</text><text x="168" y="85">I</text><text x="104" y="20">Q</text></g>
</svg>
<figcaption>Constellations: each point is one symbol. More points carry more bits but sit closer together, so less noise is enough to confuse them.</figcaption>
</figure>

**Gray coding** labels neighbouring points with bit patterns that differ in one bit, so the most likely error (mistaking
a point for its neighbour) costs one bit, not several.

## 8.4 Noise and errors

The received symbol is $r = s + n$, where $n$ is complex Gaussian noise. The receiver picks the nearest constellation
point. An error happens when noise pushes $r$ past the midpoint to a neighbour. For BPSK, with energy per bit $E_b$
and noise density $N_0$:

$$P_b = Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right), \qquad Q(x) = \frac{1}{\sqrt{2\pi}}\int_x^\infty e^{-u^2/2}\,du$$

$Q(x)$ is the tail of the normal distribution; it falls extremely fast: $Q(3) \approx 1.3 \times 10^{-3}$,
$Q(4.75) \approx 10^{-6}$. BPSK needs $E_b/N_0 \approx 10.5$ dB for one error in a million (uncoded). QPSK has the same
bit error rate per $E_b/N_0$ (it is two BPSKs on I and Q).

For square $M$-QAM at a fixed average power, points get closer as $M$ grows: each doubling of the constellation side
(4× the points, 2 more bits) needs about **6 dB** more S/N for the same error rate. Rough uncoded needs for a symbol
error rate near $10^{-5}$: QPSK about 13 dB, 16-QAM about 20 dB, 64-QAM about 26 dB, 256-QAM about 32 dB. With coding
(Chapter 6) the needs drop by several dB, and **link adaptation** chooses the densest constellation the current S/N
supports.

## 8.5 OFDM

A wideband channel with echoes is frequency-selective (Chapter 7). **Orthogonal frequency-division multiplexing**
splits it into $N$ narrow **subcarriers**, each so narrow that its channel response is flat: a single complex number
$H_k$.

The transmitter puts one QAM symbol $X_k$ on each subcarrier and computes the time signal with an **inverse FFT**:

$$x_n = \frac{1}{N}\sum_{k=0}^{N-1} X_k\, e^{j 2\pi k n / N}$$

The subcarriers are spaced exactly $1/T$ apart (for symbol time $T$), which makes them **orthogonal**: over one symbol,
each subcarrier's sinusoid integrates to zero against every other's, so they overlap in frequency without interfering.

The channel's echoes would smear one OFDM symbol into the next. The fix is the **cyclic prefix**: copy the last part of
each symbol to its front, longer than the longest echo. Then the channel's effect (a convolution) becomes a simple
multiplication per subcarrier:

$$Y_k = H_k X_k + N_k$$

The receiver takes an FFT and divides each $Y_k$ by $H_k$ (estimated from known **pilot** symbols): equalisation is one
complex division per subcarrier. Wi-Fi (802.11a onward), 4G, 5G, DSL (as DMT), DVB and DOCSIS 3.1 all use it.
Practical details (subcarrier spacing, resource units, OFDMA) are in [Wireless, chapter 5](../wireless/05-OFDM-and-OFDMA.md).

## Check yourself

??? question "1. How many bits per symbol does 1024-QAM carry?"
    log₂ 1024 = 10.

??? question "2. Multiply e^{jπ/4} by e^{jπ/4}. What is the result?"
    e^{jπ/2} = j: lengths multiply (1), angles add (90°).

??? question "3. Why does OFDM need a cyclic prefix?"
    To absorb echoes (multipath delay) so they don't spill into the next symbol, and to turn the channel's convolution into a per-subcarrier multiplication.

??? info "Sources"
    - J. Proakis and M. Salehi, *Digital Communications*, 5th ed., McGraw-Hill, 2008.
    - D. Tse and P. Viswanath, *Fundamentals of Wireless Communication*, Cambridge, 2005, chapter 3 (free online).
    - R. Chang, "Synthesis of Band-Limited Orthogonal Signals for Multichannel Data Transmission", *BSTJ*, 1966; S. Weinstein and P. Ebert, "Data Transmission by FDM Using the DFT", *IEEE Trans. Comm.*, 1971.
