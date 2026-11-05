# 14. Satellites and deep space

*Satellites reach places no cable does, from ships to remote villages, and spacecraft carry the network to the Moon and Mars. This chapter covers orbits and what they mean for latency, geostationary and low-orbit broadband, satellite-to-phone service, and the Deep Space Network and Mars relay network.*

!!! abstract "In this chapter"
    **You will learn:** GEO, MEO and LEO orbits and their delays; satellite broadband from GEO to Starlink; laser
    links between satellites; direct-to-device service; the Deep Space Network; how Mars rovers send data home; deep-space
    protocols (CCSDS) and delay-tolerant networking.

    **You need:** [Chapter 2](02-Antennas-and-Link-Budgets.md) (link budgets); [networks book, chapter 3](../networks/03-Delay-Loss-and-Throughput.md).

## 14.1 Orbits and delay

| Orbit | Altitude | Period | One-way ground-sat-ground delay | Examples |
| --- | --- | --- | --- | --- |
| **GEO** (geostationary) | 35,786 km | 24 h (stays above one point) | about 240–280 ms; RTT about 600 ms with the return | satellite TV, older broadband (Viasat, HughesNet) |
| **MEO** | about 8,000 km | about 5 h | about 60–80 ms RTT | O3b mPOWER, GPS (at 20,200 km) |
| **LEO** | 300–1,500 km | about 90–110 min | 25–60 ms RTT in practice | Starlink, OneWeb, Kuiper, Iridium |

A GEO satellite seems fixed in the sky, so a dish can stay pointed, but the round trip to 36,000 km and back (twice, for
a request and its reply) adds about half a second: fine for TV, painful for calls and games, and harmful to TCP's
throughput (large bandwidth-delay product, networks book Chapter 17). LEO satellites are close, so delay is low, but
each crosses the sky in a few minutes, so a constellation needs thousands of them, and ground terminals must track them
with phased-array antennas and hand over every few minutes.

## 14.2 LEO broadband

**Starlink** (SpaceX) had by 2025 several thousand satellites at about 340–570 km, user terminals with electronically
steered phased arrays, and Ku- and Ka-band links to ground gateways. Typical service: 50–250 Mbit/s down, 25–60 ms
latency. **Optical inter-satellite links** (lasers between satellites, about 100 Gbit/s each) let traffic travel through
space to a distant gateway, serving oceans and polar regions, and, because light in vacuum is about 50% faster than in
fibre, long routes can even beat undersea cables (networks book, Chapter 23).

Challenges: capacity is shared per cell on the ground, so dense areas congest; interference with other satellites and
radio astronomy; light pollution in astronomers' images; space debris and collision avoidance.

## 14.3 Direct to device

Since 2023–2025, ordinary phones can connect to satellites: emergency SOS and messaging on some phones via Globalstar,
and operator partnerships (such as T-Mobile with Starlink) in which satellites act as cell towers in space using the
operator's spectrum. 3GPP's **non-terrestrial networks** (Release 17 onward) standardise this for 4G/5G, including
compensating large Doppler shifts and delays. Rates are low (texts, then voice and light data), since a phone's small
antenna and power must reach a satellite hundreds of kilometres away.

## 14.4 The Deep Space Network

NASA's **Deep Space Network** has three complexes about 120° apart in longitude (Goldstone, California; Madrid, Spain;
Canberra, Australia) so every spacecraft beyond Earth orbit is always in view of at least one. Each has a 70 m dish and
several 34 m dishes, which can be **arrayed** (combined) for weak signals. It serves dozens of missions, from the Moon
and Mars to Voyager 1, more than 24 billion km away, whose signal arrives at about $10^{-21}$ W.

Deep-space links use S, X and Ka band (Chapter 1), cryogenically cooled receivers, and codes close to the Shannon
limit: turbo and LDPC codes standardised by **CCSDS** (the Consultative Committee for Space Data Systems). NASA's
**DSOC** experiment on the Psyche spacecraft (2023–2025) demonstrated **laser** communication from deep space, sending
data at up to 267 Mbit/s from about 30 million km (and far lower rates from hundreds of millions of km).

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 370" role="img" aria-labelledby="sk-nw-dsn-t"><title id="sk-nw-dsn-t">The Earth seen from above the North Pole with Goldstone, Madrid and Canberra about 120 degrees apart, so one of them always faces any spacecraft</title><defs><filter id="sk-nw-dsn-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-dsn-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-dsn-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-dsn-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-dsn-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="370" filter="url(#sk-nw-dsn-paper)"/><g filter="url(#sk-nw-dsn-pen)"><text x="30" y="44" class="h">Three dishes, always one awake</text><circle cx="250" cy="220" r="100" class="p room"/><circle cx="250" cy="220" r="4" class="p"/><text x="250" y="242" text-anchor="middle" class="s">North Pole</text><circle cx="339.2" cy="265.2" r="7" class="p gold"/><path class="p dash" d="M339.2 265.2 L403.8 218.1" opacity=".6"/><path class="p dash" d="M339.2 265.2 L339.3 345.2" opacity=".6"/><text x="374.9" y="283.3" text-anchor="middle" class="s">Goldstone</text><circle cx="257.3" cy="120.3" r="7" class="p gold"/><path class="p dash" d="M257.3 120.3 L188.9 78.9" opacity=".6"/><path class="p dash" d="M257.3 120.3 L331.1 89.3" opacity=".6"/><text x="260.3" y="80.4" text-anchor="middle" class="s">Madrid</text><circle cx="198.5" cy="305.7" r="7" class="p gold"/><path class="p dash" d="M198.5 305.7 L240.9 373.5" opacity=".6"/><path class="p dash" d="M198.5 305.7 L118.7 300.1" opacity=".6"/><text x="177.9" y="340.0" text-anchor="middle" class="s">Canberra</text><path class="p" d="M390 320 A140 140 0 0 0 390 120" marker-end="url(#sk-nw-dsn-ah)"/><text x="440" y="225" class="s">Earth turns</text><text x="480" y="110" class="s">about 120° apart, so</text><text x="480" y="130" class="s">as one loses Mars below</text><text x="480" y="150" class="s">its horizon, the next</text><text x="480" y="170" class="s">has already risen to it</text><text x="480" y="290" class="s">70 m dishes, combined</text><text x="480" y="310" class="s">for the faintest signals</text></g></svg><figcaption>Sketched for this page. Station places from their longitudes.</figcaption></figure>

## 14.5 How Mars talks to Earth

A rover such as Curiosity or Perseverance has two links:

- **Direct to Earth** at X band, using its high-gain antenna: slow, a few kbit/s to tens of kbit/s, used mainly to
  receive the day's commands.
- **Relay** at UHF (about 400 MHz) to orbiters passing overhead: Mars Reconnaissance Orbiter, MAVEN, Mars Odyssey,
  ESA's Trace Gas Orbiter and Mars Express. A pass lasts about 10 minutes and can move hundreds of megabits at up to
  2 Mbit/s (adaptive rates, Proximity-1 protocol). The orbiter stores the data and later sends it to the DSN at X band
  with its large antenna and more power.

Most data from Mars surface missions arrives through the relay network. The trip takes 3 to 22 minutes one way, and for
about two weeks around **solar conjunction** (every 26 months, when Mars is behind the Sun from Earth) the Sun's plasma
corrupts signals and missions stop sending commands.

## 14.6 Delay-tolerant networking

Internet protocols assume a connected path exists end to end and that round trips are short; TCP over a 40-minute RTT
with links that disappear for hours would never work. **Delay-tolerant networking** (DTN) uses the **Bundle Protocol**
(RFC 9171, CCSDS 734.2-B): each node takes custody of a **bundle** and stores it until a contact with the next node
opens, using **contact graph routing** with predicted contact schedules (orbits are predictable). It was tested from the
EPOXI spacecraft (2008) and has run on the International Space Station since 2016. NASA's and ESA's **LunaNet** plans
for lunar missions build on it, a step toward a solar-system internet, and DTN also serves remote areas on Earth where
connectivity comes and goes.

## Check yourself

??? question "1. What is the minimum round trip for a request and reply via a GEO satellite overhead?"
    Four crossings of about 35,786 km (up, down for the request; up, down for the reply): about 143,000 km / 300,000 km/s ≈ 0.48 s, more in practice.

??? question "2. Why does a Mars rover send most data through orbiters?"
    Orbiters pass close overhead (strong UHF link at low rover power) and have bigger antennas and more power to reach Earth, so far more data gets through than by the rover's own direct link.

??? question "3. What does DTN do differently from IP routing?"
    Nodes store bundles until the next link becomes available (store and forward with custody), instead of requiring an end-to-end path at the moment of sending.

??? info "Sources"
    - NASA JPL, *Deep Space Network* (deepspace.jpl.nasa.gov) and *DSN Telecommunications Link Design Handbook* (810-005); NASA, "Deep Space Optical Communications" results (2023–2025).
    - C. Edwards et al., "The Mars Relay Network", IEEE Aerospace Conference proceedings; CCSDS 211.0-B (Proximity-1), CCSDS 131.0-B (TM coding), CCSDS 734.2-B (Bundle Protocol).
    - RFC 4838 (DTN architecture), RFC 9171 (Bundle Protocol v7).
    - SpaceX Starlink network updates; 3GPP TR 38.811 and Release 17 NTN specifications.
