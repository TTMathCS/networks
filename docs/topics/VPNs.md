# VPNs

*When a VPN helps, when it does not, and how to build your own. Four parts: stop at the one you need.*

[In one minute](#in-one-minute) · [Do it](#do-it) · [Expert](#expert) · [Now and next](#now-and-next)

## In one minute

A **VPN** (virtual private network) builds a locked tunnel from your device to another place, and sends your traffic
through it. Anyone on the way, such as the café's Wi-Fi or your internet provider, sees only scrambled data going to
the VPN server. Companies use VPNs so staff at home can reach office systems as if they were in the building, and to
join two offices. A consumer VPN app sends your traffic to the provider's server, so websites see the provider's
address instead of yours.

What a VPN does **not** do: make you anonymous to sites you log in to, stop viruses or phishing, or hide anything from
the VPN company itself. It moves trust from your internet provider to the VPN provider.

## Do it

**Choosing a consumer VPN** (if you need one: public Wi-Fi you do not trust, or reaching home services while
travelling): prefer providers with independent audits and a clear no-logging policy, modern protocols (WireGuard or
IKEv2), and a kill switch. Free VPNs often pay for themselves with your data.

**Reaching your home network from anywhere:** many routers include a WireGuard or OpenVPN server; or use a mesh VPN
service built on WireGuard (such as Tailscale) that needs no port forwarding.

**Your own WireGuard tunnel** between a laptop and a server you control:

```ini
# server /etc/wireguard/wg0.conf
[Interface]
Address = 10.99.0.1/24
ListenPort = 51820
PrivateKey = <server private key>

[Peer]
PublicKey = <laptop public key>
AllowedIPs = 10.99.0.2/32
```

```ini
# laptop wg0.conf
[Interface]
Address = 10.99.0.2/24
PrivateKey = <laptop private key>

[Peer]
PublicKey = <server public key>
Endpoint = server.example.com:51820
AllowedIPs = 10.99.0.0/24        # 0.0.0.0/0, ::/0 to send everything through the tunnel
```

Make keys with `wg genkey | tee priv | wg pubkey > pub`, start with `sudo wg-quick up wg0`, and check with `sudo wg show`.
A full walk-through with captures is in [Lab 11](../labs/11-A-WireGuard-VPN.md).

## Expert

**Protocols** ([security book, chapter 9](../books/security/09-IPsec-and-VPNs.md)):

| Protocol | Strengths | Watch out for |
|---|---|---|
| **WireGuard** | tiny, fast, modern fixed crypto, silent to scanners | no built-in user management; static addresses; algorithm changes need a new version |
| **IPsec / IKEv2** | standard everywhere (routers, phones, clouds); certificates, EAP | complex; many options; NAT traversal; vendor bugs |
| **OpenVPN / TLS VPNs** | passes most firewalls on 443; flexible | user-space speed; configuration sprawl |

**Design choices.** Full tunnel versus split tunnel (visibility and control versus bandwidth and latency); MTU and MSS
clamping (WireGuard's 1420, IPsec overhead around 50–73 bytes); DNS through the tunnel (or names leak); IPv6 handled
or blocked (or traffic leaks around an IPv4-only tunnel); kill switch when the tunnel drops; certificate- or
key-based authentication plus MFA for users.

**Common mistakes:** VPN appliance not patched (the most exploited class of edge device in 2019–2025); pre-shared keys
reused across sites; split tunnel with no endpoint protection; "the VPN user is trusted" (one stolen login reaches the
whole network); forgetting that a consumer VPN sees everything the ISP used to.

## Now and next

*Last checked: 5 November 2026.*

- **Zero trust access** is replacing "join the whole network" VPNs: per-application access through an identity-aware
  proxy, with device checks ([security book, chapter 15](../books/security/15-Zero-Trust.md)).
- **Post-quantum VPNs:** IKEv2 can add ML-KEM through extra key exchanges (RFC 9370); WireGuard users add a pre-shared
  key, and post-quantum handshakes for WireGuard-style protocols are being designed and tested.
- **MASQUE** (IETF): tunnelling IP and UDP inside HTTP/3, so VPN traffic looks like ordinary QUIC; used by Apple's
  iCloud Private Relay and Cloudflare's WARP.
- Edge VPN appliances keep appearing in CISA's Known Exploited Vulnerabilities list; patch them first.

??? info "Sources"
    - J. A. Donenfeld, "WireGuard: Next Generation Kernel Network Tunnel", NDSS 2017; `wg-quick(8)`.
    - RFC 7296 (IKEv2), RFC 9370 (multiple key exchanges), RFC 9484 (Proxying IP in HTTP, MASQUE).
    - NSA and CISA, *Selecting and Hardening Remote Access VPN Solutions* (2021); CISA Known Exploited Vulnerabilities catalog.
