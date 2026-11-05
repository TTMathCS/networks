# 6. Ethernet and switches

*Ethernet, invented at Xerox PARC in 1973, is the link layer of almost every wired network and the model for Wi-Fi. This chapter covers MAC addresses, the Ethernet frame, how a switch learns where every host is, and the speeds from 10 Mbit/s to 800 Gbit/s.*

!!! abstract "In this chapter"
    **You will learn:** the 48-bit MAC address and its parts; the Ethernet II frame field by field; how a learning
    switch fills its table and floods unknowns; hubs versus switches; full duplex; switch architectures; Power over Ethernet.

    **You need:** [Chapter 5](05-Framing-and-Error-Detection.md).

## 6.1 MAC addresses

Every Ethernet or Wi-Fi interface has a 48-bit **MAC address**, written as six bytes in hex: `3c:22:fb:9a:10:4e`.

- The first three bytes are the **OUI** (organisationally unique identifier), bought by the maker from the IEEE.
- The lowest bit of the first byte is the **individual/group** bit: 1 means a multicast address.
- The next bit is the **universal/local** bit: 1 means the address was set locally, not burned in by the maker.
- `ff:ff:ff:ff:ff:ff` is **broadcast**: every station on the link receives it.

Phones now use **randomised MAC addresses** for each Wi-Fi network (with the local bit set) so that shops and
airports cannot track a device by its address.

## 6.2 The frame

An Ethernet II frame, as it appears on the wire:

| Field | Bytes | Purpose |
| --- | --- | --- |
| Preamble + start-of-frame | 7 + 1 | lets the receiver lock its clock (Chapter 5) |
| Destination MAC | 6 | first, so a switch can start forwarding early |
| Source MAC | 6 | the sender |
| EtherType | 2 | what is inside: `0x0800` IPv4, `0x86DD` IPv6, `0x0806` ARP, `0x8100` a VLAN tag |
| Payload | 46–1500 | padded to 46 so every frame is at least 64 bytes |
| Frame check sequence | 4 | CRC-32 over the frame |

The 64-byte minimum came from CSMA/CD: a frame had to last long enough that a sender would still be transmitting when
news of a collision came back from the far end of a 2.5 km network. Between frames there is a gap of 12 byte-times.
Many data-centre links allow **jumbo frames** of about 9,000 bytes to cut per-packet overhead.

## 6.3 Hubs and switches

Early Ethernet was one shared coaxial cable, then a **hub**: a box that repeats every bit to every port. All hosts
were in one **collision domain** and shared its bandwidth.

A **switch** (a multi-port bridge) instead receives each frame, looks at the destination MAC address, and sends it only
out of the right port. Every port is its own collision domain, and modern ports are **full duplex** (send and receive at
once on separate pairs or fibres), so collisions are gone and CSMA/CD is switched off. A 48-port gigabit switch can move
48 Gbit/s each way at once if its internal fabric is fast enough (**non-blocking**).

## 6.4 How a switch learns

A switch is plug-and-play: no one configures where hosts are. It keeps a **MAC address table** (forwarding table) of
(MAC address, port, age) entries and follows three rules for each frame arriving on port $p$:

1. **Learn:** record that the *source* MAC is reachable through port $p$ (refreshing the entry's timer).
2. **Forward:** if the *destination* MAC is in the table on port $q \ne p$, send the frame out of port $q$ only. If
   $q = p$, drop it (the destination is on the same side).
3. **Flood:** if the destination is unknown, broadcast or multicast, send it out of every port except $p$.

Entries expire after a few minutes (300 s by default), so the table follows hosts that move.

**Example.** A switch with empty table: A (port 1) sends to B. The switch learns A→1, floods to ports 2–4. B (port 3)
replies to A: the switch learns B→3 and forwards only to port 1. From now on A and B talk privately, and the other ports
see nothing.

This table is also an attack surface: flooding a switch with frames from millions of fake source addresses fills it,
and the switch starts flooding everything like a hub ([Security, chapter 5](../security/05-Attacks-on-the-Local-Network.md)).

## 6.5 Cut-through and store-and-forward

A **store-and-forward** switch receives the whole frame and checks its CRC before sending it on; bad frames die here.
A **cut-through** switch starts sending as soon as it has read the destination address, saving a few microseconds per
hop, which matters in trading networks and some data centres, at the price of passing on corrupted frames (the next
device drops them).

## 6.6 Inside a switch

At line rate, a 64-byte frame on a 100 Gbit/s port arrives every 6.7 ns. Lookups are done in hardware: MAC tables in
hashed SRAM, and for routers, IP prefixes in **TCAM** (ternary content-addressable memory, which matches all entries in
parallel). Frames wait in shared buffer memory; when an output is oversubscribed, buffers fill and frames are dropped.
A single switch chip in 2025 offered 51.2 Tbit/s (for example 64 ports of 800 Gbit/s).

## 6.7 Speeds and names

| Name | Speed | Typical medium | Year |
| --- | --- | --- | --- |
| 10BASE-T | 10 Mbit/s | twisted pair | 1990 |
| 100BASE-TX (Fast Ethernet) | 100 Mbit/s | Cat 5 | 1995 |
| 1000BASE-T (Gigabit) | 1 Gbit/s | Cat 5e | 1999 |
| 2.5/5GBASE-T | 2.5 or 5 Gbit/s | Cat 5e/6, for Wi-Fi access points | 2016 |
| 10GBASE-T, 10GBASE-SR/LR | 10 Gbit/s | Cat 6A, fibre | 2002–2006 |
| 100GBASE-SR4 / LR4 | 100 Gbit/s | parallel or WDM fibre | 2010 |
| 400GBASE, 800GBASE | 400–800 Gbit/s | fibre, PAM4 lanes | 2017–2024 |
| 1.6TBASE (IEEE 802.3dj) | 1.6 Tbit/s | fibre, 200 Gbit/s lanes | being finished |

In a name like 1000BASE-T, "BASE" means baseband (one signal on the medium) and the suffix the medium: T twisted pair,
SR short-reach multimode fibre, LR long-reach single-mode.

Two ports on the same link agree speed and duplex by **auto-negotiation**. A classic fault is a **duplex mismatch**
(one side fixed at full duplex, the other negotiating half): the link works but is very slow, with many errors.

## 6.8 Power over Ethernet

**PoE** (IEEE 802.3af, at, bt) sends DC power over the same twisted pairs as the data: up to about 15 W, 30 W, or 60–90 W
per port. Wi-Fi access points, security cameras, phones and even lights run from one cable to a PoE switch.

## Check yourself

??? question "1. A switch's table is empty. Host A (port 2) sends a frame to host C. What happens?"
    The switch learns A→port 2 and floods the frame out of every other port, since C is unknown.

??? question "2. Why must an Ethernet payload be at least 46 bytes?"
    The frame must be at least 64 bytes so that, on classic shared Ethernet, a sender is still transmitting when a collision at the far end could be detected. Short payloads are padded.

??? question "3. What does the EtherType 0x86DD mean?"
    The payload is an IPv6 packet.

??? info "Sources"
    - R. Metcalfe and D. Boggs, "Ethernet: Distributed Packet Switching for Local Computer Networks", *CACM*, 1976.
    - IEEE 802.3-2022 (Ethernet), IEEE 802.1Q-2022 (bridges), IEEE 802.3bt (PoE), IEEE 802.3dj (in progress, 2026).
    - IEEE Registration Authority (OUIs); Broadcom Tomahawk 5 product brief (51.2 Tbit/s, 2022).
