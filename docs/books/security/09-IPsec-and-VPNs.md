# 9. IPsec and VPNs

*A VPN builds a private, encrypted tunnel across a network you do not trust. This chapter covers IPsec (ESP, IKEv2, tunnel and transport modes), WireGuard's small modern design, TLS-based VPNs, and what a VPN does and does not protect, for companies and for people at home.*

!!! abstract "In this chapter"
    **You will learn:** site-to-site and remote-access VPNs; IPsec's ESP and AH; tunnel vs transport mode; IKEv2
    and security associations; NAT traversal; WireGuard and its Noise handshake; SSL/TLS VPNs; split tunnelling;
    what consumer VPNs do; VPN gateways as targets.

    **You need:** [Chapter 3](03-The-Cryptography-Toolkit.md); networks book [chapter 8](../networks/08-IPv4-Addressing-and-Subnets.md) and [chapter 9](../networks/09-NAT-DHCP-and-ARP.md).

## 9.1 Why tunnel

A **virtual private network** wraps packets from one private network inside encrypted packets that cross the public
internet, so the two ends behave as if joined by a private line. Two main uses:

- **Site-to-site**: two offices' routers keep a permanent tunnel; computers on each side need nothing special.
- **Remote access**: a laptop runs a VPN client and joins the company network from anywhere.

A third use is the consumer VPN (9.6).

## 9.2 IPsec: ESP, AH and modes

**IPsec** protects IP packets themselves, below TCP and UDP, so every application benefits without change. It has two
protocols:

- **ESP** (Encapsulating Security Payload, IP protocol 50): encrypts and authenticates the payload, today with AEAD
  such as AES-GCM. This is what nearly everyone uses.
- **AH** (Authentication Header, protocol 51): authenticates the packet, including parts of the IP header, without
  encrypting. It breaks with NAT and is rarely used.

and two **modes**:

| Mode | What is protected | Used for |
| --- | --- | --- |
| **Transport** | the payload; the original IP header stays | host-to-host |
| **Tunnel** | the whole original packet, inside a new IP header | gateways, site-to-site, remote access |

<figure class="mars-fig">
<svg viewBox="0 0 640 130" role="img" aria-label="ESP tunnel mode packet layout">
<rect x="10" y="40" width="100" height="40" class="nd-f"/><text x="60" y="65" text-anchor="middle" font-size="12">New IP hdr</text>
<rect x="110" y="40" width="90" height="40" class="nb-f"/><text x="155" y="65" text-anchor="middle" font-size="12">ESP hdr</text>
<rect x="200" y="40" width="100" height="40" class="na-f"/><text x="250" y="65" text-anchor="middle" font-size="12">Orig IP hdr</text>
<rect x="300" y="40" width="130" height="40" class="na-f"/><text x="365" y="65" text-anchor="middle" font-size="12">TCP/UDP + data</text>
<rect x="430" y="40" width="90" height="40" class="nb-f"/><text x="475" y="65" text-anchor="middle" font-size="12">ESP trailer</text>
<rect x="520" y="40" width="100" height="40" class="nc-f"/><text x="570" y="65" text-anchor="middle" font-size="12">ICV (tag)</text>
<line x1="200" y1="95" x2="520" y2="95" stroke="currentColor" stroke-width="2"/><text x="360" y="112" text-anchor="middle" font-size="12">encrypted</text>
<line x1="110" y1="25" x2="520" y2="25" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4"/><text x="315" y="18" text-anchor="middle" font-size="12">authenticated</text>
</svg>
<figcaption>ESP in tunnel mode: the original packet is hidden entirely; outsiders see only the gateways' addresses.</figcaption>
</figure>

Each direction of protected traffic is a **security association** (SA), named by a 32-bit **SPI** (security parameter
index) in the ESP header and holding keys, algorithms and a sequence number counter. The receiver keeps a sliding
**anti-replay window** and drops packets it has already seen.

## 9.3 IKEv2

Keys for the SAs are negotiated by **IKEv2** (Internet Key Exchange version 2, RFC 7296), over UDP port 500:

1. **IKE_SA_INIT**: agree algorithms, exchange Diffie–Hellman values and nonces; derive keys to protect the rest.
2. **IKE_AUTH**: each side proves identity (certificates, a pre-shared key, or EAP for users) and the first child SA
   for ESP is set up.

Later exchanges create more child SAs and **rekey** regularly (for example hourly), keeping forward secrecy. When a
NAT is on the path, IKEv2 detects it and moves to UDP port 4500, wrapping ESP in UDP (**NAT traversal**, RFC 3948),
since NAT boxes do not know how to rewrite ESP. Post-quantum key exchange has been added through extra exchanges
(RFC 9370) so IKEv2 can include ML-KEM.

IPsec is powerful but complex: many options, many ways to misconfigure, and implementations in big vendor appliances.
Pre-shared keys that are short or shared across many sites are a common weakness; certificates are better.

## 9.4 WireGuard

**WireGuard** (Jason Donenfeld, 2016; in the Linux kernel since 2020) took the opposite approach: no negotiation. One
fixed set of modern algorithms: Curve25519 for key exchange, ChaCha20-Poly1305 for encryption, BLAKE2s for hashing,
in a handshake based on the **Noise** framework. Each peer is identified by its **public key**, configured like an SSH
key; each peer's allowed IP addresses form its routing table ("cryptokey routing").

Its strengths: about 4,000 lines of kernel code (small enough to audit and formally verify), a one-round-trip
handshake repeated every two minutes for fresh keys, and silence: it sends nothing in reply to unauthenticated packets,
so scanners cannot even tell it is there. Its limits: it does not assign addresses or manage users by itself, and its
fixed algorithms would need a new version to change (an optional pre-shared key adds a layer of post-quantum
protection today). Many commercial VPNs and mesh products (such as Tailscale) build on it. You will set one up in
[Lab 11](../../labs/11-A-WireGuard-VPN.md).

## 9.5 TLS VPNs and split tunnelling

**SSL/TLS VPNs** run over TCP or UDP port 443, which passes almost any firewall, often starting from a web portal.
OpenVPN is a popular open-source example; many corporate products work this way.

**Full tunnel** sends all of a laptop's traffic through the company; **split tunnel** sends only company traffic,
letting video calls and web browsing go directly. Split tunnelling saves bandwidth but means the company sees and
protects less. Zero-trust access products (Chapter 15) replace the "join the whole network" model with per-application
access.

## 9.6 What a consumer VPN does

A commercial VPN app sends your traffic encrypted to the provider's server, which then sends it to the internet. It
**does**: hide your traffic from the local network (café Wi-Fi) and your ISP; make sites see the provider's address
instead of yours. It **does not**: make you anonymous to the sites you log in to; protect you from malware or phishing;
hide anything from the VPN provider itself, which now sees what your ISP used to. With HTTPS everywhere, a VPN adds less
than it once did. Choose based on trust in the provider, not marketing.

## 9.7 VPN gateways as targets

VPN appliances sit on the internet edge, are reachable by anyone, and lead straight into the network. Between 2019 and
2025 serious flaws in products from many major vendors (including Pulse Secure/Ivanti, Fortinet, Citrix and Palo Alto
Networks) were exploited widely, often before or just after patches. Lessons: patch edge devices first and fast
(Chapter 2), require MFA for VPN logins, log and watch them, and prefer simple, well-reviewed software where possible.

## Check yourself

??? question "1. Which IPsec mode hides the original source and destination addresses?"
    Tunnel mode: the whole original packet, header included, is encrypted inside a new packet between the gateways.

??? question "2. Why does IPsec move to UDP port 4500 when a NAT is detected?"
    NAT devices rewrite addresses and ports, but ESP has no ports; wrapping ESP in UDP lets NAT handle it.

??? question "3. How is a WireGuard peer identified, and what decides which packets go to it?"
    By its public key; its configured AllowedIPs act as both a routing table for sending and a filter for receiving.

??? question "4. Does a consumer VPN stop a phishing site from stealing your password?"
    No. It only changes the path your traffic takes; the phishing site still receives what you type.

??? info "Sources"
    - RFC 4301 (IPsec architecture), RFC 4303 (ESP), RFC 4302 (AH), RFC 7296 (IKEv2), RFC 3948 (UDP encapsulation), RFC 9370 (multiple key exchanges in IKEv2).
    - J. A. Donenfeld, "WireGuard: Next Generation Kernel Network Tunnel", NDSS 2017; T. Perrin, *The Noise Protocol Framework*.
    - CISA advisories on exploited VPN appliances (2019–2025); NSA and CISA, *Selecting and Hardening Remote Access VPN Solutions* (2021).
