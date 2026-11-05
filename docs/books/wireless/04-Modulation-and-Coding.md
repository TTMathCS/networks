# 4. Modulation and coding

*A radio link turns bits into symbols, protects them with an error-correcting code, and adapts both to the channel many times a second. This chapter covers how real systems choose modulation and coding, the MCS tables of Wi-Fi and 5G, link adaptation, HARQ, and spread spectrum.*

!!! abstract "In this chapter"
    **You will learn:** amplitude, frequency and phase modulation; PSK and QAM in practice; code rate; Wi-Fi's MCS
    index and what each step needs; link adaptation and rate control; HARQ; spread spectrum (DSSS, FHSS, chirps).

    **You need:** [Math, chapters 6 and 8](../math/08-Modulation-Math.md); [Chapter 3](03-Fading-and-Noise.md).

## 4.1 Three things to change

A carrier $A\cos(2\pi f t + \phi)$ can carry information by changing:

- **Amplitude** (ASK, or on-off keying): simple; used in RFID and some optical links.
- **Frequency** (FSK): robust to amplitude changes, efficient amplifiers; Bluetooth's basic rate uses **GFSK** (Gaussian
  FSK), and many low-power IoT radios use FSK variants.
- **Phase** (PSK), or **amplitude and phase together** (QAM): the most bits per hertz; Wi-Fi, cellular, satellite.

The math of constellations and error rates is in [Math, chapter 8](../math/08-Modulation-Math.md). The essentials:
BPSK carries 1 bit per symbol, QPSK 2, 16-QAM 4, 64-QAM 6, 256-QAM 8, 1024-QAM 10, 4096-QAM 12; each step up needs about
6 dB more S/N for the same error rate.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 360" role="img" aria-labelledby="sk-nw-qam-t"><title id="sk-nw-qam-t">A 16-QAM constellation: sixteen points in a four by four grid on in-phase and quadrature axes, each standing for four bits</title><defs><filter id="sk-nw-qam-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-qam-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-qam-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-qam-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-qam-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="360" filter="url(#sk-nw-qam-paper)"/><g filter="url(#sk-nw-qam-pen)"><text x="30" y="44" class="h">16 points, 4 bits each</text><path class="p" d="M80 220 L320 220 M200 100 L200 340"/><text x="324" y="225" class="s">in phase</text><text x="206" y="96" class="s">quadrature</text><circle cx="125.0" cy="145.0" r="6" class="p gold"/><circle cx="125.0" cy="195.0" r="6" class="p gold"/><circle cx="125.0" cy="245.0" r="6" class="p gold"/><circle cx="125.0" cy="295.0" r="6" class="p gold"/><circle cx="175.0" cy="145.0" r="6" class="p gold"/><circle cx="175.0" cy="195.0" r="6" class="p gold"/><circle cx="175.0" cy="245.0" r="6" class="p gold"/><circle cx="175.0" cy="295.0" r="6" class="p gold"/><circle cx="225.0" cy="145.0" r="6" class="p gold"/><circle cx="225.0" cy="195.0" r="6" class="p gold"/><circle cx="225.0" cy="245.0" r="6" class="p gold"/><circle cx="225.0" cy="295.0" r="6" class="p gold"/><circle cx="275.0" cy="145.0" r="6" class="p gold"/><text x="299.0" y="127.0" class="s">bits 1000</text><circle cx="275.0" cy="195.0" r="6" class="p gold"/><circle cx="275.0" cy="245.0" r="6" class="p gold"/><circle cx="275.0" cy="295.0" r="6" class="p gold"/><circle cx="275.0" cy="145.0" r="20" class="p dash"/><text x="380" y="110" class="s">Each symbol picks one point: one</text><text x="380" y="130" class="s">loudness and one timing (phase).</text><text x="380" y="180" class="s">BPSK 1 bit · QPSK 2 · 16-QAM 4</text><text x="380" y="200" class="s">64-QAM 6 · 256 8 · 1024 10 · 4096 12</text><text x="380" y="250" class="s">More points sit closer together, so</text><text x="380" y="270" class="s">noise (the dashed circle) blurs them:</text><text x="380" y="290" class="s">each step needs about 6 dB more</text><text x="380" y="310" class="s">signal over noise.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## 4.2 Coding rate

Data is first encoded with an error-correcting code (LDPC in modern Wi-Fi and 5G, convolutional codes in older Wi-Fi).
The **code rate** $r = k/n$ is the fraction of transmitted bits that is data: rate 1/2 sends one data bit per two coded
bits, rate 5/6 is lighter protection. The useful bits per symbol per subcarrier is $r \log_2 M$.

## 4.3 The MCS table

Wi-Fi combines modulation and code rate into a **modulation and coding scheme (MCS)** index. For one spatial stream of
802.11ax (Wi-Fi 6) on a 20 MHz channel with the short 0.8 µs guard interval:

| MCS | Modulation | Rate | Data rate (Mbit/s) | Needed S/N (approx.) |
| --- | --- | --- | --- | --- |
| 0 | BPSK | 1/2 | 8.6 | 2–5 dB |
| 1 | QPSK | 1/2 | 17.2 | 5–8 dB |
| 3 | 16-QAM | 1/2 | 34.4 | 12–15 dB |
| 5 | 64-QAM | 2/3 | 68.8 | 18–22 dB |
| 7 | 64-QAM | 5/6 | 86.0 | 22–25 dB |
| 9 | 256-QAM | 5/6 | 114.7 | 28–31 dB |
| 11 | 1024-QAM | 5/6 | 143.4 | 32–35 dB |
| 13 (Wi-Fi 7) | 4096-QAM | 5/6 | 172.1 | 38–42 dB |

Multiply by channel width (×2 for 40 MHz, about ×4.2 for 80, ×8.3 for 160, ×16.6 for 320 MHz) and by the number of
spatial streams (Chapter 6). The headline "Wi-Fi 7: 46 Gbit/s" is 16 streams × 320 MHz × MCS 13: no phone has 16
antennas. A typical 2×2 phone on an 80 MHz channel at MCS 11 gets a link rate of about 1.2 Gbit/s, and roughly 60–70% of
that as real throughput after the protocol's overheads.

The needed S/N figures are approximate: they depend on the receiver, the target error rate and the channel.

## 4.4 Link adaptation

The channel changes constantly (Chapter 3), so transmitters keep choosing the MCS:

- **Wi-Fi** uses **rate control** in the driver: Linux's Minstrel tries rates and keeps statistics of which succeed;
  802.11ax adds feedback from the receiver.
- **Cellular** uses explicit feedback: the phone reports a **channel quality indicator (CQI)** every few milliseconds,
  and the base station's scheduler picks the MCS, aiming at about 10% block error rate on the first try, since HARQ
  repairs the rest cheaply.

Too high an MCS means many retransmissions; too low wastes airtime. Rate selection also affects everyone else: a client
far away at MCS 0 takes ten times the airtime of a close one for the same data, slowing the whole network (the
"performance anomaly", Chapter 9).

## 4.5 HARQ

Plain ARQ discards a frame that fails its check and resends it. **Hybrid ARQ** (4G, 5G, and Wi-Fi 8 proposals) keeps the
failed attempt's soft information and combines it with the retransmission. With **incremental redundancy**, the
retransmission carries *new* parity bits, effectively lowering the code rate until decoding succeeds. Retransmissions
take a few milliseconds in 4G and well under one in 5G, hiding radio errors from TCP.

## 4.6 Spread spectrum

Spread spectrum deliberately uses far more bandwidth than the data needs, which makes signals robust to narrowband
interference and fading and allows many users to share a band.

- **Frequency hopping (FHSS)**: hop among many channels in a pseudo-random pattern. Bluetooth Classic hops 1,600 times
  a second over 79 channels of 1 MHz (BLE over 40 channels of 2 MHz), and **adaptive frequency hopping** avoids channels
  where it sees interference, such as busy Wi-Fi. (The idea was patented in 1942 by actress Hedy Lamarr and composer
  George Antheil, for torpedo guidance.)
- **Direct sequence (DSSS)**: multiply each bit by a fast pseudo-random chip sequence; the receiver correlates with the
  same sequence and recovers it, while interference is spread out. Original 802.11b Wi-Fi (11-chip Barker code) and GPS
  use it; **CDMA** cellular (3G) gave each user a different code.
- **Chirp spread spectrum**: each symbol is a frequency sweep. LoRa uses it to reach several kilometres at very low
  power, below the noise floor (Chapter 12).

**Processing gain** = spread bandwidth / data bandwidth: GPS's 1.023 Mchip/s code over 50 bit/s data gives about 43 dB,
which is how a phone decodes satellite signals arriving 20 dB below the noise.

## Check yourself

??? question "1. How many data bits per subcarrier per symbol does 256-QAM rate 5/6 carry?"
    8 × 5/6 ≈ 6.67.

??? question "2. Why does a cellular scheduler aim at about 10% errors on the first try rather than 0.1%?"
    HARQ fixes failed blocks quickly and cheaply, so a slightly aggressive MCS gives more throughput overall than a cautious one.

??? question "3. What does Bluetooth's adaptive frequency hopping do?"
    It stops hopping onto channels where it detects interference (such as an active Wi-Fi channel) and uses the remaining ones.

??? info "Sources"
    - IEEE 802.11ax-2021 and 802.11be-2024, MCS tables (clause 27 and 36).
    - 3GPP TS 38.214 (5G link adaptation, CQI and MCS tables), TS 38.321 (HARQ).
    - Bluetooth Core Specification 6.0 (2024), Physical Layer.
    - M. Lacage, M. Manshaei, T. Turletti, "IEEE 802.11 Rate Adaptation: A Practical Approach", MSWiM 2004; H. Lamarr and G. Antheil, US Patent 2,292,387 (1942).
