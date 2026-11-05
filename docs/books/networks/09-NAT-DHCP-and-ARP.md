# 9. NAT, DHCP and ARP

*Three small protocols make a local IPv4 network work without anyone typing addresses: DHCP gives a host its address, ARP finds the MAC address behind an IP address, and NAT lets a whole home share one public address. This chapter takes each in turn, plus ICMP.*

!!! abstract "In this chapter"
    **You will learn:** the four DHCP messages and what a lease contains; how ARP resolves addresses and caches them;
    how NAT rewrites addresses and ports, its kinds, and what it breaks; NAT traversal; ICMP messages.

    **You need:** [Chapter 8](08-IPv4-Addressing-and-Subnets.md).

## 9.1 DHCP: getting an address

A laptop joining a network knows nothing: not its address, the mask, the router or the DNS server. The **Dynamic Host
Configuration Protocol** (RFC 2131) supplies all of it, over UDP (client port 68, server port 67), in four messages
remembered as **DORA**:

1. **Discover**: the client broadcasts from `0.0.0.0` to `255.255.255.255`: "is there a DHCP server?"
2. **Offer**: a server offers an address and settings.
3. **Request**: the client broadcasts which offer it accepts (telling any other servers no).
4. **Acknowledge**: the server confirms. The address is now **leased** for a time (often hours to a day).

The lease includes: address and mask, **default gateway**, **DNS servers**, lease time, and optional extras (a domain
name, NTP servers, boot information). At half the lease time the client asks to renew. Large networks put one DHCP
server in the data centre and let each router act as a **relay agent** that forwards the broadcasts to it as unicast.

DHCP trusts whoever answers first, so a **rogue DHCP server** can hand out itself as the gateway and see all
traffic; switches block this with **DHCP snooping** ([Security, chapter 5](../security/05-Attacks-on-the-Local-Network.md)).

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 395" role="img" aria-labelledby="sk-nb-dora-t"><title id="sk-nb-dora-t">A new laptop and a DHCP server exchange Discover, Offer, Request and Acknowledge; the laptop ends with an address leased for a time</title><defs><filter id="sk-nb-dora-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nb-dora-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nb-dora-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nb-dora-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nb-dora-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="395" filter="url(#sk-nb-dora-paper)"/><g filter="url(#sk-nb-dora-pen)"><text x="30" y="44" class="h">Four messages to join a network</text><path class="p room" d="M60 76 L180 76 L180 120 L60 120Z"/><text x="120.0" y="104.0" text-anchor="middle" class="s">new laptop</text><path class="p gold" d="M460 76 L580 76 L580 120 L460 120Z"/><text x="520.0" y="104.0" text-anchor="middle" class="s">DHCP server</text><path class="p dash" d="M120 122 L120 380 M520 122 L520 380"/><path class="p " d="M124 160 L516 160" marker-end="url(#sk-nb-dora-ah)"/><text x="320" y="150" text-anchor="middle" class="l">D · Discover</text><text x="320" y="180" text-anchor="middle" class="s">“is there a DHCP server?” (to everyone)</text><path class="p " d="M516 218 L124 218" marker-end="url(#sk-nb-dora-ah)"/><text x="320" y="208" text-anchor="middle" class="l">O · Offer</text><text x="320" y="238" text-anchor="middle" class="s">“you can have 192.168.1.23”</text><path class="p " d="M124 276 L516 276" marker-end="url(#sk-nb-dora-ah)"/><text x="320" y="266" text-anchor="middle" class="l">R · Request</text><text x="320" y="296" text-anchor="middle" class="s">“I take that one” (to everyone)</text><path class="p " d="M516 334 L124 334" marker-end="url(#sk-nb-dora-ah)"/><text x="320" y="324" text-anchor="middle" class="l">A · Acknowledge</text><text x="320" y="354" text-anchor="middle" class="s">“yours for 24 hours: gateway, DNS…”</text></g></svg><figcaption>Sketched for this page. The address and lease time are an example.</figcaption></figure>

## 9.2 ARP: from IP to MAC

To send a packet to `192.168.1.20` on the same subnet (or to the gateway), a host needs that interface's MAC address.
The **Address Resolution Protocol** (RFC 826) asks:

- **Request**, broadcast: "who has 192.168.1.20? Tell 192.168.1.5 (at aa:aa:…)".
- **Reply**, unicast: "192.168.1.20 is at bb:bb:…".

Both sides cache the answer in an **ARP table** for a few minutes (`ip neigh` on Linux, `arp -a` elsewhere). A
**gratuitous ARP** is an unrequested announcement of one's own address, used to detect duplicates and to move an
address to a standby machine during failover.

ARP has no authentication: anyone can claim any address. **ARP spoofing** puts the attacker between victim and gateway;
the defence is dynamic ARP inspection on switches. IPv6 replaces ARP with Neighbor Discovery (Chapter 10).

## 9.3 NAT: many hosts, one address

A home ISP gives one public IPv4 address; the home has twenty devices with private `192.168.x.x` addresses. The router
performs **network address translation**, strictly **NAPT** (port translation), keeping a table:

| Inside address:port | Outside address:port | Remote |
| --- | --- | --- |
| 192.168.1.20:51200 | 203.0.113.7:40001 | 93.184.215.14:443 |
| 192.168.1.31:51200 | 203.0.113.7:40002 | 93.184.215.14:443 |

Outgoing packets get the public address and a fresh port; replies to that port are translated back. The 16-bit port
space allows tens of thousands of simultaneous flows per public address. Entries time out when idle (UDP after a minute
or two, TCP after hours), so long-lived idle connections send **keep-alives**.

ISPs short of addresses now put many customers behind a second layer, **carrier-grade NAT** (CGN), using
`100.64.0.0/10` between them, so thousands of homes share a few public addresses.

### What NAT breaks

- **Incoming connections**: nothing outside can start a connection to a device inside unless a **port forward** is
  configured. (This blocks some attacks, but NAT is not a firewall; real firewalls do this deliberately, Chapter 11 of
  the security book.)
- **End-to-end addressing**: protocols that carry IP addresses inside their messages (FTP, SIP) need helper code in the
  router (an **ALG**).
- **Peer-to-peer**: two devices both behind NAT cannot simply call each other.

### NAT traversal

Video calls and games get through anyway with **ICE** (RFC 8445): each side learns its public address and port from a
**STUN** server, both send packets to each other at the same time to open holes in their NATs ("hole punching"), and if
that fails (strict NATs), they relay through a **TURN** server. Routers can also open ports on request with UPnP or PCP,
which is convenient and a known security risk.

<figure class="play" data-play="nat"><span class="ai-tag">AI-created</span><figcaption><b>Watch it.</b> Three devices at home share one public address. The router swaps each private source address and port for its public address and a port of its own, notes the pair, and swaps back when the reply comes. Addresses from the ranges kept for examples.</figcaption></figure>

## 9.4 ICMP: the network's error messages

The **Internet Control Message Protocol** (RFC 792; ICMPv6 RFC 4443) carries errors and diagnostics, inside IP:

| Type | Name | Sent when |
| --- | --- | --- |
| 0 / 8 | Echo reply / request | `ping` |
| 3 | Destination unreachable | no route (code 0), host down (1), port closed (3), fragmentation needed (4) |
| 11 | Time exceeded | TTL reached 0: `traceroute` uses this |
| 5 | Redirect | "use another router on this subnet" (usually ignored now) |

Each error message carries the start of the packet that caused it, so the sender knows which connection failed.
Blocking all ICMP "for security" breaks path MTU discovery (Chapter 8); block selectively instead (RFC 4890 lists what
IPv6 needs).

## 9.5 Putting it together

You open a laptop at a café and load a page. DHCP gives it `10.0.0.57/24`, gateway `10.0.0.1`, DNS `10.0.0.1`. It ARPs
for `10.0.0.1`. It sends a DNS query (Chapter 18) via the gateway, gets the server's address, opens a TCP connection
(Chapter 16): every packet goes to the gateway's MAC address with the remote IP address, and the café's router
translates the source to its public address on the way out. [Lab 3](../../labs/03-Interfaces-and-Routes.md) lets you
watch each step.

## Check yourself

??? question "1. Why are DHCP Discover and Request broadcast rather than sent to the server?"
    The client has no address yet and does not know the server's; the Request is broadcast so other servers learn their offers were declined.

??? question "2. Two laptops inside a home both open connections from port 51200 to the same website. How does NAT tell the replies apart?"
    It gives each a different outside port (e.g. 40001 and 40002) and maps replies back by that port.

??? question "3. Which ICMP message does traceroute rely on?"
    Time exceeded (type 11), sent by each router whose TTL reaches zero.

??? info "Sources"
    - RFC 2131 (DHCP), RFC 826 (ARP), RFC 3022 and RFC 4787 (NAT behaviour), RFC 6598 (shared address space), RFC 8445 (ICE), RFC 8489 (STUN), RFC 8656 (TURN).
    - RFC 792 (ICMP), RFC 4443 (ICMPv6), RFC 4890 (ICMPv6 filtering).
