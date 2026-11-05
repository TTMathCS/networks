# 13. Cellular from 2G to 5G

*A mobile network hands a moving phone from tower to tower without dropping a call, across a whole continent. This chapter explains the cellular idea, the generations from GSM to 5G, the parts of a 4G and 5G network, how a phone attaches and moves, and how cellular security works.*

!!! abstract "In this chapter"
    **You will learn:** cells and frequency reuse; 2G GSM, 3G UMTS, 4G LTE, 5G NR in one table; the radio access
    network and the core; what happens when a phone switches on; handover; 5G's service-based core, network slicing and
    standalone versus non-standalone; SIMs, authentication and the attacks on older generations.

    **You need:** [Chapters 3–6](03-Fading-and-Noise.md); [networks book, chapter 8](../networks/08-IPv4-Addressing-and-Subnets.md).

## 13.1 The cellular idea

Spectrum is scarce, so the same frequencies must be reused. Bell Labs' idea (1947, deployed from 1979–1983) was to
divide an area into **cells**, each served by a base station at low power, and reuse frequencies in cells far enough
apart. Smaller cells mean more reuse and more capacity per square kilometre, at the cost of more base stations and more
**handovers** as users move. Modern networks reuse every frequency in every cell and manage the resulting interference
with scheduling, power control and beamforming.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 415" role="img" aria-labelledby="sk-nw-cells-t"><title id="sk-nw-cells-t">A honeycomb of cells, each with a mast, using three sets of frequencies so that no two neighbouring cells share one</title><defs><filter id="sk-nw-cells-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-cells-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-cells-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-cells-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-cells-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="415" filter="url(#sk-nw-cells-paper)"/><g filter="url(#sk-nw-cells-pen)"><text x="30" y="44" class="h">The same frequencies, used again farther on</text><path class="p rust" d="M120.0 132.5 91.4 149.0 62.8 132.5 62.8 99.5 91.4 83.0 120.0 99.5Z"/><circle cx="91.4" cy="116.0" r="3" class="p"/><text x="91.4" y="134.0" text-anchor="middle" class="s">C</text><path class="p room" d="M148.5 182.0 120.0 198.5 91.4 182.0 91.4 149.0 120.0 132.5 148.5 149.0Z"/><circle cx="120.0" cy="165.5" r="3" class="p"/><text x="120.0" y="183.5" text-anchor="middle" class="s">B</text><path class="p gold" d="M177.1 231.5 148.5 248.0 120.0 231.5 120.0 198.5 148.5 182.0 177.1 198.5Z"/><circle cx="148.5" cy="215.0" r="3" class="p"/><text x="148.5" y="233.0" text-anchor="middle" class="s">A</text><path class="p rust" d="M205.7 281.0 177.1 297.5 148.5 281.0 148.5 248.0 177.1 231.5 205.7 248.0Z"/><circle cx="177.1" cy="264.5" r="3" class="p"/><text x="177.1" y="282.5" text-anchor="middle" class="s">C</text><path class="p room" d="M234.3 330.5 205.7 347.0 177.1 330.5 177.1 297.5 205.7 281.0 234.3 297.5Z"/><circle cx="205.7" cy="314.0" r="3" class="p"/><text x="205.7" y="332.0" text-anchor="middle" class="s">B</text><path class="p gold" d="M177.1 132.5 148.5 149.0 120.0 132.5 120.0 99.5 148.5 83.0 177.1 99.5Z"/><circle cx="148.5" cy="116.0" r="3" class="p"/><text x="148.5" y="134.0" text-anchor="middle" class="s">A</text><path class="p rust" d="M205.7 182.0 177.1 198.5 148.5 182.0 148.5 149.0 177.1 132.5 205.7 149.0Z"/><circle cx="177.1" cy="165.5" r="3" class="p"/><text x="177.1" y="183.5" text-anchor="middle" class="s">C</text><path class="p room" d="M234.3 231.5 205.7 248.0 177.1 231.5 177.1 198.5 205.7 182.0 234.3 198.5Z"/><circle cx="205.7" cy="215.0" r="3" class="p"/><text x="205.7" y="233.0" text-anchor="middle" class="s">B</text><path class="p gold" d="M262.8 281.0 234.3 297.5 205.7 281.0 205.7 248.0 234.3 231.5 262.8 248.0Z"/><circle cx="234.3" cy="264.5" r="3" class="p"/><text x="234.3" y="282.5" text-anchor="middle" class="s">A</text><path class="p rust" d="M291.4 330.5 262.8 347.0 234.3 330.5 234.3 297.5 262.8 281.0 291.4 297.5Z"/><circle cx="262.8" cy="314.0" r="3" class="p"/><text x="262.8" y="332.0" text-anchor="middle" class="s">C</text><path class="p room" d="M234.3 132.5 205.7 149.0 177.1 132.5 177.1 99.5 205.7 83.0 234.3 99.5Z"/><circle cx="205.7" cy="116.0" r="3" class="p"/><text x="205.7" y="134.0" text-anchor="middle" class="s">B</text><path class="p gold" d="M262.8 182.0 234.3 198.5 205.7 182.0 205.7 149.0 234.3 132.5 262.8 149.0Z"/><circle cx="234.3" cy="165.5" r="3" class="p"/><text x="234.3" y="183.5" text-anchor="middle" class="s">A</text><path class="p rust" d="M291.4 231.5 262.8 248.0 234.3 231.5 234.3 198.5 262.8 182.0 291.4 198.5Z"/><circle cx="262.8" cy="215.0" r="3" class="p"/><text x="262.8" y="233.0" text-anchor="middle" class="s">C</text><path class="p room" d="M320.0 281.0 291.4 297.5 262.8 281.0 262.8 248.0 291.4 231.5 320.0 248.0Z"/><circle cx="291.4" cy="264.5" r="3" class="p"/><text x="291.4" y="282.5" text-anchor="middle" class="s">B</text><path class="p gold" d="M348.6 330.5 320.0 347.0 291.4 330.5 291.4 297.5 320.0 281.0 348.6 297.5Z"/><circle cx="320.0" cy="314.0" r="3" class="p"/><text x="320.0" y="332.0" text-anchor="middle" class="s">A</text><path class="p rust" d="M291.4 132.5 262.8 149.0 234.3 132.5 234.3 99.5 262.8 83.0 291.4 99.5Z"/><circle cx="262.8" cy="116.0" r="3" class="p"/><text x="262.8" y="134.0" text-anchor="middle" class="s">C</text><path class="p room" d="M320.0 182.0 291.4 198.5 262.8 182.0 262.8 149.0 291.4 132.5 320.0 149.0Z"/><circle cx="291.4" cy="165.5" r="3" class="p"/><text x="291.4" y="183.5" text-anchor="middle" class="s">B</text><path class="p gold" d="M348.6 231.5 320.0 248.0 291.4 231.5 291.4 198.5 320.0 182.0 348.6 198.5Z"/><circle cx="320.0" cy="215.0" r="3" class="p"/><text x="320.0" y="233.0" text-anchor="middle" class="s">A</text><path class="p rust" d="M377.2 281.0 348.6 297.5 320.0 281.0 320.0 248.0 348.6 231.5 377.2 248.0Z"/><circle cx="348.6" cy="264.5" r="3" class="p"/><text x="348.6" y="282.5" text-anchor="middle" class="s">C</text><path class="p room" d="M405.7 330.5 377.2 347.0 348.6 330.5 348.6 297.5 377.2 281.0 405.7 297.5Z"/><circle cx="377.2" cy="314.0" r="3" class="p"/><text x="377.2" y="332.0" text-anchor="middle" class="s">B</text><path class="p gold" d="M348.6 132.5 320.0 149.0 291.4 132.5 291.4 99.5 320.0 83.0 348.6 99.5Z"/><circle cx="320.0" cy="116.0" r="3" class="p"/><text x="320.0" y="134.0" text-anchor="middle" class="s">A</text><path class="p rust" d="M377.2 182.0 348.6 198.5 320.0 182.0 320.0 149.0 348.6 132.5 377.2 149.0Z"/><circle cx="348.6" cy="165.5" r="3" class="p"/><text x="348.6" y="183.5" text-anchor="middle" class="s">C</text><path class="p room" d="M405.7 231.5 377.2 248.0 348.6 231.5 348.6 198.5 377.2 182.0 405.7 198.5Z"/><circle cx="377.2" cy="215.0" r="3" class="p"/><text x="377.2" y="233.0" text-anchor="middle" class="s">B</text><path class="p gold" d="M434.3 281.0 405.7 297.5 377.2 281.0 377.2 248.0 405.7 231.5 434.3 248.0Z"/><circle cx="405.7" cy="264.5" r="3" class="p"/><text x="405.7" y="282.5" text-anchor="middle" class="s">A</text><path class="p rust" d="M462.9 330.5 434.3 347.0 405.7 330.5 405.7 297.5 434.3 281.0 462.9 297.5Z"/><circle cx="434.3" cy="314.0" r="3" class="p"/><text x="434.3" y="332.0" text-anchor="middle" class="s">C</text><path class="p room" d="M405.7 132.5 377.2 149.0 348.6 132.5 348.6 99.5 377.2 83.0 405.7 99.5Z"/><circle cx="377.2" cy="116.0" r="3" class="p"/><text x="377.2" y="134.0" text-anchor="middle" class="s">B</text><path class="p gold" d="M434.3 182.0 405.7 198.5 377.2 182.0 377.2 149.0 405.7 132.5 434.3 149.0Z"/><circle cx="405.7" cy="165.5" r="3" class="p"/><text x="405.7" y="183.5" text-anchor="middle" class="s">A</text><path class="p rust" d="M462.9 231.5 434.3 248.0 405.7 231.5 405.7 198.5 434.3 182.0 462.9 198.5Z"/><circle cx="434.3" cy="215.0" r="3" class="p"/><text x="434.3" y="233.0" text-anchor="middle" class="s">C</text><path class="p room" d="M491.5 281.0 462.9 297.5 434.3 281.0 434.3 248.0 462.9 231.5 491.5 248.0Z"/><circle cx="462.9" cy="264.5" r="3" class="p"/><text x="462.9" y="282.5" text-anchor="middle" class="s">B</text><path class="p gold" d="M520.0 330.5 491.5 347.0 462.9 330.5 462.9 297.5 491.5 281.0 520.0 297.5Z"/><circle cx="491.5" cy="314.0" r="3" class="p"/><text x="491.5" y="332.0" text-anchor="middle" class="s">A</text><path class="p rust" d="M462.9 132.5 434.3 149.0 405.7 132.5 405.7 99.5 434.3 83.0 462.9 99.5Z"/><circle cx="434.3" cy="116.0" r="3" class="p"/><text x="434.3" y="134.0" text-anchor="middle" class="s">C</text><path class="p room" d="M491.5 182.0 462.9 198.5 434.3 182.0 434.3 149.0 462.9 132.5 491.5 149.0Z"/><circle cx="462.9" cy="165.5" r="3" class="p"/><text x="462.9" y="183.5" text-anchor="middle" class="s">B</text><path class="p gold" d="M520.0 231.5 491.5 248.0 462.9 231.5 462.9 198.5 491.5 182.0 520.0 198.5Z"/><circle cx="491.5" cy="215.0" r="3" class="p"/><text x="491.5" y="233.0" text-anchor="middle" class="s">A</text><path class="p rust" d="M548.6 281.0 520.0 297.5 491.5 281.0 491.5 248.0 520.0 231.5 548.6 248.0Z"/><circle cx="520.0" cy="264.5" r="3" class="p"/><text x="520.0" y="282.5" text-anchor="middle" class="s">C</text><path class="p room" d="M577.2 330.5 548.6 347.0 520.0 330.5 520.0 297.5 548.6 281.0 577.2 297.5Z"/><circle cx="548.6" cy="314.0" r="3" class="p"/><text x="548.6" y="332.0" text-anchor="middle" class="s">B</text><text x="30" y="380" class="s">Three sets of frequencies, A, B and C: no cell shares a set with a neighbour. Smaller cells mean</text><text x="30" y="400" class="s">more reuse, more capacity, more masts, and more hand-overs as people move.</text></g></svg><figcaption>Sketched for this page. Today's networks often reuse every frequency in every cell and manage the interference.</figcaption></figure>

## 13.2 Generations

| Gen | Main standard | Years | Access | Peak data (typical real) | Key ideas |
| --- | --- | --- | --- | --- | --- |
| 1G | AMPS, NMT | 1980s | analogue FDMA | voice only | cells, handover |
| 2G | GSM | 1991 | TDMA, 200 kHz carriers | 9.6 kbit/s; GPRS/EDGE up to about 200 kbit/s | digital voice, SMS, SIM card, encryption |
| 3G | UMTS (WCDMA), CDMA2000 | 2001 | CDMA, 5 MHz | up to 42 Mbit/s with HSPA+ (a few Mbit/s) | mobile internet |
| 4G | LTE, LTE-Advanced | 2009 | OFDMA down, SC-FDMA up, up to 20 MHz × carriers | up to 1 Gbit/s+ (tens of Mbit/s) | all-IP, voice as VoLTE, MIMO, carrier aggregation |
| 5G | NR | 2019 | OFDMA both ways, up to 100 MHz (FR1) / 400 MHz (FR2) | multi-Gbit/s (100–500 Mbit/s mid band) | flexible numerology, massive MIMO, mmWave, new core, low latency |

Each generation is defined by **3GPP**, a partnership of standards bodies, in numbered **Releases** (LTE from Release 8,
5G from Release 15, "5G-Advanced" from Release 18). The ITU sets the targets (IMT-2000, IMT-Advanced, IMT-2020).

5G radio uses two ranges: **FR1** (below 7.125 GHz, especially the 3.3–4.2 GHz "C-band") and **FR2** (mmWave, 24–71 GHz).
Most 5G capacity today is mid band with massive MIMO; mmWave is used in dense spots.

## 13.3 The parts of a network

**Radio access network (RAN)**: base stations, called **eNodeB** in 4G and **gNodeB** in 5G. They run the radio,
schedule every phone's transmissions each millisecond or less, and manage handovers. In 5G a gNB can be split into
radio units on the mast and distributed and central units in data centres; **Open RAN** standardises the interfaces
between them so operators can mix vendors.

**Core network**: 4G's **Evolved Packet Core**:

| Element | Job |
| --- | --- |
| MME | signalling: attach, authentication, tracking where idle phones are, handover control |
| HSS | the subscriber database and authentication keys |
| S-GW | anchors the user's data path as the phone moves between base stations |
| P-GW | the gateway to the internet: gives the phone its IP address, enforces policy and charging |

5G's **service-based core** splits these into software functions that talk over HTTP/2 APIs, run in clouds: **AMF**
(access and mobility), **SMF** (sessions), **UPF** (user-plane forwarding, the only part in the data path), **AUSF** and
**UDM** (authentication and subscriber data), **PCF** (policy), and others.

Between the phone and the internet, user data travels in **GTP-U tunnels** (UDP port 2152) from the base station to the
gateway, so the phone keeps the same IP address while moving between base stations.

## 13.4 Switching on and moving

1. The phone scans for cells, reads their broadcast system information, and picks the strongest suitable one on its
   network.
2. **Random access**: it sends a preamble on a shared channel; the base station assigns it resources.
3. **Attach / registration**: the core authenticates the SIM (13.6), sets up security, and creates a default data
   session (a **bearer** in 4G, a **PDU session** in 5G) with an IP address.
4. In **idle** mode the phone sleeps, waking periodically to check for paging; the network knows only its **tracking
   area** (a group of cells). An incoming call or data triggers **paging** in that area.
5. In **connected** mode, the phone measures neighbouring cells and reports; the base station decides a **handover**,
   prepares the target cell over the X2/Xn interface, and tells the phone to switch, typically with a break of tens of
   milliseconds or less.

## 13.5 5G features

- **Non-standalone (NSA)** 5G uses a 4G core and an LTE anchor for signalling; **standalone (SA)** uses the 5G core
  end to end, enabling the features below.
- **Network slicing**: logical networks with different guarantees (low latency for factories, best-effort for phones)
  over one physical network.
- **URLLC**: ultra-reliable low-latency communication, aiming at 1 ms radio latency and 99.999% reliability for
  industrial control.
- **Edge computing**: placing UPFs and servers close to base stations to cut delay.
- **Private 5G** for factories, ports and campuses, often in shared spectrum such as CBRS.

## 13.6 SIMs and security

A **SIM** (now often an **eSIM**, a chip soldered in and provisioned remotely) holds the subscriber identity (**IMSI**)
and a secret key $K$, also stored in the operator's database. Authentication (**AKA**): the network sends a random
challenge and an authentication token; the SIM checks the token came from its own network (mutual authentication since
3G) and computes a response and session keys from $K$. Traffic is then encrypted (AES, SNOW, ZUC-based algorithms) and
signalling is integrity-protected.

Older generations had flaws: **GSM** authenticated only the phone, not the network, so **fake base stations** ("IMSI
catchers") could impersonate a tower and its A5/1 and A5/2 ciphers were broken. Attackers still force phones down to 2G.
**SS7** and **Diameter**, the signalling networks between operators, trust their peers and have been abused to locate
phones and intercept SMS, which is why SMS codes are a weak second factor ([Security, chapter 4](../security/04-Authentication-and-Identity.md)).
**5G** encrypts the permanent identity (the **SUCI**, concealed with the operator's public key) so it is never sent in
the clear, and modern phones let users disable 2G.

## Check yourself

??? question "1. Why do smaller cells give more capacity?"
    The same spectrum is reused in more places, so total traffic per area grows (with more base stations and more handovers).

??? question "2. Which 5G core function is in the user data path?"
    The UPF (user plane function).

??? question "3. Why can a fake GSM base station fool phones but not a 5G one, in principle?"
    GSM authenticates only the phone, not the network; 3G onward authenticates the network too (mutual AKA), and 5G also conceals the permanent identity.

??? info "Sources"
    - 3GPP TS 23.401 (EPC), TS 23.501 (5G system architecture), TS 33.501 (5G security), TS 38.300 (NR overview).
    - E. Dahlman, S. Parkvall, J. Sköld, *5G NR: The Next Generation Wireless Access Technology*, 2nd ed., Academic Press, 2020.
    - ITU-R M.2083 (IMT-2020 vision); V. MacDonald, "The Cellular Concept", *Bell System Technical Journal*, 1979.
    - D. Rupprecht et al., "Breaking LTE on Layer Two", IEEE S&P 2019; ENISA, *Signalling Security in Telecom SS7/Diameter/5G*, 2018.
