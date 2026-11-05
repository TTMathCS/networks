# 2. Attackers and attacks

*To defend a network you need to know who attacks it, what they want, and how an attack unfolds from first look to final damage. This chapter introduces the kinds of attacker, the stages of an attack (the kill chain and MITRE ATT&CK), the common ways in, and how flaws are named and scored.*

!!! abstract "In this chapter"
    **You will learn:** kinds of attacker and their motives; passive and active attacks; the stages of an intrusion;
    MITRE ATT&CK; phishing, malware and ransomware; vulnerabilities, exploits, CVE and CVSS; why patching matters.

    **You need:** [Chapter 1](01-What-Security-Means.md).

## 2.1 Who attacks

| Attacker | Wants | Typical skill and resources |
| --- | --- | --- |
| Opportunist ("script kiddie") | fun, bragging | low; uses ready-made tools |
| Criminal group | money: ransom, stolen cards, fraud | medium to high; organised like a business |
| Hacktivist | publicity for a cause | low to medium; defacements, leaks, floods |
| Insider | revenge, money, or just a mistake | already has access |
| State-backed group | spying, sabotage, long-term access | very high; patient; may hold unknown flaws |

Most attacks on ordinary networks are **opportunistic and automated**: bots scan the whole IPv4 internet in minutes
(tools such as ZMap made this practical in 2013) and try known flaws and common passwords on whatever answers. A new
server is usually probed within minutes of getting a public address. You do not need to be interesting to be
attacked; you only need to be reachable and weak.

## 2.2 Passive and active

A **passive** attack only listens: sniffing traffic, analysing who talks to whom and when (**traffic analysis**, which
works even on encrypted traffic). Passive attacks are hard to detect, so the defence is prevention: encryption, and
padding or mixing for traffic analysis.

An **active** attack changes something: injecting, replaying, modifying or dropping packets, impersonating a party,
or flooding a service. Active attacks can be detected, so defences combine prevention (authentication, integrity
checks) with detection and response.

A classic active attack is **man-in-the-middle** (MITM, also called on-path): the attacker sits between two parties,
relaying and possibly altering everything. Chapters 5–7 show how attackers get on-path on a LAN (ARP spoofing), on the
internet (route hijacks) and by name (DNS spoofing). Cryptographic authentication (Chapter 3) is what defeats it.

## 2.3 How an intrusion unfolds

Lockheed Martin's **Cyber Kill Chain** (2011) splits an intrusion into stages:

1. **Reconnaissance**: learn about the target (staff names, exposed servers, software versions).
2. **Weaponisation**: prepare the exploit or malicious document.
3. **Delivery**: get it to the target (email, website, USB stick, exposed service).
4. **Exploitation**: trigger the flaw.
5. **Installation**: leave a foothold (malware, a new account).
6. **Command and control (C2)**: the foothold calls home for instructions.
7. **Actions on objectives**: steal, encrypt, destroy.

The useful lesson: a defender can break the chain at any stage, and the earlier the better. Inside the network,
attackers also **move laterally** (from the first laptop to servers) and **escalate privilege** (from user to admin),
which is why internal segmentation and monitoring matter (Chapters 11–12).

**MITRE ATT&CK** is a free, detailed catalogue of attacker behaviour drawn from real incidents: 14 **tactics** (the
"why", such as initial access, persistence, lateral movement, exfiltration) and hundreds of **techniques** (the "how",
such as phishing with an attachment, or using stolen valid accounts). Defenders map their detections against it to
find gaps.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 315" role="img" aria-labelledby="sk-ns-chain-t"><title id="sk-ns-chain-t">Seven chain links, from looking around to acting on the goal; cutting the third link, delivery, stops everything after it</title><defs><filter id="sk-ns-chain-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ns-chain-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ns-chain-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ns-chain-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ns-chain-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="315" filter="url(#sk-ns-chain-paper)"/><g filter="url(#sk-ns-chain-pen)"><text x="30" y="44" class="h">Seven links: break any one</text><ellipse cx="70" cy="150" rx="40" ry="22" class="p room"/><text x="70" y="196" text-anchor="middle" class="s">1 look around</text><ellipse cx="152" cy="150" rx="40" ry="22" class="p room"/><text x="152" y="218" text-anchor="middle" class="s">2 prepare</text><ellipse cx="234" cy="150" rx="40" ry="22" class="p rust"/><text x="234" y="196" text-anchor="middle" class="s">3 deliver</text><ellipse cx="316" cy="150" rx="40" ry="22" class="p room"/><text x="316" y="218" text-anchor="middle" class="s">4 exploit</text><ellipse cx="398" cy="150" rx="40" ry="22" class="p room"/><text x="398" y="196" text-anchor="middle" class="s">5 install</text><ellipse cx="480" cy="150" rx="40" ry="22" class="p room"/><text x="480" y="218" text-anchor="middle" class="s">6 call home</text><ellipse cx="562" cy="150" rx="40" ry="22" class="p room"/><text x="562" y="196" text-anchor="middle" class="s">7 act</text><path class="p red" d="M216 120 L236 180 M236 120 L216 180"/><text x="40" y="270" class="s">Stop the delivery (say, a filtered email) and nothing after it can happen.</text><text x="40" y="294" class="s">The earlier the break, the less the attacker has learned or touched.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## 2.4 The common ways in

Year after year, incident reports (such as Verizon's Data Breach Investigations Report) show the same few doors:

- **Stolen or weak credentials**: reused passwords, passwords guessed by trying common ones on many accounts
  (**password spraying**), or leaked lists tried elsewhere (**credential stuffing**). Defence: unique passwords, MFA
  (Chapter 4).
- **Phishing**: a message that tricks a person into giving a password or running a file. Defence: phishing-resistant
  MFA (passkeys), mail filtering, training, and making it easy to report.
- **Exploiting unpatched, exposed systems**: VPN gateways, firewalls, mail servers and file-transfer tools on the edge
  have been favourite targets in 2023–2025. Defence: patch fast, expose less.
- **Misconfiguration**: an open database or storage bucket, a default admin password, a test server left online.

**Malware** is software built to harm: viruses and worms (which spread themselves; the 1988 Morris worm was the first to
hit the internet widely), trojans (which pretend to be useful), **botnets** (many infected devices controlled together,
like the 2016 Mirai botnet of cameras and routers with default passwords) and **ransomware**, which encrypts files and
demands payment, today usually also stealing data first and threatening to publish it ("double extortion"). The
strongest defence against ransomware is tested, offline or immutable **backups**.

## 2.5 Vulnerabilities, exploits and scores

A **vulnerability** is a flaw; an **exploit** is code or a method that uses it. Publicly known flaws get a **CVE**
identifier (Common Vulnerabilities and Exposures, such as CVE-2014-0160 for Heartbleed, a TLS library bug that leaked
server memory). Each is scored with **CVSS** (Common Vulnerability Scoring System, version 4.0 since 2023) from 0 to 10,
from base metrics such as: can it be reached over the network, is it easy, does it need a login or user action, and
what does it do to C, I and A.

| CVSS score | Rating |
| --- | --- |
| 0.1–3.9 | Low |
| 4.0–6.9 | Medium |
| 7.0–8.9 | High |
| 9.0–10.0 | Critical |

A score says how bad a flaw *could* be, not how likely it is to be used. Two extra sources help prioritise: CISA's
**Known Exploited Vulnerabilities** catalogue (flaws seen used in real attacks) and **EPSS** (a model estimating the
probability of exploitation in the next 30 days). Patch what is exposed and known to be exploited first.

A **zero-day** is a flaw the vendor does not yet know about, so no patch exists. Zero-days are expensive and usually
used carefully against chosen targets. Most damage comes from **n-days**: flaws with patches that were not applied.
After a patch appears, attackers can compare old and new versions to find the flaw, so exploitation often starts within
days.

## Check yourself

??? question "1. Why should a small business with nothing secret still worry about attacks?"
    Most attacks are automated and opportunistic: bots scan everything reachable and exploit whatever is weak, often for ransomware or to recruit devices into botnets.

??? question "2. Is traffic analysis possible on fully encrypted traffic? Give an example."
    Yes. Packet sizes, timing and endpoints remain visible; for example, which websites someone visits can often be guessed from the pattern of encrypted traffic.

??? question "3. A flaw has CVSS 9.8 but is in a service you do not expose; another is 7.5, on your VPN gateway, and in CISA's KEV catalogue. Which do you patch first?"
    The 7.5 on the VPN gateway: it is exposed to the internet and known to be exploited. Score alone is not priority.

??? question "4. Name the kill-chain stage where 'the malware calls a server every hour for instructions' happens."
    Command and control (stage 6).

??? info "Sources"
    - E. M. Hutchins, M. J. Cloppert and R. M. Amin, "Intelligence-Driven Computer Network Defense Informed by Analysis of Adversary Campaigns and Intrusion Kill Chains", Lockheed Martin, 2011.
    - MITRE ATT&CK (attack.mitre.org); FIRST, *CVSS v4.0 Specification* (2023) and *EPSS* (first.org/epss).
    - CISA, *Known Exploited Vulnerabilities Catalog*; Verizon, *Data Breach Investigations Report* (yearly).
    - Z. Durumeric, E. Wustrow and J. A. Halderman, "ZMap: Fast Internet-wide Scanning", USENIX Security 2013; M. Antonakakis et al., "Understanding the Mirai Botnet", USENIX Security 2017.
