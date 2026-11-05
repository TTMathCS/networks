# 12. Detection and monitoring

*Prevention eventually fails, so you must notice when it does. This chapter covers what to collect (logs, flows, packets), intrusion detection with signatures and anomalies, SIEMs, endpoint detection, deception, and the hard truth about false alarms, which has a precise mathematical form.*

!!! abstract "In this chapter"
    **You will learn:** the sources of evidence on a network; NetFlow/IPFIX; packet capture; IDS and IPS; signature and
    anomaly detection; Snort, Suricata and Zeek; the base-rate fallacy; SIEM and correlation; EDR and NDR; honeypots
    and canary tokens; measuring detection.

    **You need:** [Chapter 2](02-Attackers-and-Attacks.md); [Math foundations, chapter 2](../math/02-Probability-for-Networks.md) for Bayes' rule.

## 12.1 What to collect

| Source | Tells you | Cost |
| --- | --- | --- |
| **Logs** (firewall, DNS, VPN, authentication, servers) | who did what, when | low to medium |
| **Flow records** (NetFlow, IPFIX, sFlow) | who talked to whom, how much, how long | low |
| **Full packet capture** | exactly what was sent | high storage; mostly encrypted now |
| **Endpoint telemetry** (EDR) | processes, files, connections on each host | medium |

A **flow record** summarises a conversation: addresses, ports, protocol, start and end, bytes and packets. Flows are
tiny compared with packets, so you can keep months of them and answer "which hosts talked to this bad address in
August?" Packet capture is kept briefly or triggered for specific cases. Packets reach a sensor via a **network tap**
or a switch **SPAN** (mirror) port.

Clocks must agree (NTP everywhere) and logs must be sent off the device quickly, or an intruder will delete them.

## 12.2 Intrusion detection

An **IDS** watches traffic or hosts and raises alerts; an **IPS** sits inline and can also drop traffic. Two methods:

- **Signature-based**: match known patterns, such as a byte sequence of a known exploit or a known malware's call-home
  request. Precise for known threats, blind to new ones.
- **Anomaly-based**: learn what normal looks like, flag what differs (a printer suddenly sending gigabytes to another
  country, a user logging in from two continents in an hour). Can catch new attacks but produces more false alarms.

Open-source tools: **Snort** (1998) and **Suricata** (2010) are signature IDS/IPS engines with shared rule formats;
**Zeek** (formerly Bro, 1998) turns traffic into detailed logs of connections, DNS, HTTP, TLS certificates and more for
analysis. A Suricata rule looks like:

```
alert dns any any -> any any (msg:"Lookup of known bad domain";
  dns.query; content:"bad.example"; nocase; sid:1000001; rev:1;)
```

Encryption hides payloads, so modern detection relies on metadata: DNS queries, TLS details (server names, certificate
fields, client fingerprints such as JA4), flow patterns such as regular "beaconing" to the same server.

## 12.3 The base-rate fallacy

Suppose an IDS catches 99% of attacks and wrongly alarms on only 1% of normal events, and 1 in 10,000 events is
actually an attack. If it alarms, what is the chance it is a real attack? By Bayes' rule:

$$P(\text{attack}\mid\text{alarm}) = \frac{0.99 \times 0.0001}{0.99 \times 0.0001 + 0.01 \times 0.9999} \approx 0.0098.$$

Under 1%: about 99 of every 100 alarms are false. Stefan Axelsson showed this in 2000: because real attacks are rare,
the false-alarm rate, not the detection rate, decides whether an IDS is usable. With millions of events per day, even
0.01% false alarms swamp analysts ("alert fatigue"), and real alerts are missed, as in several famous breaches where
the alert fired but nobody acted. Good detection engineering tunes rules to the environment, combines weak signals
before alerting, and measures precision.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 415" role="img" aria-labelledby="sk-ns-baserate-t"><title id="sk-ns-baserate-t">A grid of 100 alarm dots with one red: when attacks are 1 in 10,000 events, a detector with 99 percent detection and 1 percent false alarms is right under 1 percent of the time it alarms</title><defs><filter id="sk-ns-baserate-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ns-baserate-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ns-baserate-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ns-baserate-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ns-baserate-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="415" filter="url(#sk-ns-baserate-paper)"/><g filter="url(#sk-ns-baserate-pen)"><text x="30" y="44" class="h">Of 100 alarms, about one is real</text><circle cx="50" cy="80" r="10" class="p room"/><circle cx="80" cy="80" r="10" class="p room"/><circle cx="110" cy="80" r="10" class="p room"/><circle cx="140" cy="80" r="10" class="p room"/><circle cx="170" cy="80" r="10" class="p room"/><circle cx="200" cy="80" r="10" class="p room"/><circle cx="230" cy="80" r="10" class="p room"/><circle cx="260" cy="80" r="10" class="p room"/><circle cx="290" cy="80" r="10" class="p room"/><circle cx="320" cy="80" r="10" class="p room"/><circle cx="50" cy="110" r="10" class="p room"/><circle cx="80" cy="110" r="10" class="p room"/><circle cx="110" cy="110" r="10" class="p room"/><circle cx="140" cy="110" r="10" class="p room"/><circle cx="170" cy="110" r="10" class="p room"/><circle cx="200" cy="110" r="10" class="p room"/><circle cx="230" cy="110" r="10" class="p room"/><circle cx="260" cy="110" r="10" class="p room"/><circle cx="290" cy="110" r="10" class="p room"/><circle cx="320" cy="110" r="10" class="p room"/><circle cx="50" cy="140" r="10" class="p room"/><circle cx="80" cy="140" r="10" class="p room"/><circle cx="110" cy="140" r="10" class="p room"/><circle cx="140" cy="140" r="10" class="p room"/><circle cx="170" cy="140" r="10" class="p room"/><circle cx="200" cy="140" r="10" class="p room"/><circle cx="230" cy="140" r="10" class="p room"/><circle cx="260" cy="140" r="10" class="p room"/><circle cx="290" cy="140" r="10" class="p room"/><circle cx="320" cy="140" r="10" class="p room"/><circle cx="50" cy="170" r="10" class="p room"/><circle cx="80" cy="170" r="10" class="p room"/><circle cx="110" cy="170" r="10" class="p room"/><circle cx="140" cy="170" r="10" class="p room"/><circle cx="170" cy="170" r="10" class="p room"/><circle cx="200" cy="170" r="10" class="p room"/><circle cx="230" cy="170" r="10" class="p room"/><circle cx="260" cy="170" r="10" class="p room"/><circle cx="290" cy="170" r="10" class="p room"/><circle cx="320" cy="170" r="10" class="p room"/><circle cx="50" cy="200" r="10" class="p room"/><circle cx="80" cy="200" r="10" class="p room"/><circle cx="110" cy="200" r="10" class="p room"/><circle cx="140" cy="200" r="10" class="p room"/><circle cx="170" cy="200" r="10" class="p room"/><circle cx="200" cy="200" r="10" class="p room"/><circle cx="230" cy="200" r="10" class="p room"/><circle cx="260" cy="200" r="10" class="p room"/><circle cx="290" cy="200" r="10" class="p room"/><circle cx="320" cy="200" r="10" class="p room"/><circle cx="50" cy="230" r="10" class="p room"/><circle cx="80" cy="230" r="10" class="p room"/><circle cx="110" cy="230" r="10" class="p room"/><circle cx="140" cy="230" r="10" class="p room"/><circle cx="170" cy="230" r="10" class="p room"/><circle cx="200" cy="230" r="10" class="p room"/><circle cx="230" cy="230" r="10" class="p room"/><circle cx="260" cy="230" r="10" class="p room"/><circle cx="290" cy="230" r="10" class="p room"/><circle cx="320" cy="230" r="10" class="p room"/><circle cx="50" cy="260" r="10" class="p room"/><circle cx="80" cy="260" r="10" class="p room"/><circle cx="110" cy="260" r="10" class="p room"/><circle cx="140" cy="260" r="10" class="p red" style="fill:#a03a2a"/><circle cx="170" cy="260" r="10" class="p room"/><circle cx="200" cy="260" r="10" class="p room"/><circle cx="230" cy="260" r="10" class="p room"/><circle cx="260" cy="260" r="10" class="p room"/><circle cx="290" cy="260" r="10" class="p room"/><circle cx="320" cy="260" r="10" class="p room"/><circle cx="50" cy="290" r="10" class="p room"/><circle cx="80" cy="290" r="10" class="p room"/><circle cx="110" cy="290" r="10" class="p room"/><circle cx="140" cy="290" r="10" class="p room"/><circle cx="170" cy="290" r="10" class="p room"/><circle cx="200" cy="290" r="10" class="p room"/><circle cx="230" cy="290" r="10" class="p room"/><circle cx="260" cy="290" r="10" class="p room"/><circle cx="290" cy="290" r="10" class="p room"/><circle cx="320" cy="290" r="10" class="p room"/><circle cx="50" cy="320" r="10" class="p room"/><circle cx="80" cy="320" r="10" class="p room"/><circle cx="110" cy="320" r="10" class="p room"/><circle cx="140" cy="320" r="10" class="p room"/><circle cx="170" cy="320" r="10" class="p room"/><circle cx="200" cy="320" r="10" class="p room"/><circle cx="230" cy="320" r="10" class="p room"/><circle cx="260" cy="320" r="10" class="p room"/><circle cx="290" cy="320" r="10" class="p room"/><circle cx="320" cy="320" r="10" class="p room"/><circle cx="50" cy="350" r="10" class="p room"/><circle cx="80" cy="350" r="10" class="p room"/><circle cx="110" cy="350" r="10" class="p room"/><circle cx="140" cy="350" r="10" class="p room"/><circle cx="170" cy="350" r="10" class="p room"/><circle cx="200" cy="350" r="10" class="p room"/><circle cx="230" cy="350" r="10" class="p room"/><circle cx="260" cy="350" r="10" class="p room"/><circle cx="290" cy="350" r="10" class="p room"/><circle cx="320" cy="350" r="10" class="p room"/><text x="380" y="100" class="s">The alarm catches 99% of attacks</text><text x="380" y="120" class="s">and wrongly fires on 1% of normal</text><text x="380" y="140" class="s">events. Sounds good.</text><text x="380" y="190" class="s">But only 1 event in 10,000 is an</text><text x="380" y="210" class="s">attack. In a million events:</text><text x="380" y="240" class="s">about 99 real alarms</text><text x="380" y="260" class="s">about 10,000 false ones</text><text x="380" y="310" class="l">Under 1% of alarms are real.</text><text x="30" y="400" class="s">Red: the one real attack among a hundred alarms. Rare events make false alarms win.</text></g></svg><figcaption>Sketched for this page. To scale: 1 in 100.</figcaption></figure>

## 12.4 SIEM, EDR and NDR

A **SIEM** (security information and event management) collects logs from everywhere, normalises them, keeps them, and
runs **correlation** rules and searches: "five failed VPN logins, then a success from a new country, then a new admin
account". **SOAR** tools automate the response steps.

**EDR** (endpoint detection and response) agents watch each computer's processes and connections and can isolate a
host with one click; **NDR** (network detection and response) does the same from network traffic; **XDR** products
combine both. Detection rules are increasingly written in shared formats (Sigma for logs) and mapped to MITRE ATT&CK
(Chapter 2) to see which attacker techniques are covered.

## 12.5 Deception

A **honeypot** is a system with no legitimate use; any connection to it is suspicious by definition, so it gives
alerts with almost no false positives. **Canary tokens** are fake credentials, documents or DNS names planted where an
intruder would look; touching one sends an alert. Deception is cheap and catches attackers doing reconnaissance inside
the network, where other detection is weakest.

## 12.6 Measuring and improving

Useful measures: **time to detect** and **time to respond** (industry reports have shown median "dwell times" falling
from months in the early 2010s to days in the 2020s, though many intrusions are still found by outsiders);
**coverage** of ATT&CK techniques relevant to you; and the **precision** of each alert rule. Test detection by running
safe simulations of attacker techniques in your own environment (open tools such as Atomic Red Team exist for this) and
checking that the alerts fire, a practice called **purple teaming** (Chapter 17).

## Check yourself

??? question "1. Why can flow records be kept much longer than packet captures?"
    They store only a summary per conversation (addresses, ports, sizes, times), which is a tiny fraction of the packet data.

??? question "2. Recompute 12.3 with a false alarm rate of 0.1%. What share of alarms are real?"
    0.99 × 0.0001 / (0.99 × 0.0001 + 0.001 × 0.9999) ≈ 0.000099 / 0.0010989 ≈ 9%. Ten times fewer false alarms raises precision about ninefold, but most alarms are still false.

??? question "3. Why do honeypots have so few false positives?"
    No legitimate user or system has a reason to touch them, so any contact is suspicious.

??? question "4. With most traffic encrypted, name two things a network sensor can still use."
    DNS queries, TLS handshake details (SNI, certificates, client fingerprints), flow timing and volume, destinations.

??? info "Sources"
    - S. Axelsson, "The Base-Rate Fallacy and the Difficulty of Intrusion Detection", *ACM TISSEC* 3(3), 2000.
    - D. E. Denning, "An Intrusion-Detection Model", *IEEE Transactions on Software Engineering*, 1987; V. Paxson, "Bro: A System for Detecting Network Intruders in Real-Time", 1999.
    - RFC 7011 (IPFIX); NIST SP 800-92 (log management), SP 800-94 (IDPS); Suricata and Zeek documentation; Sigma project; FoxIO JA4 specification.
    - Mandiant, *M-Trends* reports (dwell time figures).
