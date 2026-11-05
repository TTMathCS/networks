# DNS: names to addresses

*How a name like www.akadian.ca becomes an address, how to make lookups private and honest, and how to fix DNS problems. Four parts: stop at the one you need.*

[In one minute](#in-one-minute) · [Do it](#do-it) · [Expert](#expert) · [Now and next](#now-and-next)

## In one minute

Computers on the internet find each other by numbers (IP addresses), but people use names. **DNS**, the Domain Name
System, is the internet's phone book: your device asks a **resolver** (usually run by your internet provider, or a
public one like 1.1.1.1), which asks the servers in charge of each part of the name, from the root, to `.ca`, to
`akadian.ca`, and hands back the address. Answers are remembered for a while (cached) so the next lookup is instant.
Because DNS decides where you go, a wrong answer sends you to the wrong place, which is why DNS can be checked with
signatures (DNSSEC) and hidden from eavesdroppers with encryption.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 365" role="img" aria-labelledby="sk-n-dnschain-t"><title id="sk-n-dnschain-t">Your device asks a resolver, which asks the root, then the .ca servers, then akadian.ca's own servers, and hands the address back</title><defs><filter id="sk-n-dnschain-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-n-dnschain-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-n-dnschain-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-n-dnschain-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-n-dnschain-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="365" filter="url(#sk-n-dnschain-paper)"/><g filter="url(#sk-n-dnschain-pen)"><text x="30" y="44" class="h">Who knows akadian.ca?</text><path class="p room" d="M30 160 L130 160 L130 216 L30 216Z"/><text x="80.0" y="194.0" text-anchor="middle" class="s">your device</text><path class="p gold" d="M200 160 L310 160 L310 216 L200 216Z"/><text x="255.0" y="194.0" text-anchor="middle" class="s">resolver</text><path class="p " d="M132 180 L198 180" marker-end="url(#sk-n-dnschain-ah)"/><path class="p " d="M198 200 L132 200" marker-end="url(#sk-n-dnschain-ah)"/><text x="132" y="150" class="s">1 where is</text><text x="132" y="236" class="s">5 here: 203.0.113.9</text><path class="p room" d="M440 76 L570 76 L570 126 L440 126Z"/><text x="505.0" y="107.0" text-anchor="middle" class="s">root</text><path class="p " d="M312 188 L438 94" marker-end="url(#sk-n-dnschain-ah)"/><text x="580" y="106" class="s">2</text><text x="440" y="146" class="s">“ask the .ca servers”</text><path class="p room" d="M440 168 L570 168 L570 218 L440 218Z"/><text x="505.0" y="199.0" text-anchor="middle" class="s">.ca</text><path class="p " d="M312 188 L438 186" marker-end="url(#sk-n-dnschain-ah)"/><text x="580" y="198" class="s">3</text><text x="440" y="238" class="s">“ask akadian.ca's servers”</text><path class="p room" d="M440 260 L570 260 L570 310 L440 310Z"/><text x="505.0" y="291.0" text-anchor="middle" class="s">akadian.ca</text><path class="p " d="M312 188 L438 278" marker-end="url(#sk-n-dnschain-ah)"/><text x="580" y="290" class="s">4</text><text x="440" y="330" class="s">“www is 203.0.113.9”</text><text x="30" y="330" class="s">The resolver keeps each answer for a while (its TTL), so the next visit</text><text x="30" y="350" class="s">skips the whole chain.</text></g></svg><figcaption>Sketched for this page. 203.0.113.9 is an address kept for examples.</figcaption></figure>

<figure class="play" data-play="whosees" data-mode="dns"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> Who can see the names you look up, and who could send a false answer, with plain and encrypted DNS. Red means they can.</figcaption></figure>

## Do it

**Look up a name:**

```bash
nslookup www.akadian.ca              # Windows, macOS, Linux
dig +short www.akadian.ca            # macOS, Linux (more detail without +short)
```

**Choose your resolver:** in your router (for the whole home) or device settings. Common public ones: 1.1.1.1
(Cloudflare), 8.8.8.8 (Google), 9.9.9.9 (Quad9, which also blocks known malicious domains). For encryption, turn on
"Secure DNS" (DNS over HTTPS) in your browser, or "Private DNS" (DNS over TLS) on Android.

**Fix DNS problems:**

| Symptom | Try |
|---|---|
| Sites fail by name but `ping 1.1.1.1` works | change resolver; `nslookup site 1.1.1.1` to compare |
| A site moved but you still reach the old one | flush the cache: Windows `ipconfig /flushdns`; macOS `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`; Linux `resolvectl flush-caches` |
| Works for others, not you | your resolver or a filter blocks it; compare resolvers |

**For your own domain:** turn on DNSSEC at your registrar (often one switch), use MFA on the registrar account, add a
CAA record, and remove records pointing at servers you no longer use. A step-by-step lookup trace is in
[Lab 4](../labs/04-DNS-with-dig.md).

## Expert

**Resolution** ([networks book, chapter 18](../books/networks/18-DNS.md)): stub → recursive resolver → root → TLD →
authoritative, following referrals (NS + glue), caching each answer for its TTL, and negative answers for the SOA's
negative TTL. Records worth knowing: A, AAAA, CNAME (no other data at a name with a CNAME, so not at the zone apex),
MX, TXT (SPF, DKIM, DMARC, verification), NS, SOA, CAA, SRV, **HTTPS/SVCB** (service parameters, ALPN, ECH keys).

**Security** ([security book, chapter 7](../books/security/07-DNS-Security.md)):

- **Poisoning** defences: random source port + ID, 0x20, bailiwick checks; the real fix is **DNSSEC** validation
  (DNSKEY, RRSIG, DS chain from the root; NSEC/NSEC3 for denial).
- **Privacy:** DoT (853), DoH (443), DoQ protect stub-to-resolver; the resolver still sees all; QNAME minimisation
  (RFC 9156) limits what upstream servers learn.
- **Abuse:** amplification (close open resolvers, response rate limiting), tunnelling (watch long random names, TXT
  floods), domain and registrar hijacking (registry lock, MFA), dangling CNAMEs (subdomain takeover).
- **Protective DNS** blocks known-bad domains cheaply for a whole organisation.

**Operations:** at least two authoritative servers in different networks (or an anycast provider); lower TTLs a day
before a planned change; monitor expiry of DNSSEC signatures and of the domain itself; serve both IPv4 and IPv6.

**Common mistakes:** expired domain or DNSSEC signatures (a whole organisation offline); a CNAME at the apex; TTLs of
a week before a migration; forgetting the trailing dot in zone files (`www` becomes `www.example.com.example.com`);
DS record left at the parent after turning DNSSEC off (validation fails everywhere).

## Now and next

*Last checked: 5 November 2026.*

- **HTTPS records** (RFC 9460) are widely published by large sites and used by browsers to connect faster (HTTP/3
  hints) and to fetch ECH keys.
- **Encrypted DNS** is the default in many browsers and operating systems; **DDR** (RFC 9462) lets devices discover
  their network's own encrypted resolver.
- **DNSSEC algorithm changes:** zones are moving from RSA to ECDSA P-256 and Ed25519 for smaller responses; post-quantum
  DNSSEC is an open research problem because post-quantum signatures are much larger than DNS packets like.
- **Recursive-to-authoritative encryption** (RFC 9539, opportunistic) is in early deployment.

??? info "Sources"
    - RFC 1034/1035, RFC 4033–4035 (DNSSEC), RFC 8484 (DoH), RFC 7858 (DoT), RFC 9250 (DoQ), RFC 9156 (QNAME minimisation), RFC 9460 (SVCB/HTTPS), RFC 9462 (DDR), RFC 9539 (unilateral opportunistic encryption).
    - NSA and CISA, *Selecting a Protective DNS Service* (2021); ICANN, DNSSEC deployment statistics.
