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
