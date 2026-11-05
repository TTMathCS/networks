# 3. Addresses and names

*Every device on the internet has an address made of numbers, like a house number. People prefer names like "akadian.ca", so the internet has a giant phone book that turns names into addresses.*

## An address for every device

A letter needs an address so the post office knows where to take it. A packet needs one too. On the internet it is
called an **IP address** (IP stands for Internet Protocol, the main rule book of the internet). The older kind looks
like four numbers with dots:

```
142.250.80.46
```

Each of the four numbers is between 0 and 255. That gives about 4.3 billion different addresses, which sounded like
plenty in 1981 but is fewer than the number of phones on Earth today. So a newer kind, **IPv6**, uses much longer
addresses, written in groups of letters and digits:

```
2607:f8b0:4005:80a::200e
```

IPv6 has so many addresses (a 39-digit number of them) that every grain of sand on Earth could have billions.

## Home addresses and street addresses

Your home router has one address that the rest of the internet sees. The devices inside your home get their own
private addresses, often starting with 192.168. When your laptop sends a packet out, the router swaps the private
address for the home's public one, and remembers to send the answer back to the laptop. It is like a family sharing
one street address, with names on the envelopes to tell the people inside apart.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 395" role="img" aria-labelledby="sk-n-nat-t"><title id="sk-n-nat-t">Three devices in a home with private addresses 192.168.1.10 to .12 send through one router, which swaps them for the one public address the internet sees</title><defs><filter id="sk-n-nat-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-n-nat-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-n-nat-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-n-nat-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-n-nat-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="395" filter="url(#sk-n-nat-paper)"/><g filter="url(#sk-n-nat-pen)"><text x="30" y="44" class="h">One street address, many names inside</text><path class="p soft" d="M40 120 L60 90 L250 90 L270 120 L270 330 L40 330Z"/><text x="155" y="112" text-anchor="middle" class="l">your home</text><path class="p room" d="M60 135 L180 135 L180 181 L60 181Z"/><text x="120.0" y="158.0" text-anchor="middle" class="s">laptop</text><text x="120.0" y="176.0" text-anchor="middle" class="s">192.168.1.10</text><path class="p " d="M182 158 L300 230" marker-end="url(#sk-n-nat-ah)"/><path class="p room" d="M60 197 L180 197 L180 243 L60 243Z"/><text x="120.0" y="220.0" text-anchor="middle" class="s">phone</text><text x="120.0" y="238.0" text-anchor="middle" class="s">192.168.1.11</text><path class="p " d="M182 220 L300 230" marker-end="url(#sk-n-nat-ah)"/><path class="p room" d="M60 259 L180 259 L180 305 L60 305Z"/><text x="120.0" y="282.0" text-anchor="middle" class="s">tablet</text><text x="120.0" y="300.0" text-anchor="middle" class="s">192.168.1.12</text><path class="p " d="M182 282 L300 230" marker-end="url(#sk-n-nat-ah)"/><path class="p gold" d="M300 195 L410 195 L410 265 L300 265Z"/><text x="355.0" y="230.0" text-anchor="middle" class="s">router</text><text x="355.0" y="248.0" text-anchor="middle" class="s">swaps addresses</text><path class="p " d="M412 230 L470 230" marker-end="url(#sk-n-nat-ah)"/><path class="p soft" d="M480 230 C470 170 540 150 570 180 C610 160 640 210 610 240 C640 280 580 310 550 285 C520 310 470 290 480 230Z"/><text x="555" y="236" text-anchor="middle" class="l">internet</text><text x="440" y="96" class="s">The internet sees only</text><text x="440" y="116" class="s">203.0.113.7, the home's</text><text x="440" y="136" class="s">one public address.</text><text x="40" y="360" class="s">Inside: private addresses (192.168…). The router remembers who asked,</text><text x="40" y="380" class="s">so each answer goes back to the right device.</text></g></svg><figcaption>Sketched for this page. 203.0.113.7 is an address kept for examples.</figcaption></figure>

## Names are easier

Nobody wants to type 142.250.80.46. So the internet has the **Domain Name System (DNS)**: a huge, shared phone book.
When you type a name such as `www.akadian.ca`, your computer first asks a DNS server "what is the address of this
name?" and only then sends its packets to that address.

Names are read from right to left, like a postal address from country down to house:

| Part | Meaning |
| --- | --- |
| `.ca` | the top: Canada's part of the phone book |
| `akadian` | the owner's name inside `.ca` |
| `www` | one computer (or service) of that owner |

No single computer holds the whole phone book. The top servers know who looks after `.ca`; the `.ca` servers know
who looks after `akadian.ca`; and that one knows the address of `www.akadian.ca`. Your computer follows the chain,
then remembers the answer for a while so the next visit is instant.

<figure class="play" data-play="dnswalk"><span class="ai-tag">AI-created</span><figcaption><b>Watch it.</b> Looking up www.akadian.ca the first time: the resolver asks the root, then the .ca servers, then akadian.ca’s own server, reading the name from right to left. Ask again and it answers from memory. Server names simplified.</figcaption></figure>

## Two more numbers

Each packet carries two more labels:

- a **port** number, which says which program on the device should get it, like a flat number in a building. Web
  pages use port 443; email often uses 587.
- a **MAC address**, built into each network card, used only on the local link (the last few metres).

## Activity: the class phone book

Give each student a "number" (their seat number) and a "name" (a nickname). One student is the DNS server and keeps
the list. To send a note, you must first ask DNS for your friend's seat number and write it on the note. What happens
if the DNS student is absent? (Nobody can find anyone by name: a real problem that has stopped big websites.)

## Check yourself

??? question "1. Why does the internet need IPv6?"
    The old IPv4 addresses allow only about 4.3 billion devices, fewer than there are now. IPv6 addresses are far longer, so there are enough for everything.

??? question "2. What does DNS do?"
    It turns a name people can remember, like www.akadian.ca, into the numeric IP address computers use.

??? question "3. What is a port?"
    A number that says which program on a device a packet is for, like a flat number in a building.

??? info "Sources"
    - RFC 791 (IPv4, 1981), RFC 8200 (IPv6), RFC 1918 (private addresses), RFC 1034 and 1035 (DNS).
    - IANA, *Service Name and Transport Protocol Port Number Registry* (ports 443 and 587).

[← Packets](02-Packets.md) · [Next: Wires and radio waves →](04-Wires-and-Radio.md)
