---
template: home.html
title: Networks
---

# Networks and security, from the first idea to research

<div class="start-band" markdown>

New here? Start with six short lessons

About five minutes each. No computer and no technical words needed.

1. [**What is a network?** *computers that can reach each other*](start/01-What-Is-a-Network.md)
2. [**Packets** *a message cut into postcards*](start/02-Packets.md)
3. [**Addresses and names** *how a message finds its way*](start/03-Addresses-and-Names.md)
4. [**Wires and radio waves** *cables, fibre and Wi-Fi*](start/04-Wires-and-Radio.md)
5. [**Staying safe** *locks, keys and the padlock in your browser*](start/05-Staying-Safe.md)
6. [**Talking to Mars** *a network where every hello takes minutes*](start/06-Talking-to-Mars.md)

[Begin lesson 1 →](start/01-What-Is-a-Network.md)

</div>

A network is any set of devices that can send each other messages. The internet joins billions of them, through
copper, glass fibre and radio, and keeps working when parts of it fail. This site explains how, layer by layer:
the ideas, the math that makes them work, the radio behind Wi-Fi, Bluetooth and phones, how attackers break networks
and how defenders protect them, and labs where you try every idea on your own computer.

The picture above is a real network: rovers on Mars send data over UHF radio to orbiters passing overhead, and the
orbiters relay it to the three dishes of NASA's Deep Space Network on Earth, a trip of 3 to 22 minutes at the speed
of light. [Talking to Mars](start/06-Talking-to-Mars.md) and [Satellites and deep space](books/wireless/14-Satellites-and-Deep-Space.md)
explain how it works.

## Find your level

<div class="level-cards" markdown>

<div class="level-card level-card--1" markdown>

Beginner

New to networks: young learners, a class.

- Six five-minute lessons with everyday pictures
- No computer needed

[Start here](start/index.md)

</div>

<div class="level-card level-card--2" markdown>

Intermediate

Students and anyone who uses a command line a little.

- The first chapters of each [Book](#books)
- The first [Labs](labs/index.md): ping, traceroute, DNS, packet capture

[Open the books](books/index.md)

</div>

<div class="level-card level-card--3" markdown>

Expert

Network and security professionals, university and beyond.

- [Topics](topics/index.md): from a one-minute summary to expert detail
- Later chapters: BGP, congestion control, MIMO, 5G, zero trust
- [What's new](new.md): the latest standards and research

[Find a topic](topics/index.md)

</div>

</div>

<p class="level-check-link" markdown>Not sure which one is you? [Take the one-minute level check →](level-check.md)</p>

## Explainers { #explainers }

Picture-led walks through the everyday internet, for readers who have never seen the words before.

| Explainer | What you will understand |
| --- | --- |
| [How email gets delivered](explainers/Email-Delivery.md) | a real case of bounced school email, and how domains, DNS, SPF, DKIM and DMARC fixed it |
| [How DNS works](explainers/How-DNS-Works.md) | the internet's phone book, step by step, and who runs it for the whole world |
| [How a web page reaches you](explainers/How-a-Page-Reaches-You.md) | the journey of one click: addresses, routers, HTTPS and CDNs |

## Books { #books }

Each book is a full course in pages of five to six minutes, from the first idea to current research.

| Book | What is in it |
| --- | --- |
| [How networks work](books/networks/index.md) | 23 chapters: layers, delay and throughput, the physical layer, Ethernet and switches, VLANs, IPv4 and subnets, NAT, IPv6, routers, routing algorithms, OSPF and BGP, UDP, TCP, congestion control, DNS, HTTP and QUIC, streaming and CDNs, data centres and SDN, running a network |
| [Math foundations](books/math/index.md) | 10 chapters: binary and masks, probability, queues and Little's law, graphs and flows, information and Shannon capacity, error-correcting codes, signals and Fourier, modulation, feedback and fairness, the math of security |
| [Wireless and mobile](books/wireless/index.md) | 15 chapters: radio and spectrum, antennas and link budgets, fading, modulation, OFDM, MIMO, how Wi-Fi works, Wi-Fi 4 to 7, designing Wi-Fi, Wi-Fi security, Bluetooth, NFC and UWB, IoT radios, cellular 2G to 5G, satellites and deep space |
| [Network security](books/security/index.md) | 18 chapters: what security means, attackers, the cryptography toolkit, identity, attacks on LANs, IP and routing, DNS security, TLS, VPNs, SSH, firewalls, detection, denial of service, web security, zero trust, incident response, testing your own network |
| [Labs](labs/index.md) | 15 hands-on labs on your own computer: ping and traceroute, routes, dig, curl and TLS, Wireshark, a whole network on one laptop, OSPF, sockets, nftables, WireGuard, SSH, Wi-Fi surveys, nmap and Scapy |

Every idea on this site was first published by people, in standards (RFCs and IEEE documents) and textbooks; each
page lists its sources in a closed box at the end. The text and diagrams are <span class="ai-tag">AI-created</span>
and checked against those sources. Cryptography itself (how ciphers work) has its own site,
[cryptography.akadian.ca](https://cryptography.akadian.ca/); algorithms such as Dijkstra's are on
[cs.akadian.ca](https://cs.akadian.ca/).
