# 15. Where wireless goes

*Wireless research is moving on several fronts at once: the sixth cellular generation, more reliable Wi-Fi, sensing with radio, surfaces that steer waves, higher frequencies, and networks in space. This chapter surveys what is being standardised and what is still research. Last checked: November 2026.*

!!! abstract "In this chapter"
    **You will learn:** what 6G aims at and when; AI in the radio network; integrated sensing and communication;
    reconfigurable intelligent surfaces; sub-THz and optical wireless; Wi-Fi 8; non-terrestrial networks; spectrum
    sharing; the open problems.

    **You need:** the rest of this book.

## 15.1 6G

The ITU's **IMT-2030** framework (2023) sets the goals for 6G, and 3GPP began 6G study items in Release 20 (2025–2026),
with first specifications expected in Release 21 around 2028–2029 and commercial networks around 2030. Directions:

- new mid-band spectrum, especially **7–15 GHz** ("FR3"), between today's mid band and mmWave, with very large antenna
  arrays;
- **AI-native** air interface: learned channel estimation, beam management and scheduling;
- integrated sensing, positioning and communication;
- full integration of satellites and other non-terrestrial nodes;
- energy efficiency as a first-class target, since networks' power use is a large cost and footprint.

Open problem: what users need that 5G-Advanced cannot already give, which will shape what is actually deployed.

## 15.2 AI in the radio

Machine learning already tunes networks (cell parameters, energy saving by switching off carriers at night). Research
and 3GPP Release 18–19 study items put it in the link itself: neural networks to compress channel feedback for massive
MIMO, predict beams before a user moves, and decode signals. Challenges: models must work on phones from many vendors,
be testable, and not fail badly on situations absent from training.

## 15.3 Sensing with radio

Radio signals change when people move: Wi-Fi channel measurements can detect presence, breathing and falls. **IEEE
802.11bf** (WLAN sensing, completed 2025) standardises how devices request and report such measurements. Cellular
**integrated sensing and communication (ISAC)** would let base stations act as radars, tracking drones and vehicles.
These raise privacy questions: a network that can sense people through walls needs clear rules about consent and use.

## 15.4 Steering the environment

A **reconfigurable intelligent surface** (RIS) is a panel of many tiny elements whose reflection phase can be adjusted
electronically, redirecting waves around corners or into dead spots without amplifying them. It turns the propagation
environment, until now fixed, into something the network can configure. Trials exist; open problems are channel
estimation with thousands of passive elements, cost, and showing gains over simply adding small base stations.

## 15.5 Higher frequencies

**Sub-terahertz** (100–300 GHz) offers tens of gigahertz of spectrum for very short links (inside racks, kiosk downloads,
wireless backhaul), demonstrated at over 100 Gbit/s in labs; absorption by air, rain and objects limits range to metres
or tens of metres. **Optical wireless** (Li-Fi, IEEE 802.11bb, 2023) uses light, invisible infrared or modulated
lighting, for interference-free links in rooms, hospitals and aircraft cabins.

## 15.6 Wi-Fi 8 and beyond

**802.11bn** ("Ultra High Reliability", Chapter 8) targets consistent latency and throughput, with coordination between
access points, better roaming and lower power. Further work: integrating Wi-Fi with 5G/6G (seamless switching), 60 GHz
for very high rates (802.11ay successors), and Wi-Fi ranging and sensing.

## 15.7 Networks above the Earth

Constellations keep growing (Starlink, Kuiper, OneWeb and Chinese constellations such as Guowang and Qianfan), direct-
to-device service is moving from text to voice and data, and **high-altitude platforms** (aircraft or balloons in the
stratosphere) fill gaps. For the Moon, **LunaNet** and ESA's Moonlight programme plan relay satellites and navigation
services around 2028–2030; the same delay-tolerant and relay ideas would extend a network to Mars, where any settlement
would need local wireless (Wi-Fi, cellular-like systems for surface vehicles) plus trunk links to Earth through relay
orbiters, at minutes of delay.

## 15.8 Spectrum

Every band is contested. Trends: **dynamic sharing** with databases (CBRS, 6 GHz automated frequency coordination),
more unlicensed spectrum, sharing with radar and satellites, and protecting passive uses such as weather satellites and
radio astronomy, whose sensitive receivers can be blinded by neighbouring transmissions. The ITU's World
Radiocommunication Conference in 2027 will decide on several candidate bands for 6G.

## Check yourself

??? question "1. Which new frequency range is a main candidate for 6G capacity?"
    The upper mid band, roughly 7–15 GHz (FR3).

??? question "2. What does a reconfigurable intelligent surface do?"
    It reflects radio waves with electronically adjustable phases, steering signals around obstacles without amplifying them.

??? question "3. Why are sub-THz links short-range?"
    Path loss and absorption by air, water vapour and obstacles grow sharply at those frequencies.

??? info "Sources"
    - ITU-R M.2160 (IMT-2030 framework, 2023); 3GPP Release 19–20 work plans (3gpp.org).
    - IEEE 802.11bf (WLAN sensing), 802.11bb (light communications, 2023), 802.11bn task group documents.
    - E. Basar et al., "Wireless Communications Through Reconfigurable Intelligent Surfaces", *IEEE Access*, 2019.
    - NASA LunaNet Interoperability Specification; ESA Moonlight programme.
