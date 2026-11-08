# How a web page reaches you: addresses, routers, HTTPS and the journey of one click

*Everything that happens between tapping a link and seeing the page, told one piece at a time: the addresses, the
boxes that pass messages along, the lock that keeps them private, and the copies that make them fast. Every term is
explained the first time, and the [glossary](#glossary) collects them.*

[The big picture](#the-big-picture) · [Addresses](#ip-addresses-the-street-numbers) · [Packets](#packets-a-page-in-pieces) · [Your home network](#your-home-network) · [Routers](#routers-passing-the-parcel) · [The internet's map](#how-routers-know-the-way) · [TCP and QUIC](#tcp-and-quic-nothing-lost-nothing-out-of-order) · [HTTPS](#https-the-lock) · [HTTP](#http-asking-for-the-page) · [CDNs](#cdns-copies-close-to-you) · [Who runs it](#who-runs-the-numbers-and-the-cables) · [One click, timed](#one-click-timed) · [Glossary](#glossary)

## The big picture

When you open `https://www.maplehill.example/news`, about a dozen separate systems cooperate in under a second.
Here is the whole trip on one page; each part is explained below.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 380" role="img" aria-labelledby="sk-nw-trip-t"><title id="sk-nw-trip-t">The journey of one click: your device asks DNS for the number, then the request goes through your home router, your provider and 10 to 20 routers to the server, inside a TLS lock, and the page comes back the same way</title><defs><filter id="sk-nw-trip-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-trip-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-trip-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-trip-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-trip-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="380" filter="url(#sk-nw-trip-paper)"/><g filter="url(#sk-nw-trip-pen)"><text x="30" y="44" class="h">The journey of one click</text><path class="p room" d="M30 150 L130 150 L130 210 L30 210Z"/><text x="80.0" y="186.0" text-anchor="middle" class="s">you</text><path class="p room" d="M140 150 L240 150 L240 210 L140 210Z"/><text x="190.0" y="186.0" text-anchor="middle" class="s">home router</text><path class="p room" d="M265 150 L365 150 L365 210 L265 210Z"/><text x="315.0" y="186.0" text-anchor="middle" class="s">provider</text><path class="p room" d="M380 150 L480 150 L480 210 L380 210Z"/><text x="430.0" y="186.0" text-anchor="middle" class="s">the internet</text><path class="p gold" d="M510 150 L610 150 L610 210 L510 210Z"/><text x="560.0" y="186.0" text-anchor="middle" class="s">server</text><path class="p " d="M132 180 L138 180" marker-end="url(#sk-nw-trip-ah)"/><path class="p " d="M242 180 L263 180" marker-end="url(#sk-nw-trip-ah)"/><path class="p " d="M367 180 L378 180" marker-end="url(#sk-nw-trip-ah)"/><path class="p " d="M482 180 L508 180" marker-end="url(#sk-nw-trip-ah)"/><path class="p room" d="M220 260 L380 260 L380 314 L220 314Z"/><text x="300.0" y="293.0" text-anchor="middle" class="s">DNS resolver</text><path class="p dash" d="M80 212 Q120 290 218 287" marker-end="url(#sk-nw-trip-ah)"/><text x="30" y="310" class="s">1 name → number</text><text x="135" y="132" class="s" text-anchor="middle">2 Wi-Fi</text><text x="370" y="132" class="s" text-anchor="middle">3 10 to 20 routers</text><text x="565" y="132" class="s" text-anchor="middle">4 TLS lock</text><text x="420" y="250" class="s">5 HTTP: “send /news”</text><text x="420" y="272" class="s">6 the page comes back</text><text x="420" y="294" class="s">   the same way</text><text x="30" y="360" class="s">Each piece is a separate system, often run by a different company.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

1. **Find the address.** DNS turns the name into a number ([How DNS works](How-DNS-Works.md)).
2. **Leave home.** Your phone or laptop sends the request over Wi-Fi or a cable to your **router**.
3. **Cross the internet.** The request is cut into **packets**, and dozens of **routers**, run by several
   different companies, pass each packet one step closer to the server.
4. **Open a safe line.** Your browser and the server agree on secret keys (**TLS**), so the rest is private: that is
   the lock in the address bar.
5. **Ask for the page.** The browser sends an **HTTP** request: "please send `/news`."
6. **Get the answer.** The server (or a nearby copy of it, a **CDN**) sends the page back the same way, and the
   browser draws it, then asks for the pictures, styles and scripts the page mentions.

## IP addresses: the street numbers

Every device that talks on the internet needs an **IP address** (IP = Internet Protocol), just as every house needs
a street address for letters to arrive. There are two kinds in use today:

| Kind | Looks like | How many | Notes |
|---|---|---|---|
| **IPv4** (since 1983) | `203.0.113.10`: four numbers from 0 to 255 | about 4.3 billion | long since used up; stretched by sharing (NAT, below) |
| **IPv6** (since the late 1990s) | `2001:db8:4f2a::10`: eight groups of hexadecimal digits | 340 undecillion (3.4 × 10³⁸) | enough for every device forever; now carries close to half of Google's traffic |

An address has two parts, like a postcode and a house number: the first part says **which network**, the rest says
**which device on it**. Routers only look at the network part until the message reaches the right network.

**Public and private addresses.** A few ranges, such as `192.168.x.x` and `10.x.x.x`, are **private**: used inside
homes, schools and offices, never seen on the open internet, and reused by millions of networks at once. The
**public** address is the one the rest of the internet sees, usually one per home or building.

## Packets: a page in pieces

Messages do not travel in one piece. A web page, a photo or a video call is cut into **packets** of at most about
1,500 bytes each (around a paragraph of text). Each packet carries:

- the **destination address** and the **source address** (where to send replies),
- some **numbers to put the pieces back in order**,
- and a slice of the content.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 400" role="img" aria-labelledby="sk-nw-packet-t"><title id="sk-nw-packet-t">A packet as nested envelopes: the Wi-Fi or Ethernet layer, inside it the IP layer with addresses, inside it the TCP or QUIC layer with order and port, and inside that a slice of the page</title><defs><filter id="sk-nw-packet-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-packet-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-packet-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-packet-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-packet-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="400" filter="url(#sk-nw-packet-paper)"/><g filter="url(#sk-nw-packet-pen)"><text x="30" y="44" class="h">A packet: a letter in envelopes</text><path class="p room" d="M30 70 L610 70 L610 340 L30 340Z"/><text x="44" y="100" class="s">Wi-Fi or Ethernet: to the next box only</text><path class="p room" d="M60 120 L580 120 L580 320 L60 320Z"/><text x="74" y="150" class="s">IP: from 192.168.1.23 to 203.0.113.10</text><path class="p room" d="M90 170 L550 170 L550 300 L90 300Z"/><text x="104" y="200" class="s">TCP or QUIC: piece 3 of 9, port 443</text><path class="p gold" d="M120 220 L520 220 L520 280 L120 280Z"/><text x="134" y="250" class="s">the content: a slice of the page</text><text x="30" y="380" class="l">Each box on the way opens only the envelope it needs.</text></g></svg><figcaption>Sketched for this page. Example addresses.</figcaption></figure>

Like postcards, each packet travels on its own. Two packets of the same page may take different roads and arrive
in a different order; the receiving computer sorts them out. This is called **packet switching**, and it is why the
internet keeps working when a link breaks: packets simply flow around the gap. The [first Start lesson on
packets](../start/02-Packets.md) shows it with pictures.

Packets are wrapped in layers, like a letter inside an envelope inside a mail bag: the web request inside a
**TCP** or **QUIC** wrapper (for order and reliability) inside an **IP** wrapper (for addresses) inside a **Wi-Fi**
or **Ethernet** wrapper (for the one hop to the next box). Each box on the way opens only the layers it needs.

## Your home network

Your **home router** (often one box with the internet provider's modem) does four jobs at once:

| Job | What it does | Everyday picture |
|---|---|---|
| **Wi-Fi access point** | the radio your devices connect to | the front door |
| **DHCP server** | gives each device a private address when it joins (`192.168.1.23`) | a receptionist handing out room numbers |
| **NAT** (network address translation) | swaps private addresses for the home's one public address on the way out, and back on the way in | the building's single street address, with a list of who asked for what |
| **Router** | sends anything not for the home out to the provider | the post box at the end of the road |

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 390" role="img" aria-labelledby="sk-nw-home-t"><title id="sk-nw-home-t">Laptop, phone and TV with private addresses connect to the home router, which hands out addresses, translates them to one public address and sends traffic to the provider</title><defs><filter id="sk-nw-home-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-home-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-home-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-home-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-home-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="390" filter="url(#sk-nw-home-paper)"/><g filter="url(#sk-nw-home-pen)"><text x="30" y="44" class="h">Four jobs in one home box</text><path class="p soft" d="M30 110 L60 80 L330 80 L360 110 L360 370 L30 370Z"/><text x="195" y="105" class="s" text-anchor="middle">home</text><path class="p room" d="M50 125 L190 125 L190 181 L50 181Z"/><text x="120.0" y="148.0" text-anchor="middle" class="l">laptop</text><text x="120.0" y="170.0" text-anchor="middle" class="s">192.168.1.23</text><path class="p " d="M192 153 L238 230" marker-end="url(#sk-nw-home-ah)"/><path class="p room" d="M50 203 L190 203 L190 259 L50 259Z"/><text x="120.0" y="226.0" text-anchor="middle" class="l">phone</text><text x="120.0" y="248.0" text-anchor="middle" class="s">192.168.1.24</text><path class="p " d="M192 231 L238 230" marker-end="url(#sk-nw-home-ah)"/><path class="p room" d="M50 281 L190 281 L190 337 L50 337Z"/><text x="120.0" y="304.0" text-anchor="middle" class="l">TV</text><text x="120.0" y="326.0" text-anchor="middle" class="s">192.168.1.25</text><path class="p " d="M192 309 L238 230" marker-end="url(#sk-nw-home-ah)"/><path class="p gold" d="M240 180 L350 180 L350 280 L240 280Z"/><text x="295.0" y="214.0" text-anchor="middle" class="l">router</text><text x="295.0" y="236.0" text-anchor="middle" class="s">Wi-Fi · DHCP</text><text x="295.0" y="258.0" text-anchor="middle" class="s">NAT · routing</text><path class="p " d="M352 230 L440 230" marker-end="url(#sk-nw-home-ah)"/><path class="p room" d="M442 200 L612 200 L612 260 L442 260Z"/><text x="527.0" y="236.0" text-anchor="middle" class="l">provider</text><text x="380" y="150" class="s">the internet sees only</text><text x="380" y="170" class="s">one address: 198.51.100.7</text></g></svg><figcaption>Sketched for this page. Example addresses.</figcaption></figure>

Beyond your router is your **internet provider** (ISP: Rogers, Bell, Comcast, BT, a fibre co-op…), whose own network
reaches a city or a country. That network connects to others, and the "inter-network" of all of them is the
internet.

## Routers: passing the parcel

A **router** is a computer whose only job is to forward packets. Each one keeps a **routing table**, a list like
"addresses starting with 203.0.113 → send out of door 3". For each arriving packet it reads the destination,
finds the best matching line, and sends the packet one hop onward, millions of times a second. No router knows the
whole path; each only knows the next step, like a relay of postmen who each know only the next sorting office.

A typical page request crosses **10 to 20 routers**. You can see them: the command `traceroute` (macOS, Linux) or
`tracert` (Windows) lists every hop and how long each took; [Lab 2](../labs/02-Ping-and-Traceroute.md) shows how.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 400" role="img" aria-labelledby="sk-nw-hops-t"><title id="sk-nw-hops-t">A packet passes from router to router, each choosing the next hop from its routing table; a second, dashed road is used if a link breaks</title><defs><filter id="sk-nw-hops-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-hops-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-hops-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-hops-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-hops-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="400" filter="url(#sk-nw-hops-paper)"/><g filter="url(#sk-nw-hops-pen)"><text x="30" y="44" class="h">Hop by hop: each router knows the next step</text><path class="p " d="M74 296 L134 234" marker-end="url(#sk-nw-hops-ah)"/><path class="p " d="M164 226 L224 274" marker-end="url(#sk-nw-hops-ah)"/><path class="p " d="M254 266 L314 184" marker-end="url(#sk-nw-hops-ah)"/><path class="p " d="M344 176 L404 234" marker-end="url(#sk-nw-hops-ah)"/><path class="p " d="M434 226 L494 154" marker-end="url(#sk-nw-hops-ah)"/><path class="p " d="M524 146 L574 204" marker-end="url(#sk-nw-hops-ah)"/><path class="p dash" d="M160 236 L232 334 L322 318 L412 328 L506 160"/><circle cx="60" cy="300" r="14" class="p gold"/><circle cx="150" cy="230" r="14" class="p room"/><circle cx="240" cy="270" r="14" class="p room"/><circle cx="330" cy="180" r="14" class="p room"/><circle cx="420" cy="230" r="14" class="p room"/><circle cx="510" cy="150" r="14" class="p room"/><circle cx="590" cy="200" r="14" class="p gold"/><circle cx="240" cy="340" r="14" class="p room"/><circle cx="330" cy="320" r="14" class="p room"/><circle cx="420" cy="330" r="14" class="p room"/><text x="30" y="340" class="s">you</text><text x="560" y="240" class="s">server</text><text x="340" y="380" class="s">another road if a link breaks</text><path class="p room" d="M380 70 L610 70 L610 134 L380 134Z"/><text x="495.0" y="97.0" text-anchor="middle" class="l">routing table</text><text x="495.0" y="119.0" text-anchor="middle" class="s">203.0.113.* → door 3</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

Between continents, packets travel through **undersea fibre-optic cables**: more than 500 of them, some longer than
20,000 km, carry almost all traffic between continents. Light in glass covers about 200 km every millisecond, so the
round trip from Toronto to London (at least 11,000 km there and back by cable) can never take less than about 55 ms.
Satellites add more routes, but cables still do most of the work.

## How routers know the way

The internet is not one network but **tens of thousands** of independently run networks: internet providers,
universities, cloud companies, governments. Each is called an **autonomous system** (AS) and has a number (an
**ASN**). They meet at **internet exchange points** (IXPs: buildings where many networks plug into a shared switch,
such as TorIX in Toronto or DE-CIX in Frankfurt) and through private links.

Each network tells its neighbours which addresses it can reach, using a protocol called **BGP**, the Border Gateway
Protocol: "I can deliver to 203.0.113.0/24, through me." Neighbours pass the news on, adding themselves to the path,
and every network picks the routes it prefers (shortest, cheapest, most reliable). This **gossip** is how a packet
from a laptop in Calgary finds a server in Singapore, without any central map.

!!! warning "Built on trust"
    BGP was designed in 1989 for a small community that trusted each other, so a network can announce addresses
    that are not its own, by mistake or on purpose. In 2008 a mistaken announcement made YouTube unreachable for
    much of the world for about two hours. **RPKI** (signed records saying which network may announce which
    addresses) now lets routers reject many such mistakes; most large networks check it.

## TCP and QUIC: nothing lost, nothing out of order

IP delivers packets on a **best effort** basis: a packet can be lost, duplicated or arrive late. Something has to
put the page back together correctly. That is the job of a **transport protocol**:

- **TCP** (Transmission Control Protocol, 1981): numbers every byte, has the receiver confirm what arrived, and
  resends what did not. It opens with a short **handshake** ("hello" / "hello back" / "ready"), and slows down when
  the network is congested so that everyone gets a fair share.
- **QUIC** (2021): a newer protocol from Google, now a standard, that does the same job over UDP, combines the
  handshake with the encryption one (saving a round trip), and copes better with lost packets and with phones
  switching from Wi-Fi to mobile data. **HTTP/3** runs on QUIC and now carries a large share of web traffic.

**Ports** let one computer run many services: the address finds the computer, the **port number** finds the
program. Web servers listen on port **443** for HTTPS (and 80 for old plain HTTP); email servers on 25.

## HTTPS: the lock

Without protection, anyone along the path (the café's Wi-Fi, an internet provider, a compromised router) could read
or change what you send and receive. **TLS** (Transport Layer Security) prevents that; **HTTPS** is simply HTTP
carried inside TLS. Before any page is sent:

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 380" role="img" aria-labelledby="sk-nw-tls-t"><title id="sk-nw-tls-t">TLS 1.3: the browser says hello, the server answers with its certificate and key share, the browser checks the certificate, and both use the shared key to encrypt the request</title><defs><filter id="sk-nw-tls-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-tls-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-tls-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-tls-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-tls-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="380" filter="url(#sk-nw-tls-paper)"/><g filter="url(#sk-nw-tls-pen)"><text x="30" y="44" class="h">Opening the lock: one round trip</text><path class="p room" d="M30 80 L170 80 L170 140 L30 140Z"/><text x="100.0" y="116.0" text-anchor="middle" class="l">browser</text><path class="p gold" d="M470 80 L610 80 L610 140 L470 140Z"/><text x="540.0" y="116.0" text-anchor="middle" class="l">server</text><path class="p" d="M100 142 L100 360 M540 142 L540 360"/><path class="p " d="M102 170 L538 188" marker-end="url(#sk-nw-tls-ah)"/><text x="320" y="162" class="s" text-anchor="middle">hello: I speak TLS 1.3, I want maplehill.example</text><path class="p " d="M538 225 L102 243" marker-end="url(#sk-nw-tls-ah)"/><text x="320" y="217" class="s" text-anchor="middle">hello + certificate + its half of the key</text><text x="320" y="296" class="s" text-anchor="middle">checks the certificate; both now share a key</text><path class="p " d="M102 335 L538 353" marker-end="url(#sk-nw-tls-ah)"/><text x="320" y="327" class="s" text-anchor="middle">encrypted: GET /news …</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

1. **Hello.** Your browser says which encryption methods it supports and which site it wants.
2. **Proof of identity.** The server sends its **certificate**: a digital document saying "this key belongs to
   `www.maplehill.example`", signed by a **certificate authority** (CA) that your browser already trusts, such as
   Let's Encrypt. The browser checks the signature, the name and the dates.
3. **Shared secret.** Browser and server each contribute a random number and, with a little mathematics
   (Diffie–Hellman key exchange), both arrive at the same secret key that nobody watching can work out.
4. **Private line.** Everything after this is encrypted with that key, and any change on the way is detected.

All of this takes one round trip in TLS 1.3 (the current version). The lock icon means two things: **the
connection is private**, and **the server proved this name**. It does not mean the site is honest: a scam site at
`maplehi11-school.example` can have a perfectly valid lock for its own fake name. Read the name. More in [How HTTPS
keeps a page private](../topics/HTTPS.md).

## HTTP: asking for the page

**HTTP** (HyperText Transfer Protocol) is the language of the web: short, readable requests and replies. The browser
sends:

```http
GET /news HTTP/1.1
Host: www.maplehill.example
Accept-Language: en-CA
```

and the server answers with a **status code**, some **headers**, and the content:

```http
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: max-age=600

<!doctype html> <html> … the page …
```

| Code | Meaning | You may have seen |
|---|---|---|
| **200** | OK, here it is | (nothing: the page just loads) |
| **301 / 302** | it moved, go here instead | the address bar changes by itself |
| **404** | no such page | "Page not found" |
| **403** | not allowed | "Forbidden" |
| **500 / 502 / 503** | the server or something behind it failed | "Bad gateway", "Service unavailable" |

The first answer is only the page's skeleton (HTML). It names other files: pictures, styles (CSS), scripts
(JavaScript), fonts. The browser fetches each, often 50 to 100 requests for one modern page, all over the same
private connection.

## CDNs: copies close to you

Light is fast but not instant, and every round trip across an ocean costs a tenth of a second. So most large sites
use a **content delivery network** (CDN): a company (Cloudflare, Akamai, Fastly, Amazon CloudFront and others) with
servers in hundreds of cities that keep **copies** of a site's files.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 400" role="img" aria-labelledby="sk-nw-cdn-t"><title id="sk-nw-cdn-t">An origin server feeds copies to CDN edge servers in Vancouver, Toronto, London and Sydney; a visitor in Toronto is served by the Toronto copy in a few milliseconds</title><defs><filter id="sk-nw-cdn-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-cdn-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-cdn-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-cdn-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-cdn-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="400" filter="url(#sk-nw-cdn-paper)"/><g filter="url(#sk-nw-cdn-pen)"><text x="30" y="44" class="h">A copy near you</text><path class="p gold" d="M440 80 L610 80 L610 144 L440 144Z"/><text x="525.0" y="107.0" text-anchor="middle" class="l">origin server</text><text x="525.0" y="129.0" text-anchor="middle" class="s">the site itself</text><path class="p room" d="M40 225 L150 225 L150 275 L40 275Z"/><text x="95.0" y="256.0" text-anchor="middle" class="s">Vancouver</text><path class="p dash" d="M95 223 L525 146"/><path class="p room" d="M185 265 L295 265 L295 315 L185 315Z"/><text x="240.0" y="296.0" text-anchor="middle" class="s">Toronto</text><path class="p dash" d="M240 263 L525 146"/><path class="p room" d="M345 225 L455 225 L455 275 L345 275Z"/><text x="400.0" y="256.0" text-anchor="middle" class="s">London</text><path class="p dash" d="M400 223 L525 146"/><path class="p room" d="M500 265 L610 265 L610 315 L500 315Z"/><text x="555.0" y="296.0" text-anchor="middle" class="s">Sydney</text><path class="p dash" d="M555 263 L525 146"/><text x="240" y="370" class="s" text-anchor="middle">you, in Toronto: a few ms</text><path class="p " d="M240 350 L240 318" marker-end="url(#sk-nw-cdn-ah)"/><text x="30" y="120" class="s">edge copies,</text><text x="30" y="140" class="s">filled from</text><text x="30" y="160" class="s">the origin once</text></g></svg><figcaption>Sketched for this page. A made-up set of cities.</figcaption></figure>

When you visit, DNS (or anycast routing) sends you to the nearest copy, the **edge**, often in your own city. If the
edge has the file, it answers in a few milliseconds; if not, it fetches it once from the site's own server, the
**origin**, and keeps it for the next visitor, for as long as the `Cache-Control` header allows. CDNs also absorb
attacks: a flood of fake traffic is spread over hundreds of cities instead of hitting one server.

## Who runs the numbers and the cables

Like DNS, the internet has no owner. The pieces are run like this:

| Piece | Who keeps it |
|---|---|
| The pool of all IP addresses and AS numbers | **IANA**, which hands large blocks to five regional registries |
| Addresses for each region | the five **regional internet registries** (RIRs): **ARIN** (Canada, US, parts of the Caribbean), **RIPE NCC** (Europe, Middle East, Central Asia), **APNIC** (Asia-Pacific), **LACNIC** (Latin America), **AFRINIC** (Africa) |
| Addresses for your home | your internet provider, from its RIR block |
| The rules of the protocols (IP, TCP, HTTP, TLS, DNS) | the **IETF** (Internet Engineering Task Force), an open community anyone can join, publishing standards called **RFCs** |
| Web formats (HTML, CSS) | the **W3C** and **WHATWG** |
| Cables, routers, exchange points | thousands of companies, universities and governments, each running its own part and agreeing to connect |

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 450" role="img" aria-labelledby="sk-nw-rirs-t"><title id="sk-nw-rirs-t">IANA hands blocks of addresses to five regional registries, ARIN, RIPE NCC, APNIC, LACNIC and AFRINIC, which give them to internet providers, which give one to your home</title><defs><filter id="sk-nw-rirs-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-rirs-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-rirs-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-rirs-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-rirs-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="450" filter="url(#sk-nw-rirs-paper)"/><g filter="url(#sk-nw-rirs-pen)"><text x="30" y="44" class="h">Where addresses come from</text><path class="p gold" d="M220 70 L420 70 L420 126 L220 126Z"/><text x="320.0" y="93.0" text-anchor="middle" class="l">IANA</text><text x="320.0" y="115.0" text-anchor="middle" class="s">the whole pool</text><path class="p room" d="M20 190 L132 190 L132 254 L20 254Z"/><text x="76.0" y="217.0" text-anchor="middle" class="s">ARIN</text><text x="76.0" y="239.0" text-anchor="middle" class="s">N. America</text><path class="p" d="M320 128 L76 188" marker-end="url(#sk-nw-rirs-ah)"/><path class="p room" d="M142 190 L254 190 L254 254 L142 254Z"/><text x="198.0" y="217.0" text-anchor="middle" class="s">RIPE NCC</text><text x="198.0" y="239.0" text-anchor="middle" class="s">Europe</text><path class="p" d="M320 128 L198 188" marker-end="url(#sk-nw-rirs-ah)"/><path class="p room" d="M264 190 L376 190 L376 254 L264 254Z"/><text x="320.0" y="217.0" text-anchor="middle" class="s">APNIC</text><text x="320.0" y="239.0" text-anchor="middle" class="s">Asia-Pacific</text><path class="p" d="M320 128 L320 188" marker-end="url(#sk-nw-rirs-ah)"/><path class="p room" d="M386 190 L498 190 L498 254 L386 254Z"/><text x="442.0" y="217.0" text-anchor="middle" class="s">LACNIC</text><text x="442.0" y="239.0" text-anchor="middle" class="s">Latin America</text><path class="p" d="M320 128 L442 188" marker-end="url(#sk-nw-rirs-ah)"/><path class="p room" d="M508 190 L620 190 L620 254 L508 254Z"/><text x="564.0" y="217.0" text-anchor="middle" class="s">AFRINIC</text><text x="564.0" y="239.0" text-anchor="middle" class="s">Africa</text><path class="p" d="M320 128 L564 188" marker-end="url(#sk-nw-rirs-ah)"/><path class="p room" d="M180 300 L460 300 L460 350 L180 350Z"/><text x="320.0" y="331.0" text-anchor="middle" class="l">your internet provider</text><path class="p " d="M76 256 L200 298" marker-end="url(#sk-nw-rirs-ah)"/><path class="p room" d="M240 390 L400 390 L400 434 L240 434Z"/><text x="320.0" y="418.0" text-anchor="middle" class="l">your home</text><path class="p " d="M320 352 L320 388" marker-end="url(#sk-nw-rirs-ah)"/></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## One click, timed

A rough timeline for opening a page from a server about 1,000 km away, on good home internet, the first time:

| Step | Time | Running total |
|---|---|---|
| DNS lookup (nothing cached) | 30 ms | 30 ms |
| TCP or QUIC handshake | 20 ms | 50 ms |
| TLS 1.3 handshake | 20 ms | 70 ms |
| HTTP request, server prepares the page, first bytes back | 60 ms | 130 ms |
| Page skeleton arrives; browser asks for pictures, styles, scripts | 150 ms | 280 ms |
| Browser lays out and paints the page | 100 ms | about 0.4 s |

The second visit is far quicker: DNS is cached, the connection may be reused, and many files are kept by the
browser or served by a nearby CDN edge. On a Mars base, by contrast, the very first step would take between 6 and
44 minutes, round trip; see [Talking to Mars](../start/06-Talking-to-Mars.md).

## Glossary

**Anycast**
: Many servers sharing one address; the network delivers to the nearest.

**Autonomous system (AS)**
: One independently run network on the internet, with its own number (ASN).

**BGP**
: Border Gateway Protocol: how networks tell each other which addresses they can reach.

**CDN**
: Content delivery network: servers in many cities that keep copies of websites close to visitors.

**Certificate / certificate authority (CA)**
: A signed document proving that a key belongs to a name / the trusted organisation that signs it.

**DHCP**
: The service that hands a device an address when it joins a network.

**HTTP / HTTPS**
: The request-and-reply language of the web / the same inside TLS encryption.

**IP address (IPv4, IPv6)**
: The number that identifies a device on the internet; IPv6 is the newer, much larger kind.

**IXP**
: Internet exchange point: a place where many networks connect to each other.

**NAT**
: Network address translation: many private addresses sharing one public address.

**Packet**
: A small piece of a message, with addresses, travelling on its own.

**Port**
: A number that picks the program on a computer: 443 for HTTPS, 25 for email between servers.

**RIR**
: Regional internet registry: one of five organisations that hand out IP addresses in their part of the world.

**Router**
: A device that forwards packets one step closer to their destination.

**Routing table**
: A router's list of which way to send each range of addresses.

**TCP / QUIC**
: Transport protocols that make delivery reliable and in order; QUIC is the newer one used by HTTP/3.

**TLS**
: Transport Layer Security: the encryption behind HTTPS and many other secure connections.

**Traceroute**
: A tool that lists each router a packet passes through.

## Keep reading

- [How DNS works](How-DNS-Works.md) and [How email gets delivered](Email-Delivery.md), the other explainers.
- [When the internet is down](../topics/Internet-Is-Down.md): use this page's map to find which piece is broken.
- In the books: [Routers and forwarding](../books/networks/11-Routers-and-Forwarding.md), [OSPF and BGP](../books/networks/13-OSPF-and-BGP.md), [TCP](../books/networks/16-TCP.md), [HTTP and QUIC](../books/networks/19-HTTP-and-QUIC.md), [TLS and HTTPS](../books/security/08-TLS-and-HTTPS.md).

??? info "Sources"
    - RFC 791 (IPv4), RFC 8200 (IPv6), RFC 1918 (private addresses), RFC 5737 and RFC 3849 (example addresses), RFC 2131 (DHCP), RFC 9293 (TCP), RFC 9000 (QUIC), RFC 9114 (HTTP/3), RFC 9110 (HTTP semantics and status codes), RFC 8446 (TLS 1.3), RFC 4271 (BGP-4), RFC 6480 (RPKI).
    - Google, *IPv6 adoption statistics* (google.com/intl/en/ipv6/statistics.html), checked November 2026.
    - RIPE NCC, *YouTube Hijacking: A RIPE NCC RIS case study* (February 2008).
    - TeleGeography, *Submarine Cable Map* and *Submarine Cable FAQs* (more than 500 cables; most intercontinental traffic).
    - IANA, *Number Resources*; NRO (Number Resource Organization), the five RIRs.
    - Timings in "One click, timed" are rounded examples, not measurements.
