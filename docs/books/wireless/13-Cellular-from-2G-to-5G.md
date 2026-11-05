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
