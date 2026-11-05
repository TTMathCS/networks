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
