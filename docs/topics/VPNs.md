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

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 380" role="img" aria-labelledby="sk-n-tunnel-t"><title id="sk-n-tunnel-t">A locked tunnel runs from the laptop past the café Wi-Fi and the provider to the VPN server, which then talks to the website</title><defs><filter id="sk-n-tunnel-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-n-tunnel-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-n-tunnel-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-n-tunnel-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-n-tunnel-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="380" filter="url(#sk-n-tunnel-paper)"/><g filter="url(#sk-n-tunnel-pen)"><text x="30" y="44" class="h">Through the tunnel</text><path class="p room" d="M30 150 L126 150 L126 200 L30 200Z"/><text x="78.0" y="181.0" text-anchor="middle" class="s">laptop</text><path class="p room" d="M150 150 L246 150 L246 200 L150 200Z"/><text x="198.0" y="181.0" text-anchor="middle" class="s">café Wi-Fi</text><path class="p room" d="M270 150 L366 150 L366 200 L270 200Z"/><text x="318.0" y="181.0" text-anchor="middle" class="s">provider</text><path class="p gold" d="M390 150 L486 150 L486 200 L390 200Z"/><text x="438.0" y="181.0" text-anchor="middle" class="s">VPN server</text><path class="p room" d="M520 150 L616 150 L616 200 L520 200Z"/><text x="568.0" y="181.0" text-anchor="middle" class="s">website</text><path class="p" d="M60 140 C60 110 90 104 120 104 L440 104 C470 104 486 116 486 140"/><path class="p" d="M60 210 C60 240 90 246 120 246 L440 246 C470 246 486 234 486 210"/><rect x="128" y="108" width="300" height="10" fill="url(#sk-n-tunnel-hatch)"/><rect x="128" y="232" width="300" height="10" fill="url(#sk-n-tunnel-hatch)"/><path class="p " d="M488 175 L518 175" marker-end="url(#sk-n-tunnel-ah)"/><text x="200" y="96" class="s">locked tunnel</text><text x="150" y="280" class="s">café and provider see:</text><text x="150" y="300" class="s">scrambled data to the VPN server</text><text x="440" y="280" class="s">website sees the</text><text x="440" y="300" class="s">VPN server's address</text><text x="30" y="345" class="s">The VPN server unlocks everything, so the VPN company could see it all:</text><text x="30" y="365" class="s">trust moves from your provider to them.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

<figure class="play" data-play="whosees" data-mode="vpn"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> Who can see what, with and without a VPN. Red means they can see it; https still hides page contents in both cases.</figcaption></figure>

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
