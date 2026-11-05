# 11. Firewalls and segmentation

*A firewall decides which traffic may pass between parts of a network; segmentation decides what those parts are. This chapter covers packet filters, stateful firewalls, next-generation firewalls, the DMZ, VLAN- and micro-segmentation, writing rules well, and host firewalls.*

!!! abstract "In this chapter"
    **You will learn:** stateless and stateful filtering; connection tracking; application-aware firewalls; NAT is not
    a firewall; the DMZ and zones; segmentation and micro-segmentation; egress filtering; rule-writing practice;
    host firewalls (nftables, Windows Firewall); cloud security groups.

    **You need:** networks book [chapter 7](../networks/07-VLANs-and-Spanning-Tree.md), [chapter 14](../networks/14-UDP-Ports-and-Sockets.md), [chapter 16](../networks/16-TCP.md).

## 11.1 Stateless packet filters

The first firewalls (late 1980s, on routers) looked at each packet alone and matched fields: source and destination
address, protocol, ports, TCP flags. A rule list is read top to bottom; the first match decides:

```
permit tcp any host 203.0.113.10 eq 443     # web server
permit tcp any host 203.0.113.20 eq 25      # mail
deny   ip  any any                          # everything else
```

Stateless filters are fast and still used (router access lists, edge filtering of spoofed addresses), but they handle
replies badly: to let answers back in, you must allow all traffic *from* port 443, which an attacker can use by
sending from that port.

## 11.2 Stateful firewalls

A **stateful** firewall keeps a **connection table**. When an inside host opens a TCP connection, the firewall records
its addresses, ports and TCP state; replies that match an entry pass, and unsolicited packets do not. UDP and ICMP are
tracked as pseudo-connections with timeouts. Rules then only need to describe who may *start* a connection:

```
allow  inside  -> any      tcp/udp  (new)
allow  any     -> web-dmz  tcp/443  (new)
allow  established, related
drop   everything else
```

Linux's **nftables** (successor to iptables), the BSDs' **pf**, and every commercial firewall work this way. The table
has limits: a flood of new connections can fill it (Chapter 13), so firewalls set per-source limits and timeouts.

## 11.3 Next-generation firewalls

Port numbers no longer say much: almost everything runs on 443. **Next-generation firewalls** (NGFWs) identify the
application from traffic patterns and TLS details, tie rules to users and groups (via the directory), and include
intrusion prevention and URL filtering. Some decrypt TLS by acting as a trusted middlebox with their own CA on company
devices; this gives visibility but breaks certificate pinning, weakens end-to-end security if done badly, and raises
privacy issues, so it is usually limited to chosen categories. TLS 1.3 and ECH make passive identification harder.

## 11.4 NAT is not a firewall

A home router doing NAT blocks unsolicited inbound connections as a side effect, because it has no mapping for them.
But NAT is an addressing trick, not a security control: **UPnP** lets devices open ports on their own, IPv6 gives every
device a global address with no NAT at all, and outbound connections (which malware uses) pass freely. A home router
should run a real stateful firewall for both IPv4 and IPv6 that blocks unsolicited inbound traffic by default.

## 11.5 Zones and the DMZ

Networks are divided into **zones** of similar trust, and the firewall controls traffic between them. The classic
design puts servers that the internet must reach into a **DMZ** (demilitarised zone) between the internet and the
inside:

<figure class="mars-fig">
<svg viewBox="0 0 640 200" role="img" aria-label="Firewall with internet, DMZ and internal zones">
<rect x="250" y="70" width="140" height="56" rx="8" class="nd-f"/><text x="320" y="103" text-anchor="middle">Firewall</text>
<rect x="20" y="70" width="130" height="56" rx="8" class="na-f"/><text x="85" y="103" text-anchor="middle">Internet</text>
<rect x="490" y="15" width="140" height="56" rx="8" class="nb-f"/><text x="560" y="40" text-anchor="middle">DMZ</text><text x="560" y="58" text-anchor="middle" font-size="12">web, mail relay</text>
<rect x="490" y="125" width="140" height="56" rx="8" class="nc-f"/><text x="560" y="150" text-anchor="middle">Internal</text><text x="560" y="168" text-anchor="middle" font-size="12">users, databases</text>
<line x1="150" y1="98" x2="250" y2="98" stroke="currentColor" stroke-width="2"/>
<line x1="390" y1="90" x2="490" y2="45" stroke="currentColor" stroke-width="2"/><line x1="390" y1="106" x2="490" y2="150" stroke="currentColor" stroke-width="2"/>
<text x="200" y="88" text-anchor="middle" font-size="11">443, 25 to DMZ only</text>
<text x="450" y="135" text-anchor="middle" font-size="11">no internet-initiated</text>
</svg>
<figcaption>Internet users reach only the DMZ; the DMZ reaches only the few internal services it needs; nothing from the internet reaches the inside directly.</figcaption>
</figure>

If a DMZ server is broken into, the attacker is still outside the internal network and faces another set of rules.

## 11.6 Segmentation

A **flat** network, where every device can reach every other, lets one infected laptop reach every server, which is how
ransomware spreads in hours. **Segmentation** splits the network into zones (users, servers, management, guests,
printers and cameras, payment systems) using VLANs and subnets, with a firewall or router access lists between them,
allowing only needed flows.

**Micro-segmentation** goes further: policy per workload or per application, enforced on each host or hypervisor
(cloud security groups, Kubernetes network policies, host firewalls managed centrally). A web server may talk to its
database on one port and nothing else. Labelling workloads ("app=billing, tier=db") lets rules follow them as they move.

Segmentation is also required by standards for sensitive data: PCI DSS reduces the scope of card-data rules when the
card environment is separated.

## 11.7 Writing good rules

- **Default deny** in both directions, then allow what is needed (Chapter 1's fail-safe default).
- **Egress filtering**: servers rarely need to start connections to the whole internet. Limiting outbound traffic
  blocks many malware call-homes and data theft. Force DNS and web traffic through your resolvers and proxies.
- Write each rule with an **owner, a reason and a date**; review regularly; remove rules nobody can explain.
  Old, broad "temporary" rules are among the most common findings in audits.
- Put specific rules before general ones; watch for **shadowed** rules that can never match.
- **Log** denies and important allows, and send logs to your monitoring (Chapter 12).
- Protect the firewall's own management interface; it is a prime target (Chapter 9's edge-device lesson).

## 11.8 Host firewalls

Every host should also filter for itself: Windows Defender Firewall, macOS's application firewall and pf, Linux's
nftables (or front ends such as ufw and firewalld). Host firewalls protect laptops on hostile networks and stop
lateral movement inside a segment. A minimal nftables policy for a server allowing only SSH and HTTPS looks like:

```
table inet filter {
  chain input {
    type filter hook input priority 0; policy drop;
    ct state established,related accept
    iif lo accept
    ip protocol icmp accept
    ip6 nexthdr icmpv6 accept
    tcp dport { 22, 443 } accept
  }
}
```

You will build and test this in [Lab 10](../../labs/10-A-Firewall-with-nftables.md).

## Check yourself

??? question "1. Why does a stateful firewall need fewer rules than a stateless one to let replies back in?"
    It remembers connections started from inside and lets matching replies pass automatically; a stateless filter must open whole port ranges for replies.

??? question "2. Give two reasons NAT alone is not a firewall."
    UPnP lets devices open inbound ports themselves; IPv6 addresses are globally reachable without NAT; outbound traffic is not filtered at all.

??? question "3. Why does segmentation slow ransomware?"
    An infected device can reach only the few systems its segment is allowed to, so the malware cannot spread to every server directly.

??? question "4. In the nftables example, what happens to a UDP packet to port 53?"
    It matches no accept rule and the chain's policy drops it.

??? info "Sources"
    - NIST SP 800-41 Rev. 1, *Guidelines on Firewalls and Firewall Policy*; NIST SP 800-207 (zero trust, on micro-segmentation).
    - W. R. Cheswick, S. M. Bellovin and A. D. Rubin, *Firewalls and Internet Security*, 2nd ed., Addison-Wesley, 2003.
    - nftables wiki (wiki.nftables.org); OpenBSD pf documentation; PCI Security Standards Council, *PCI DSS v4.0* and guidance on scoping and segmentation.
    - CISA and NSA, *Network Infrastructure Security Guide* (2022).
