# What's new

*Recent changes in networking, wireless and security, newest first, two lines each with a link. Last checked: 5 November 2026.*

## Networks

| When | What changed | More |
|---|---|---|
| 2025 | **L4S** (low latency, low loss, scalable throughput) ships in home routers, cable networks and phones: queues signal congestion early with ECN marks so video calls and games keep delay near zero under load. | [networks ch. 17](books/networks/17-Congestion-Control.md) |
| 2024–2025 | **IPv6** passes about half of Google's users on some days; India, France and Germany are well above that. | [networks ch. 10](books/networks/10-IPv6.md) |
| June 2025 | **Ultra Ethernet** 1.0 specification re-designs Ethernet transport for AI training clusters of up to a million accelerators. | [networks ch. 21](books/networks/21-Data-Centres-and-SDN.md) |
| 2022–2025 | **HTTP/3 and QUIC** carry about a third of web traffic at large CDNs. | [networks ch. 19](books/networks/19-HTTP-and-QUIC.md) |

## Wireless

| When | What changed | More |
|---|---|---|
| 2024 | **Wi-Fi 7** certification starts: 320 MHz channels, 4096-QAM, multi-link operation. **Wi-Fi 8** (802.11bn) work targets reliability for about 2028. | [wireless ch. 8](books/wireless/08-Wi-Fi-Generations.md) |
| 2023–2025 | **Phones talk to satellites**: emergency messaging, then texting and data straight from ordinary phones (3GPP non-terrestrial networks). | [wireless ch. 14](books/wireless/14-Satellites-and-Deep-Space.md) |
| 2023–2025 | **Laser link from deep space**: NASA's DSOC on the Psyche spacecraft sends data by laser from tens to hundreds of millions of kilometres. | [wireless ch. 14](books/wireless/14-Satellites-and-Deep-Space.md) |
| 2025 | **6G** studies begin in 3GPP Release 20, aiming at first standards around 2028–2029 and service around 2030. | [wireless ch. 15](books/wireless/15-Where-Wireless-Goes.md) |

## Security

| When | What changed | More |
|---|---|---|
| 2025 | **Certificates get shorter**: maximum lifetime will fall in steps to 47 days by 2029. | [HTTPS guide](topics/HTTPS.md#now-and-next) |
| 2024–2025 | **Post-quantum key exchange by default**: hybrid X25519 + ML-KEM in browsers, CDNs and OpenSSH 10. NIST standards FIPS 203–205 (August 2024). | [security ch. 3](books/security/03-The-Cryptography-Toolkit.md), [ch. 18](books/security/18-Where-Security-Goes.md) |
| 2025 | **Encrypted Client Hello** standardised: the site name in TLS is hidden too. | [security ch. 8](books/security/08-TLS-and-HTTPS.md) |
| 2024 | **xz backdoor** caught days before reaching stable Linux releases; a wake-up call for open-source supply chains. | [security ch. 10](books/security/10-SSH.md) |
| 2024 | **Blast-RADIUS**: forging RADIUS "accept" messages; fixes require Message-Authenticator and RADIUS over TLS. | [security ch. 4](books/security/04-Authentication-and-Identity.md) |
| 2023–2025 | **DDoS records** keep falling: HTTP/2 Rapid Reset (2023), then volumetric attacks above 20 Tbit/s (2025). | [security ch. 13](books/security/13-Denial-of-Service.md) |

## Where to follow

- [IETF Datatracker](https://datatracker.ietf.org/) (new RFCs and drafts), [APNIC Blog](https://blog.apnic.net/) and [RIPE Labs](https://labs.ripe.net/) (measurements)
- [CISA Known Exploited Vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities-catalog), [Canadian Centre for Cyber Security](https://www.cyber.gc.ca/)
- Conferences: ACM SIGCOMM, USENIX NSDI (networks); ACM MobiCom (wireless); USENIX Security, IEEE S&P, ACM CCS, NDSS (security)
