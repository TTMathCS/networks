# 7. How Wi-Fi works

*Wi-Fi is IEEE 802.11: a link layer for radio that looks like Ethernet to everything above it. This chapter explains the parts of a Wi-Fi network, how a device finds and joins one, how stations share the air with CSMA/CA, the 802.11 frame and its three addresses, and power saving.*

!!! abstract "In this chapter"
    **You will learn:** stations, access points, BSS and ESS, SSID and BSSID; beacons, probing, authentication and
    association; CSMA/CA, backoff, ACKs and inter-frame spaces; hidden terminals and RTS/CTS; the 802.11 frame and its
    address fields; aggregation; power save and target wake time.

    **You need:** [Networks book, chapters 5–6](../networks/06-Ethernet-and-Switches.md).

## 7.1 The parts

- A **station (STA)**: any Wi-Fi device.
- An **access point (AP)**: a station that bridges wireless clients to the wired network.
- A **basic service set (BSS)**: one AP and its clients, on one channel, identified by the AP radio's MAC address, the
  **BSSID**.
- An **extended service set (ESS)**: several APs sharing one network name, the **SSID** ("HomeNet"), joined by a wired
  (or mesh) **distribution system**, so clients can roam between them.

An AP usually runs separate BSSes on each band (2.4, 5, 6 GHz), and can host several SSIDs (main, guest, IoT) on one
radio, each with its own BSSID.

## 7.2 Finding and joining a network

1. **Discovery**: APs broadcast **beacons** about ten times a second (every 102.4 ms), carrying the SSID, supported
   rates, security settings and capabilities. Clients listen (**passive scan**) or send **probe requests** and get probe
   responses (**active scan**). The list on your phone is built from these.
2. **Authentication** (802.11 "open system"): a formality in modern Wi-Fi; real authentication comes later. With WPA3,
   this step carries the SAE password exchange (Chapter 10).
3. **Association**: the client requests to join, stating capabilities; the AP replies with an association ID.
4. **Key handshake**: for protected networks, the 4-way handshake (or 802.1X first, in enterprises) derives encryption
   keys (Chapter 10).
5. **DHCP** gives the device an IP address (networks book, Chapter 9). Now it can send data.

## 7.3 Sharing the air: CSMA/CA

A radio cannot listen while it transmits (its own signal drowns everything), so Wi-Fi cannot detect collisions as wired
Ethernet did. It **avoids** them, with the **distributed coordination function**:

1. Before sending, sense the channel (**clear channel assessment**). If idle for a waiting time called **DIFS**
   (34 µs at 5 GHz), continue.
2. Pick a random **backoff** of $0$ to $CW$ slots (9 µs each), with the **contention window** $CW$ starting at 15.
   Count down only while the channel is idle; freeze while it is busy.
3. At zero, transmit the frame.
4. The receiver waits a short **SIFS** (16 µs) and returns an **ACK**. No ACK? Assume a collision or error, double $CW$
   (up to 1023), and retry.

The short SIFS before ACKs (shorter than DIFS) means an ACK always wins the channel over a new frame. Random backoff
makes simultaneous starts rare; doubling the window after failures backs off under heavy load, like Ethernet's
exponential backoff.

**EDCA** (from 802.11e, used by Wi-Fi Multimedia) gives four access categories (voice, video, best effort, background)
their own shorter or longer waits and windows, so voice frames statistically go first.

<figure class="play" data-play="csma"><span class="ai-tag">AI-created</span><figcaption><b>Watch it.</b> Three stations, two frames each, sharing the air with random backoff: counts freeze while someone sends, and a collision doubles the window. The backoffs are random and the timings scaled.</figcaption></figure>

## 7.4 Hidden terminals

Two laptops A and C on opposite sides of an AP B may each hear B but not each other. Both sense an idle channel and send
at once; their frames collide at B. This is the **hidden terminal** problem.

**RTS/CTS**: before a long frame, A sends a short *request to send*; B answers *clear to send*, which C hears; C then
stays silent for the duration stated in it. Every frame also carries a **duration** field that sets listeners'
**network allocation vector (NAV)**: a "virtual carrier sense" timer. RTS/CTS costs airtime, so it is used selectively.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 400" role="img" aria-labelledby="sk-nw-hidden-t"><title id="sk-nw-hidden-t">Laptops A and C each reach router B but sit outside each other's range, so both send at once and collide at B</title><defs><filter id="sk-nw-hidden-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-hidden-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-hidden-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-hidden-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-hidden-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="400" filter="url(#sk-nw-hidden-paper)"/><g filter="url(#sk-nw-hidden-pen)"><text x="30" y="44" class="h">Both hear the router, not each other</text><circle cx="190" cy="200" r="130" class="p dash"/><circle cx="450" cy="200" r="130" class="p dash"/><circle cx="190" cy="200" r="22" class="p room"/><text x="190" y="207" text-anchor="middle" class="l">A</text><circle cx="320" cy="200" r="22" class="p gold"/><text x="320" y="207" text-anchor="middle" class="l">B</text><circle cx="450" cy="200" r="22" class="p room"/><text x="450" y="207" text-anchor="middle" class="l">C</text><path class="p red" d="M308 168 L332 192 M332 168 L308 192" transform="translate(0,-30)"/><text x="320" y="122" text-anchor="middle" class="s">collision</text><text x="60" y="80" class="s">A's reach</text><text x="520" y="80" class="s">C's reach</text><text x="320" y="250" text-anchor="middle" class="s">router</text><text x="30" y="365" class="s">Fix: A asks “ready to send?”, the router answers “clear to send” for all to hear,</text><text x="30" y="385" class="s">and C waits for the time stated in it.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## 7.5 The 802.11 frame

| Field | Bytes | Purpose |
| --- | --- | --- |
| Frame control | 2 | type (management, control, data), subtype, flags: to/from DS, retry, power, protected |
| Duration | 2 | NAV time in µs |
| Address 1 | 6 | receiver on this hop |
| Address 2 | 6 | transmitter on this hop |
| Address 3 | 6 | the other end (or BSSID) |
| Sequence control | 2 | for duplicate detection and fragments |
| (Address 4) | 6 | only in wireless bridging (mesh, WDS) |
| QoS, HT control | 2 + 4 | priority, link adaptation |
| Body | 0–about 11,000 | encrypted payload |
| FCS | 4 | CRC-32 |

Why three addresses? A frame from your laptop to the router at `192.168.1.1` crosses the radio to the AP, then the wire.
Address 1 is the AP's BSSID (the radio receiver), address 2 is your laptop, address 3 is the final destination's MAC
address. The AP rewrites it into an ordinary Ethernet frame. Management frames (beacons, probes, association) and control
frames (ACK, RTS, CTS, block ACK) are other types; protected management frames (802.11w, required in WPA3) stop forged
"deauthentication" frames from kicking clients off.

## 7.6 Overheads and aggregation

Each frame pays a fixed cost: DIFS, backoff, a physical-layer preamble of tens of microseconds, SIFS, ACK. At high data
rates, sending a 1,500-byte packet takes only a few microseconds, so overheads would dominate. 802.11n added
**aggregation**: an **A-MPDU** packs up to 64 frames (256 in Wi-Fi 6, 1024 in Wi-Fi 7) into one transmission, with one
**block ACK** saying which arrived. This is why Wi-Fi throughput is typically 60–70% of the link rate, not 20%.

## 7.7 Power saving

Phones save battery by sleeping their radio:

- **Legacy power save**: the client tells the AP it is sleeping; the AP buffers frames and lists waiting clients in a
  map in each beacon (**TIM**); the client wakes for beacons every few intervals and fetches its data.
- **Target wake time (TWT)** (Wi-Fi 6): client and AP agree on a schedule of wake-ups, letting sensors sleep for seconds
  or hours, and reducing contention by spreading clients in time.

## Check yourself

??? question "1. Why does Wi-Fi need an ACK for every unicast frame (or block)?"
    A sender cannot detect collisions or radio errors while transmitting; the ACK is its only evidence that the frame arrived.

??? question "2. A and C cannot hear each other but both reach the AP. What goes wrong, and what helps?"
    Hidden terminals: they transmit at the same time and collide at the AP. RTS/CTS (and the NAV) makes C wait when the AP grants A the channel.

??? question "3. In a frame from a laptop to its default gateway, what are addresses 1, 2 and 3?"
    1: the AP's BSSID (receiver on the radio hop); 2: the laptop (transmitter); 3: the gateway's MAC address (final destination).

??? info "Sources"
    - IEEE 802.11-2020 (MAC: clauses 9–11), 802.11ax-2021 (TWT, OFDMA), 802.11w (protected management frames).
    - M. Gast, *802.11 Wireless Networks: The Definitive Guide*, 2nd ed., O'Reilly, 2005; *802.11ac: A Survival Guide*, 2013.
    - G. Bianchi, "Performance Analysis of the IEEE 802.11 Distributed Coordination Function", *IEEE JSAC*, 2000.
