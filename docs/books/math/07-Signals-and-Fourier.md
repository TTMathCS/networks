# 7. Signals and Fourier

*Every link sends bits as a signal that changes over time. Joseph Fourier's idea, that any signal is a sum of sine waves, turns questions about signals into questions about frequencies: what bandwidth a signal needs, what a channel does to it, and how fast it must be sampled. This chapter builds those tools.*

!!! abstract "In this chapter"
    **You will learn:** sinusoids, frequency, amplitude and phase; Fourier series and the spectrum of a square wave;
    the Fourier transform and bandwidth; filters and the channel as a filter; the sampling theorem and aliasing;
    the discrete Fourier transform and the FFT; the decibel scale.

    **You need:** trigonometry; complex numbers help (see [Chapter 8](08-Modulation-Math.md)).

## 7.1 Sine waves

A **sinusoid** $x(t) = A \cos(2\pi f t + \phi)$ has **amplitude** $A$, **frequency** $f$ (cycles per second, hertz),
and **phase** $\phi$. Its period is $T = 1/f$ and, travelling at speed $c$, its **wavelength** is $\lambda = c / f$:
a 2.4 GHz Wi-Fi wave in air is $3 \times 10^8 / 2.4 \times 10^9 = 12.5$ cm long.

Sinusoids are special because linear channels (cables, air, filters) change only their amplitude and phase, never
their frequency. So if we can write any signal as a sum of sinusoids, we can work out what any channel does to it.

## 7.2 Fourier series

Fourier (1807) showed that a periodic signal with period $T$ is a sum of sinusoids at multiples (**harmonics**) of
$f_0 = 1/T$:

$$x(t) = a_0 + \sum_{n=1}^{\infty} \big(a_n \cos(2\pi n f_0 t) + b_n \sin(2\pi n f_0 t)\big)$$

A **square wave** alternating between $+1$ and $-1$ (the bit pattern 1010… on a wire) is

$$x(t) = \frac{4}{\pi}\left(\sin(2\pi f_0 t) + \frac{1}{3}\sin(2\pi\, 3f_0 t) + \frac{1}{5}\sin(2\pi\, 5 f_0 t) + \cdots\right)$$

Only odd harmonics, shrinking as $1/n$. The sharp edges need the high harmonics; a channel that passes only frequencies
up to $3f_0$ delivers a rounded wave that is still easy to read as 1s and 0s. That is the link between **bit rate** and
**bandwidth**: sending $R$ bits per second as 1010… needs a fundamental of $R/2$ Hz, and a few harmonics more for clean
edges.

<figure class="mars-fig">
<svg viewBox="0 0 520 150" width="520" role="img" aria-label="A square wave and its approximation with the first and third harmonics">
<g fill="none" stroke-width="2">
<path stroke="currentColor" stroke-opacity=".45" d="M20 35 H120 V115 H220 V35 H320 V115 H420 V35 H500"/>
<path class="na" stroke-width="2.6" d="M20 75 C 30 30, 60 25, 70 35 C 80 45, 100 30, 120 75 C 140 120, 160 125, 170 115 C 180 105, 200 120, 220 75 C 230 30, 260 25, 270 35 C 280 45, 300 30, 320 75 C 340 120, 360 125, 370 115 C 380 105, 400 120, 420 75 C 430 30, 460 25, 470 35 C 480 45, 495 40, 500 60"/></g>
<text x="260" y="145" font-size="12" fill="currentColor" text-anchor="middle">grey: the square wave · orange: its first two odd harmonics added together</text>
</svg>
<figcaption>Two sine waves already look like the square wave; more harmonics sharpen the corners.</figcaption>
</figure>

## 7.3 The Fourier transform and bandwidth

Non-periodic signals have a continuous **spectrum**, given by the **Fourier transform**:

$$X(f) = \int_{-\infty}^{\infty} x(t)\, e^{-j 2\pi f t}\, dt$$

$|X(f)|$ says how much of frequency $f$ the signal contains. Key facts:

- **Time-frequency trade-off**: a pulse of duration $\tau$ has a spectrum about $1/\tau$ wide. Shorter pulses (faster
  bits) need more bandwidth.
- **Shifting in frequency**: multiplying by $\cos(2\pi f_c t)$ moves the spectrum to around $f_c$. This is how
  **modulation** puts a signal into a radio band (Chapter 8).
- The **bandwidth** of a signal is the width of the band holding most of its power.

## 7.4 Channels as filters

A linear, time-invariant channel multiplies each frequency by its **frequency response** $H(f)$: output spectrum
$Y(f) = H(f)\, X(f)$. A copper pair attenuates high frequencies more than low (a low-pass filter), which smears pulses
into one another (**inter-symbol interference**). A Wi-Fi channel with echoes from walls has dips at some frequencies
(frequency-selective fading). An **equaliser** applies roughly $1/H(f)$ to undo it, and OFDM (Chapter 8) avoids the
problem by sending on many narrow subcarriers, each of which sees an almost flat $H$.

Nyquist's 1928 result follows: through a channel of bandwidth $B$, at most $2B$ independent pulses per second can be
sent without interfering.

## 7.5 Sampling

Digital receivers measure the signal at regular instants. The **sampling theorem** (Nyquist, Shannon; also Kotelnikov,
Whittaker): a signal with no frequencies above $B$ is completely determined by samples taken at a rate above $2B$ per
second, and can be rebuilt exactly from them.

Sample slower and **aliasing** occurs: a high frequency masquerades as a low one (like wagon wheels turning backwards in
films). Receivers therefore filter out everything above half the sampling rate before sampling. CD audio samples at
44.1 kHz to capture up to about 20 kHz; a Wi-Fi receiver for a 160 MHz channel samples at least 160 million complex
samples per second.

## 7.6 The DFT and the FFT

On a computer we work with $N$ samples $x_0, \dots, x_{N-1}$. The **discrete Fourier transform**:

$$X_k = \sum_{n=0}^{N-1} x_n\, e^{-j 2\pi k n / N}, \qquad k = 0, \dots, N-1$$

gives the strength of each of $N$ frequencies. Computed directly it costs $N^2$ operations; the **fast Fourier
transform** (Cooley and Tukey, 1965) splits it into halves recursively and takes $O(N \log N)$: for $N = 4096$, about
50,000 operations instead of 17 million. Every Wi-Fi, 4G and 5G modem runs FFTs constantly: OFDM is built on them.

## 7.7 Decibels

Signal powers span huge ranges (a transmitter at 0.1 W, a received signal at $10^{-12}$ W), so engineers use the
logarithmic **decibel**:

$$\text{dB} = 10 \log_{10} \frac{P_1}{P_2}, \qquad \text{dBm} = 10 \log_{10} \frac{P}{1\ \text{mW}}$$

| Power | dBm |
| --- | --- |
| 1 W | +30 |
| 100 mW (Wi-Fi max, typical) | +20 |
| 1 mW | 0 |
| 1 nW (good Wi-Fi signal) | −60 |
| 0.1 pW (weak but usable Wi-Fi) | −100 |

Gains and losses add in dB, which is why link budgets are sums ([Wireless, chapter 2](../wireless/02-Antennas-and-Link-Budgets.md)).

## Check yourself

??? question "1. What is the wavelength of a 5.8 GHz signal?"
    3×10⁸ / 5.8×10⁹ ≈ 5.2 cm.

??? question "2. A signal contains frequencies up to 20 MHz. What is the minimum sampling rate?"
    More than 40 million samples per second.

??? question "3. A signal is −65 dBm and noise is −95 dBm. What is the S/N as a ratio?"
    30 dB, a ratio of 1000.

??? info "Sources"
    - A. Oppenheim and A. Willsky, *Signals and Systems*, 2nd ed., Prentice Hall, 1997.
    - C. Shannon, "Communication in the Presence of Noise", *Proc. IRE*, 1949 (sampling theorem).
    - J. Cooley and J. Tukey, "An Algorithm for the Machine Calculation of Complex Fourier Series", *Math. Comp.*, 1965.
