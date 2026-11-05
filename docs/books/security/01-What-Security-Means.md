# 1. What security means

*Security is not a product you install but a property you keep: the right people can use the network, and the wrong people cannot read, change or stop it. This chapter gives the words and ideas that every later chapter uses: the CIA triad, threats and risk, and the design principles that have held since the 1970s.*

!!! abstract "In this chapter"
    **You will learn:** confidentiality, integrity and availability (and authenticity and accountability); assets,
    threats, vulnerabilities and risk; threat modelling with STRIDE; the classic design principles (least privilege,
    defence in depth, fail-safe defaults); why security is a trade-off.

    **You need:** [How networks work](../networks/index.md), chapters 1–2.

## 1.1 Three goals: C, I and A

Security people describe what they protect with three goals, the **CIA triad**:

| Goal | Means | A failure looks like |
| --- | --- | --- |
| **Confidentiality** | only the intended people can read the data | someone on the café Wi-Fi reads your messages |
| **Integrity** | nobody can change the data without being noticed | a download is swapped for one with malware; a bank transfer's amount is altered |
| **Availability** | the service works when you need it | a flood of traffic takes a website offline |

Two more goals are usually added. **Authenticity**: you know who you are talking to (the server really is your bank;
the message really came from your friend). **Accountability** (or non-repudiation): actions can be traced to whoever
did them, so a signer cannot later deny signing.

The goals pull against each other. Locking every door helps confidentiality and hurts availability; keeping many
copies helps availability and makes confidentiality harder. Good design balances them for the actual use.

## 1.2 Assets, threats, vulnerabilities, risk

Four words, often mixed up:

- An **asset** is something worth protecting: customer data, a router's configuration, the network's uptime.
- A **threat** is something that could harm an asset: a criminal group, a careless insider, a power cut.
- A **vulnerability** is a weakness a threat can use: an unpatched router, a reused password, an open port.
- **Risk** combines how likely harm is and how bad it would be.

A common rough formula is

$$\text{risk} = \text{likelihood} \times \text{impact}.$$

If a breach of a database has a 10% chance per year and would cost 2 million dollars, the yearly expected loss is
200,000 dollars, which tells you a 50,000-dollar fix is worth it. Real numbers are hard to know, so many organisations
use a simple grid (low / medium / high on each axis). Risk can be **reduced** (add a control), **transferred**
(insurance, an outside service), **avoided** (stop doing the risky thing) or **accepted** (write it down and live with it).

## 1.3 Controls

A **control** is anything that reduces risk. Controls are grouped by what they do:

- **Preventive**: stop the attack (a firewall rule, a strong password, encryption).
- **Detective**: notice it (logs, an intrusion detection system, an alert on a strange login).
- **Corrective**: limit and repair damage (backups, incident response, patching).

and by kind: **technical** (software and devices), **administrative** (policies, training, procedures) and **physical**
(locks, guards, a locked network cupboard). A network needs all three kinds: the best firewall is useless if anyone
can walk in and plug a laptop into the core switch.

## 1.4 Threat modelling

Before choosing controls, ask four questions (Adam Shostack's framing): *What are we working on? What can go wrong?
What are we going to do about it? Did we do a good job?* To answer "what can go wrong" systematically, Microsoft's
**STRIDE** lists six kinds of threat, each the opposite of a goal:

| Threat | Violates | Network example |
| --- | --- | --- |
| **S**poofing | authenticity | a fake Wi-Fi access point with the café's name |
| **T**ampering | integrity | changing packets in transit |
| **R**epudiation | accountability | an admin deletes the logs of what they did |
| **I**nformation disclosure | confidentiality | sniffing unencrypted traffic |
| **D**enial of service | availability | flooding a server |
| **E**levation of privilege | authorisation | a guest on the network reaching the admin page of a router |

Draw the system as a **data-flow diagram** (users, processes, data stores, and the flows between them), mark the
**trust boundaries** where data crosses from less trusted to more trusted parts (the internet edge, the guest Wi-Fi,
the database), and walk STRIDE over each flow that crosses one. Most real attacks happen at trust boundaries.

<figure class="mars-fig">
<svg viewBox="0 0 640 170" role="img" aria-label="A data-flow diagram with trust boundaries between internet, web server and database">
<rect x="10" y="60" width="110" height="50" rx="8" class="na-f"/><text x="65" y="90" text-anchor="middle">Internet user</text>
<rect x="250" y="60" width="130" height="50" rx="8" class="nb-f"/><text x="315" y="90" text-anchor="middle">Web server</text>
<rect x="510" y="60" width="120" height="50" rx="8" class="nc-f"/><text x="570" y="90" text-anchor="middle">Database</text>
<line x1="120" y1="85" x2="250" y2="85" class="na" stroke-width="2" marker-end="url(#a1)"/>
<line x1="380" y1="85" x2="510" y2="85" class="nb" stroke-width="2" marker-end="url(#a1)"/>
<line x1="185" y1="20" x2="185" y2="150" stroke="currentColor" stroke-dasharray="6 5"/>
<line x1="445" y1="20" x2="445" y2="150" stroke="currentColor" stroke-dasharray="6 5"/>
<text x="185" y="165" text-anchor="middle" font-size="12">trust boundary</text>
<text x="445" y="165" text-anchor="middle" font-size="12">trust boundary</text>
<defs><marker id="a1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
</svg>
<figcaption>A tiny data-flow diagram. Dashed lines are trust boundaries; each flow that crosses one gets the STRIDE questions.</figcaption>
</figure>

## 1.5 Design principles

In 1975 Jerome Saltzer and Michael Schroeder listed design principles for protecting information. They still hold:

- **Least privilege**: give each user and program only the access it needs. A printer needs no route to the payroll server.
- **Fail-safe defaults**: deny unless allowed. A firewall that ends with "drop everything else" fails safe.
- **Economy of mechanism**: keep it small and simple, so it can be checked.
- **Complete mediation**: check every access, not only the first.
- **Open design**: security must not depend on keeping the design secret, only the keys (this is **Kerckhoffs's
  principle** from 1883 cryptography).
- **Separation of privilege**: require two conditions (a password *and* a phone) for important actions.
- **Least common mechanism**: share as little as possible between users.
- **Psychological acceptability**: if security is too painful, people work around it.

To these, network practice adds **defence in depth**: several independent layers (a firewall, then segmentation, then
host hardening, then encryption, then monitoring), so one failure does not lose everything. It also adds **assume
breach**: plan as if an attacker is already inside, which leads to zero trust (Chapter 15).

## 1.6 Security is a process

Attackers adapt, software changes, and new flaws are found in old code every week. So security is a cycle: identify
what you have, protect it, detect attacks, respond, and recover; NIST's Cybersecurity Framework 2.0 (2024) names these
functions and adds **govern** (who decides and owns the risk). The rest of this book follows the same path: the ideas
and the attacker (Part I), attacks on each layer (Part II), the secure channels that defeat many of them (Part III),
how a network is defended (Part IV), and what to do when something goes wrong (Part V).

## Check yourself

??? question "1. A hospital's records are encrypted but the server is down for a day. Which goal failed?"
    Availability. Confidentiality and integrity held, but doctors could not reach the records.

??? question "2. A breach has a 5% yearly chance and would cost 400,000 dollars. What is the expected yearly loss, and is a 30,000-dollar fix that removes the risk worth it?"
    0.05 × 400,000 = 20,000 dollars per year. A one-time 30,000-dollar fix pays for itself in about a year and a half, so usually yes.

??? question "3. Which STRIDE threat is a fake access point with the café's network name?"
    Spoofing: it pretends to be something it is not, violating authenticity.

??? question "4. Why is 'drop everything else' at the end of a firewall rule list an example of fail-safe defaults?"
    Anything nobody thought about is blocked instead of allowed, so mistakes of omission fail closed.

??? info "Sources"
    - J. H. Saltzer and M. D. Schroeder, "The Protection of Information in Computer Systems", *Proceedings of the IEEE* 63(9), 1975.
    - NIST, *Cybersecurity Framework 2.0* (CSWP 29, 2024); NIST SP 800-30 Rev. 1, *Guide for Conducting Risk Assessments*.
    - A. Shostack, *Threat Modeling: Designing for Security*, Wiley, 2014.
    - R. Anderson, *Security Engineering*, 3rd ed., Wiley, 2020, chapters 1–2.
