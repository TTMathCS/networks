# 7. VLANs and spanning tree

*Real switched networks need two more things: a way to split one physical network into several separate ones (VLANs), and a way to have spare links without frames looping forever (spanning tree). This chapter covers both, plus link aggregation.*

!!! abstract "In this chapter"
    **You will learn:** broadcast domains; 802.1Q VLAN tags, access and trunk ports; why loops are fatal to Ethernet;
    how the Spanning Tree Protocol elects a root and blocks ports; RSTP and MSTP; link aggregation; why data centres
    now route instead.

    **You need:** [Chapter 6](06-Ethernet-and-Switches.md).

## 7.1 Broadcast domains

Every broadcast (ARP requests, DHCP discovers) reaches every host in a switched network: they form one **broadcast
domain**. With thousands of hosts, broadcasts waste bandwidth, every host sees every other's discovery traffic, and a
compromised laptop in the guest area can reach the payroll server directly. Splitting the network into separate
switches works but is expensive and rigid.

## 7.2 VLANs

A **virtual LAN** makes one switch (or many) behave like several separate switches. Each port is assigned to a VLAN by
number (1–4094); frames never cross between VLANs inside the switch. To get from one VLAN to another, traffic must go
through a router (or a "layer 3 switch"), where a firewall can check it.

Typical office: VLAN 10 staff, 20 guests, 30 phones, 40 cameras, 99 management.

## 7.3 802.1Q tags, access and trunk ports

When one cable carries several VLANs (between two switches, or to a router), each frame carries a 4-byte **802.1Q tag**
inserted after the source MAC:

| Field | Bits | Meaning |
| --- | --- | --- |
| TPID | 16 | `0x8100`: "a tag follows" |
| PCP | 3 | priority (0–7), used for voice and video quality of service |
| DEI | 1 | may be dropped first under congestion |
| VID | 12 | the VLAN number |

- An **access port** belongs to one VLAN and sends untagged frames: the host never knows about VLANs.
- A **trunk port** carries many VLANs, tagged. One VLAN on a trunk may be **native** (sent untagged), a convenience
  that attackers abuse with "double tagging" ([Security, chapter 5](../security/05-Attacks-on-the-Local-Network.md)).

Service providers stack two tags (**Q-in-Q**, 802.1ad) to carry customers' VLANs inside their own. Because 12 bits allow
only 4,094 VLANs, cloud data centres instead use **VXLAN** (RFC 7348), which carries Ethernet frames inside UDP packets
with a 24-bit network identifier (16 million segments): see [Chapter 21](21-Data-Centres-and-SDN.md).

## 7.4 Why loops are fatal

For reliability you join switches with spare links. But Ethernet frames have no hop count: a broadcast sent around a
loop is flooded by each switch to the next, forever, and multiplies at every branch. Within seconds a **broadcast
storm** saturates every link and switches' MAC tables flap as the same source address appears on different ports. The
network stops.

<figure class="play" data-play="storm"><span class="ai-tag">AI-created</span><figcaption><b>Watch it.</b> One broadcast enters a triangle of switches. With no hop count the copies circle forever; with Spanning Tree one port blocks and the flood stops.</figcaption></figure>

## 7.5 Spanning Tree Protocol

Radia Perlman's **Spanning Tree Protocol (STP)** (1985, standardised as IEEE 802.1D) lets switches agree on a loop-free
subset of links, a **spanning tree**, and block the rest, unblocking them if a link fails. Switches exchange **BPDUs**
(bridge protocol data units) and:

1. **Elect a root bridge**: the switch with the lowest **bridge ID** (a configurable priority, default 32768, followed by
   its MAC address). Set the priority on purpose, or an old switch in a cupboard may become root.
2. **Each other switch picks a root port**: its port with the lowest total **path cost** to the root (cost falls with
   speed: in the modern scheme 20,000 for 1 Gbit/s, 2,000 for 10 Gbit/s).
3. **Each link picks a designated port**: on each segment, the port closest to the root forwards; ties are broken by
   bridge ID, then port ID.
4. **All other ports block**: they receive BPDUs but forward nothing.

<figure class="mars-fig">
<svg viewBox="0 0 480 220" width="480" role="img" aria-label="Three switches in a triangle; the root at the top; one link blocked">
<g fill="none" stroke="currentColor" stroke-width="2.2">
<rect x="195" y="15" width="90" height="36" rx="6" class="soft-acc"/><rect x="45" y="160" width="90" height="36" rx="6"/><rect x="345" y="160" width="90" height="36" rx="6"/>
<line x1="215" y1="51" x2="110" y2="160" class="nc"/><line x1="265" y1="51" x2="370" y2="160" class="nc"/>
<line x1="135" y1="178" x2="345" y2="178" stroke-dasharray="6 6"/></g>
<g font-size="13" fill="currentColor" text-anchor="middle"><text x="240" y="38">root (prio 4096)</text><text x="90" y="183">switch B</text><text x="390" y="183">switch C</text>
<text x="240" y="170">blocked on C's side</text><text x="135" y="100">B's root port</text><text x="350" y="100">C's root port</text></g>
<text x="250" y="210" font-size="20" fill="currentColor" text-anchor="middle">✕</text>
</svg>
<figcaption>A triangle of switches: both lower switches use their direct link to the root; the B–C link is blocked at one end, removing the loop. If a root link fails, it unblocks.</figcaption>
</figure>

Classic STP took 30–50 seconds to recover from a failure (timers for listening and learning). **Rapid STP** (802.1w,
now part of 802.1D/802.1Q) uses handshakes between neighbours and converges in about a second. **Multiple STP**
(802.1s) runs separate trees for groups of VLANs so that different VLANs can use different links. Two important
protections: **BPDU guard** shuts a host-facing port that sends BPDUs (someone plugged in a switch), and **root guard**
stops a port from ever leading to a new root.

## 7.6 Link aggregation

Instead of blocking a second link, you can bundle several physical links between the same two devices into one
logical link: **link aggregation** (IEEE 802.1AX, LACP). Spanning tree sees one link; traffic is spread across members
by hashing each flow's addresses and ports, so one flow stays on one member (keeping its packets in order) and one flow
cannot go faster than one member. Pairs of switches can share one bundle (**MLAG**) so either can fail.

## 7.7 Layer 2 or layer 3?

Spanning tree wastes the blocked links and big broadcast domains scale badly. Modern data centres and campus cores
therefore **route** between switches (every link active, equal-cost multipath, Chapter 21), keep VLANs small and at the
edge, and stretch layer 2 only where needed, over VXLAN with **EVPN** (BGP carrying MAC addresses). **TRILL** and
**SPB** (802.1aq) were standard attempts to fix Ethernet with link-state routing; they are now rare.

## Check yourself

??? question "1. Two hosts are on the same switch but in VLANs 10 and 20. Can they reach each other?"
    Not directly. Their traffic must go through a router (or layer 3 switch) that routes between the VLANs.

??? question "2. Four switches have priorities 32768, 32768, 4096 and 32768. Which becomes root?"
    The one with priority 4096: the lowest bridge ID wins, and priority comes first.

??? question "3. Why does link aggregation keep each flow on one physical link?"
    So the flow's frames stay in order; spreading one flow over links of slightly different delay would reorder it.

??? info "Sources"
    - R. Perlman, "An Algorithm for Distributed Computation of a Spanning Tree in an Extended LAN", SIGCOMM 1985.
    - IEEE 802.1Q-2022 (VLANs, RSTP, MSTP), IEEE 802.1AX-2020 (link aggregation), IEEE 802.1ad (Q-in-Q).
    - RFC 7348 (VXLAN), RFC 7432 (EVPN).
