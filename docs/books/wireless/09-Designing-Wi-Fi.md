# 9. Designing Wi-Fi

*A good Wi-Fi network is mostly planning: enough access points in the right places, sensible channels and power, and settings that keep slow devices from wasting airtime. This chapter covers airtime, capacity planning, channel and power plans, site surveys, roaming, mesh, and the most common mistakes.*

!!! abstract "In this chapter"
    **You will learn:** why airtime, not signal strength, limits Wi-Fi; designing for capacity; channel reuse and
    co-channel contention; transmit power balance; site surveys and heat maps; roaming with 802.11k/v/r; mesh and
    wired backhaul; common mistakes.

    **You need:** [Chapters 2, 3, 7 and 8](07-How-Wi-Fi-Works.md).

## 9.1 Airtime is the resource

All devices on one channel (in range of each other) share its **airtime**: only one transmits at a time (apart from
OFDMA and MU-MIMO). Throughput per device is roughly airtime share × the rate it can use. A client far away at
MCS 0 needs ten times the airtime of a close client at a high MCS for the same data, slowing everyone: the **802.11
performance anomaly** (Heusse and others, 2003). Fixes: airtime fairness scheduling in the AP, more APs so clients stay
close, and disabling the lowest data rates so that distant clients roam instead of clinging.

## 9.2 Design for capacity, not just coverage

Old designs asked "does the signal reach every room?" Modern designs ask "can every room carry its load?"

1. **Count devices and uses**: per area, how many phones, laptops, cameras, TVs; what applications (a 4K stream needs
   about 25 Mbit/s, a video call 2–4 Mbit/s each way).
2. **Estimate per-AP capacity**: a realistic 80 MHz Wi-Fi 6 AP might deliver a few hundred Mbit/s aggregate in a busy
   space, shared among its clients.
3. **Place APs** so each area is served by a nearby AP at a strong signal, typically **−65 dBm or better** for voice and
   video (−67 dBm is a common enterprise target), with S/N above about 25 dB.
4. **Choose channels** so neighbouring APs do not share one.

In practice: roughly one AP per 2–4 rooms in a house with thick walls; one per classroom in schools; dense ceilings of APs
in lecture halls and stadiums, with directional antennas.

## 9.3 Channels and reuse

APs on the same channel within hearing distance share airtime (**co-channel contention**), even if they belong to
different networks. So:

- **2.4 GHz**: only channels 1, 6 and 11 (in most countries) don't overlap. Use 20 MHz only. In dense buildings,
  consider turning 2.4 GHz off on some APs; it reaches too far and interferes with itself.
- **5 GHz**: about 25 channels of 20 MHz. Use 40 or 80 MHz in homes; 20 or 40 MHz in dense enterprises so there are
  enough channels to reuse. DFS channels add capacity but must vacate on radar detection.
- **6 GHz**: 59 channels of 20 MHz in the USA and Canada (24 in Europe); 80 or 160 MHz is practical.

Like colouring a map, assign channels so adjacent APs differ. Controllers and cloud-managed systems do this
automatically (**radio resource management**) but should be checked.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 340" role="img" aria-labelledby="sk-nw-channels-t"><title id="sk-nw-channels-t">Eleven overlapping 2.4 gigahertz channels, of which 1, 6 and 11 do not overlap; beside them a map of access points coloured so neighbours use different channels</title><defs><filter id="sk-nw-channels-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-channels-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-channels-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-channels-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-channels-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="340" filter="url(#sk-nw-channels-paper)"/><g filter="url(#sk-nw-channels-pen)"><text x="30" y="44" class="h">Only 1, 6 and 11 stay apart</text><path class="p" d="M40 200 L356.8 200"/><path class="p gold" d="M40.0 200 C40.0 100 128.0 100 128.0 200"/><text x="84.0" y="220" text-anchor="middle" class="s">1</text><path class="p dash" d="M62.0 200 C62.0 130 150.0 130 150.0 200" opacity=".5"/><text x="106.0" y="220" text-anchor="middle" class="s">2</text><path class="p dash" d="M84.0 200 C84.0 130 172.0 130 172.0 200" opacity=".5"/><text x="128.0" y="220" text-anchor="middle" class="s">3</text><path class="p dash" d="M106.0 200 C106.0 130 194.0 130 194.0 200" opacity=".5"/><text x="150.0" y="220" text-anchor="middle" class="s">4</text><path class="p dash" d="M128.0 200 C128.0 130 216.0 130 216.0 200" opacity=".5"/><text x="172.0" y="220" text-anchor="middle" class="s">5</text><path class="p gold" d="M150.0 200 C150.0 100 238.0 100 238.0 200"/><text x="194.0" y="220" text-anchor="middle" class="s">6</text><path class="p dash" d="M172.0 200 C172.0 130 260.0 130 260.0 200" opacity=".5"/><text x="216.0" y="220" text-anchor="middle" class="s">7</text><path class="p dash" d="M194.0 200 C194.0 130 282.0 130 282.0 200" opacity=".5"/><text x="238.0" y="220" text-anchor="middle" class="s">8</text><path class="p dash" d="M216.0 200 C216.0 130 304.0 130 304.0 200" opacity=".5"/><text x="260.0" y="220" text-anchor="middle" class="s">9</text><path class="p dash" d="M238.0 200 C238.0 130 326.0 130 326.0 200" opacity=".5"/><text x="282.0" y="220" text-anchor="middle" class="s">10</text><path class="p gold" d="M260.0 200 C260.0 100 348.0 100 348.0 200"/><text x="304.0" y="220" text-anchor="middle" class="s">11</text><text x="40" y="246" class="s">channels 5 MHz apart, each about 20 MHz wide</text><path class="p gold" d="M499.4 117.0 470.0 134.0 440.6 117.0 440.6 83.0 470.0 66.0 499.4 83.0Z"/><text x="470.0" y="106.0" text-anchor="middle" class="s">1</text><path class="p room" d="M558.3 117.0 528.9 134.0 499.4 117.0 499.4 83.0 528.9 66.0 558.3 83.0Z"/><text x="528.9" y="106.0" text-anchor="middle" class="s">6</text><path class="p rust" d="M617.2 117.0 587.8 134.0 558.3 117.0 558.3 83.0 587.8 66.0 617.2 83.0Z"/><text x="587.8" y="106.0" text-anchor="middle" class="s">11</text><path class="p rust" d="M528.9 168.0 499.4 185.0 470.0 168.0 470.0 134.0 499.4 117.0 528.9 134.0Z"/><text x="499.4" y="157.0" text-anchor="middle" class="s">11</text><path class="p gold" d="M587.8 168.0 558.3 185.0 528.9 168.0 528.9 134.0 558.3 117.0 587.8 134.0Z"/><text x="558.3" y="157.0" text-anchor="middle" class="s">1</text><path class="p room" d="M646.7 168.0 617.2 185.0 587.8 168.0 587.8 134.0 617.2 117.0 646.7 134.0Z"/><text x="617.2" y="157.0" text-anchor="middle" class="s">6</text><path class="p gold" d="M499.4 219.0 470.0 236.0 440.6 219.0 440.6 185.0 470.0 168.0 499.4 185.0Z"/><text x="470.0" y="208.0" text-anchor="middle" class="s">1</text><path class="p room" d="M558.3 219.0 528.9 236.0 499.4 219.0 499.4 185.0 528.9 168.0 558.3 185.0Z"/><text x="528.9" y="208.0" text-anchor="middle" class="s">6</text><path class="p rust" d="M617.2 219.0 587.8 236.0 558.3 219.0 558.3 185.0 587.8 168.0 617.2 185.0Z"/><text x="587.8" y="208.0" text-anchor="middle" class="s">11</text><text x="430" y="300" class="s">like colouring a map:</text><text x="430" y="320" class="s">neighbours differ</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## 9.4 Power: less is often more

Turning an AP's power to maximum seems helpful but backfires: the AP's signal reaches clients that cannot reach back
(phones transmit at 10–15 dBm, an AP at up to 20–30), it interferes with more neighbours, and clients stay attached to a
far AP instead of roaming. Match AP power to clients (often 10–17 dBm at 5 GHz) and add APs instead.

## 9.5 Surveys

A **site survey** measures what the plan predicted:

- **Predictive**: a floor plan with wall materials in planning software estimates coverage and capacity.
- **Passive**: walk the site with a laptop or phone app recording every AP's signal (RSSI), noise and channel, producing
  **heat maps**.
- **Active**: connect and measure throughput, loss and roaming along the walk.
- **Spectrum analysis**: looks for non-Wi-Fi interference (microwave ovens, cameras, radar).

Validate after installation and after furniture or wall changes. [Lab 13](../../labs/13-Surveying-Your-Wi-Fi.md) shows
how to do a simple survey of your own network with free tools.

## 9.6 Roaming

Clients, not APs, decide when to roam, usually when the signal drops below a threshold. Three amendments help:

- **802.11k** (radio measurement): the AP gives the client a list of neighbour APs, so it scans only those channels.
- **802.11v** (network management): the AP can suggest that a client move ("BSS transition management").
- **802.11r** (fast BSS transition): keys are derived ahead of time, so the security handshake on the new AP takes a
  few milliseconds instead of hundreds: important for voice calls on enterprise (802.1X) networks.

Enable all three for modern clients; a few old clients mishandle 11r, so test.

## 9.7 Mesh and backhaul

Where cables cannot reach, **mesh** APs relay traffic over Wi-Fi to an AP that is wired (**wireless backhaul**). Each
wireless hop on the same radio roughly halves throughput, because the relay must receive and retransmit on the same
channel. Tri-band systems dedicate one radio (often 5 or 6 GHz) to backhaul. Best is **wired backhaul**: Ethernet (or
MoCA over TV coax, or powerline as a last resort) to every AP. EasyMesh (Wi-Fi Alliance) standardises mesh between vendors.

## 9.8 Common mistakes

| Mistake | Effect | Fix |
| --- | --- | --- |
| One powerful router in a corner of the house | weak signal far away, slow devices hog airtime | more APs, centrally placed, wired if possible |
| 40 MHz channels at 2.4 GHz | overlaps everything nearby | 20 MHz only |
| All APs on "auto" with the same channel | co-channel contention | check and plan channels |
| Lowest data rates enabled | slow beacons and sticky distant clients | raise the minimum basic rate (e.g. to 12 or 24 Mbit/s) |
| Router in a cupboard, behind a TV, near a microwave | absorption and interference | open, high, central placement |
| Ignoring the wired side | Wi-Fi faster than the internet link or switch port | check the bottleneck (networks book, Chapter 3) |
| Separate SSIDs per band | users stuck on the worse band | one SSID with band steering, unless a device needs 2.4 GHz only |

For a home checklist see [Set up home Wi-Fi well](../../topics/Home-Wi-Fi.md).

## Check yourself

??? question "1. Why can adding an AP at lower power beat raising one AP's power?"
    Clients transmit weakly, so links are limited by the uplink; more APs keep clients close (higher MCS, less airtime) and give each AP fewer clients; lower power reduces co-channel interference.

??? question "2. What does 802.11r speed up?"
    The security handshake when roaming, by deriving keys for the new AP in advance (fast BSS transition).

??? question "3. Why does each wireless mesh hop on one radio roughly halve throughput?"
    The relay must receive and retransmit each packet on the same channel, and it cannot do both at once.

??? info "Sources"
    - M. Heusse, F. Rousseau, G. Berger-Sabbatel, A. Duda, "Performance Anomaly of 802.11b", INFOCOM 2003.
    - IEEE 802.11-2020 (k, v, r amendments, now folded in); Wi-Fi Alliance EasyMesh specification.
    - Cisco, *Enterprise Mobility 8.x Design Guide*; Aruba, *Validated Reference Design: Very High Density 802.11ac Networks* (design targets such as −65/−67 dBm).
    - CWNP, *CWNA Certified Wireless Network Administrator Study Guide* (structure of the design topics).
