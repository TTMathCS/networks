# 13. Denial of service

*A denial-of-service attack does not steal anything: it makes a service unusable for everyone else. This chapter covers the kinds of flood, why reflection and amplification multiply an attacker's power, the record-breaking attacks of recent years, and how networks and services defend themselves.*

!!! abstract "In this chapter"
    **You will learn:** volumetric, protocol and application-layer attacks; botnets; reflection and amplification
    factors; HTTP/2 Rapid Reset; how big attacks have become; defences: capacity, filtering, scrubbing, anycast and
    CDNs, rate limiting, RTBH and Flowspec; protecting a small site.

    **You need:** [Chapter 6](06-Attacks-on-IP-and-Routing.md) (spoofing); networks book [chapter 20](../networks/20-Email-Streaming-and-CDNs.md) (CDNs).

## 13.1 Three kinds of attack

| Kind | Exhausts | Measured in | Examples |
| --- | --- | --- | --- |
| **Volumetric** | link bandwidth | bits per second | UDP floods, amplification |
| **Protocol** | state tables in servers, firewalls, load balancers | packets per second | SYN floods, fragment floods |
| **Application layer** | server CPU, database, threads | requests per second | HTTP floods, expensive searches, Rapid Reset |

A **distributed** attack (DDoS) comes from many sources at once, usually a **botnet** of infected computers, routers,
cameras or rented cloud servers. Many sources make the attack bigger and much harder to block by address. "Booter" or
"stresser" services sell attacks for a few dollars, which is why law enforcement regularly seizes them.

## 13.2 Reflection and amplification

The attacker sends requests with the **victim's address as the source** (spoofing, Chapter 6) to many public servers;
the servers send their replies to the victim. If replies are larger than requests, the attack is also **amplified**.
The **bandwidth amplification factor** is

$$\text{BAF} = \frac{\text{bytes of reply (UDP payload)}}{\text{bytes of request (UDP payload)}}.$$

Christian Rossow's 2014 study measured typical factors:

| Protocol | Approx. amplification |
| --- | --- |
| DNS (open resolver, ANY query) | 28–54 |
| NTP (`monlist` command) | about 557 |
| SSDP (UPnP discovery) | about 30 |
| CharGen | about 359 |
| Memcached over UDP (found 2018) | up to about 51,000 |

With a factor of 50, an attacker with 1 Gbit/s of spoofing capacity can aim 50 Gbit/s at a victim. In February 2018
memcached reflection produced a 1.35 Tbit/s attack on GitHub, which stayed online by sending its traffic to a
scrubbing service within minutes. Each new protocol found to amplify is followed by a clean-up campaign: patching,
closing open servers, and providers filtering the port. The long-term fix is preventing spoofing (BCP 38).

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 395" role="img" aria-labelledby="sk-ns-amplify-t"><title id="sk-ns-amplify-t">An attacker sends small requests with the victim's address forged as the sender to public servers, whose much larger replies all land on the victim</title><defs><filter id="sk-ns-amplify-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ns-amplify-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ns-amplify-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ns-amplify-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ns-amplify-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="395" filter="url(#sk-ns-amplify-paper)"/><g filter="url(#sk-ns-amplify-pen)"><text x="30" y="44" class="h">A small question, a huge answer</text><path class="p rust" d="M30 180 L140 180 L140 230 L30 230Z"/><text x="85.0" y="211.0" text-anchor="middle" class="s">attacker</text><path class="p room" d="M510 180 L620 180 L620 230 L510 230Z"/><text x="565.0" y="211.0" text-anchor="middle" class="s">victim</text><path class="p room" d="M260 68 L370 68 L370 112 L260 112Z"/><text x="315.0" y="96.0" text-anchor="middle" class="s">public server</text><path class="p" d="M142 205 L256 90" marker-end="url(#sk-ns-amplify-ah)"/><path class="p red" d="M372 90 L506 205" style="stroke-width:9;opacity:.55"/><path class="p " d="M372 90 L506 205" marker-end="url(#sk-ns-amplify-ah)"/><path class="p room" d="M260 178 L370 178 L370 222 L260 222Z"/><text x="315.0" y="206.0" text-anchor="middle" class="s">public server</text><path class="p" d="M142 205 L256 200" marker-end="url(#sk-ns-amplify-ah)"/><path class="p red" d="M372 200 L506 205" style="stroke-width:9;opacity:.55"/><path class="p " d="M372 200 L506 205" marker-end="url(#sk-ns-amplify-ah)"/><path class="p room" d="M260 288 L370 288 L370 332 L260 332Z"/><text x="315.0" y="316.0" text-anchor="middle" class="s">public server</text><path class="p" d="M142 205 L256 310" marker-end="url(#sk-ns-amplify-ah)"/><path class="p red" d="M372 310 L506 205" style="stroke-width:9;opacity:.55"/><path class="p " d="M372 310 L506 205" marker-end="url(#sk-ns-amplify-ah)"/><text x="40" y="150" class="s">small requests,</text><text x="40" y="168" class="s">“from: victim” (forged)</text><text x="440" y="120" class="s">replies 50 times</text><text x="440" y="138" class="s">bigger, all to the victim</text><text x="30" y="380" class="s">1 Gbit/s sent becomes 50 Gbit/s received. Networks that refuse forged sources stop it.</text></g></svg><figcaption>Sketched for this page. The factor 50 is one example from the table.</figcaption></figure>

## 13.3 Application-layer attacks

These look like real users: valid HTTPS requests over completed connections, from many residential addresses, often
aimed at slow pages (search, login). They need far less bandwidth but are harder to tell from real traffic.
**Slowloris** (2009) held many connections open by sending headers very slowly, exhausting servers that use one thread
per connection.

In October 2023, **HTTP/2 Rapid Reset** (CVE-2023-44487) used a protocol feature: a client opens a stream and
immediately cancels it, many times per connection. Servers did work for each request while the client paid almost
nothing. Google reported a peak of 398 million requests per second, Cloudflare 201 million, from a botnet of only about
20,000 machines. Fixes limited stream resets per connection. In 2025 a related "MadeYouReset" flaw showed the same
class of problem could be triggered differently.

## 13.4 How big attacks have become

Record volumetric attacks have grown from hundreds of gigabits in the mid-2010s to multiple terabits: Mirai's 2016
attacks on the DNS provider Dyn disrupted many large sites; in 2024–2025 Cloudflare reported attacks above 5, then 7
and over 20 Tbit/s, and packet rates in the billions per second, mostly very short (seconds to a minute), from botnets
of compromised routers, cameras and servers. Short bursts are designed to finish before manual defences can react, so
defence must be automatic.

## 13.5 Defences

- **Capacity and anycast.** Big providers and CDNs announce the same address from hundreds of locations (**anycast**);
  each attacking bot's traffic lands at its nearest site, spreading the attack over the whole network's capacity. A
  single data centre cannot match that.
- **Scrubbing.** Traffic is diverted (by BGP or DNS) to a scrubbing centre that filters attack packets and forwards
  clean traffic.
- **Upstream filtering.** A network under attack can ask its provider to drop traffic: **RTBH** (remotely triggered
  black hole, RFC 7999) drops everything to the attacked address (completing the attack, but saving everyone else);
  **BGP Flowspec** (RFC 8955) distributes finer rules ("drop UDP from port 11211 to this prefix").
- **Protocol defences.** SYN cookies (Chapter 6); stateless handling at the edge; connection and state-table limits.
- **Application defences.** Rate limiting per client, caching, challenges for suspicious clients, making expensive
  operations cheap or queued, and a web application firewall.
- **Not being an amplifier.** Close open resolvers, NTP, memcached and SSDP to the internet; use response rate
  limiting on authoritative DNS; filter spoofed sources leaving your network.

## 13.6 For a small site

A small organisation cannot outbuild a terabit attack, and does not need to. Put public websites behind a CDN or DDoS
protection service (many have free tiers); keep origin servers' real addresses private and accept web traffic only
from the provider; have a contact at your ISP and know whether they offer RTBH or scrubbing; keep DNS with a large,
anycast provider; and write down in advance what to do when an attack starts (Chapter 16). Availability is a security
goal too (Chapter 1).

## Check yourself

??? question "1. A protocol replies 3,000 bytes to a 60-byte request. What is the amplification factor, and how much traffic could 200 Mbit/s of spoofed requests produce?"
    3,000 / 60 = 50; up to about 200 Mbit/s × 50 = 10 Gbit/s at the victim.

??? question "2. Why does anycast help against DDoS?"
    Each bot's traffic goes to its nearest site, so the attack is split across many locations' capacity instead of landing on one.

??? question "3. Why was HTTP/2 Rapid Reset so efficient for the attacker?"
    Cancelling a stream immediately cost the client almost nothing while the server still started work for each request, and many could be sent on one connection.

??? question "4. What does RTBH achieve, and at what price?"
    It drops all traffic to the attacked address upstream, protecting the rest of the network, but the attacked address becomes unreachable.

??? info "Sources"
    - C. Rossow, "Amplification Hell: Revisiting Network Protocols for DDoS Abuse", NDSS 2014; US-CERT alert TA14-017A (UDP-based amplification attacks).
    - GitHub Engineering, "February 28th DDoS Incident Report" (2018); M. Antonakakis et al., "Understanding the Mirai Botnet", USENIX Security 2017.
    - CVE-2023-44487; Google Cloud and Cloudflare blog posts on HTTP/2 Rapid Reset (October 2023); Cloudflare quarterly DDoS threat reports (2024–2025).
    - RFC 4987 (SYN flooding), RFC 7999 (BLACKHOLE community), RFC 8955 (Flowspec), RFC 2827 (BCP 38).
