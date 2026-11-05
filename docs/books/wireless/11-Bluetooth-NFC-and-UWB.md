# 11. Bluetooth, NFC and UWB

*Short-range radios connect the devices around you: headphones and watches over Bluetooth, payment cards and phones over NFC, and precise finding over ultra-wideband. This chapter explains how each works and how each is secured.*

!!! abstract "In this chapter"
    **You will learn:** Bluetooth Classic and Bluetooth Low Energy; piconets, advertising and connections; GATT;
    LE Audio and Auracast; pairing and its security levels; Bluetooth attacks; NFC and contactless payments; UWB ranging
    and its uses.

    **You need:** [Chapters 1, 4 and 7](04-Modulation-and-Coding.md).

## 11.1 Bluetooth Classic

Bluetooth was created by Ericsson in 1994 as a cable replacement and is maintained by the **Bluetooth SIG**. **Classic**
Bluetooth (BR/EDR):

- 2.4 GHz, **79 channels** of 1 MHz, **frequency hopping** 1,600 times a second, with adaptive hopping to avoid busy
  Wi-Fi channels (Chapter 4).
- GFSK at 1 Mbit/s; π/4-DQPSK and 8DPSK in "Enhanced Data Rate" for 2 and 3 Mbit/s.
- A **piconet**: one central device and up to seven active peripherals, which follow the central's hopping sequence and
  clock.
- **Profiles** define uses: A2DP for stereo audio, HFP for calls, HID for keyboards.

## 11.2 Bluetooth Low Energy

**BLE** (Bluetooth 4.0, 2010) is a different, much simpler radio designed to run for months or years on a coin cell:

- **40 channels** of 2 MHz: 3 **advertising** channels (37, 38, 39, chosen to avoid the three common Wi-Fi channels) and
  37 data channels.
- **Advertising**: a device broadcasts short packets (up to 31 bytes in legacy mode) a few times a second; scanners
  listen. Beacons, trackers and "find my" networks work entirely by advertising.
- **Connections**: two devices agree a **connection interval** (7.5 ms to 4 s) and wake only at those instants, hopping
  channel each time.
- **GATT** (Generic Attribute Profile): data is organised as services and characteristics with numeric IDs (heart
  rate measurement, battery level); a phone reads, writes or subscribes to them.
- PHYs: 1 Mbit/s, 2 Mbit/s (Bluetooth 5), and **coded PHY** (125 or 500 kbit/s with FEC) for about four times the range.

Bluetooth 5.x added longer advertising, **direction finding** (angle of arrival and departure using antenna arrays),
and 6.0 (2024) **channel sounding**, which measures distance to centimetres using phase and round-trip timing.

## 11.3 LE Audio and Auracast

**LE Audio** (2022) moves audio onto BLE with the **LC3** codec (better quality at lower bitrates than the old SBC),
supports hearing aids natively, and allows **Auracast** broadcast: one transmitter (a TV, a gate announcement, a cinema)
streams to unlimited listeners nearby, like a radio station people can tune into with their earbuds.

## 11.4 Pairing and security

Pairing creates a shared key. Modern **LE Secure Connections** (Bluetooth 4.2+) uses elliptic-curve Diffie-Hellman
(P-256), with an association model chosen by what the devices can display or input:

| Model | How the user takes part | Protection against a man in the middle |
| --- | --- | --- |
| Numeric comparison | confirm the same 6-digit number on both screens | yes |
| Passkey entry | type a 6-digit number shown on one device into the other | yes |
| Out of band | exchange data over NFC or a QR code | yes, if that channel is safe |
| Just Works | nothing (headphones with no screen) | **no** |

Bonded devices store the key for later. To limit tracking, BLE devices use **resolvable private addresses** that
change every few minutes; only bonded peers can resolve them.

Attacks have included **KNOB** (2019, forcing a 1-byte encryption key on Classic connections), **BIAS** (2020,
impersonating a previously bonded device) and many implementation bugs (BlueBorne, 2017; BrakTooth, 2021). Defences:
keep firmware updated, turn off discoverability when not pairing, and prefer devices supporting Secure Connections Only
mode.

## 11.5 NFC

**Near Field Communication** works at **13.56 MHz** by magnetic coupling between two coil antennas, over about 4 cm.
The reader's field also *powers* passive tags and cards, which need no battery. Rates are 106–424 kbit/s.

Modes: **reader/writer** (phone reads a tag or poster), **peer-to-peer**, and **card emulation** (phone acts as a
contactless card). Standards: ISO/IEC 14443 (contactless cards), ISO/IEC 18092 and NFC Forum specifications.

**Contactless payment** (EMV): the card or phone produces a one-time **cryptogram** for each payment from a key in its
secure element and transaction data, so a captured exchange cannot be replayed. Phone wallets use **tokenisation**: the
merchant sees a device-specific token, not the real card number, and payment needs the owner's fingerprint, face or
code. The very short range is itself a security feature, though **relay attacks** (extending the range with two radios)
have been shown in research; transaction limits and distance-bounding checks reduce the risk.

## 11.6 UWB

**Ultra-wideband** (IEEE 802.15.4z, about 6–9 GHz) sends very short pulses (about 2 ns) spread over 500 MHz or more,
at very low power density. Short pulses make timing precise: measuring the round-trip time of a pulse gives distance to
about 10 cm, and arrays give direction. UWB measures **time of flight**, which, unlike signal strength, an attacker
cannot shorten by amplifying, so it resists relay attacks.

Uses: phones finding tags precisely, digital car keys (the CCC Digital Key 3.0 standard uses UWB so a car unlocks only
when the phone is really next to it), building access, and indoor positioning. Bluetooth 6.0 channel sounding competes
for some of these uses.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 370" role="img" aria-labelledby="sk-nw-uwb-t"><title id="sk-nw-uwb-t">A phone sends very short pulses to a car and times the answer; the round-trip time gives the distance to about 10 centimetres</title><defs><filter id="sk-nw-uwb-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-uwb-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-uwb-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-uwb-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-uwb-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="370" filter="url(#sk-nw-uwb-paper)"/><g filter="url(#sk-nw-uwb-pen)"><text x="30" y="44" class="h">Distance from time, not loudness</text><path class="p room" d="M40 160 L110 160 L110 270 L40 270Z"/><text x="75.0" y="221.0" text-anchor="middle" class="s">phone</text><path class="p room" d="M420 180 Q440 140 520 140 L580 140 Q610 150 610 190 L610 250 L420 250Z"/><text x="515" y="210" text-anchor="middle" class="s">car</text><path class="p red" d="M160 215 L166 215 L169 185 L172 245 L175 215 L190 215"/><path class="p red" d="M220 215 L226 215 L229 185 L232 245 L235 215 L250 215"/><path class="p red" d="M280 215 L286 215 L289 185 L292 245 L295 215 L310 215"/><path class="p red" d="M340 215 L346 215 L349 185 L352 245 L355 215 L370 215"/><path class="p " d="M112 200 L416 200" marker-end="url(#sk-nw-uwb-ah)"/><path class="p dash" d="M416 230 L112 230" marker-end="url(#sk-nw-uwb-ah)"/><text x="140" y="140" class="s">a pulse about 2 nanoseconds long</text><text x="140" y="290" class="s">answer comes back</text><text x="40" y="330" class="s">distance = speed of light × round-trip time ÷ 2. Light covers 30 cm in a nanosecond,</text><text x="40" y="350" class="s">so precise timing gives about 10 cm. A relay can only add time, never remove it.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## Check yourself

??? question "1. Why are BLE's three advertising channels placed where they are?"
    They sit in the gaps between and around Wi-Fi channels 1, 6 and 11, so advertising suffers less interference.

??? question "2. Which pairing model gives no protection against a man in the middle, and why is it used?"
    Just Works: devices without a screen or keyboard (like headphones) cannot show or enter a code.

??? question "3. Why does UWB resist relay attacks better than signal-strength ranging?"
    It measures time of flight; an attacker can amplify a signal but cannot make it arrive sooner than light allows.

??? info "Sources"
    - Bluetooth SIG, *Core Specification* 5.4 and 6.0 (2024); *LE Audio* and *Auracast* specifications.
    - D. Antonioli, N. Tippenhauer, K. Rasmussen, "The KNOB is Broken", USENIX Security 2019; "BIAS", IEEE S&P 2020.
    - ISO/IEC 14443, ISO/IEC 18092; EMVCo, *Contactless Specifications*; IEEE 802.15.4z-2020; Car Connectivity Consortium, *Digital Key Release 3.0*.
