# 4. The physical layer

*The physical layer turns bits into something that can travel (a voltage, a pulse of light, a radio wave) and back again. This chapter covers the media, the limits that Nyquist and Shannon put on any link, line coding, and how the access links into homes work.*

!!! abstract "In this chapter"
    **You will learn:** twisted pair, coaxial cable and fibre; bandwidth in hertz versus bits per second; the
    Nyquist and Shannon limits; line codes such as NRZ, Manchester, 4B/5B and PAM4; DSL, cable, fibre to the home.

    **You need:** [Chapter 3](03-Delay-Loss-and-Throughput.md); logarithms help. Radio is covered in
    [Wireless and mobile](../wireless/index.md).

## 4.1 Guided media

| Medium | How it carries bits | Typical reach and rate |
| --- | --- | --- |
| **Twisted pair** (Cat 5e, 6, 6A, 8) | voltages on pairs of twisted copper wires; twisting cancels interference | 100 m at 1–10 Gbit/s (Cat 8: 25–40 Gbit/s over 30 m) |
| **Coaxial cable** | a central wire inside a shield; carries many frequency channels at once | cable TV networks, km with amplifiers |
| **Multimode fibre** | light from cheap lasers or LEDs in a wide (50 µm) glass core | up to a few hundred metres, inside buildings |
| **Single-mode fibre** | laser light in a narrow (about 9 µm) core | 10–80 km without amplification; thousands with amplifiers |

Fibre is immune to electrical interference, hard to tap without detection, and its capacity is enormous: with
**wavelength-division multiplexing (WDM)**, 80 or more colours of light share one fibre, each carrying 400 Gbit/s or
more. Optical amplifiers boost all colours at once every 50–100 km, which is how one transatlantic cable carries
hundreds of terabits per second.

## 4.2 Bandwidth: hertz and bits

Engineers use "bandwidth" for two things. In physics it is a range of **frequencies** in hertz that a channel passes
(a telephone line passes roughly 300–3,400 Hz). In networking it often means **bit rate**. They are linked by two
famous limits.

**Nyquist (1928):** a noiseless channel of bandwidth $B$ hertz can carry at most $2B$ symbols per second. If each
symbol takes one of $V$ levels, the maximum bit rate is

$$C = 2B \log_2 V$$

**Shannon (1948):** noise limits the number of levels you can tell apart. With signal-to-noise ratio $S/N$ (a power
ratio, not decibels), the capacity of the channel is

$$C = B \log_2\left(1 + \frac{S}{N}\right)$$

No coding scheme can beat it; good modern codes get within a fraction of a decibel. A 3,100 Hz phone line with S/N of
30 dB (1,000 times) has $C \approx 3100 \times \log_2 1001 \approx 31$ kbit/s, which is why dial-up modems topped out
near 33.6 kbit/s in both directions. [Math foundations, chapter 5](../math/05-Information-and-Capacity.md) proves why.

Decibels: $\text{dB} = 10 \log_{10}(\text{power ratio})$, so 3 dB is a factor of 2, 10 dB a factor of 10, 30 dB a
factor of 1,000.

## 4.3 Line coding

How do you put bits on a wire? The simplest code, **NRZ** (non-return to zero), sends a high voltage for 1 and low for
0. Two problems: a long run of identical bits has no transitions, so the receiver's clock drifts and it loses count;
and the average voltage drifts (baseline wander). Solutions:

- **Manchester** (10 Mbit/s Ethernet): every bit has a transition in the middle (low-to-high for 1). Self-clocking, but
  needs twice the signalling rate.
- **4B/5B** (100 Mbit/s Ethernet) and **8b/10b** (Gigabit fibre, older PCIe): map each group of 4 (or 8) bits to a
  5 (or 10) bit code chosen to have enough transitions. Cost: 20% overhead.
- **64b/66b** (10 Gbit/s Ethernet and up): 2 bits of overhead per 64, plus scrambling to randomise the bit pattern.
- **Multi-level codes**: PAM5 (Gigabit over copper, five voltage levels on all four pairs at once), PAM16 (10GBASE-T),
  and **PAM4** (four levels, 2 bits per symbol), now standard for 100–800 Gbit/s links.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 395" role="img" aria-labelledby="sk-nb-linecode-t"><title id="sk-nb-linecode-t">The bits 1 0 1 1 0 0 0 1 drawn as NRZ, a high or low level per bit, and as Manchester, with a transition in the middle of every bit</title><defs><filter id="sk-nb-linecode-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nb-linecode-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nb-linecode-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nb-linecode-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nb-linecode-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="395" filter="url(#sk-nb-linecode-paper)"/><g filter="url(#sk-nb-linecode-pen)"><text x="30" y="44" class="h">Same bits, two ways to send them</text><text x="170.0" y="90" text-anchor="middle" class="l">1</text><path class="p dash" d="M140 100 L140 330" opacity=".4"/><text x="230.0" y="90" text-anchor="middle" class="l">0</text><path class="p dash" d="M200 100 L200 330" opacity=".4"/><text x="290.0" y="90" text-anchor="middle" class="l">1</text><path class="p dash" d="M260 100 L260 330" opacity=".4"/><text x="350.0" y="90" text-anchor="middle" class="l">1</text><path class="p dash" d="M320 100 L320 330" opacity=".4"/><text x="410.0" y="90" text-anchor="middle" class="l">0</text><path class="p dash" d="M380 100 L380 330" opacity=".4"/><text x="470.0" y="90" text-anchor="middle" class="l">0</text><path class="p dash" d="M440 100 L440 330" opacity=".4"/><text x="530.0" y="90" text-anchor="middle" class="l">0</text><path class="p dash" d="M500 100 L500 330" opacity=".4"/><text x="590.0" y="90" text-anchor="middle" class="l">1</text><path class="p dash" d="M560 100 L560 330" opacity=".4"/><path class="p blue" d="M140 130 L140 130 L200 130 L200 180 L260 180 L260 130 L320 130 L320 130 L380 130 L380 180 L440 180 L440 180 L500 180 L500 180 L560 180 L560 130 L620 130"/><text x="30" y="160" class="l">NRZ</text><path class="p red" d="M140 290 L170.0 290 L170.0 240 L200 240 L200 240 L230.0 240 L230.0 290 L260 290 L260 290 L290.0 290 L290.0 240 L320 240 L320 290 L350.0 290 L350.0 240 L380 240 L380 240 L410.0 240 L410.0 290 L440 290 L440 240 L470.0 240 L470.0 290 L500 290 L500 240 L530.0 240 L530.0 290 L560 290 L560 290 L590.0 290 L590.0 240 L620 240"/><text x="30" y="260" class="l">Manchester</text><text x="30" y="210" class="s">0 0 0: a flat line, the receiver can lose count</text><text x="30" y="360" class="s">Manchester flips in the middle of every bit (low to high for 1), so the clock</text><text x="30" y="380" class="s">never drifts, at the cost of twice the signalling rate.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## 4.4 Signals get worse with distance

Every medium **attenuates** (weakens) the signal, more at high frequencies, and adds **noise**. Copper also suffers
**crosstalk** from neighbouring pairs, and **dispersion** spreads pulses out in time so neighbouring symbols blur
together (inter-symbol interference). Receivers fight back with **equalisers** (filters that undo the channel's
distortion) and **forward error correction**, extra bits that let errors be fixed without retransmission
([Math foundations, chapter 6](../math/06-Error-Correcting-Codes.md)).

## 4.5 Access networks

| Technology | Medium | Typical speeds (2026) | How it works |
| --- | --- | --- | --- |
| **DSL** (ADSL2+, VDSL2) | phone line | 10–100 Mbit/s down, depends on distance | splits the line into hundreds of small frequency bins, each modulated separately (DMT) |
| **Cable** (DOCSIS 3.1, 4.0) | coaxial TV cable, fibre to the neighbourhood | up to 1–10 Gbit/s down | many homes share frequency channels; OFDM on coax |
| **Fibre to the home** (GPON, XGS-PON) | single fibre split passively to up to 64 homes | 1–10 Gbit/s | one wavelength down, another up; the homes take turns sending |
| **Fixed wireless and 5G home** | radio | 50 Mbit/s–1 Gbit/s | a roof or window antenna to a tower |
| **Satellite** (LEO) | radio to low-orbit satellites | 50–300 Mbit/s | see [Satellites and deep space](../wireless/14-Satellites-and-Deep-Space.md) |

DSL is **asymmetric** (more down than up) because most homes download more than they upload, and because nearby lines'
upstream signals interfere less at low frequencies.

## 4.6 Clocks and synchronisation

Sender and receiver must agree when each symbol starts. Receivers recover the sender's clock from the transitions in
the signal (clock recovery), which is why line codes guarantee transitions. Networks that carry mobile phone traffic
also need devices to agree on the actual *time*, to microseconds; they use the **Precision Time Protocol** (IEEE 1588),
where hardware timestamps packets as they leave and arrive.

## Check yourself

??? question "1. A channel has 1 MHz of bandwidth and an S/N of 30 dB. What is its Shannon capacity?"
    S/N = 1000, so C = 10⁶ × log₂(1001) ≈ 10⁶ × 9.97 ≈ 10 Mbit/s.

??? question "2. Why can't NRZ be used alone on a long serial link?"
    Long runs of identical bits have no transitions, so the receiver's clock drifts and it miscounts bits; the average voltage also drifts.

??? question "3. What does WDM do?"
    It sends many wavelengths (colours) of light down one fibre, each an independent channel, multiplying the fibre's capacity.

??? info "Sources"
    - C. Shannon, "A Mathematical Theory of Communication", *Bell System Technical Journal*, 1948; H. Nyquist, "Certain Topics in Telegraph Transmission Theory", 1928.
    - IEEE 802.3-2022 (Ethernet physical layers); ITU-T G.993.2 (VDSL2), G.9807.1 (XGS-PON); CableLabs DOCSIS 4.0 specifications.
    - Tanenbaum, Feamster and Wetherall, *Computer Networks*, 6th ed., chapter 2.
