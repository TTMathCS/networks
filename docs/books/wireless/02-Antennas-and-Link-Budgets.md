# 2. Antennas and link budgets

*Will this link work? A link budget answers it with simple addition: transmit power, plus antenna gains, minus every loss on the way, compared with what the receiver needs. This chapter explains antennas and gain, free-space path loss and the Friis equation, and works out budgets from a room to Mars.*

!!! abstract "In this chapter"
    **You will learn:** what an antenna does; isotropic and dipole antennas; gain, dBi and EIRP; beamwidth and dish
    size; free-space path loss and the Friis equation; receiver sensitivity and noise floor; fade margin; a Wi-Fi budget
    and a Mars budget.

    **You need:** [Chapter 1](01-Radio-Waves-and-Spectrum.md); decibels ([Math, chapter 7](../math/07-Signals-and-Fourier.md)).

## 2.1 What an antenna does

An antenna converts current in a wire into a radio wave and back. It does not create energy; it **directs** it. The
reference is an imaginary **isotropic** antenna that radiates equally in every direction. A real antenna's **gain** is
how much stronger it radiates in its best direction than an isotropic one would with the same power, in **dBi**:

| Antenna | Gain | Shape of the beam |
| --- | --- | --- |
| Half-wave dipole (a simple rod, $\lambda/2$ long) | 2.15 dBi | doughnut round the rod |
| Phone or laptop internal antennas | about −2 to +3 dBi | lumpy, nearly all round |
| Ceiling Wi-Fi access point | 3–6 dBi | wide, downward |
| Sector antenna on a cell tower | 15–18 dBi | 65° wide horizontally |
| Satellite TV dish (60 cm, Ku) | about 35 dBi | narrow cone, about 3° |
| Deep Space Network 70 m dish at X band | about 74 dBi | about 0.03° wide |

Gain and beamwidth are two sides of one thing: concentrating power into a narrower cone. For a dish of diameter $D$ and
efficiency $\eta$ (typically 0.55–0.7):

$$G = \eta \left(\frac{\pi D}{\lambda}\right)^2$$

Doubling the dish diameter, or the frequency, adds 6 dB of gain. The antenna's useful size is measured in wavelengths,
which is why phones fit many antennas for 3.5 GHz but few for 700 MHz.

**Reciprocity**: an antenna has the same gain receiving as transmitting.

**EIRP** (equivalent isotropically radiated power) = transmit power + antenna gain − cable loss, in dBm. Regulators cap
EIRP, not transmitter power, for unlicensed devices.

## 2.2 Free-space path loss

In empty space the power spreads over a growing sphere, area $4\pi d^2$. Combining that with how much an isotropic
antenna collects (its effective area is $\lambda^2/4\pi$) gives the **free-space path loss**:

$$\text{FSPL} = \left(\frac{4\pi d}{\lambda}\right)^2 \qquad \text{FSPL(dB)} = 20\log_{10} d_\text{km} + 20\log_{10} f_\text{MHz} + 32.44$$

Each doubling of distance costs 6 dB (the inverse-square law). The frequency term is not the wave "fading faster": it
reflects that a fixed-gain antenna is physically smaller at higher frequency and collects less. With fixed-*size*
antennas at both ends, higher frequency actually gains (both dishes gain 6 dB per doubling), which is why deep-space
links moved from S to X to Ka band.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 380" role="img" aria-labelledby="sk-nw-square-t"><title id="sk-nw-square-t">Power from an antenna spreads out; at twice the distance the same beam covers twice the height and width, four times the area, a quarter of the power</title><defs><filter id="sk-nw-square-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-square-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-square-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-square-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-square-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="380" filter="url(#sk-nw-square-paper)"/><g filter="url(#sk-nw-square-pen)"><text x="30" y="44" class="h">Twice as far, a quarter of the power</text><circle cx="90" cy="210" r="14" class="p gold"/><text x="90" y="250" text-anchor="middle" class="s">antenna</text><path class="p dash" d="M214.2 171.6 A130 130 0 0 1 214.2 248.4"/><path class="p dash" d="M338.4 133.2 A260 260 0 0 1 338.4 286.8"/><path class="p" d="M104 204 L340 140 M104 216 L340 280"/><path class="p gold" d="M215 175 L220 175 L220 245 L215 245Z"/><path class="p room" d="M345 140 L350 140 L350 280 L345 280Z"/><text x="190" y="290" class="s">at d: one patch</text><text x="330" y="320" class="s">at 2d: the same power spread</text><text x="330" y="340" class="s">over four patches (twice as tall</text><text x="330" y="360" class="s">and twice as wide)</text><text x="430" y="150" class="l">−6 dB</text><text x="430" y="172" class="s">every time the</text><text x="430" y="192" class="s">distance doubles</text></g></svg><figcaption>Sketched for this page. The cone stands for a slice of a sphere.</figcaption></figure>

<figure class="play" data-play="fspl"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> Slide from across a room to Mars at its farthest and watch the free-space path loss grow: 6 dB every time the distance doubles, from the formula above. Distances: the Moon 384,400 km, Mars 54.6 to 401 million km (NASA). Deep-space links win most of it back with 34 and 70 m dishes.</figcaption></figure>

## 2.3 The Friis equation

Received power in free space (Harald Friis, 1946):

$$P_r = P_t + G_t + G_r - \text{FSPL} \quad \text{(all in dB)}$$

Real paths lose more: walls (a plasterboard wall costs a few dB at 5 GHz, a concrete wall 10–20 dB, a metal-coated window
more), floors, bodies, foliage, rain at high frequencies. Indoors, engineers use log-distance models where loss grows
with a **path loss exponent** $n$ of 2.5–4 instead of free space's 2.

## 2.4 What the receiver needs

The **noise floor** of a receiver of bandwidth $B$ is thermal noise $kTB$ plus the receiver's own **noise figure** NF:

$$N = -174\ \text{dBm/Hz} + 10\log_{10} B + \text{NF}$$

For a 20 MHz Wi-Fi channel and NF = 6 dB: $-174 + 73 + 6 = -95$ dBm. The receiver needs the signal to be some
**required S/N** above that, depending on the modulation (Chapter 4): about 5 dB for the slowest Wi-Fi rates, 25–35 dB
for 256- to 4096-QAM. Signal minus noise floor minus required S/N is the **margin**. Designers keep a **fade margin**
(often 10–20 dB) for fading (Chapter 3) and bodies in the way.

## 2.5 Example: Wi-Fi across a house

Access point 20 dBm, 4 dBi antenna; laptop 0 dBi; 5.5 GHz; 15 m; two interior walls at 5 dB each.

- FSPL at 15 m: $20\log_{10}0.015 + 20\log_{10}5500 + 32.44 = -36.5 + 74.8 + 32.4 = 70.7$ dB.
- Received: $20 + 4 + 0 - 70.7 - 10 = -56.7$ dBm.
- Noise floor (20 MHz): about −95 dBm, so S/N ≈ 38 dB: enough for the highest rates, if nothing else interferes.

Move to 40 m and three more walls: FSPL ≈ 79.2 dB, received ≈ −80 dBm, S/N ≈ 15 dB: a slow 16-QAM rate. This is why a
mesh node or second access point helps far more than a stronger one: the laptop's own weak transmitter must also reach
back.

## 2.6 Example: Mars to Earth

Mars Reconnaissance Orbiter talks to a 70 m DSN dish at X band, 8.4 GHz, at a distance (say) of 200 million km.

- FSPL: $20\log_{10}(2 \times 10^8) + 20\log_{10}(8400) + 32.44 = 166.0 + 78.5 + 32.4 = 276.9$ dB.
- MRO: about 100 W of radio power (50 dBm) into a 3 m dish (about 46 dBi). DSN 70 m: about 74 dBi.
- Received: $50 + 46 + 74 - 277 = -107$ dBm, about $2 \times 10^{-14}$ W.

That is enough for megabits per second only because the DSN's receivers are cooled to a few kelvin (a very low noise
floor) and use codes close to the Shannon limit. At Mars's farthest, the rate drops by about a factor of ten. By NASA's count
MRO has sent back more data than all earlier Mars missions combined, largely thanks to this link.

## 2.7 Polarisation and beam steering

A wave's electric field points in a direction, its **polarisation**: vertical, horizontal or circular. A receiving
antenna crossed with the wave's polarisation can lose 20 dB or more; that's why satellites use circular polarisation and
Wi-Fi access points mix several orientations. **Phased arrays**, many small antennas with adjustable phases, form and
steer beams electronically, with no moving parts: the basis of 5G massive MIMO, mmWave phones and LEO satellite
terminals (Chapter 6).

## Check yourself

??? question "1. What is the free-space path loss at 2.4 GHz over 100 m?"
    20 log 0.1 + 20 log 2400 + 32.44 = −20 + 67.6 + 32.4 ≈ 80 dB.

??? question "2. A 1 W transmitter with a 6 dBi antenna and 1 dB of cable loss: what is the EIRP?"
    30 + 6 − 1 = 35 dBm (about 3.2 W).

??? question "3. Why does adding an access point help more than turning one up?"
    Links are two-way: the client's weak transmitter must reach the access point too, and a nearer access point improves both directions and spreads the load.

??? info "Sources"
    - H. Friis, "A Note on a Simple Transmission Formula", *Proc. IRE*, 1946.
    - C. Balanis, *Antenna Theory*, 4th ed., Wiley, 2016.
    - NASA JPL, *DSN Telecommunications Link Design Handbook* (810-005), modules 101 and 104; J. Taylor et al., *Mars Reconnaissance Orbiter Telecommunications*, DESCANSO Design and Performance Summary Series, 2006.
    - ITU-R P.1238 (indoor propagation), ITU-R P.525 (free-space attenuation).
