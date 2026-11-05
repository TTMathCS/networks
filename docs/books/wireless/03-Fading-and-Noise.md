# 3. Fading and noise

*A wireless signal does not arrive as one clean wave: it bounces off walls, cars and people, and the copies add up or cancel, changing from moment to moment and from one centimetre to the next. This chapter explains path loss, shadowing and multipath fading, delay spread and Doppler, interference and noise, and how systems fight them.*

!!! abstract "In this chapter"
    **You will learn:** the three scales of loss (path loss, shadowing, fast fading); multipath and how waves cancel;
    Rayleigh and Rician fading; delay spread and coherence bandwidth; Doppler and coherence time; noise and
    interference; diversity against fading.

    **You need:** [Chapter 2](02-Antennas-and-Link-Budgets.md).

## 3.1 Three scales

Received power varies on three scales at once:

1. **Path loss**: the average fall-off with distance (Chapter 2), over hundreds of metres.
2. **Shadowing**: buildings, hills or a wall in the way, changing over tens of metres. Typically modelled as a random
   number of dB with a normal distribution (**log-normal shadowing**, standard deviation 4–12 dB).
3. **Fast (small-scale) fading**: copies of the signal arriving by different paths add or cancel, changing over a
   fraction of a wavelength, a few centimetres at Wi-Fi frequencies.

## 3.2 Multipath

Indoors, a signal reaches the receiver directly and by reflection off walls, floor, ceiling and furniture. Each copy
has travelled a different distance, so it arrives with a different delay and phase. If two equal copies arrive half a
wavelength apart in path length (6 cm at 2.4 GHz), they **cancel**: a deep fade. Moving the laptop a few centimetres
can change the signal by 20–30 dB. This is why turning a phone or moving a router slightly sometimes helps a lot.

When there is no direct path and many reflections, the received amplitude follows a **Rayleigh distribution**; fades
of 20 dB below average happen about 1% of the time. With a strong direct path plus reflections, it is **Rician**, and
deep fades are rarer.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 400" role="img" aria-labelledby="sk-nw-multipath-t"><title id="sk-nw-multipath-t">In a room, a router's signal reaches a laptop directly and by bouncing off the ceiling and the floor; the copies can add or cancel</title><defs><filter id="sk-nw-multipath-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-multipath-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-multipath-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-multipath-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-multipath-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="400" filter="url(#sk-nw-multipath-paper)"/><g filter="url(#sk-nw-multipath-pen)"><text x="30" y="44" class="h">Three copies of one signal</text><path class="p soft" d="M30 90 L610 90 L610 330 L30 330Z"/><path class="p gold" d="M90 200 L120 200 L120 220 L90 220Z"/><text x="105" y="244" text-anchor="middle" class="s">router</text><path class="p room" d="M500 196 L540 196 L540 222 L500 222Z"/><text x="520" y="244" text-anchor="middle" class="s">laptop</text><path class="p " d="M122 208 L496 208" marker-end="url(#sk-nw-multipath-ah)"/><path class="p blue" d="M110 198 L310 92 L506 194" marker-end="url(#sk-nw-multipath-ah)"/><path class="p red" d="M110 222 L300 328 L506 222" marker-end="url(#sk-nw-multipath-ah)"/><text x="250" y="200" class="s">direct</text><text x="200" y="126" class="s">off the ceiling</text><text x="200" y="300" class="s">off the floor</text><text x="30" y="365" class="s">Each copy travels a different distance. If two arrive half a wavelength apart (6 cm at 2.4 GHz),</text><text x="30" y="385" class="s">they cancel: moving the laptop a few centimetres can change the signal a hundredfold.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

<figure class="play" data-play="multipath"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> A direct signal and one reflection at 70% strength, at 2.4 GHz (a 12.5 cm wavelength). Slide the laptop along 30 cm of desk and watch the deep fades a few centimetres apart. The room is made up.</figcaption></figure>

## 3.3 Delay spread and frequency selectivity

The spread between the first and last significant echoes is the **delay spread** $\tau$: about 10–100 ns indoors,
0.5–5 µs outdoors in cities. Its inverse is the **coherence bandwidth** $B_c \approx 1/(5\tau)$: frequencies closer than
$B_c$ fade together, and farther ones independently.

- If the signal's bandwidth is much smaller than $B_c$, the whole signal fades together: **flat fading**.
- If it is wider, different frequencies fade differently: **frequency-selective fading**, and symbols smear into each
  other (inter-symbol interference) unless the symbol time is much longer than $\tau$.

A 20 MHz Wi-Fi signal outdoors is wider than the coherence bandwidth, which is exactly why Wi-Fi uses OFDM: 64 narrow
subcarriers each see nearly flat fading, and a cyclic prefix (0.8 µs, or 0.4 µs in short mode) swallows the echoes
(Chapter 5).

## 3.4 Doppler and coherence time

When the transmitter, receiver or reflectors move at speed $v$, frequencies shift by up to the **Doppler shift**

$$f_D = \frac{v}{\lambda} = \frac{v f}{c}$$

A car at 108 km/h (30 m/s) on 3.5 GHz: $f_D = 30 \times 3.5\times10^9 / 3\times10^8 = 350$ Hz. The channel changes over a
**coherence time** of roughly $T_c \approx 0.4 / f_D$, about a millisecond here. Systems must re-estimate the channel
faster than that, with pilot signals; 5G uses wider subcarrier spacing at high frequencies partly to tolerate Doppler.
For LEO satellites moving at 7.5 km/s, Doppler shifts are tens of kilohertz and must be pre-compensated.

## 3.5 Noise

Every receiver hears **thermal noise** from the random motion of electrons, with power $kTB$: $-174$ dBm per hertz at
room temperature (Chapter 2). Amplifiers add more (the noise figure). Other natural noise: the Sun and the galaxy (which
matters for deep-space receivers looking at a quiet sky), lightning at low frequencies.

## 3.6 Interference

In unlicensed bands, the main enemy is usually not noise but other transmitters:

- **Co-channel interference**: other Wi-Fi networks on the same channel. They share airtime (Chapter 7), so throughput
  is divided.
- **Adjacent-channel interference**: overlapping channels (2.4 GHz channels 1 and 3) that cannot decode each other and
  so do not wait their turn, but still add noise: worse than sharing one channel.
- **Non-Wi-Fi sources**: microwave ovens (2.45 GHz), Bluetooth (hops across 2.4 GHz), wireless cameras, baby monitors,
  radar in the 5 GHz DFS channels.

Cellular networks reuse the same frequencies in every cell, so their performance is limited by **SINR** (signal to
interference plus noise ratio), especially at cell edges.

## 3.7 Fighting fading: diversity

The probability that **several independent** copies all fade at once is much smaller than for one. Systems create
independent copies, **diversity**, in several ways:

| Diversity | How | Example |
| --- | --- | --- |
| Space | antennas a half-wavelength or more apart | almost every Wi-Fi device and phone, MIMO |
| Frequency | spread data across subcarriers, with coding | OFDM with interleaving and FEC |
| Time | spread data over time, with retransmission | interleaving, HARQ in 4G/5G |
| Polarisation | two polarisations | cellular sector antennas |

With two antennas and choosing the better one (selection diversity), a 1% chance of a deep fade becomes about 0.01%.
**Maximal ratio combining** adds the antennas' signals weighted by their strength and does better still. Combined
with coding and fast retransmissions (HARQ), diversity turns a wildly fluctuating channel into a dependable link.

## Check yourself

??? question "1. Why can moving a phone by 5 cm change Wi-Fi signal strength by 20 dB?"
    Multipath copies add or cancel depending on path differences of fractions of a wavelength (12.5 cm at 2.4 GHz); a few centimetres moves you from a peak to a null.

??? question "2. The delay spread is 1 µs. Roughly what is the coherence bandwidth, and is a 20 MHz signal flat-fading?"
    About 1/(5 µs) = 200 kHz; 20 MHz is much wider, so the fading is frequency-selective.

??? question "3. What is the Doppler shift at 5 GHz for someone walking at 1.5 m/s?"
    1.5 × 5×10⁹ / 3×10⁸ = 25 Hz.

??? info "Sources"
    - A. Goldsmith, *Wireless Communications*, Cambridge, 2005, chapters 2–3 and 7.
    - D. Tse and P. Viswanath, *Fundamentals of Wireless Communication*, Cambridge, 2005, chapters 2–3.
    - ITU-R P.1238 (indoor), 3GPP TR 38.901 (channel models for 0.5–100 GHz).
