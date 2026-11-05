# 8. Wi-Fi generations

*From 2 Mbit/s in 1997 to multi-gigabit Wi-Fi 7, each generation added a few key techniques. This chapter walks through them, with the Wi-Fi Alliance's generation names, and says which features matter in practice.*

!!! abstract "In this chapter"
    **You will learn:** what changed in 802.11b, a/g, n, ac, ax and be; the Wi-Fi 4–7 names; channel widths, streams
    and modulation per generation; Wi-Fi 6E and the 6 GHz band; multi-link operation; Wi-Fi 8's focus on reliability.

    **You need:** [Chapters 4–7](04-Modulation-and-Coding.md).

## 8.1 Standards and names

The **IEEE 802.11** working group writes the standards; amendments get letters. The **Wi-Fi Alliance**, an industry
group, tests products for interoperability and in 2018 introduced generation numbers.

| Standard | Name | Year | Bands | Max width | Top modulation | Max streams | Max link rate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 802.11 | | 1997 | 2.4 | 22 MHz | DSSS/FHSS | 1 | 2 Mbit/s |
| 802.11b | (Wi-Fi 1, unofficial) | 1999 | 2.4 | 22 MHz | CCK | 1 | 11 Mbit/s |
| 802.11a | (Wi-Fi 2) | 1999 | 5 | 20 MHz | 64-QAM OFDM | 1 | 54 Mbit/s |
| 802.11g | (Wi-Fi 3) | 2003 | 2.4 | 20 MHz | 64-QAM OFDM | 1 | 54 Mbit/s |
| 802.11n | Wi-Fi 4 | 2009 | 2.4, 5 | 40 MHz | 64-QAM | 4 | 600 Mbit/s |
| 802.11ac | Wi-Fi 5 | 2013 | 5 | 160 MHz | 256-QAM | 8 | 6.9 Gbit/s |
| 802.11ax | Wi-Fi 6 / 6E | 2019–2021 | 2.4, 5, (6) | 160 MHz | 1024-QAM | 8 | 9.6 Gbit/s |
| 802.11be | Wi-Fi 7 | 2024 | 2.4, 5, 6 | 320 MHz | 4096-QAM | 16 | 46 Gbit/s |

The maximum link rates assume every stream and the widest channel; real devices use a fraction (Chapter 4).

## 8.2 What each generation added

**802.11b and g** made Wi-Fi a consumer product. 802.11g brought OFDM to 2.4 GHz, with "protection" mechanisms so that
old 11b devices could still coexist, at a large cost in airtime.

**Wi-Fi 4 (802.11n)**: MIMO with up to 4 spatial streams, 40 MHz channels, frame aggregation (A-MPDU) and block ACK,
short guard interval. The leap from 54 to hundreds of Mbit/s.

**Wi-Fi 5 (802.11ac)**: 5 GHz only; 80 and 160 MHz channels; 256-QAM; standardised explicit beamforming; downlink
MU-MIMO (in "wave 2" products).

**Wi-Fi 6 (802.11ax, "High Efficiency")**: focused on busy networks rather than peak speed:

- OFDMA, with uplink and downlink scheduled by the AP (Chapter 5);
- uplink MU-MIMO;
- 1024-QAM; four times longer OFDM symbols for outdoor robustness;
- **BSS colouring**: a colour number in each frame lets a device ignore distant transmissions from a neighbouring
  network on the same channel and transmit anyway (**spatial reuse**), instead of always deferring;
- target wake time for battery devices;
- WPA3 required for certification.

**Wi-Fi 6E**: the same, extended to the **6 GHz** band (Chapter 1): up to 1,200 MHz of clean spectrum with no legacy
devices, room for several 160 MHz channels.

**Wi-Fi 7 (802.11be, "Extremely High Throughput")**:

- 320 MHz channels in 6 GHz;
- 4096-QAM;
- **multi-link operation (MLO)**: one device connects on several bands at once (say 5 and 6 GHz) and sends on
  whichever is free, or on both, lowering latency and raising reliability;
- multi-RU and **preamble puncturing**: use a wide channel even when a 20 MHz slice of it is busy;
- up to 16 spatial streams (in the standard; products have 2–4 per band).

## 8.3 Which features matter

For a home or office in 2026:

- **6 GHz** (6E/7) matters most where neighbours crowd 2.4 and 5 GHz (flats, offices): clean channels and wide
  bandwidth. Range is shorter, so it suits rooms near an AP.
- **MLO** helps latency-sensitive uses (calls, games, VR) more than speed tests.
- **OFDMA and TWT** help networks with many devices, especially IoT.
- **4096-QAM** and **320 MHz** help only close to the AP with little interference.
- Your slowest link usually isn't Wi-Fi at all but the internet connection, unless it is above about 500 Mbit/s.

## 8.4 Backward compatibility

Every generation can talk to older devices on the same band, using older frame formats when needed. Old devices cost
airtime: an 802.11b device at 1 Mbit/s once slowed everyone. Disabling the oldest rates (raising the "minimum basic
rate") is one of the most effective tuning steps (Chapter 9).

## 8.5 What comes next: Wi-Fi 8

**802.11bn, "Ultra High Reliability"** (expected around 2028), aims not at more peak speed but at more consistent
performance: **coordination between access points** (coordinated scheduling, spatial reuse and beamforming among
neighbouring APs), seamless roaming across APs as one "mobility domain", better operation at the edge of coverage and
lower tail latency. Other amendments add Wi-Fi sensing (802.11bf: detecting motion and presence from channel changes)
and better location (802.11az).

## Check yourself

??? question "1. Which generation introduced MIMO, and which introduced OFDMA?"
    MIMO: Wi-Fi 4 (802.11n). OFDMA: Wi-Fi 6 (802.11ax).

??? question "2. What does BSS colouring allow?"
    Recognising frames from a neighbouring network by their colour, so a device can transmit over a weak distant transmission on the same channel (spatial reuse) instead of always deferring.

??? question "3. What is multi-link operation?"
    A Wi-Fi 7 device maintaining links on several bands at once, sending on whichever is free or on both, for lower latency and better reliability.

??? info "Sources"
    - IEEE 802.11-2020; 802.11ax-2021; 802.11be-2024; 802.11bn project authorisation (PAR) and task group documents.
    - Wi-Fi Alliance, "Wi-Fi 6", "Wi-Fi 6E" and "Wi-Fi 7" certification overviews (wi-fi.org).
    - E. Khorov et al., "Current Status and Directions of IEEE 802.11be", *IEEE Wireless Comm.*, 2020.
