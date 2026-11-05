# Network security

*How networks are attacked and defended, from the ideas (confidentiality, integrity, availability) and the math of cryptography to the attacks on each layer and the defences used in real networks. The structure follows the standard security courses and texts (Stallings' *Network Security Essentials*, Kaufman, Perlman and Speciner's *Network Security*, Anderson's *Security Engineering*) and the areas of the common certifications (Security+, CISSP), but every claim is checked against the RFCs, NIST guidance and the original papers.*

**You need:** [How networks work](../networks/index.md), at least Parts I–III. The math is in [Math foundations](../math/index.md),
chapter 10. Cryptography itself is taught in depth on [cryptography.akadian.ca](https://cryptography.akadian.ca/); here we use it.

!!! warning "Only test what you own"
    Everything in this book is for understanding and defending networks. Trying attacks on networks, devices or
    accounts that are not yours, without written permission, is illegal in most countries. Practise in your own lab
    ([Lab 1](../../labs/01-Your-Lab.md)).

| Part | Chapters |
| --- | --- |
| **I. Ideas** | [1. What security means](01-What-Security-Means.md) · [2. Attackers and attacks](02-Attackers-and-Attacks.md) · [3. The cryptography toolkit](03-The-Cryptography-Toolkit.md) · [4. Authentication and identity](04-Authentication-and-Identity.md) |
| **II. Attacks layer by layer** | [5. Attacks on the local network](05-Attacks-on-the-Local-Network.md) · [6. Attacks on IP and routing](06-Attacks-on-IP-and-Routing.md) · [7. DNS security](07-DNS-Security.md) |
| **III. Secure channels** | [8. TLS and HTTPS](08-TLS-and-HTTPS.md) · [9. IPsec and VPNs](09-IPsec-and-VPNs.md) · [10. SSH](10-SSH.md) |
| **IV. Defending a network** | [11. Firewalls and segmentation](11-Firewalls-and-Segmentation.md) · [12. Detection and monitoring](12-Detection-and-Monitoring.md) · [13. Denial of service](13-Denial-of-Service.md) · [14. Web application security](14-Web-Application-Security.md) · [15. Zero trust](15-Zero-Trust.md) |
| **V. Practice and future** | [16. Incident response](16-Incident-Response.md) · [17. Testing your own network](17-Testing-Your-Own-Network.md) · [18. Where security goes](18-Where-Security-Goes.md) |

Wi-Fi security (WPA2, WPA3, 802.1X) is in [Wireless and mobile, chapter 10](../wireless/10-Wi-Fi-Security.md).
Terms are collected in the [Glossary](Glossary.md). Hands-on work: [Labs](../../labs/index.md) 10–15.
