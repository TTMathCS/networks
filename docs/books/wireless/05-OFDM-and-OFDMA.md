# 5. OFDM and OFDMA

*Wi-Fi since 802.11a, 4G, 5G, digital TV and cable modems all send data on hundreds or thousands of narrow subcarriers at once. This chapter explains OFDM in practice (subcarriers, symbols, guard intervals, pilots) and OFDMA, which shares those subcarriers among many users at the same moment.*

!!! abstract "In this chapter"
    **You will learn:** why many narrow subcarriers beat one wide carrier; subcarrier spacing and symbol time; guard
    intervals and the cyclic prefix; pilots and channel estimation; the drawbacks (peak power, frequency offsets);
    OFDMA resource units in Wi-Fi 6 and resource blocks in 4G/5G; 5G numerology.

    **You need:** [Chapter 3](03-Fading-and-Noise.md); the math is in [Math, chapter 8](../math/08-Modulation-Math.md).

## 5.1 The idea

A single carrier sending 100 million symbols a second has symbols 10 ns long: echoes of 100 ns would smear ten
symbols together, needing a complex equaliser. **OFDM** instead sends, say, 1,000 slow streams in parallel on 1,000
subcarriers. Each symbol now lasts microseconds, much longer than the echoes, and each subcarrier is so narrow that
its fading is flat. The subcarriers overlap in frequency but are **orthogonal**: spaced exactly $1/T_u$ apart (for
useful symbol time $T_u$), so that each one's peak falls on the others' zeros. An inverse FFT builds the whole symbol at
once and an FFT takes it apart.

## 5.2 Numbers from Wi-Fi

| | 802.11a/g/n/ac | 802.11ax/be (Wi-Fi 6, 7) |
| --- | --- | --- |
| Subcarrier spacing | 312.5 kHz | 78.125 kHz (four times denser) |
| Useful symbol time $T_u$ | 3.2 µs | 12.8 µs |
| Guard interval | 0.8 µs (0.4 short) | 0.8, 1.6 or 3.2 µs |
| Subcarriers in 20 MHz | 64 (52 data, 4 pilot) | 256 (234 data, 8 pilot) |

Wi-Fi 6's longer symbols cut the relative overhead of the guard interval (0.8 µs out of 13.6 instead of 4.0) and
tolerate longer echoes outdoors.

## 5.3 Guard interval and cyclic prefix

Between symbols sits a **guard interval** filled with a copy of the symbol's end: the **cyclic prefix**. Any echo
shorter than the prefix only shifts each subcarrier's phase rather than spilling into the next symbol, and the receiver
undoes each subcarrier's phase and amplitude with one complex division. Choosing its length is a trade-off: longer
prefix, more echo tolerance, less throughput.

## 5.4 Pilots and channel estimation

How does the receiver know each subcarrier's channel $H_k$? From **training fields** in each frame's preamble (known
symbols on every subcarrier) and **pilot** subcarriers carrying known values in every symbol, which track drift in phase
and frequency through the frame. In cellular systems, **reference signals** spread across the time-frequency grid play
the same role and also tell the base station how to schedule and beamform.

## 5.5 Drawbacks

- **Peak power**: adding hundreds of subcarriers occasionally produces a peak far above the average (a high
  **peak-to-average power ratio**), forcing amplifiers to run well below their maximum, wasting battery. 4G's uplink
  therefore uses a variant, **SC-FDMA** (DFT-spread OFDM), with lower peaks; 5G allows both.
- **Frequency offset**: if transmitter and receiver clocks differ slightly, or Doppler shifts the signal (Chapter 3),
  subcarriers lose orthogonality and leak into each other. Receivers estimate and correct the offset from the preamble.
- **Guard bands**: subcarriers at the band's edges are left empty to limit leakage into neighbouring channels.

## 5.6 OFDMA: many users in one symbol

Before Wi-Fi 6, one OFDM transmission went to one client: a 100-byte message to a smart plug occupied the whole 80 MHz
channel for the whole frame. **OFDMA** divides the subcarriers into groups and gives different groups to different
users in the same transmission.

- **Wi-Fi 6 resource units (RUs)**: 26, 52, 106, 242, 484, 996 or 2×996 subcarriers. A 20 MHz channel can be split into
  up to nine 26-tone RUs for nine clients at once. The access point schedules both directions: for uplink it sends a
  **trigger frame** telling each client which RU to use and when. Wi-Fi 7 adds **multi-RU** (several RUs to one client)
  and **preamble puncturing** (skipping a busy 20 MHz slice inside a wide channel instead of falling back to a narrow
  one).
- **4G and 5G resource blocks**: 12 subcarriers × one slot. The base station's scheduler assigns resource blocks to
  phones every slot (1 ms in 4G, as little as 0.125 ms in 5G), using CQI reports (Chapter 4) to give each phone the
  subcarriers where its channel is good: **frequency-selective scheduling**.

OFDMA's gain is in efficiency with many small packets (IoT, voice, gaming) and in latency, more than in peak speed.

## 5.7 5G numerology

5G NR supports several subcarrier spacings, $15 \times 2^\mu$ kHz:

| $\mu$ | Spacing | Slot | Typical use |
| --- | --- | --- | --- |
| 0 | 15 kHz | 1 ms | low bands, large cells (same as 4G) |
| 1 | 30 kHz | 0.5 ms | mid band (3.5 GHz) |
| 2 | 60 kHz | 0.25 ms | mid band, mmWave |
| 3 | 120 kHz | 0.125 ms | mmWave (Doppler and phase noise are larger) |

Wider spacing means shorter symbols: lower latency and more Doppler tolerance, but a shorter cyclic prefix, so it suits
small cells with short echoes.

## 5.8 Other OFDM systems

DSL (as DMT, with up to 4,096 tones adapted to each line's noise), DOCSIS 3.1 and 4.0 cable, DVB-T2 and ATSC 3.0
broadcast TV, powerline adapters (HomePlug, G.hn) and some optical systems all use OFDM. The same few ideas (IFFT,
cyclic prefix, per-subcarrier equalisation and bit loading) recur everywhere.

## Check yourself

??? question "1. What is the useful symbol time with 78.125 kHz subcarrier spacing?"
    1 / 78,125 Hz = 12.8 µs.

??? question "2. Why did Wi-Fi 6 add OFDMA if peak speed hardly changes?"
    To serve many clients with small packets in one transmission, cutting overhead and latency in busy networks.

??? question "3. Why does 4G's uplink use DFT-spread OFDM?"
    It has a lower peak-to-average power ratio, so the phone's amplifier can run more efficiently and save battery.

??? info "Sources"
    - IEEE 802.11ax-2021, clause 27 (HE PHY), and 802.11be-2024 (EHT PHY).
    - 3GPP TS 38.211 (5G NR physical channels and modulation), TS 36.211 (LTE).
    - R. van Nee and R. Prasad, *OFDM for Wireless Multimedia Communications*, Artech House, 2000.
    - E. Khorov, A. Kiryanov, A. Lyakhov, G. Bianchi, "A Tutorial on IEEE 802.11ax High Efficiency WLANs", *IEEE Comm. Surveys & Tutorials*, 2019.
