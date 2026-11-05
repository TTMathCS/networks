# Glossary

*The terms of [Network security](index.md), with the chapter where each is explained.*

| Term | Meaning | Ch. |
| --- | --- | --- |
| 802.1X | port-based network login with EAP and RADIUS | 4 |
| AAA | authentication, authorisation, accounting | 4 |
| AEAD | encryption that also authenticates (AES-GCM, ChaCha20-Poly1305) | 3 |
| Amplification factor | reply size divided by request size in a reflection attack | 13 |
| Anycast | one address announced from many places | 13 |
| ARP spoofing | false ARP replies that put an attacker on-path | 5 |
| ASPA | signed list of an AS's providers, against route leaks | 6 |
| Base-rate fallacy | rare attacks make most alarms false even with accurate detectors | 12 |
| BCP 38 | ingress filtering against spoofed source addresses | 6 |
| BeyondCorp | Google's zero trust model without a VPN | 15 |
| Botnet | many compromised devices controlled together | 2, 13 |
| BPDU Guard | shuts access ports that send spanning-tree messages | 5 |
| BPSec | security for individual bundles in delay-tolerant networks | 18 |
| CAA record | DNS record naming the CAs allowed to issue for a domain | 7 |
| Certificate Transparency | public logs of all issued certificates | 3 |
| CIA triad | confidentiality, integrity, availability | 1 |
| Containment | stopping an incident spreading | 16 |
| CSP | Content Security Policy: which scripts a page may run | 14 |
| CSRF | forcing a logged-in browser to send an unwanted request | 14 |
| CVE / CVSS | identifier / severity score for a known flaw | 2 |
| DAI | Dynamic ARP Inspection on switches | 5 |
| Defence in depth | several independent layers of protection | 1 |
| DHCP snooping | switch drops DHCP offers from untrusted ports | 5 |
| DMZ | zone for servers the internet must reach | 11 |
| DNSSEC | signatures on DNS data with a chain of trust | 7 |
| DoH / DoT / DoQ | DNS over HTTPS / TLS / QUIC | 7 |
| ECH | Encrypted Client Hello: hides the server name in TLS | 8 |
| EDR / NDR / XDR | endpoint / network / combined detection and response | 12 |
| ESP | IPsec's encrypting protocol | 9 |
| Forward secrecy | past sessions stay safe if long-term keys leak | 3 |
| Honeypot / canary token | decoys that alert when touched | 12 |
| HSTS | forces a browser to use HTTPS for a site | 8 |
| IDOR | accessing others' objects by changing an ID | 14 |
| IDS / IPS | intrusion detection / prevention system | 12 |
| IKEv2 | key exchange protocol for IPsec | 9 |
| Kerberos | ticket-based login for local networks | 4 |
| Kill chain | stages of an intrusion | 2 |
| Least privilege | only the access that is needed | 1 |
| MACsec | encryption of Ethernet links | 5 |
| MFA | login needing two different kinds of factor | 4 |
| MITRE ATT&CK | catalogue of attacker tactics and techniques | 2 |
| ML-KEM / ML-DSA | NIST post-quantum key exchange / signature | 3, 18 |
| mTLS | TLS where both sides present certificates | 8, 15 |
| Nmap | network scanner for ports, services and OS | 17 |
| Passkey | phishing-resistant FIDO2 login with a device key | 4 |
| PDP / PEP | zero trust policy decision / enforcement point | 15 |
| Phishing | tricking a person into giving access | 2 |
| Prompt injection | hidden instructions that hijack an AI system | 18 |
| RA Guard | switch blocks rogue IPv6 router advertisements | 5 |
| RADIUS | protocol between network devices and an authentication server | 4 |
| Ransomware | malware that encrypts (and often steals) data for ransom | 2, 16 |
| Risk | likelihood combined with impact | 1 |
| ROA / RPKI | signed statement of which AS may originate a prefix / its PKI | 6 |
| RTBH | dropping all traffic to an attacked address upstream | 13 |
| Salt | random per-user value mixed into password hashes | 4 |
| SBOM | list of the components inside software | 14, 18 |
| Segmentation | dividing a network into controlled zones | 11 |
| SIEM | central log collection, search and correlation | 12 |
| SQL injection | user data changing the meaning of a database query | 14 |
| SSH certificate | CA-signed SSH key with names and expiry | 10 |
| SSRF | making a server fetch an attacker-chosen URL | 14 |
| Stateful firewall | firewall that tracks connections | 11 |
| STRIDE | spoofing, tampering, repudiation, disclosure, DoS, elevation | 1 |
| SYN cookie | stateless defence against SYN floods | 6 |
| TOFU | trust on first use (SSH known_hosts) | 10 |
| TOTP | time-based one-time code | 4 |
| uRPF | router check that a source address is plausible | 6 |
| VLAN hopping | sending into another VLAN via trunk tricks | 5 |
| WAF | web application firewall | 14 |
| WireGuard | small modern VPN with fixed algorithms | 9 |
| XSS | attacker's script running in another site's pages | 14 |
| Zero-day | flaw with no patch available yet | 2 |
| Zero trust | no trust from network location; verify every request | 15 |
