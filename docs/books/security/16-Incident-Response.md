# 16. Incident response

*Something has gone wrong: ransomware notes on screens, an alert about a strange admin login, a call from a partner saying your server attacks them. What you do in the first hours decides how bad it gets. This chapter gives the incident-response cycle, from preparation to lessons learned, with the network engineer's part in each step.*

!!! abstract "In this chapter"
    **You will learn:** what an incident is; the NIST response cycle; preparation and playbooks; detection and triage;
    containment choices; evidence and forensics; eradication and recovery; backups that survive ransomware;
    communication; the post-incident review.

    **You need:** [Chapter 12](12-Detection-and-Monitoring.md).

## 16.1 Events and incidents

An **event** is anything observable (a login, a blocked connection). An **incident** is an event, or set of events,
that harms or threatens confidentiality, integrity or availability, or breaks policy. Most alerts are not incidents;
**triage** decides which are, and how serious. A simple severity scale (low, medium, high, critical) based on what is
affected and how widely helps decide who to wake up.

## 16.2 The cycle

NIST SP 800-61 described four phases; its 2025 revision (Rev. 3) maps them onto the Cybersecurity Framework functions
(govern, identify, protect, detect, respond, recover), but the classic steps are still the clearest:

1. **Preparation**
2. **Detection and analysis**
3. **Containment, eradication and recovery**
4. **Post-incident activity** (lessons learned)

and back to preparation.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 410" role="img" aria-labelledby="sk-ns-cycle-t"><title id="sk-ns-cycle-t">A loop of four phases: preparation, detection and analysis, containment eradication and recovery, lessons learned, then back to preparation</title><defs><filter id="sk-ns-cycle-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ns-cycle-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ns-cycle-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ns-cycle-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ns-cycle-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="410" filter="url(#sk-ns-cycle-paper)"/><g filter="url(#sk-ns-cycle-pen)"><text x="30" y="44" class="h">Round and round, a little better each time</text><ellipse cx="320" cy="100" rx="90" ry="26" class="p gold"/><text x="320" y="105" text-anchor="middle" class="s">preparation</text><ellipse cx="440" cy="220" rx="70" ry="26" class="p room"/><text x="440" y="217" text-anchor="middle" class="s">detection and</text><text x="440" y="233" text-anchor="middle" class="s">analysis</text><ellipse cx="320" cy="340" rx="90" ry="26" class="p room"/><text x="320" y="337" text-anchor="middle" class="s">containment,</text><text x="320" y="353" text-anchor="middle" class="s">eradication, recovery</text><ellipse cx="200" cy="220" rx="70" ry="26" class="p room"/><text x="200" y="225" text-anchor="middle" class="s">lessons learned</text><path class="p" d="M383 118 A120 120 0 0 1 422 157" marker-end="url(#sk-ns-cycle-ah)"/><path class="p" d="M422 283 A120 120 0 0 1 383 322" marker-end="url(#sk-ns-cycle-ah)"/><path class="p" d="M257 322 A120 120 0 0 1 218 283" marker-end="url(#sk-ns-cycle-ah)"/><path class="p" d="M218 157 A120 120 0 0 1 257 118" marker-end="url(#sk-ns-cycle-ah)"/><text x="30" y="395" class="s">What you learn after one incident goes into getting ready for the next.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## 16.3 Preparation

Most of the outcome is decided before the incident:

- A **plan**: who leads, who decides to shut things down, who talks to management, customers, police and regulators,
  and how to reach them when email is down (phone numbers on paper).
- **Playbooks** for likely cases: ransomware, a compromised account, a DDoS (Chapter 13), a lost laptop, a data leak.
- **Visibility**: logs centralised and kept long enough (a year is a common target), flows, EDR, accurate clocks.
- **Inventory and diagrams**: you cannot contain what you cannot find.
- **Backups** that an attacker with admin rights cannot delete: offline, immutable (write-once) or in a separate
  account, and **tested** by actually restoring.
- **Exercises**: a tabletop walk-through of a scenario once or twice a year finds gaps cheaply.

## 16.4 Detection and analysis

Signs arrive from alerts, users ("my files have strange names"), outsiders (a partner, a researcher, a national
CERT), or the attacker. Analysis asks: what happened, which systems and accounts are involved, is it still going on,
and how did they get in? Build a **timeline** from logs, flows and endpoint data. Keep notes of every step and time,
because you will need them later. Look for the same **indicators of compromise** (IP addresses, domains, file hashes)
across all systems to find the full scope; attackers rarely touch only one machine.

## 16.5 Containment

Containment stops the damage spreading. Network engineers are central here:

| Action | Effect | Cost |
| --- | --- | --- |
| Isolate a host (EDR or switch port to a quarantine VLAN) | stops it spreading or calling home | user offline |
| Block indicators at firewall and DNS | cuts command and control | attacker may switch |
| Disable accounts, reset credentials, revoke tokens and sessions | removes stolen access | must cover all of them at once |
| Segment or disconnect whole sites or the internet link | stops large-scale spread (ransomware) | business stops |

A key choice is **timing**: act at once to stop harm, or watch briefly to learn the full scope so you can remove the
attacker everywhere at the same moment. If you block one door the attacker notices and uses another. For active
ransomware encryption, speed wins.

## 16.6 Evidence

Preserve evidence before changing systems where you can: memory captures and disk images of key machines, copies of
logs, packet captures. Record who handled each item and when (the **chain of custody**) if legal action or insurance
claims may follow. Volatile data (memory, network connections) disappears on reboot, so capture it first (RFC 3227's
"order of volatility"). Do not power off a compromised machine by reflex.

## 16.7 Eradication and recovery

**Eradicate**: remove malware and attacker accounts, close the initial way in (patch, fix the configuration), and
reset every credential the attacker might have seen, including service accounts and, in a Windows domain, the Kerberos
`krbtgt` account twice. When in doubt, rebuild systems from known-good images rather than cleaning them.

**Recover**: restore from clean backups, bring systems back in order of importance, and watch closely for the attacker
returning. For ransomware, check backups were not encrypted or tampered with, and remember the attacker probably also
stole data. National agencies (such as CISA and the Canadian Centre for Cyber Security) publish ransomware guides and
advise against paying, since payment funds more attacks and does not guarantee recovery.

## 16.8 Communication and lessons

Inside, keep leaders informed with short regular updates. Outside, many places have rules requiring notification of
affected people or regulators within set times when personal data is involved; involve legal advisers early. Coordinate
with your providers and, where useful, your national CERT.

Within two weeks, hold a **blameless post-incident review**: what happened, what went well, what did not, and concrete
actions with owners (more logging here, MFA there, a playbook change). The aim is to make the next incident smaller,
not to find someone to blame; people hide mistakes when they fear punishment.

## Check yourself

??? question "1. Why should backups be offline or immutable?"
    Ransomware operators with admin rights look for and delete or encrypt reachable backups before encrypting everything else.

??? question "2. Why might responders wait briefly before blocking an attacker they have found?"
    To learn the full scope (all footholds and accounts), so they can remove the attacker everywhere at once instead of tipping them off.

??? question "3. Why capture memory before rebooting a compromised server?"
    Memory holds volatile evidence (running malware, keys, network connections) that is lost on reboot.

??? question "4. What makes a post-incident review 'blameless', and why does it matter?"
    It focuses on systems and decisions rather than punishing individuals, so people report honestly and the real causes are fixed.

??? info "Sources"
    - NIST SP 800-61 Rev. 2 (2012) and Rev. 3, *Incident Response Recommendations and Considerations for Cybersecurity Risk Management* (2025).
    - RFC 3227, *Guidelines for Evidence Collection and Archiving*; NIST SP 800-86 (integrating forensics into incident response).
    - CISA and partners, *#StopRansomware Guide* (2023); Canadian Centre for Cyber Security, *Ransomware Playbook* (ITSM.00.099).
    - SANS Institute, *Incident Handler's Handbook*.
