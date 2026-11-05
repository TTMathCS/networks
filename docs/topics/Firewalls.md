# Firewalls

*Decide what may come in and go out, at home, on a server, and between parts of a network. Four parts: stop at the one you need.*

[In one minute](#in-one-minute) · [Do it](#do-it) · [Expert](#expert) · [Now and next](#now-and-next)

## In one minute

A **firewall** is a gatekeeper for network traffic. It looks at each connection (where it comes from, where it is going,
and which service it wants) and follows a list of rules: let it through, or stop it. The safest rule list ends with
"**stop everything else**", so only what you meant to allow gets in. Your home router has one that blocks strangers
from the internet starting connections to your devices; your laptop has one too; companies put firewalls between the
internet and their servers, and between departments, so a problem in one place cannot spread everywhere.

## Do it

**At home:** keep the router's firewall on (it is by default), including for IPv6; turn off UPnP and remote
management unless needed; remove port forwards you do not recognise ([Lab 14](../labs/14-Scanning-Your-Own-Network.md)).

**On your computer:** Windows Defender Firewall on for all profiles (choose "Public" for networks you do not trust);
macOS System Settings → Network → Firewall on; Linux `sudo ufw enable`.

**On a Linux server** that offers SSH and a website, with `ufw`:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw limit 22/tcp        # SSH, with rate limiting
sudo ufw allow 443/tcp       # HTTPS
sudo ufw allow 80/tcp        # HTTP (to redirect to HTTPS)
sudo ufw enable
sudo ufw status verbose
```

Keep your current SSH session open while you enable it. The same in raw nftables, and a router firewall between two
networks, are in [Lab 10](../labs/10-A-Firewall-with-nftables.md).

**In the cloud:** security groups (AWS, Azure NSGs, GCP firewall rules) work the same way: allow only the ports each
server needs, and only from the sources that need them; never open SSH or databases to `0.0.0.0/0`.

## Expert

**Kinds** ([security book, chapter 11](../books/security/11-Firewalls-and-Segmentation.md)): stateless packet filters
(router ACLs; fast; need rules for both directions); **stateful** firewalls (connection tracking: write rules for new
connections, replies pass automatically; the norm); **next-generation** firewalls (identify applications and users, add
IPS and URL filtering, optional TLS inspection); **web application firewalls** (HTTP-level rules); host and
micro-segmentation firewalls (per workload).

**Rule-writing practice:**

- Default deny inbound **and** filter outbound on servers (blocks call-homes and data theft).
- Allow established/related first, drop invalid, then specific allows, then a logged drop.
- Allow the ICMP that networks need (packet too big, time exceeded; for IPv6 also neighbour discovery) instead of
  blocking all ICMP.
- One owner, reason and review date per rule; remove what nobody can explain; look for shadowed rules.
- Treat IPv4 and IPv6 equally (`inet` tables in nftables); NAT is not a firewall.
- Protect the firewall's own management interface; patch it promptly.

**Segmentation** stops lateral movement: separate users, servers, management, guests, IoT and payment systems, with
only needed flows between them. Measure success by asking "if this laptop were taken over, what could it reach?"

**Common mistakes:** "any any allow" left from troubleshooting; rules opened for a project and never closed; testing
from inside the network and believing the outside view matches; forgetting IPv6; management interfaces exposed to the
internet; logging nothing, so incidents cannot be traced.

## Now and next

*Last checked: 5 November 2026.*

- Firewalls are moving **into the cloud** (SASE, firewall-as-a-service) and **onto every host** (micro-segmentation,
  eBPF-based enforcement in Linux and Kubernetes, such as Cilium), following zero trust
  ([security book, chapter 15](../books/security/15-Zero-Trust.md)).
- **Encrypted traffic** (TLS 1.3, QUIC, ECH) leaves less for firewalls to inspect; identity and endpoint signals
  matter more than packet contents.
- **Firewall and VPN appliances themselves** are among the most attacked devices; several vendors had critical,
  actively exploited flaws in 2024–2025. Patch edge devices first, and do not expose their management to the internet.

??? info "Sources"
    - NIST SP 800-41 Rev. 1, *Guidelines on Firewalls and Firewall Policy*; CISA and NSA, *Network Infrastructure Security Guide* (2022).
    - Ubuntu `ufw(8)` manual; nftables wiki; RFC 4890 (ICMPv6 filtering recommendations).
    - CISA Known Exploited Vulnerabilities catalog; Cilium documentation (cilium.io).
