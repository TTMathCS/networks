# 12. IoT radios

*Sensors, smart plugs, water meters and trackers need radios that run for years on a battery. They trade speed for power and range. This chapter covers the main families: IEEE 802.15.4 with Zigbee and Thread, the Matter standard, LoRaWAN, and cellular IoT (LTE-M and NB-IoT).*

!!! abstract "In this chapter"
    **You will learn:** the IoT trade-off between rate, range and power; 802.15.4 and mesh; Zigbee; Thread and
    6LoWPAN; Matter; LoRa and LoRaWAN; Sigfox; LTE-M and NB-IoT; choosing a radio; securing IoT devices.

    **You need:** [Chapters 2 and 4](02-Antennas-and-Link-Budgets.md); IPv6 ([networks book, chapter 10](../networks/10-IPv6.md)).

## 12.1 The trade-off

Battery life depends on how long the radio is on and how hard it transmits. The usual levers:

- send rarely and little (a temperature every 10 minutes is a few bytes);
- sleep almost always, waking on a schedule;
- trade rate for range: a lower rate needs less S/N, so it reaches farther at the same power (Chapter 2).

| Radio | Range | Rate | Battery life | Network |
| --- | --- | --- | --- | --- |
| BLE | 10–100 m | 0.1–2 Mbit/s | months to years | phone or hub |
| Zigbee, Thread (802.15.4) | 10–30 m per hop, mesh | 250 kbit/s | years | mesh to a hub or border router |
| Wi-Fi (with TWT) | 30 m | high | weeks to months (newer: longer) | existing AP |
| LoRaWAN | 2–15 km | 0.3–50 kbit/s | 5–10 years | gateways |
| LTE-M / NB-IoT | cellular coverage | 1 Mbit/s / tens of kbit/s | up to about 10 years | mobile operator |

## 12.2 IEEE 802.15.4

**802.15.4** defines a simple low-power radio, mostly at 2.4 GHz with 16 channels of 2 MHz (O-QPSK, 250 kbit/s,
frames of at most 127 bytes), and a MAC with CSMA/CA. Zigbee, Thread and several industrial protocols build on it.
Devices can be **routers** (mains-powered, always listening, relaying for others) or **end devices** (battery, sleeping,
attached to a parent router), forming a **mesh** that routes round obstacles and failures.

## 12.3 Zigbee

**Zigbee** (Connectivity Standards Alliance) adds network and application layers to 802.15.4: a coordinator, mesh
routing, and "clusters" describing device functions (on/off, level, temperature). It has been widely used in smart
lighting and sensors. It is not IP-based: a hub translates to the home network.

## 12.4 Thread

**Thread** (2014) runs **IPv6** over 802.15.4 using **6LoWPAN** (RFC 4944, RFC 6282), which compresses the 40-byte IPv6
header to a few bytes and fragments packets into 127-byte frames. Every device has an IPv6 address; **border routers**
(often a smart speaker or TV box) connect the Thread mesh to Wi-Fi and Ethernet. The mesh elects leaders and routers
automatically, has no single point of failure, and uses AES-CCM at the link layer with network keys commissioned
securely.

## 12.5 Matter

**Matter** (2022, CSA, backed by Apple, Google, Amazon, Samsung and others) is an **application** standard, not a radio:
a common data model and security framework for smart-home devices over IP, carried on Thread, Wi-Fi or Ethernet, with BLE
used only for setup. A Matter device works with every major ecosystem, and can belong to several at once
("multi-admin"). Security: each device has a certificate from its maker (device attestation), commissioning uses a
setup code (the QR code) with a password-authenticated key exchange (SPAKE2+), and all traffic is encrypted.

## 12.6 LoRa and LoRaWAN

**LoRa** is a physical layer using **chirp spread spectrum** (Chapter 4) in sub-GHz unlicensed bands (868 MHz in Europe,
915 MHz in North America). Its **spreading factor** SF7–SF12 trades rate for range: each step up doubles the time per
symbol and gains about 2.5 dB of sensitivity, down to about −137 dBm, decoding signals well below the noise floor.

**LoRaWAN** is the network: devices broadcast to any gateways in range (star of stars), gateways forward to a network
server, which removes duplicates and passes data to applications. Class A devices sleep and only listen briefly after
sending. Regional rules limit **duty cycle** (often 1% in Europe: 36 seconds of transmission per hour), which suits
meters, agriculture, tracking and city sensors sending tens of bytes per hour. Security: AES-128 with separate network
and application session keys.

**Sigfox** was a similar operator-run ultra-narrowband network (100 Hz signals, 12-byte messages); after financial
difficulties in 2022 it continues under new ownership (UnaBiz) with a smaller footprint.

## 12.7 Cellular IoT

Mobile operators offer two 3GPP technologies in licensed spectrum, with operator-grade coverage and roaming:

- **LTE-M** (Cat-M1): 1.4 MHz channels, up to about 1 Mbit/s, supports mobility and voice: trackers, wearables, alarm
  panels.
- **NB-IoT**: 180 kHz, tens of kbit/s, deep indoor penetration (about 20 dB better coverage than normal LTE): meters in
  basements.

Both use **power saving mode** (sleep for days while staying registered) and **eDRX** (listen rarely). 5G calls them
**massive machine-type communication**; 5G **RedCap** (Release 17) adds mid-speed devices such as watches and
industrial sensors.

## 12.8 Choosing and securing

Pick by data size and frequency, range, power source, who runs the network, and cost: a home sensor → Thread/Matter or
Zigbee; a field sensor 5 km away → LoRaWAN; a tracker on a lorry → LTE-M.

IoT devices are frequent security failures: default passwords, no updates, unencrypted protocols. The Mirai botnet
(2016) took over hundreds of thousands of cameras and routers using a short list of default passwords and used them
for record denial-of-service attacks ([Security, chapter 13](../security/13-Denial-of-Service.md)). Basics: unique
credentials, signed updates, encrypted traffic, a separate network segment, and buying devices with a stated support
period; rules such as the UK's PSTI Act (2024) and the EU Cyber Resilience Act now require many of these.

## Check yourself

??? question "1. Why does a lower data rate give longer range at the same power?"
    Each bit gets more energy (longer symbols, more spreading), so the receiver needs less S/N and can decode weaker signals.

??? question "2. What does 6LoWPAN do?"
    Compresses IPv6 headers and fragments packets so IPv6 fits in 127-byte 802.15.4 frames.

??? question "3. Is Matter a radio?"
    No: it is an application-layer standard over IP, running on Thread, Wi-Fi or Ethernet (BLE for setup).

??? info "Sources"
    - IEEE 802.15.4-2020; Thread Group, *Thread 1.3 Specification*; RFC 4944 and RFC 6282 (6LoWPAN).
    - Connectivity Standards Alliance, *Matter 1.x Core Specification*; *Zigbee PRO* specification.
    - LoRa Alliance, *LoRaWAN L2 1.0.4 Specification* and *Regional Parameters*; Semtech LoRa SX126x datasheet (sensitivity).
    - 3GPP Releases 13–17 (LTE-M, NB-IoT, RedCap); M. Antonakakis et al., "Understanding the Mirai Botnet", USENIX Security 2017.
