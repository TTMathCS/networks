# 7. DNS security

*DNS turns names into addresses, so whoever controls the answer controls where you go. This chapter covers cache poisoning and the Kaminsky attack, DNSSEC's chain of signatures, encrypted DNS (DoT, DoH, DoQ), DNS used by attackers for tunnelling and amplification, and protecting your own domains.*

!!! abstract "In this chapter"
    **You will learn:** spoofing and cache poisoning; the 2008 Kaminsky attack and source-port randomisation; DNSSEC
    (RRSIG, DNSKEY, DS, the chain of trust); encrypted DNS and its trade-offs; DNS tunnelling; domain hijacking and
    registrar locks; protective DNS.

    **You need:** networks book [chapter 18](../networks/18-DNS.md); [Chapter 3](03-The-Cryptography-Toolkit.md) (signatures).

## 7.1 Why DNS is attractive

Most DNS still runs over UDP with no authentication. A resolver sends a query and accepts the first answer that
matches its question, the 16-bit **transaction ID** and the source port. Whoever answers first, right, wins. If an
attacker's false answer is **cached**, every user of that resolver goes to the attacker's address until the record
expires.

Attacks fall into three groups: lie in the answer (spoofing and poisoning), watch the questions (privacy), and use DNS
as a weapon or a channel (amplification, tunnelling).

## 7.2 Cache poisoning and Kaminsky

An off-path attacker who cannot see the query must guess the transaction ID. With a fixed source port, that is one in
65,536 per forged packet, and the attacker can send many forged answers during each query's short window.

In 2008 Dan Kaminsky showed how to make every attempt count. The attacker makes the resolver ask for random names that
are not cached (`a1.bank.example`, `a2.bank.example`, ...) and races each query with forged answers that include a
**referral**: "the server for bank.example is ns.attacker, at this address". One win poisons the whole domain, and the
attacker can retry instantly with a new random name instead of waiting for the cache to expire. Unpatched resolvers fell
in seconds.

The coordinated fix was **source-port randomisation**: with a random port as well as a random ID, the attacker must
guess about $2^{16} \times 2^{16} = 2^{32}$ combinations (less in practice, since not all ports are usable). Further
defences followed: random upper/lower case in query names ("0x20" encoding), stricter rules on what extra records a
resolver accepts ("bailiwick" checks), and, in 2020, the **SAD DNS** attack showed that side channels in ICMP rate
limits could reveal the port, so operating systems changed those too. The complete answer is cryptographic: DNSSEC.

<figure class="play" data-play="kaminsky"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> Guessing a DNS answer off-path, Kaminsky-style: each race wins if one forged answer matches the 16-bit ID, and after 2008 also the random source port. The attack pace is a made-up example: one race every 0.1 s.</figcaption></figure>

## 7.3 DNSSEC

**DNSSEC** (RFCs 4033–4035) signs DNS data, so a resolver can check that an answer really came from the zone's owner
and was not changed. It adds record types:

| Record | Holds |
| --- | --- |
| **DNSKEY** | the zone's public keys (a key-signing key and a zone-signing key) |
| **RRSIG** | a signature over a set of records |
| **DS** | a hash of a child zone's key, stored in the **parent** zone |
| **NSEC / NSEC3** | signed proof that a name does **not** exist |

Trust is a **chain**: the root zone's key is built into validating resolvers (the root was signed in 2010, and its
key was rolled over in 2018). The root signs the DS record for `.ca`; `.ca`'s key signs the DS for `akadian.ca`;
`akadian.ca`'s key signs its own records. A validating resolver walks the chain down; any broken link gives the answer
**SERVFAIL** instead of a lie.

<figure class="mars-fig">
<svg viewBox="0 0 640 140" role="img" aria-label="DNSSEC chain of trust from root to zone">
<rect x="10" y="40" width="150" height="56" rx="8" class="na-f"/><text x="85" y="64" text-anchor="middle">Root (.)</text><text x="85" y="82" text-anchor="middle" font-size="12">key built in</text>
<rect x="245" y="40" width="150" height="56" rx="8" class="nb-f"/><text x="320" y="64" text-anchor="middle">.ca</text><text x="320" y="82" text-anchor="middle" font-size="12">DS signed by root</text>
<rect x="480" y="40" width="150" height="56" rx="8" class="nc-f"/><text x="555" y="64" text-anchor="middle">example.ca</text><text x="555" y="82" text-anchor="middle" font-size="12">DS signed by .ca</text>
<line x1="160" y1="68" x2="245" y2="68" stroke="currentColor" stroke-width="2"/><line x1="395" y1="68" x2="480" y2="68" stroke="currentColor" stroke-width="2"/>
<text x="320" y="125" text-anchor="middle" font-size="12">Each parent vouches for its child's key; each zone signs its own records.</text>
</svg>
<figcaption>The DNSSEC chain of trust.</figcaption>
</figure>

DNSSEC gives integrity and authenticity, **not** confidentiality: answers are still readable. Its costs are larger
responses (useful to amplification attackers), key management, and outages when signatures expire or keys are rolled
wrongly. Adoption is uneven: most top-level domains are signed and large public resolvers validate, but only a
minority of individual domains are signed. Signing your domain at a registrar that supports it is now usually one
setting.

## 7.4 Encrypted DNS

Classic DNS lets anyone on the path (the café Wi-Fi, an ISP) see and alter every name you look up. Three protocols
encrypt the hop from your device to the resolver:

- **DNS over TLS** (DoT, RFC 7858), on port 853.
- **DNS over HTTPS** (DoH, RFC 8484), inside normal HTTPS on port 443, so it looks like web traffic.
- **DNS over QUIC** (DoQ, RFC 9250).

These protect the question in transit, but the resolver itself still sees everything, so you are choosing whom to
trust. They also complicate network defence: an organisation that filters malicious domains at its own resolver
loses that view if applications send DoH elsewhere, so managed networks configure devices to use the organisation's
own encrypted resolver. Encryption between resolvers and authoritative servers is still experimental. The name you
visit can also leak in TLS's **SNI** field; **Encrypted Client Hello** (Chapter 8) closes that gap.

## 7.5 DNS as a weapon and a channel

- **Amplification.** A 60-byte query with a spoofed source can trigger a reply of several kilobytes (large TXT or
  DNSSEC records) towards the victim. Open resolvers that answer anyone make this worse; close them and use response
  rate limiting (Chapter 13).
- **Tunnelling.** Because DNS is almost always allowed out, malware hides data in names
  (`base32data.tunnel.attacker.example`) and receives commands in TXT answers. Signs: long random-looking names,
  many unique subdomains of one domain, lots of TXT queries. Defence: force all DNS through your resolver and watch it.
- **Fast flux and domain generation algorithms** let malware find its servers through names that change constantly.

**Protective DNS** resolvers block known-malicious domains and are a cheap, effective layer, recommended by
national cyber agencies.

## 7.6 Protecting your own domain

Attackers also go after the domain itself: stealing the registrar account and changing the name servers (in 2018–2019
the "Sea Turtle" and "DNSpionage" campaigns did this to government domains, then got real certificates for the
hijacked names). Defences: MFA on the registrar and DNS host accounts, **registry lock** for important domains,
DNSSEC, monitoring of your records and of Certificate Transparency logs for certificates you did not request, and
**CAA** records naming the only CAs allowed to issue for your domain. Remove **dangling** records that point to cloud
resources you no longer own, or someone else can claim the resource and serve content under your name (subdomain
takeover).

## Check yourself

??? question "1. What made the Kaminsky attack faster than earlier poisoning?"
    Querying random non-existent subdomains gave unlimited fresh chances without waiting for cache expiry, and a forged referral poisoned the whole domain.

??? question "2. Does DNSSEC hide which names you look up?"
    No. It proves answers are authentic; encryption (DoT, DoH, DoQ) is what hides questions in transit.

??? question "3. A validating resolver gets an answer whose signature does not verify. What does the user's program see?"
    A failure (SERVFAIL), not the forged address.

??? question "4. Name two signs of DNS tunnelling in resolver logs."
    Long, high-entropy subdomain labels; many unique names under one domain; unusual volumes of TXT or NULL queries from one host.

??? info "Sources"
    - RFC 4033, 4034, 4035 (DNSSEC), RFC 5155 (NSEC3), RFC 5452 (resilience against forged answers), RFC 7858 (DoT), RFC 8484 (DoH), RFC 9250 (DoQ), RFC 8659 (CAA).
    - D. Kaminsky, "Black Ops 2008: It's the End of the Cache As We Know It", Black Hat 2008; K. Man et al., "DNS Cache Poisoning Attack Reloaded" (SAD DNS), ACM CCS 2020.
    - ICANN, Root KSK rollover (2018); Cisco Talos, "DNS Hijacking Abuses Trust In Core Internet Service" (Sea Turtle), 2019.
    - NSA and CISA, *Selecting a Protective DNS Service* (2021).
