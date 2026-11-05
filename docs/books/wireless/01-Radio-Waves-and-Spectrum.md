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
