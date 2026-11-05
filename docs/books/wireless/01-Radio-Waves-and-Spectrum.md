# 1. Radio waves and spectrum

*A radio wave is light that our eyes cannot see. This chapter explains what a wave is, how frequency sets what a band is good for, how the spectrum is divided and licensed, and which bands Wi-Fi, Bluetooth, cellular and satellites use.*

!!! abstract "In this chapter"
    **You will learn:** electromagnetic waves, frequency and wavelength; how propagation changes across the spectrum;
    licensed and unlicensed bands; the ISM bands at 2.4 and 5 GHz and the 6 GHz band; who allocates spectrum; channels
    and bandwidth.

    **You need:** [Start, lesson 4](../../start/04-Wires-and-Radio.md); [Math, chapter 7](../math/07-Signals-and-Fourier.md) helps.

## 1.1 What a radio wave is

Moving electric charges (current changing in an antenna) create changing electric and magnetic fields, which create
each other and travel away at the speed of light, $c \approx 3 \times 10^8$ m/s. James Clerk Maxwell predicted these
waves in 1865; Heinrich Hertz made and detected them in 1887; Marconi sent radio across the Atlantic in 1901.

A wave has a **frequency** $f$ (oscillations per second, Hz) and a **wavelength** $\lambda = c/f$. Radio, microwaves,
infrared, visible light, X-rays: all the same thing at different frequencies.

| Frequency | Wavelength | Name | Examples |
| --- | --- | --- | --- |
| 30–300 kHz | 1–10 km | LF | time signals, navigation |
| 3–30 MHz | 10–100 m | HF (shortwave) | bounces off the ionosphere: worldwide radio |
| 30–300 MHz | 1–10 m | VHF | FM radio, aircraft |
| 300 MHz–3 GHz | 10 cm–1 m | UHF | TV, 4G/5G low and mid bands, 2.4 GHz Wi-Fi, Bluetooth, GPS, Mars rover relay (≈400 MHz) |
| 3–30 GHz | 1–10 cm | SHF (microwave) | 5 and 6 GHz Wi-Fi, satellite TV, 5G mid band, deep space X band (8.4 GHz) |
| 30–300 GHz | 1–10 mm | EHF (millimetre wave) | 5G mmWave (24–71 GHz), 60 GHz Wi-Fi (WiGig), radar |

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 380" role="img" aria-labelledby="sk-nw-wave-t"><title id="sk-nw-wave-t">Two waves drawn to the same scale: 2.4 gigahertz with a 12.5 centimetre wavelength and 5 gigahertz with a 6 centimetre wavelength</title><defs><filter id="sk-nw-wave-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-wave-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-wave-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-wave-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-wave-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="380" filter="url(#sk-nw-wave-paper)"/><g filter="url(#sk-nw-wave-pen)"><text x="30" y="44" class="h">Higher frequency, shorter wave</text><path class="p blue" d="M150.0 130.0 L152.3 121.4 L154.6 113.6 L156.9 107.1 L159.2 102.5 L161.5 100.2 L163.8 100.4 L166.1 103.0 L168.4 107.9 L170.7 114.6 L173.0 122.5 L175.3 131.1 L177.6 139.6 L179.9 147.3 L182.2 153.6 L184.5 157.9 L186.8 159.9 L189.1 159.4 L191.4 156.5 L193.7 151.3 L196.0 144.5 L198.3 136.4 L200.6 127.7 L202.9 119.3 L205.2 111.8 L207.5 105.7 L209.8 101.7 L212.1 100.0 L214.4 100.9 L216.7 104.1 L219.0 109.5 L221.3 116.5 L223.6 124.7 L225.9 133.4 L228.2 141.7 L230.5 149.1 L232.8 154.9 L235.1 158.6 L237.4 160.0 L239.7 158.9 L242.0 155.3 L244.3 149.7 L246.6 142.4 L248.9 134.1 L251.2 125.5 L253.5 117.2 L255.8 110.0 L258.1 104.5 L260.4 101.0 L262.7 100.0 L265.0 101.5 L267.3 105.3 L269.6 111.2 L271.9 118.6 L274.2 127.0 L276.5 135.6 L278.8 143.8 L281.1 150.8 L283.4 156.1 L285.7 159.2 L288.0 159.9 L290.3 158.2 L292.6 154.0 L294.9 147.9 L297.2 140.3 L299.5 131.9 L301.8 123.3 L304.1 115.2 L306.4 108.4 L308.7 103.4 L311.0 100.5 L313.3 100.2 L315.6 102.2 L317.9 106.6 L320.2 113.0 L322.5 120.7 L324.8 129.2 L327.1 137.8 L329.4 145.8 L331.7 152.4 L334.0 157.1 L336.3 159.7 L338.6 159.7 L340.9 157.3 L343.2 152.6 L345.5 146.1 L347.8 138.2 L350.1 129.6 L352.4 121.1 L354.7 113.3 L357.0 106.9 L359.3 102.4 L361.6 100.2 L363.9 100.5 L366.2 103.2 L368.5 108.1 L370.8 114.9 L373.1 122.9 L375.4 131.5 L377.7 140.0 L380.0 147.6 L382.3 153.8 L384.6 158.0 L386.9 159.9 L389.2 159.3 L391.5 156.3 L393.8 151.1 L396.1 144.1 L398.4 136.0 L400.7 127.4 L403.0 119.0 L405.3 111.5 L407.6 105.5 L409.9 101.6 L412.2 100.0 L414.5 100.9 L416.8 104.3 L419.1 109.7 L421.4 116.9 L423.7 125.1 L426.0 133.8 L428.3 142.1 L430.6 149.4 L432.9 155.1 L435.2 158.8 L437.5 160.0 L439.8 158.8 L442.1 155.1 L444.4 149.4 L446.7 142.1 L449.0 133.8 L451.3 125.1 L453.6 116.9 L455.9 109.7 L458.2 104.3 L460.5 100.9 L462.8 100.0 L465.1 101.6 L467.4 105.5 L469.7 111.5 L472.0 119.0 L474.3 127.4 L476.6 136.0 L478.9 144.1 L481.2 151.1 L483.5 156.3 L485.8 159.3 L488.1 159.9 L490.4 158.0 L492.7 153.8 L495.0 147.6 L497.3 140.0 L499.6 131.5 L501.9 122.9 L504.2 114.9 L506.5 108.1 L508.8 103.2 L511.1 100.5 L513.4 100.2 L515.7 102.4 L518.0 106.9 L520.3 113.3 L522.6 121.1 L524.9 129.6 L527.2 138.2 L529.5 146.1 L531.8 152.6 L534.1 157.3 L536.4 159.7 L538.7 159.7 L541.0 157.1 L543.3 152.4 L545.6 145.8 L547.9 137.8 L550.2 129.2 L552.5 120.7 L554.8 113.0 L557.1 106.6 L559.4 102.2 L561.7 100.2 L564.0 100.5 L566.3 103.4 L568.6 108.4 L570.9 115.2 L573.2 123.3 L575.5 131.9 L577.8 140.3 L580.1 147.9 L582.4 154.0 L584.7 158.2 L587.0 159.9 L589.3 159.2 L591.6 156.1 L593.9 150.8 L596.2 143.8 L598.5 135.6 L600.8 127.0 L603.1 118.6 L605.4 111.2 L607.7 105.3 L610.0 101.5"/><text x="30" y="136" class="l">2.4 GHz</text><path class="p" d="M162.5 86 L212.5 86" marker-start="url(#sk-nw-wave-ah)" marker-end="url(#sk-nw-wave-ah)"/><text x="187.5" y="78" text-anchor="middle" class="s">12.5 cm</text><path class="p red" d="M150.0 260.0 L152.3 243.0 L154.6 232.0 L156.9 230.8 L159.2 239.9 L161.5 256.1 L163.8 273.6 L166.1 286.4 L168.4 289.8 L170.7 282.8 L173.0 267.8 L175.3 250.0 L177.6 235.7 L179.9 230.0 L182.2 234.8 L184.5 248.5 L186.8 266.2 L189.1 281.8 L191.4 289.6 L193.7 287.1 L196.0 275.0 L198.3 257.6 L200.6 241.1 L202.9 231.2 L205.2 231.5 L207.5 241.7 L209.8 258.4 L212.1 275.7 L214.4 287.4 L216.7 289.5 L219.0 281.2 L221.3 265.5 L223.6 247.8 L225.9 234.4 L228.2 230.0 L230.5 236.2 L232.8 250.7 L235.1 268.5 L237.4 283.3 L239.7 289.9 L242.0 286.0 L244.3 272.9 L246.6 255.3 L248.9 239.3 L251.2 230.7 L253.5 232.3 L255.8 243.7 L258.1 260.8 L260.4 277.6 L262.7 288.3 L265.0 289.0 L267.3 279.5 L269.6 263.1 L271.9 245.7 L274.2 233.3 L276.5 230.3 L278.8 237.7 L281.1 253.0 L283.4 270.8 L285.7 284.7 L288.0 290.0 L290.3 284.7 L292.6 270.8 L294.9 253.0 L297.2 237.7 L299.5 230.3 L301.8 233.3 L304.1 245.7 L306.4 263.1 L308.7 279.5 L311.0 289.0 L313.3 288.3 L315.6 277.6 L317.9 260.8 L320.2 243.7 L322.5 232.3 L324.8 230.7 L327.1 239.3 L329.4 255.3 L331.7 272.9 L334.0 286.0 L336.3 289.9 L338.6 283.3 L340.9 268.5 L343.2 250.7 L345.5 236.2 L347.8 230.0 L350.1 234.4 L352.4 247.8 L354.7 265.5 L357.0 281.2 L359.3 289.5 L361.6 287.4 L363.9 275.7 L366.2 258.4 L368.5 241.7 L370.8 231.5 L373.1 231.2 L375.4 241.1 L377.7 257.6 L380.0 275.0 L382.3 287.1 L384.6 289.6 L386.9 281.8 L389.2 266.2 L391.5 248.5 L393.8 234.8 L396.1 230.0 L398.4 235.7 L400.7 250.0 L403.0 267.8 L405.3 282.8 L407.6 289.8 L409.9 286.4 L412.2 273.6 L414.5 256.1 L416.8 239.9 L419.1 230.8 L421.4 232.0 L423.7 243.0 L426.0 260.0 L428.3 277.0 L430.6 288.0 L432.9 289.2 L435.2 280.1 L437.5 263.9 L439.8 246.4 L442.1 233.6 L444.4 230.2 L446.7 237.2 L449.0 252.2 L451.3 270.0 L453.6 284.3 L455.9 290.0 L458.2 285.2 L460.5 271.5 L462.8 253.8 L465.1 238.2 L467.4 230.4 L469.7 232.9 L472.0 245.0 L474.3 262.4 L476.6 278.9 L478.9 288.8 L481.2 288.5 L483.5 278.3 L485.8 261.6 L488.1 244.3 L490.4 232.6 L492.7 230.5 L495.0 238.8 L497.3 254.5 L499.6 272.2 L501.9 285.6 L504.2 290.0 L506.5 283.8 L508.8 269.3 L511.1 251.5 L513.4 236.7 L515.7 230.1 L518.0 234.0 L520.3 247.1 L522.6 264.7 L524.9 280.7 L527.2 289.3 L529.5 287.7 L531.8 276.3 L534.1 259.2 L536.4 242.4 L538.7 231.7 L541.0 231.0 L543.3 240.5 L545.6 256.9 L547.9 274.3 L550.2 286.7 L552.5 289.7 L554.8 282.3 L557.1 267.0 L559.4 249.2 L561.7 235.3 L564.0 230.0 L566.3 235.3 L568.6 249.2 L570.9 267.0 L573.2 282.3 L575.5 289.7 L577.8 286.7 L580.1 274.3 L582.4 256.9 L584.7 240.5 L587.0 231.0 L589.3 231.7 L591.6 242.4 L593.9 259.2 L596.2 276.3 L598.5 287.7 L600.8 289.3 L603.1 280.7 L605.4 264.7 L607.7 247.1 L610.0 234.0"/><text x="30" y="266" class="l">5 GHz</text><path class="p" d="M156.0 216 L180.0 216" marker-start="url(#sk-nw-wave-ah)" marker-end="url(#sk-nw-wave-ah)"/><text x="168.0" y="208" text-anchor="middle" class="s">6 cm</text><text x="30" y="340" class="s">wavelength = speed of light ÷ frequency. Drawn to scale: 1 cm here is 4 units wide.</text><text x="30" y="362" class="s">Mars rovers relay at about 400 MHz: a wave 75 cm long, too long to draw here.</text></g></svg><figcaption>Sketched for this page. To scale.</figcaption></figure>

## 1.2 How frequency shapes propagation

- **Low frequencies** pass through walls, bend round obstacles and hills (**diffraction**), and lose less energy over
  distance in practice. But there is little room in absolute hertz, so they carry few bits per second.
- **High frequencies** have huge amounts of bandwidth but are stopped by walls, bodies, leaves and rain; they travel
  mostly in straight lines (**line of sight**) and are easily focused into narrow beams by small antennas.

This trade-off explains the design of every system: 600–900 MHz cellular for coverage across countryside, 3.5 GHz for
capacity in towns, mmWave for stadiums and streets; 2.4 GHz Wi-Fi for range, 5 and 6 GHz for speed.

## 1.3 Who decides who uses what

Radio waves cross borders, and two transmitters on the same frequency in the same place interfere. So spectrum is
regulated:

- Internationally, the **ITU** (a UN agency) allocates bands to services at World Radiocommunication Conferences, every
  three to four years.
- Nationally, regulators assign and license: the FCC (USA), ISED (Canada), Ofcom (UK), the EU's CEPT and national bodies.

Two main models:

- **Licensed** spectrum: an operator pays (often billions at auction) for exclusive use of a band in a region.
  Cellular networks use it, so they can plan and guarantee quality.
- **Unlicensed** (licence-exempt) spectrum: anyone may transmit, within power limits and with etiquette rules
  (listen-before-talk, dynamic frequency selection). Wi-Fi, Bluetooth, Zigbee, microwave ovens and baby monitors share
  it, which is why they can interfere with each other.

Newer models sit between: **shared** spectrum such as the US CBRS band at 3.55–3.7 GHz, where a database coordinates
users in three priority tiers, and **automated frequency coordination** for outdoor 6 GHz Wi-Fi.

## 1.4 The Wi-Fi bands

| Band | Range | Channels (20 MHz) | Notes |
| --- | --- | --- | --- |
| 2.4 GHz | 2.400–2.4835 GHz | 11–14, overlapping; only 1, 6, 11 don't overlap | crowded: Bluetooth, microwave ovens (which heat water at about 2.45 GHz) |
| 5 GHz | about 5.15–5.85 GHz | up to about 25 | some channels need **DFS**: move away if radar is detected |
| 6 GHz | 5.925–7.125 GHz (USA, Canada, others; 5.925–6.425 in Europe) | up to 59 | opened 2020–2021; Wi-Fi 6E and 7 only; no old devices to slow it down |
| 60 GHz | 57–71 GHz | a few, 2.16 GHz wide | WiGig (802.11ad/ay): multi-gigabit within a room |

Wider **channels** carry more data (capacity scales with bandwidth, Shannon) but there are fewer of them: 5 GHz has
about six non-overlapping 80 MHz channels, 6 GHz has seven 160 MHz or three 320 MHz channels.

## 1.5 Other important bands

- **Cellular**: hundreds of numbered bands worldwide. 4G and 5G bands in the 600 MHz–2.6 GHz range, the 5G "C-band"
  around 3.3–4.2 GHz, and mmWave bands at 24–47 GHz.
- **GNSS** (GPS, Galileo): around 1.2 and 1.575 GHz, received at about −130 dBm, below the noise.
- **Satellite**: Ku band (12–18 GHz) and Ka band (26–40 GHz) for broadband and TV; L and S band for phones.
- **Deep space**: S band (2 GHz), X band (7.2 GHz up, 8.4 GHz down) and Ka band (32 GHz) for Mars and beyond; UHF
  around 400 MHz for rovers to orbiters.

## 1.6 Power limits and safety

Unlicensed devices are limited in transmit power, typically 100 mW to 1 W equivalent radiated power depending on band
and country; phones are usually below 0.2–2 W. Exposure limits from ICNIRP and national regulators (expressed as a
specific absorption rate for devices held near the body) are set well below the level at which radio-frequency energy
measurably heats tissue, which is the established biological effect at these frequencies. Radio waves at these
frequencies are **non-ionising**: they do not have the energy to break chemical bonds.

## Check yourself

??? question "1. What is the wavelength at 900 MHz, and why is that band good for rural coverage?"
    About 33 cm. Low frequencies diffract round obstacles and pass through foliage and walls better, so one tower covers a wide area.

??? question "2. Why do 2.4 GHz Wi-Fi networks use channels 1, 6 and 11?"
    Channels are 5 MHz apart but each signal is about 20 MHz wide, so only channels five apart do not overlap.

??? question "3. Name one advantage and one drawback of unlicensed spectrum."
    Anyone can deploy for free; but anyone else can too, so interference is uncontrolled.

??? info "Sources"
    - ITU Radio Regulations (2024 edition); FCC "Unlicensed Use of the 6 GHz Band", Report and Order FCC 20-51 (2020); ISED decision on 6 GHz (2021).
    - IEEE 802.11-2020 and 802.11be-2024 (channelisation); NASA DSN Telecommunications Link Design Handbook (810-005) for deep-space bands.
    - ICNIRP, *Guidelines for Limiting Exposure to Electromagnetic Fields (100 kHz to 300 GHz)*, 2020.
    - T. Rappaport, *Wireless Communications: Principles and Practice*, 2nd ed., 2002, chapter 1.
