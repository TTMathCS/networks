# 23. Where networks go

*The last chapter looks forward: what researchers and standards bodies are working on now, and the open problems. Each item says what it is and why it matters, with a pointer to read more. Last checked: November 2026.*

!!! abstract "In this chapter"
    **You will learn:** low-latency internet (L4S); programmable and verified networks; the network inside AI
    clusters; the space internet; the quantum internet; post-quantum migration; the measurement and
    decentralisation questions still open.

    **You need:** the rest of the book; each section names the chapter it builds on.

## 23.1 Latency is the new bandwidth

For most users, bandwidth is no longer the limit: delay *under load* is. Two movements tackle it:

- **L4S** (Chapter 17) gives scalable congestion control and shallow, separate queues, aiming at about 1 ms of
  queueing delay even on a busy link. Cable operators (DOCSIS low-latency) and some mobile networks started deploying it
  in 2024–2025, and Apple's systems support it.
- **Responsiveness** as a measured goal: tests that count round-trips per minute while the link is saturated, now part
  of Apple's and others' network-quality tools, and pushed by the bufferbloat community.

Open problem: making low latency end to end, across Wi-Fi (Chapter 7 of the wireless book), home routers and peering
links that each add their own queues.

## 23.2 Networks you can prove correct

As networks became programmable (Chapter 21), they also became analysable. **Network verification** (Header Space
Analysis, Batfish, and cloud providers' own tools that check every change to their virtual networks) proves properties
such as "no packet from the internet reaches this database" for *all* packets, not just tested ones. Research extends
this to data-plane programs (P4) and to verifying that a running network matches its intended model. Open problem:
verifying behaviour under failures and changing traffic, at the scale of the whole internet.

## 23.3 The network inside AI clusters

Training large AI models spreads one computation over tens of thousands of accelerators that exchange data in
**collective** operations (all-reduce) every step; the slowest link sets the pace. This has produced:

- scale-up fabrics inside a server or rack (NVLink, and the open **UALink** specification, 2025) at terabytes per
  second;
- scale-out Ethernet built for it: **Ultra Ethernet** (2025), packet spraying, new congestion control, in-network
  aggregation;
- optical circuit switching and co-packaged optics to cut power, since networking is a growing share of a cluster's
  energy.

Open problems: congestion control for synchronised all-to-all traffic, fault tolerance (one failed link stalls a job of
thousands of chips), and energy.

## 23.4 The space internet

Low-Earth-orbit constellations (Starlink with several thousand satellites, OneWeb/Eutelsat, Amazon Kuiper starting
service) now give broadband with 25–60 ms latency almost anywhere, using **laser links between satellites** so that
traffic can cross oceans in space, where light in vacuum outruns light in fibre by about 50%. Phones connecting
directly to satellites (3GPP **non-terrestrial networks**, "direct to cell") began service for messaging in 2024–2025.
Further out, **delay-tolerant networking** (RFC 9171) and NASA's and ESA's plans for a lunar network (LunaNet) aim at an
interplanetary internet. Open problems: routing over a constantly moving topology, sharing radio spectrum, and space
debris. See [Wireless, chapter 14](../wireless/14-Satellites-and-Deep-Space.md).

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 435" role="img" aria-labelledby="sk-nb-leo-t"><title id="sk-nb-leo-t">Low satellites at about 550 kilometres pass traffic by laser between them; a geostationary satellite at 35,786 kilometres adds about a quarter second each way</title><defs><filter id="sk-nb-leo-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nb-leo-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nb-leo-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nb-leo-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nb-leo-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="435" filter="url(#sk-nb-leo-paper)"/><g filter="url(#sk-nb-leo-pen)"><text x="30" y="44" class="h">Low orbit, short trip</text><path class="p rust" d="M0 380 Q320 300 640 380"/><text x="40" y="378" class="s">Earth</text><path class="p dash" d="M20 300 Q320 230 620 300"/><text x="560" y="276" class="s">550 km</text><path class="p dash" d="M20 90 Q320 70 620 90"/><text x="500" y="76" class="s">35,786 km (not to scale)</text><path class="p gold" d="M130 249.2 L150 249.2 L150 261.2 L130 261.2Z"/><path class="p" d="M118 255.2 L130 255.2 M150 255.2 L162 255.2"/><path class="p gold" d="M250 226.8 L270 226.8 L270 238.8 L250 238.8Z"/><path class="p" d="M238 232.8 L250 232.8 M270 232.8 L282 232.8"/><path class="p gold" d="M370 226.8 L390 226.8 L390 238.8 L370 238.8Z"/><path class="p" d="M358 232.8 L370 232.8 M390 232.8 L402 232.8"/><path class="p gold" d="M490 249.2 L510 249.2 L510 261.2 L490 261.2Z"/><path class="p" d="M478 255.2 L490 255.2 M510 255.2 L522 255.2"/><path class="p red" d="M152 266 L248 250 M272 247 L368 247 M392 250 L488 266"/><text x="250" y="226" class="s">laser links between satellites</text><path class="p gold" d="M310 72 L330 72 L330 86 L310 86Z"/><path class="p dash" d="M120 350 L318 90 L520 350"/><text x="400" y="140" class="s">a high satellite: about 0.24 s</text><text x="400" y="160" class="s">just to go up and come down</text><text x="30" y="420" class="s">In vacuum light is about 50% faster than in fibre, so long trips can go via space.</text></g></svg><figcaption>Sketched for this page. Heights not to scale.</figcaption></figure>

## 23.5 The quantum internet

A **quantum network** would send qubits rather than bits. It cannot speed up ordinary communication, but it enables
**quantum key distribution** (QKD, already in use on some fibre links and the Chinese Micius satellite), linking quantum
computers, and new kinds of sensing. Qubits cannot be copied or amplified, so long distances need **quantum
repeaters** based on entanglement swapping and quantum memories, demonstrated over small multi-node networks
(Delft, 2021 onward) and city-scale fibre testbeds. The IETF and IRTF have a quantum internet research group. Open
problem: repeaters that work at useful rates over hundreds of kilometres.

## 23.6 Post-quantum migration

A large quantum computer would break the public-key cryptography in TLS, SSH and VPNs. Standards bodies finished the
first post-quantum algorithms in 2024 (NIST FIPS 203, 204, 205: ML-KEM, ML-DSA, SLH-DSA). Browsers and large sites
already use **hybrid key exchange** (X25519 + ML-KEM-768) in TLS 1.3 by default, so a large fraction of web traffic is
already protected against "record now, decrypt later". The hard parts left are post-quantum *certificates* (signatures
are much bigger, straining handshakes and DNSSEC) and the long tail of devices. See
[Security, chapter 18](../security/18-Where-Security-Goes.md) and [cryptography.akadian.ca](https://cryptography.akadian.ca/).

## 23.7 Open questions about the internet itself

- **Consolidation**: more traffic flows through fewer large clouds and CDNs. It makes the web faster and more robust to
  attacks, but creates large single points of failure, as several big cloud outages have shown.
- **Ossification**: middleboxes make new transport protocols nearly impossible to deploy except by encryption over
  UDP (QUIC). Will the next protocol need the same trick?
- **Measurement**: as everything is encrypted, operators see less; research on privacy-preserving measurement tries to
  keep networks debuggable without exposing users.
- **IPv4's long tail**: IPv6 carries about half the traffic of big services nearly 30 years after it was designed; when can networks turn IPv4
  off?
- **Routing security**: RPKI covers origins; ASPA and path validation are still being deployed (Chapter 13).

## 23.8 How to keep up

- **Standards**: IETF working groups (datatracker.ietf.org), IEEE 802 (Ethernet, Wi-Fi), 3GPP releases (cellular).
- **Research**: ACM SIGCOMM, USENIX NSDI, ACM IMC (measurement), CoNEXT; arXiv cs.NI.
- **Operations**: NANOG, RIPE and APNIC meetings and their talks online; the APNIC and Cloudflare blogs.
- **This site**: [What's new](../../new.md).

## Check yourself

??? question "1. Why can laser links between satellites beat undersea fibre on long routes?"
    Light in vacuum travels about 50% faster than in glass, which can outweigh the extra distance up to orbit and back on long paths.

??? question "2. Why can't quantum signals use ordinary repeaters?"
    Qubits cannot be copied (no-cloning theorem), so they cannot be amplified; repeaters must use entanglement swapping and quantum memories instead.

??? question "3. What does 'record now, decrypt later' mean, and what defends against it today?"
    An attacker stores encrypted traffic now to decrypt it once a quantum computer exists; hybrid post-quantum key exchange (e.g. X25519 + ML-KEM) protects new sessions now.

??? info "Sources"
    - RFC 9330–9332 (L4S); P. Kazemian et al., "Header Space Analysis", NSDI 2012.
    - Ultra Ethernet Consortium, *UE 1.0* (2025); UALink Consortium, *UALink 200G 1.0* (2025).
    - M. Handley, "Delay is Not an Option: Low Latency Routing in Space", HotNets 2018; RFC 9171 (Bundle Protocol v7); 3GPP Release 17–19 (NTN).
    - S. Wehner, D. Elkouss, R. Hanson, "Quantum internet: A vision for the road ahead", *Science*, 2018; M. Pompili et al., "Realization of a multinode quantum network", *Science*, 2021.
    - NIST FIPS 203, 204, 205 (August 2024).
