# Firewalls

*Decide what may come in and go out, at home, on a server, and between parts of a network. Four parts: stop at the one you need.*

[In one minute](#in-one-minute) · [Do it](#do-it) · [Expert](#expert) · [Now and next](#now-and-next)

## In one minute

A **firewall** is a gatekeeper for network traffic. It looks at each connection (where it comes from, where it is going,
and which service it wants) and follows a list of rules: let it through, or stop it. The safest rule list ends with
"**stop everything else**", so only what you meant to allow gets in. Your home router has one that blocks strangers
from the internet starting connections to your devices; your laptop has one too; companies put firewalls between the
internet and their servers, and between departments, so a problem in one place cannot spread everywhere.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 375" role="img" aria-labelledby="sk-n-rules-t"><title id="sk-n-rules-t">A firewall checks three rules in order: replies to what you asked for and visitors to the web server are let in, everything else is stopped</title><defs><filter id="sk-n-rules-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-n-rules-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-n-rules-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-n-rules-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-n-rules-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="375" filter="url(#sk-n-rules-paper)"/><g filter="url(#sk-n-rules-pen)"><text x="30" y="44" class="h">Read the rules top to bottom</text><path class="p rust" d="M300 70 L330 70 L330 360 L300 360Z"/><text x="315" y="64" text-anchor="middle" class="s">firewall</text><text x="350" y="134" class="s">1  reply to something you asked for</text><text x="350" y="156" class="l">let in</text><path class="p" d="M40 110 L560 114" marker-end="url(#sk-n-rules-ah)"/><text x="350" y="214" class="s">2  new visitor for the web server, port 443</text><text x="350" y="236" class="l">let in</text><path class="p" d="M40 190 L560 194" marker-end="url(#sk-n-rules-ah)"/><text x="350" y="294" class="s">3  everything else</text><text x="350" y="316" class="l">stop</text><path class="p" d="M40 270 L294 270" marker-end="url(#sk-n-rules-ah)"/><path class="p red" d="M280 256 L304 284 M304 256 L280 284"/><text x="40" y="100" class="s">web page you opened</text><text x="40" y="180" class="s">visitor to your site</text><text x="40" y="260" class="s">stranger knocking</text><text x="40" y="320" class="s">The last rule matters most: anything you</text><text x="40" y="340" class="s">did not plan for is stopped, not let in.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

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
