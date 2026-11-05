# 17. Testing your own network

*The best way to know whether your defences work is to test them the way an attacker would, with permission and care. This chapter covers the kinds of testing, the rules that make it legal and safe, scanning with Nmap and how it works, vulnerability scanning, penetration testing and red teaming, and Wi-Fi and configuration audits.*

!!! abstract "In this chapter"
    **You will learn:** authorisation and scope; asset discovery; how port scans work (SYN, connect, UDP) and what
    "open", "closed" and "filtered" mean; service and version detection; vulnerability scanners; penetration tests,
    red and purple teams; configuration benchmarks; bug bounties and responsible disclosure.

    **You need:** [Chapter 6](06-Attacks-on-IP-and-Routing.md); networks book [chapter 16](../networks/16-TCP.md).

## 17.1 Permission first

Scanning or testing systems you do not own or have **written permission** to test can be a crime (for example under
Canada's Criminal Code section 342.1, the US Computer Fraud and Abuse Act, or the UK Computer Misuse Act), and can
break fragile systems. Before any test, have:

- a written **authorisation** from someone with the right to give it;
- a **scope**: exact addresses, applications and times, and what is out of scope (often production databases, other
  companies' cloud services, and people for phishing tests unless agreed);
- **rules of engagement**: what techniques are allowed, how to stop, whom to call if something breaks.

Cloud providers publish their own rules for testing what you run on them. For learning, use your own lab
([Lab 1](../../labs/01-Your-Lab.md)).

## 17.2 Kinds of testing

| Kind | Question | Typical form |
| --- | --- | --- |
| **Vulnerability scan** | which known flaws and misconfigurations exist? | automated, regular (weekly or after changes) |
| **Penetration test** | can a skilled tester actually get in and how far? | time-boxed project, report with fixes |
| **Red team** | would we detect and stop a realistic attacker going for a goal? | weeks, stealthy, tests people and processes |
| **Purple team** | does each attacker technique trigger our detection? | attackers and defenders together, technique by technique |
| **Configuration audit** | do devices match a hardening standard? | compare with CIS Benchmarks or vendor guides |

## 17.3 Discovering what you have

You cannot defend what you do not know about. Discovery combines your own records (DHCP leases, switch MAC tables,
cloud inventories) with active checks: ping sweeps (`nmap -sn 192.168.1.0/24`), ARP scans on local segments, and an
outside-in view of what the internet sees of you. Search engines such as Shodan and Censys continuously scan the whole
internet; it is worth checking what they list for your own addresses, because attackers do.

## 17.4 How port scanning works

**Nmap** (Gordon Lyon, 1997) is the standard tool. Its main scan types use TCP's rules (networks book Chapter 16):

- **SYN scan** (`-sS`, the default with privileges): send a SYN. A SYN-ACK means the port is **open** (Nmap replies
  with RST instead of completing the handshake); an RST means **closed**; no answer or an ICMP "unreachable" means
  **filtered** (a firewall dropped it).
- **Connect scan** (`-sT`): uses the normal operating-system connect call; no privileges needed, more visible in logs.
- **UDP scan** (`-sU`): UDP has no handshake. A reply means open; ICMP "port unreachable" means closed; silence means
  "open|filtered". Slow, because systems rate-limit ICMP errors.

After finding open ports, **service and version detection** (`-sV`) sends probes and matches answers against a
database ("OpenSSH 9.6p1", "nginx 1.26"), and OS detection (`-O`) guesses the operating system from small differences
in TCP/IP behaviour. The **Nmap Scripting Engine** (`--script`) runs checks such as listing TLS ciphers.

Scale matters: scanning 65,535 TCP ports on one host takes seconds to minutes; scanning the whole IPv4 internet on one
port takes minutes with ZMap or masscan on a fast link. IPv6 subnets (each $2^{64}$ addresses) cannot be swept, so
discovery there relies on DNS, logs and neighbour tables.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 395" role="img" aria-labelledby="sk-ns-scan-t"><title id="sk-ns-scan-t">A scanner sends a SYN to three ports: a SYN-ACK back means open, an RST means closed, silence means a firewall dropped it</title><defs><filter id="sk-ns-scan-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ns-scan-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ns-scan-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ns-scan-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ns-scan-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="395" filter="url(#sk-ns-scan-paper)"/><g filter="url(#sk-ns-scan-pen)"><text x="30" y="44" class="h">One knock, three answers</text><path class="p room" d="M30 170 L150 170 L150 220 L30 220Z"/><text x="90.0" y="201.0" text-anchor="middle" class="s">scanner</text><text x="30" y="250" class="s">sends a SYN to each port</text><text x="30" y="270" class="s">(dashed: the answer)</text><path class="p room" d="M300 68 L420 68 L420 112 L300 112Z"/><text x="360.0" y="96.0" text-anchor="middle" class="s">port</text><path class="p " d="M152 195 L296 86" marker-end="url(#sk-ns-scan-ah)"/><path class="p dash" d="M296 100 L152 205" marker-end="url(#sk-ns-scan-ah)"/><text x="436" y="88" class="l">SYN-ACK</text><text x="436" y="108" class="s">open: something listens</text><path class="p room" d="M300 173 L420 173 L420 217 L300 217Z"/><text x="360.0" y="201.0" text-anchor="middle" class="s">port</text><path class="p " d="M152 195 L296 191" marker-end="url(#sk-ns-scan-ah)"/><path class="p dash" d="M296 205 L152 205" marker-end="url(#sk-ns-scan-ah)"/><text x="436" y="193" class="l">RST</text><text x="436" y="213" class="s">closed: nothing there</text><path class="p rust" d="M300 278 L420 278 L420 322 L300 322Z"/><text x="360.0" y="306.0" text-anchor="middle" class="s">port</text><path class="p " d="M152 195 L296 296" marker-end="url(#sk-ns-scan-ah)"/><text x="436" y="298" class="l">…silence</text><text x="436" y="318" class="s">filtered: a firewall dropped it</text><text x="30" y="380" class="s">Scan only networks you own or have written permission to test.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## 17.5 Vulnerability scanners

Scanners such as OpenVAS/Greenbone (open source), Nessus and Qualys combine discovery and version detection with
thousands of checks for known CVEs and misconfigurations, and report findings with CVSS scores (Chapter 2).
**Authenticated** scans (with a login to each host) see installed packages and settings and give far more accurate
results than scanning from outside. Expect false positives (a version banner that does not reflect a backported
patch) and false negatives; triage and prioritise by exposure and known exploitation.

## 17.6 Penetration tests and red teams

A penetration test follows a method (PTES, OWASP Testing Guide, NIST SP 800-115): reconnaissance, scanning, gaining
access, escalating, moving laterally, and reporting, with evidence and steps to fix each finding. Internal tests often
find the same patterns: weak or reused passwords, unpatched internal servers, flat networks, LLMNR/NBT-NS name
poisoning on Windows networks, and too many admins.

Red teams act like a real adversary towards a goal ("reach the payment system") and test whether the defenders notice;
results are measured in detection and response, not in a list of flaws. **Purple teaming** runs techniques one by one
with the defenders watching, tuning detection immediately (Chapter 12).

## 17.7 Wi-Fi and configuration audits

Wi-Fi testing (with permission) checks for rogue access points, weak pre-shared keys, WPA2 networks that could move to
WPA3, guest networks that reach internal systems, and enterprise networks whose clients do not validate the RADIUS
server's certificate (letting a fake access point collect credentials). See the wireless book,
[chapter 10](../wireless/10-Wi-Fi-Security.md), and [Lab 13](../../labs/13-Surveying-Your-Wi-Fi.md).

Configuration audits compare devices with benchmarks: CIS Benchmarks for operating systems and network devices, vendor
hardening guides, and national guides such as NSA's network infrastructure guide. Tools can check router and firewall
configurations automatically and flag rules that allow "any to any".

## 17.8 When others find your flaws

Outside researchers find flaws too. Publish a **security.txt** file (RFC 9116) at `/.well-known/security.txt` saying how
to report, and a **vulnerability disclosure policy** that promises not to take legal action against good-faith
researchers. Some organisations pay rewards through **bug bounty** programmes. The norm of **coordinated disclosure**
is to give the vendor time to fix (often 90 days) before details are published.

## Check yourself

??? question "1. A SYN scan sends SYN to port 8080 and gets no reply at all. What does Nmap report, and why?"
    Filtered: no answer usually means a firewall silently dropped the probe, so Nmap cannot tell whether a service is there.

??? question "2. Why are authenticated vulnerability scans more accurate?"
    They read installed package versions and settings directly instead of guessing from network banners, which may hide backported patches or reveal little.

??? question "3. What is the difference in goal between a penetration test and a red team exercise?"
    A penetration test finds as many exploitable weaknesses as possible in a scope; a red team tests whether the organisation detects and responds to a realistic, goal-driven attacker.

??? question "4. Why can you not simply ping-sweep an IPv6 /64?"
    It has 2^64 ≈ 1.8 × 10^19 addresses; even a million probes per second would take over 500,000 years.

??? info "Sources"
    - G. Lyon, *Nmap Network Scanning*, 2009, and the Nmap reference guide (nmap.org/book).
    - NIST SP 800-115, *Technical Guide to Information Security Testing and Assessment*; PTES (pentest-standard.org); OWASP Web Security Testing Guide.
    - RFC 9116 (security.txt); CISA, *Vulnerability Disclosure Policy Template*; CIS Benchmarks (cisecurity.org).
    - Criminal Code of Canada, s. 342.1; Computer Fraud and Abuse Act (18 U.S.C. § 1030); UK Computer Misuse Act 1990.
