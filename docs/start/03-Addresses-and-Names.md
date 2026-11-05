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
