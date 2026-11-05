# Lab 4. DNS with dig

*`dig` is the DNS engineer's microscope. In this lab you look up records of every common type, follow a lookup from the root servers down yourself, read TTLs and caching, and check DNSSEC signatures.*

!!! abstract "In this lab"
    **You will:** query A, AAAA, MX, TXT, NS and CNAME records; read dig's output; trace a lookup from the root;
    see caching through TTLs; check DNSSEC with `+dnssec`; compare resolvers; try DNS over TLS.

    **You need:** [Lab 1](01-Your-Lab.md) or any computer with dig (macOS has it; on Windows use WSL or `nslookup`);
    [networks book, chapter 18](../books/networks/18-DNS.md). Time: 25 minutes.

## 1. A first lookup

```bash
dig www.akadian.ca
```

The answer has sections. **HEADER**: `status: NOERROR` (or `NXDOMAIN` if the name does not exist) and flags: `qr`
(a response), `rd` (recursion desired), `ra` (recursion available), and `ad` if the resolver validated DNSSEC.
**QUESTION**: what you asked. **ANSWER**: the records, each as `name TTL class type data`. At the bottom: which server
answered and how long it took.

Short answers only: `dig +short www.akadian.ca`.

## 2. Record types

```bash
dig +short AAAA www.google.com     # IPv6 addresses
dig +short MX gmail.com            # mail servers with priorities
dig +short TXT google.com          # text records: SPF and verification tokens
dig +short NS akadian.ca           # the domain's name servers
dig +short CNAME networks.akadian.ca   # an alias (this site's points to GitHub Pages)
dig -x 1.1.1.1 +short              # reverse lookup: address to name
```

## 3. Trace from the root

Normally your resolver does the work. `+trace` makes dig do it step by step, starting at the root:

```bash
dig +trace www.akadian.ca
```

You will see four groups: the 13 root server names (`a.root-servers.net` ...), then the `.ca` servers given by a root
server (a **referral**), then akadian.ca's own name servers given by a `.ca` server, then the final answer from those.
That is the whole delegation tree ([networks book, chapter 18](../books/networks/18-DNS.md)). Ask a server directly with
`@`:

```bash
dig @a.root-servers.net ca NS +norecurse
```

## 4. Caching and TTL

Ask your resolver twice:

```bash
dig example.com | grep -A1 "ANSWER SECTION"
sleep 5; dig example.com | grep -A1 "ANSWER SECTION"
```

The TTL in the second answer is lower: the resolver is counting down the cached copy. When it reaches zero, the
resolver asks the authoritative server again. Query time also drops for a cached answer (often 0–2 ms).

## 5. Compare resolvers

```bash
for r in 1.1.1.1 8.8.8.8 9.9.9.9; do echo "$r:"; dig @$r +stats www.akadian.ca | grep "Query time"; done
```

Quad9 (9.9.9.9) also blocks known malicious domains (protective DNS,
[security book, chapter 7](../books/security/07-DNS-Security.md)).

## 6. DNSSEC

```bash
dig +dnssec cloudflare.com A @1.1.1.1
dig +short DS cloudflare.com
dig +short DNSKEY cloudflare.com | head -2
```

With `+dnssec` you get an **RRSIG** record (the signature) next to the A record, and the `ad` flag shows the resolver
validated it. The DS record in the parent (`.com`) holds a hash of the child's key: the link in the chain of trust.

To see a validation failure, query a deliberately broken test domain:

```bash
dig dnssec-failed.org @1.1.1.1      # status: SERVFAIL
dig dnssec-failed.org @1.1.1.1 +cd  # +cd = checking disabled: you get the (unverified) answer
```

A validating resolver refuses the answer rather than hand you possibly forged data.

## 7. Encrypted DNS

Recent versions of dig (BIND 9.18 and later) speak DNS over TLS and HTTPS:

```bash
dig +tls @1.1.1.1 www.akadian.ca
dig +https @1.1.1.1 www.akadian.ca
```

The answers are the same; what changed is that nobody on the path could read or alter the question.

## Check yourself

??? question "1. What is the difference between NOERROR with an empty answer and NXDOMAIN?"
    NXDOMAIN means the name does not exist at all; NOERROR with no answer means the name exists but has no record of the type you asked for.

??? question "2. In `+trace` output, who tells you where akadian.ca's name servers are?"
    A .ca top-level-domain server, by a referral (NS records), after the root pointed to the .ca servers.

??? question "3. Why did the TTL drop between your two queries?"
    The second answer came from the resolver's cache, which counts down the record's remaining lifetime.

??? question "4. Why does dnssec-failed.org give SERVFAIL, but an answer with +cd?"
    Its signatures are deliberately broken, so a validating resolver refuses it; +cd asks the resolver to skip validation.

??? info "Sources"
    - `dig(1)` manual (ISC BIND 9); RFC 1034/1035 (DNS), RFC 4033–4035 (DNSSEC), RFC 7858 (DoT), RFC 8484 (DoH).
    - Root server information (root-servers.org); Comcast/Verisign DNSSEC test domain dnssec-failed.org.
