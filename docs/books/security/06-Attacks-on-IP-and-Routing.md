# 6. Attacks on IP and routing

*IP delivers packets to whatever address is written on them, and BGP believes what neighbouring networks announce. This chapter covers address spoofing and the attacks built on it, attacks on TCP, ICMP abuse, and the large routing incidents that redirected parts of the internet, with the defences: filtering, RPKI and BGPsec.*

!!! abstract "In this chapter"
    **You will learn:** IP spoofing and ingress filtering (BCP 38); TCP SYN floods and SYN cookies; TCP reset and
    hijacking; ICMP abuse; fragmentation tricks; BGP hijacks and route leaks; RPKI and route origin validation; ASPA
    and BGPsec; securing interior routing.

    **You need:** networks book [chapter 11](../networks/11-Routers-and-Forwarding.md), [chapter 13](../networks/13-OSPF-and-BGP.md), [chapter 16](../networks/16-TCP.md).

## 6.1 IP spoofing

Nothing in IP checks the source address. A host can send packets claiming to be from anywhere. It will not get the
replies (they go to the real owner of the address), so spoofing is useless for normal conversations but perfect for
**floods** and **reflection** attacks, where the attacker wants replies sent to a victim (Chapter 13).

**Defence: ingress filtering** (BCP 38, RFC 2827, from 2000): each network should drop packets leaving it whose source
address is not one of its own, and providers should drop customer packets with foreign source addresses. Routers do
it automatically with **unicast reverse path forwarding** (uRPF): accept a packet only if the route back to its source
points out the same interface (strict mode) or exists at all (loose mode). Measurements by the CAIDA Spoofer project
still find a sizeable share of networks allowing spoofing, which is why reflection attacks keep working.

## 6.2 Attacks on TCP

- **SYN flood.** Each SYN makes a server allocate state for a half-open connection. Sending SYNs from spoofed
  addresses fills the queue and real clients are refused. **SYN cookies** (D. J. Bernstein, 1996) fix it: the server
  keeps no state, but encodes it in its initial sequence number, a keyed hash of the addresses, ports and time; a
  real client's ACK returns that number, and the server rebuilds the state.
- **Reset and injection.** To inject into a TCP connection, an off-path attacker must guess the sequence number within
  the receive window. With random initial sequence numbers (RFC 6528) and RFC 5961's stricter checks, blind attacks
  are impractical, but an on-path attacker can reset or hijack any unencrypted connection. Long-lived BGP sessions
  were once a target for resets, which is why they use TCP-AO authentication (below).
- **Port scanning** (Chapter 17) uses TCP's rules to map which services listen.

## 6.3 ICMP and fragments

ICMP carries errors and diagnostics. Abuse includes **ICMP redirects** (telling a host to use another router;
hosts should ignore them), floods, and the old "ping of death" (an oversized fragmented ping that crashed 1990s
systems). Blocking all ICMP, though, breaks **path MTU discovery** and causes connections that hang on large packets;
filter carefully instead (allow "packet too big" and "time exceeded", rate-limit echo).

**Fragmentation** lets attackers split a packet so that no single fragment shows the full header, or send overlapping
fragments that different systems reassemble differently, to slip past a firewall or IDS. Modern devices reassemble
before inspecting, and IPv6 requires the full header chain in the first fragment (RFC 7112).

## 6.4 BGP: the internet believes announcements

Each network (**autonomous system**, AS) announces in BGP which address prefixes it can reach; neighbours pass this on.
BGP has no built-in way to check that an AS really holds a prefix. Two kinds of incident follow:

- A **hijack**: an AS announces someone else's prefix (by mistake or on purpose). Routers prefer the most specific
  prefix, so announcing a /24 inside someone's /22 pulls traffic away worldwide.
- A **route leak**: an AS passes on routes it should not (for example, from one provider to another), so traffic
  takes a path through a network not built for it.

Famous cases: in 2008, Pakistan Telecom announced a more specific route for YouTube's prefix to block it nationally;
it leaked out and took YouTube offline worldwide for about two hours. In 2018, a hijack of Amazon's DNS addresses let
attackers answer for MyEtherWallet.com and steal cryptocurrency. In 2019 a small ISP's leak, amplified by a large
provider, sent traffic for Cloudflare and others through a steel company's network in Pennsylvania.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 395" role="img" aria-labelledby="sk-ns-hijack-t"><title id="sk-ns-hijack-t">The real owner announces a /22; another network announces one /24 inside it; routers prefer the more specific /24 and send its traffic to the wrong network</title><defs><filter id="sk-ns-hijack-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ns-hijack-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ns-hijack-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ns-hijack-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ns-hijack-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="395" filter="url(#sk-ns-hijack-paper)"/><g filter="url(#sk-ns-hijack-pen)"><text x="30" y="44" class="h">The more specific route wins</text><path class="p room" d="M20 90 L190 90 L190 146 L20 146Z"/><text x="105.0" y="118.0" text-anchor="middle" class="s">real owner</text><text x="105.0" y="136.0" text-anchor="middle" class="s">announces a /22</text><path class="p rust" d="M20 260 L190 260 L190 316 L20 316Z"/><text x="105.0" y="288.0" text-anchor="middle" class="s">another network</text><text x="105.0" y="306.0" text-anchor="middle" class="s">announces one /24 inside it</text><circle cx="330" cy="200" r="46" class="p soft"/><text x="330" y="196" text-anchor="middle" class="s">routers</text><text x="330" y="214" text-anchor="middle" class="s">everywhere</text><path class="p " d="M192 118 L288 180" marker-end="url(#sk-ns-hijack-ah)"/><path class="p " d="M192 288 L288 220" marker-end="url(#sk-ns-hijack-ah)"/><path class="p room" d="M470 110 L620 110 L620 160 L470 160Z"/><text x="545.0" y="141.0" text-anchor="middle" class="s">rest of the /22</text><path class="p rust" d="M470 240 L620 240 L620 290 L470 290Z"/><text x="545.0" y="271.0" text-anchor="middle" class="s">that /24</text><path class="p " d="M376 190 L466 140" marker-end="url(#sk-ns-hijack-ah)"/><path class="p red" d="M376 212 L466 262" marker-end="url(#sk-ns-hijack-ah)"/><text x="400" y="320" class="s">traffic for the /24 now goes</text><text x="400" y="340" class="s">to the wrong network</text><text x="30" y="380" class="s">BGP cannot check who holds a prefix. RPKI lets routers check signed records.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

<figure class="play" data-play="hijack"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> The most specific prefix wins: see a /24 announced inside someone's /22, then the same announcement with RPKI checking. The prefixes are from a range set aside for examples.</figcaption></figure>

## 6.5 RPKI

The **Resource Public Key Infrastructure** (RPKI) gives prefixes cryptographic owners. The five regional internet
registries act as trust anchors and issue certificates to address holders; a holder signs a **Route Origin
Authorisation** (ROA): "prefix 203.0.113.0/24, up to length /24, may be originated by AS 64500". Routers fetch the
validated set and mark each route:

| State | Meaning | Action |
| --- | --- | --- |
| Valid | a ROA covers it and the origin AS matches | accept |
| Invalid | a ROA covers it but the origin or length is wrong | **drop** |
| NotFound | no ROA covers the prefix | accept (for now) |

This **route origin validation** stops many mistakes and simple hijacks. By 2025 over half of announced IPv4 routes
were covered by ROAs, and most large networks drop invalids. It does not stop an attacker who forges the path while
keeping the right origin AS. **ASPA** (AS Provider Authorisation, being standardised at the IETF) lets each AS list its
providers so leaks and fake paths can be spotted; **BGPsec** (RFC 8205) signs every hop of the path but is barely
deployed because every router on the path must support it. Operators also follow **MANRS** (Mutually Agreed Norms for
Routing Security): filter customers' announcements, prevent spoofing, keep contact data and publish routing policy.

## 6.6 Interior routing and the control plane

Inside a network, OSPF and IS-IS should use **authentication** (HMAC-SHA keys per link) so a rogue device cannot
inject routes, and BGP sessions should use **TCP-AO** (RFC 5925) or at least MD5 signatures and **GTSM** (RFC 5082:
only accept packets with TTL 255, which cannot come from more than one hop away). Routers' own management (SSH, SNMP,
web consoles) belongs on a separate management network, and **control plane policing** rate-limits traffic aimed at
the router itself, so a flood cannot starve its routing processes.

## Check yourself

??? question "1. Why is spoofing useless for an attacker who wants to log in to a server, but useful for floods?"
    Replies go to the real owner of the spoofed address, so the attacker cannot finish a TCP handshake or read answers; floods and reflection need no replies.

??? question "2. How does a SYN cookie let a server keep no state for half-open connections?"
    The server's initial sequence number encodes the connection details and a keyed hash; the client's ACK returns it, and the server checks and reconstructs the state then.

??? question "3. A ROA says 198.51.100.0/22, maxLength 22, AS 64500. A route for 198.51.100.0/24 from AS 64500 arrives. Valid, invalid or not found?"
    Invalid: the origin is right but the prefix is longer than maxLength allows. This is exactly the more-specific hijack RPKI is meant to stop.

??? question "4. What does RPKI route origin validation not protect against?"
    An attacker who keeps the correct origin AS but forges or leaks the path; ASPA and BGPsec address that.

??? info "Sources"
    - RFC 2827 / BCP 38 (ingress filtering), RFC 3704 (uRPF), RFC 4987 (SYN flooding and mitigations), RFC 5961, RFC 6528.
    - RFC 6480 (RPKI), RFC 6811 (origin validation), RFC 8205 (BGPsec), RFC 5925 (TCP-AO), RFC 5082 (GTSM); IETF SIDROPS ASPA drafts.
    - RIPE NCC, "YouTube Hijacking: A RIPE NCC RIS case study" (2008); Cloudflare blog on the June 2019 route leak; NIST RPKI Monitor; MANRS (manrs.org).
    - CAIDA Spoofer project (spoofer.caida.org).
