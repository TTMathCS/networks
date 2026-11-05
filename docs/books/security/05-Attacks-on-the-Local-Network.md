# 5. Attacks on the local network

*The local network was designed for people who trust each other: any device can claim any address, and switches believe what they are told. This chapter shows the classic attacks on layer 2 and on the services every LAN depends on (ARP, DHCP, IPv6 router advertisements), and the switch features that stop them.*

!!! abstract "In this chapter"
    **You will learn:** sniffing on hubs, switches and Wi-Fi; MAC flooding; ARP spoofing; rogue DHCP; IPv6 router
    advertisement attacks; VLAN hopping; spanning-tree attacks; the defences (port security, DHCP snooping, dynamic
    ARP inspection, RA guard, 802.1X, MACsec).

    **You need:** networks book [chapter 6](../networks/06-Ethernet-and-Switches.md), [chapter 7](../networks/07-VLANs-and-Spanning-Tree.md), [chapter 9](../networks/09-NAT-DHCP-and-ARP.md).

## 5.1 Why the LAN is soft

Ethernet, ARP and DHCP have **no authentication**. A device can send frames with any source MAC address, answer ARP
questions it was not asked, and offer DHCP leases. Inside the building, an attacker is anyone who can plug in or join
the Wi-Fi: a visitor, an infected laptop, a compromised printer. So the local network needs its own defences, not only
the firewall at the edge.

## 5.2 Sniffing

On an old **hub**, every frame went to every port, so any device could read all traffic. A **switch** learns which MAC
address is on which port and sends unicast frames only there, so a normal device sees only its own traffic plus
broadcasts. Wi-Fi is a shared medium again, but WPA2/WPA3 encrypt each client's frames with its own keys (wireless
book, [chapter 10](../wireless/10-Wi-Fi-Security.md)).

To sniff on a switched LAN, an attacker must make the switch send them other people's frames. The next sections show
how. (Network admins do this legitimately with a **SPAN** mirror port or a network tap, for monitoring, Chapter 12.)

## 5.3 MAC flooding

A switch's MAC table has a limited size (often a few thousand to some hundred thousand entries). Tools like `macof`
send frames from tens of thousands of random source addresses per second. When the table is full, the switch cannot
learn real stations and **floods** their frames out of every port, like a hub, and the attacker sees them.

**Defence: port security**: limit each access port to a few MAC addresses (one desk, one phone), and shut the port or
drop extra addresses when the limit is exceeded.

## 5.4 ARP spoofing

To send to 192.168.1.1, a host asks by broadcast "who has 192.168.1.1?" and caches the answer. ARP accepts replies
nobody asked for (**gratuitous ARP**), and the newest one wins. An attacker sends repeated replies:

- to the victim: "192.168.1.1 (the router) is at **my** MAC",
- to the router: "192.168.1.50 (the victim) is at **my** MAC".

<figure class="mars-fig">
<svg viewBox="0 0 640 190" role="img" aria-label="ARP spoofing: traffic between victim and router passes through the attacker">
<rect x="20" y="20" width="130" height="46" rx="8" class="na-f"/><text x="85" y="48" text-anchor="middle">Victim .50</text>
<rect x="490" y="20" width="130" height="46" rx="8" class="nb-f"/><text x="555" y="48" text-anchor="middle">Router .1</text>
<rect x="255" y="120" width="130" height="46" rx="8" class="nd-f"/><text x="320" y="148" text-anchor="middle">Attacker</text>
<line x1="150" y1="43" x2="490" y2="43" stroke="currentColor" stroke-dasharray="5 5"/>
<text x="320" y="36" text-anchor="middle" font-size="12">the path they think they use</text>
<path d="M120,66 L280,120" class="nd" stroke-width="2" fill="none"/><path d="M360,120 L520,66" class="nd" stroke-width="2" fill="none"/>
<text x="150" y="110" font-size="12">"router is at me"</text><text x="420" y="110" font-size="12">"victim is at me"</text>
</svg>
<figcaption>After poisoning both ARP caches, the attacker forwards traffic so nothing seems wrong, while reading or changing it.</figcaption>
</figure>

The attacker forwards packets onward, so the victim notices nothing, and is now **on-path**: able to read unencrypted
traffic, change it, or try to downgrade connections. Encryption with authentication (HTTPS, SSH, a VPN) turns this from
a disaster into a nuisance: the attacker sees only ciphertext and cannot fake the server's certificate.

**Defence: Dynamic ARP Inspection** (DAI) on the switch drops ARP replies whose IP–MAC pair does not match what the
switch learned from DHCP (the snooping table below). Static ARP entries work for a few critical hosts.

<figure class="play" data-play="arpspoof"><span class="ai-tag">AI-created</span><figcaption><b>Watch it.</b> A fake ARP reply puts the attacker between the victim and the router; then see the same attack with the switch checking ARP. The addresses are examples.</figcaption></figure>

## 5.5 Rogue DHCP

DHCP has no authentication either: the client takes the first offer. A **rogue DHCP server** (an attacker's, or an
employee's home router plugged in the wrong way round) can hand out itself as the default gateway and DNS server,
putting every new client on-path. An attacker can also first **starve** the real server by requesting every free
address with fake MACs.

**Defence: DHCP snooping**: mark only the uplink ports towards the real DHCP server as **trusted**; the switch drops
DHCP offers arriving on any other port, and builds a table of which IP was leased to which MAC on which port. DAI and
**IP Source Guard** (drop packets whose source IP was not leased to that port) use the same table.

## 5.6 IPv6 on the LAN

IPv6 replaces ARP with **Neighbor Discovery** and lets routers announce themselves with **Router Advertisements**
(RAs). Both are as trusting as ARP. An attacker can send RAs claiming to be the router (or offering a rogue DNS server),
and many networks that "don't use IPv6" are exposed because every modern operating system has IPv6 on and prefers it.
In 2018 the tool mitm6 showed how a fake DHCPv6 server could take over name resolution on Windows networks that had not
configured IPv6 at all.

**Defence: RA Guard** (RFC 6105) and **DHCPv6 Guard** on switches, the IPv6 versions of DHCP snooping; and
deliberately configuring IPv6 instead of ignoring it.

## 5.7 VLAN hopping and spanning tree

VLANs separate traffic, but misconfigured switches let an attacker jump between them:

- **Switch spoofing**: if an access port is left in "auto" trunk negotiation (Cisco's DTP), the attacker's machine
  negotiates a trunk and can then send into any VLAN. Defence: set access ports to access mode, turn negotiation off.
- **Double tagging**: an attacker on the trunk's native VLAN sends a frame with two 802.1Q tags; the first switch
  removes the outer one and forwards the frame tagged with the target VLAN. It works only one way. Defence: do not
  use the native VLAN for users; tag it or leave it unused.

**Spanning tree** elects a root bridge from BPDU messages. An attacker sending BPDUs with the best priority can become
root and pull traffic through their port, or cause constant re-elections. Defence: **BPDU Guard** shuts any access port
that sends a BPDU; **Root Guard** stops a port from becoming the path to a new root.

## 5.8 Closing the LAN

The defences together:

| Attack | Switch feature |
| --- | --- |
| Unknown device plugs in | 802.1X (Chapter 4), with a guest VLAN for failures |
| MAC flooding | port security |
| ARP spoofing | DHCP snooping + Dynamic ARP Inspection |
| Rogue DHCP / RA | DHCP snooping, DHCPv6 Guard, RA Guard |
| VLAN hopping | access ports fixed, DTP off, no users on native VLAN |
| Rogue root bridge | BPDU Guard, Root Guard |
| Sniffing on the wire | **MACsec** (802.1AE): AES-GCM encryption of each Ethernet link |

Even with all of these, assume the LAN may be hostile: encrypt application traffic end to end (Part III). This is the
core idea of zero trust (Chapter 15).

## Check yourself

??? question "1. Why does MAC flooding let an attacker sniff traffic on a switch?"
    When the MAC table is full the switch cannot learn where stations are and floods their frames to all ports, including the attacker's.

??? question "2. An attacker has ARP-spoofed your laptop and you open your bank's site over HTTPS. What can they see?"
    Which IP addresses you talk to, timing and sizes, and usually the site name (SNI), but not the content; they cannot present a valid certificate for the bank, so the browser would warn.

??? question "3. What do DHCP snooping, Dynamic ARP Inspection and IP Source Guard have in common?"
    They all use the switch's table of which IP was leased to which MAC on which port, built by DHCP snooping.

??? question "4. A network 'does not use IPv6'. Why might it still be exposed to IPv6 attacks?"
    Hosts have IPv6 enabled and accept router advertisements and DHCPv6 by default, so an attacker can become their IPv6 router or DNS server.

??? info "Sources"
    - IEEE 802.1Q-2022 (VLANs, spanning tree), IEEE 802.1AE-2018 (MACsec), IEEE 802.1X-2020.
    - RFC 826 (ARP), RFC 4861 (Neighbor Discovery), RFC 6105 (RA Guard), RFC 7610 (DHCPv6 Shield), RFC 3756 (IPv6 ND trust models and threats).
    - Cisco, *Catalyst switch security configuration guides* (port security, DHCP snooping, DAI, BPDU Guard).
    - Fox-IT, "mitm6: compromising IPv4 networks via IPv6", 2018.
