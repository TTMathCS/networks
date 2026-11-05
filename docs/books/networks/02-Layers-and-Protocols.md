# 2. Layers and protocols

*Networks are built in layers: each one offers a simple service to the layer above and uses the one below. This chapter explains protocols, the five-layer internet model and the seven-layer OSI model, encapsulation, and the end-to-end principle that shaped the internet.*

!!! abstract "In this chapter"
    **You will learn:** what a protocol is; the internet's five layers and the OSI model's seven; how headers are
    added and removed (encapsulation); the end-to-end argument and the "hourglass" shape of the internet.

    **You need:** [Chapter 1](01-What-a-Network-Is.md).

## 2.1 What a protocol is

A **protocol** is an agreement on the **format** and **order** of messages between two parties, and the **actions**
taken when a message arrives or does not. Human conversation has protocols too: you say "hello", wait for "hello"
back, ask your question, and if there is silence you repeat it. A network protocol writes all of that down exactly,
in an RFC or IEEE standard, so that equipment from different makers works together.

## 2.2 Why layers

Getting a web page from a server in Japan involves voltages on copper, radio frames, route choices across a dozen
networks, retransmission of lost data and the meaning of HTTP requests. No one could design that as one piece.
**Layering** splits the job: each layer solves one problem, offers a service to the layer above, and treats the layer
below as a black box. You can then replace one layer (copper for fibre, Wi-Fi for 5G) without touching the others.

## 2.3 The internet's five layers

| Layer | Job | Unit of data | Examples |
| --- | --- | --- | --- |
| 5. Application | what the programs say to each other | message | HTTP, DNS, SMTP, SSH |
| 4. Transport | deliver data between programs (ports), reliably if needed | segment (TCP), datagram (UDP) | TCP, UDP, QUIC |
| 3. Network | move packets from host to host across many networks | packet (datagram) | IP, ICMP, routing protocols |
| 2. Link | move a frame across one link | frame | Ethernet, Wi-Fi, 5G radio link |
| 1. Physical | move bits as signals | bit | copper, fibre, radio |

Hosts implement all five layers. Routers implement the bottom three; switches the bottom two. That is why a router
does not care whether you are loading a web page or making a call: it only reads the network-layer header.

## 2.4 The OSI model

In the 1980s the ISO standardised a seven-layer **Open Systems Interconnection (OSI)** model. Its protocols lost to
TCP/IP, but its vocabulary stuck: engineers still say "layer 2 switch", "layer 4 load balancer" or "layer 7 firewall".
OSI adds two layers between transport and application:

- **Session** (layer 5): setting up, checkpointing and ending a dialogue;
- **Presentation** (layer 6): data formats, compression, encryption.

On the internet these jobs are left to the application (for example TLS does encryption, and HTTP handles formats),
so the five-layer model is the more honest description. When someone says "layer 7" they mean the application.

## 2.5 Encapsulation

Each layer adds its own **header** in front of the data from the layer above, and the receiver strips them off in
reverse order. A web request leaving your laptop looks like this:

<figure class="mars-fig">
<svg viewBox="0 0 560 180" width="560" role="img" aria-label="Encapsulation: application data gets TCP, IP and Ethernet headers added in turn">
<g fill="none" stroke="currentColor" stroke-width="1.8">
<rect x="330" y="10" width="200" height="30" class="soft"/>
<rect x="270" y="55" width="60" height="30" class="soft-acc"/><rect x="330" y="55" width="200" height="30" class="soft"/>
<rect x="210" y="100" width="60" height="30" class="soft-acc"/><rect x="270" y="100" width="260" height="30" class="soft"/>
<rect x="150" y="145" width="60" height="30" class="soft-acc"/><rect x="210" y="145" width="320" height="30" class="soft"/><rect x="530" y="145" width="22" height="30" class="soft-acc"/></g>
<g font-size="13" fill="currentColor" text-anchor="middle">
<text x="430" y="30">HTTP request</text><text x="300" y="75">TCP</text><text x="430" y="75">segment</text>
<text x="240" y="120">IP</text><text x="400" y="120">packet</text><text x="180" y="165">Eth</text><text x="370" y="165">frame</text>
<text x="70" y="30">application</text><text x="70" y="75">transport</text><text x="70" y="120">network</text><text x="70" y="165">link</text></g>
</svg>
<figcaption>Encapsulation: each layer wraps the data from above in its own header (Ethernet also adds a checksum trailer at the end).</figcaption>
</figure>

Typical sizes: Ethernet header 14 bytes plus a 4-byte trailer, IPv4 header 20 bytes, TCP header 20 bytes (more with
options). On a 1,500-byte Ethernet payload, about 1,460 bytes are left for application data. The **maximum
transmission unit (MTU)** is the largest packet a link can carry; 1,500 bytes is standard Ethernet.

## 2.6 The end-to-end argument

In 1984 Saltzer, Reed and Clark argued that a function such as reliable delivery "can completely and correctly be
implemented only with the knowledge and help of the application standing at the end points". The network in the middle
can help (for speed) but cannot guarantee it alone: a file can be corrupted in a host's memory after every link checked
it. So the internet keeps the middle simple: IP offers only **best-effort** delivery (packets may be lost, duplicated or
reordered), and reliability lives in the hosts, in TCP.

This gives the internet its **hourglass** shape: many link technologies at the bottom, many applications at the top,
and one thin waist, IP, that everything shares. A new application needs no permission from the network, and a new link
technology only has to carry IP packets.

In practice the middle has grown: **middleboxes** such as NAT devices, firewalls and load balancers read and rewrite
headers above layer 3. They are useful, but they make new transport protocols hard to deploy, which is one reason QUIC
(Chapter 19) runs on top of UDP and encrypts almost all of its header.

## 2.7 Services: connection or not, reliable or not

Each layer offers a **service** with some guarantees and not others:

| Service | Guarantees | Example |
| --- | --- | --- |
| Best-effort datagrams | none: may lose, reorder, duplicate | IP, UDP |
| Reliable byte stream | everything arrives, once, in order | TCP |
| Reliable, multiplexed, encrypted streams | the above, per stream, plus privacy | QUIC |

## Check yourself

??? question "1. Which layers does a router implement, and why not the others?"
    Physical, link and network. It only needs to read the IP header to forward; transport and application are the hosts' business.

??? question "2. A 1,500-byte Ethernet payload carries a TCP segment over IPv4 with no options. How many bytes of application data fit?"
    1,500 − 20 (IP) − 20 (TCP) = 1,460 bytes.

??? question "3. State the end-to-end argument in one sentence."
    Functions like reliability can only be fully guaranteed by the end hosts, so the network core should stay simple and leave them to the ends.

??? info "Sources"
    - J. Saltzer, D. Reed, D. Clark, "End-to-End Arguments in System Design", *ACM TOCS*, 1984.
    - ISO/IEC 7498-1 (the OSI reference model).
    - RFC 1122 (requirements for internet hosts: the layers), RFC 791 (IP), RFC 9293 (TCP).
    - D. Clark, "The Design Philosophy of the DARPA Internet Protocols", SIGCOMM 1988.
