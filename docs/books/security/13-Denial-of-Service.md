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
