# 18. DNS

*The Domain Name System turns names into addresses for billions of lookups a second, with no central server. This chapter covers the name tree, how a resolver walks it, record types, caching and TTLs, the wire format, and running DNS for your own domain.*

!!! abstract "In this chapter"
    **You will learn:** the hierarchy of zones; root, TLD and authoritative servers; recursive resolvers and iterative
    queries; the main record types; caching and TTLs; the message format; glue; reverse DNS; anycast and how DNS fails.

    **You need:** [Chapter 14](14-UDP-Ports-and-Sockets.md). Security of DNS is [Security, chapter 7](../security/07-DNS-Security.md).

## 18.1 Why a distributed system

Before DNS (1983), every internet host downloaded one file, `HOSTS.TXT`, from a single computer at SRI. A central
database would not scale to billions of names: it would be a single point of failure, overloaded, far from most users,
and impossible to keep up to date. Paul Mockapetris's design splits the namespace into a tree and delegates each branch
to whoever owns it.

## 18.2 The name tree

Names are read right to left from the root (written as a final dot, usually omitted):

```
www.akadian.ca.
              └ root
           └ ca              top-level domain (TLD)
   └ akadian                 second-level domain, owned by a person
└ www                        a host or service
```

A **zone** is a part of the tree managed by one party. The root zone delegates `.ca` to the Canadian Internet
Registration Authority; the `.ca` zone delegates `akadian.ca` to the name servers the owner chose (here Cloudflare's).
There are about 1,500 TLDs: country codes (`.ca`, `.uk`), generic ones (`.com`, `.org`) and newer brand and word TLDs.

## 18.3 Servers and resolvers

- **Root servers**: 13 named identities (`a.root-servers.net` to `m`), run by 12 organisations, served by anycast
  (Chapter 13) from over 1,900 sites. They only know who serves each TLD.
- **TLD servers**: know the name servers for each domain under them.
- **Authoritative servers**: hold the real records for a zone.
- **Recursive resolvers**: do the work for clients: an ISP's resolver, your router, or public ones (1.1.1.1, 8.8.8.8,
  9.9.9.9). Your laptop has only a **stub resolver** that asks one recursive resolver.

## 18.4 A lookup, step by step

Your browser asks for `www.akadian.ca`. Assume every cache is empty:

1. Stub → recursive resolver: "A record for www.akadian.ca?" (a **recursive** query: "give me the final answer").
2. Resolver → a root server: the root replies with a **referral**: "I don't know; ask the `.ca` servers, here are their
   names and addresses".
3. Resolver → a `.ca` server: referral to `akadian.ca`'s name servers.
4. Resolver → `akadian.ca`'s authoritative server: the answer, with a TTL.
5. Resolver → stub: the answer. Each step is a UDP exchange on port 53 (TCP for large answers).

Steps 2–4 are **iterative** queries. In practice the resolver already has the root and `.ca` referrals cached, so only
step 4 happens, or nothing at all if the answer is cached. Try it with `dig +trace` ([Lab 4](../../labs/04-DNS-with-dig.md)).

## 18.5 Record types

| Type | Holds | Example |
| --- | --- | --- |
| **A** | IPv4 address | `www  A  185.199.108.153` |
| **AAAA** | IPv6 address | `www  AAAA  2606:50c0:8000::153` |
| **CNAME** | an alias: "this name is really that name" | `networks  CNAME  ttmathcs.github.io.` |
| **NS** | the authoritative servers for a zone | `akadian.ca  NS  …ns.cloudflare.com.` |
| **MX** | mail servers, with a preference number | `akadian.ca  MX 10 mail.example.net.` |
| **TXT** | free text: SPF, DKIM, domain verification | `"v=spf1 include:… -all"` |
| **SOA** | zone settings: serial, refresh timers, negative TTL | |
| **PTR** | reverse: address to name | `153.108.199.185.in-addr.arpa PTR …` |
| **SRV**, **HTTPS/SVCB** | service locations; HTTPS records also advertise HTTP/3 and keys | |
| **CAA** | which certificate authorities may issue for the domain | |
| **DNSKEY**, **DS**, **RRSIG** | DNSSEC signatures (Security book) | |

A CNAME cannot sit at a zone's apex (`akadian.ca` itself) alongside the NS and SOA records; providers offer "CNAME
flattening" or ALIAS records to work round this.

## 18.6 Caching and TTL

Every record carries a **time to live** in seconds. Resolvers cache answers for that long, which is why DNS is fast and
why changes take time to spread. Typical TTLs: 300 s for records that may move, a day for stable ones, two days for TLD
delegations. Lower a TTL a day *before* a planned move. Resolvers also cache **negative** answers ("no such name",
NXDOMAIN) for the time set in the SOA.

## 18.7 The message

Queries and replies share one format: a 12-byte header (a 16-bit **ID**, flags such as *recursion desired*,
*authoritative answer*, a response code), then four sections: question, answer, authority (referrals), additional
(helpful extras, such as the addresses of the name servers in a referral: **glue**, needed when a domain's name server
is inside the domain itself, like `ns1.example.com` for `example.com`). Classic DNS over UDP was limited to 512 bytes;
**EDNS(0)** (RFC 6891) allows larger messages, needed for DNSSEC and IPv6.

The resolver matches replies by ID, port and question. With only a 16-bit ID, attackers could once guess it and poison
caches (the Kaminsky attack, 2008); randomising the source port too made that far harder (Security book).

## 18.8 Running DNS for a domain

You **register** a name with a registrar, which tells the TLD which name servers serve it. Those servers (your own, or a
provider such as Cloudflare or Route 53) hold the zone. Good practice: at least two name servers in different networks;
monitoring; low TTLs before changes; CAA records; DNSSEC where you can manage it.

## 18.9 When DNS fails

If DNS is down, nothing works by name, even when every server is fine. Large outages (the 2016 attack on Dyn, which
made many big sites unreachable in North America; Facebook's 2021 outage, Chapter 13) show it. Common local faults:
wrong resolver from DHCP, a stale cache (flush it), a firewall blocking port 53, or a captive portal intercepting
lookups. Encrypted DNS (DoH, DoT) and privacy issues are covered in [Security, chapter 7](../security/07-DNS-Security.md).

## Check yourself

??? question "1. In a cold-cache lookup of mail.example.org, which servers does the recursive resolver contact, in order?"
    A root server (referral to .org), a .org TLD server (referral to example.org's name servers), then example.org's authoritative server (the answer).

??? question "2. You will move a website to a new address tomorrow. Its A record has a TTL of 86,400. What should you do today?"
    Lower the TTL (e.g. to 300) now, so that after a day all caches hold the short TTL and the change spreads within minutes.

??? question "3. Why does a referral sometimes include glue records?"
    When the name server's own name is inside the zone being delegated, the resolver could not find its address without first asking it; glue gives the address directly.

??? info "Sources"
    - RFC 1034 and RFC 1035 (DNS, P. Mockapetris, 1987), RFC 2181 (clarifications), RFC 6891 (EDNS), RFC 8499 (terminology), RFC 9460 (SVCB/HTTPS records), RFC 8659 (CAA).
    - root-servers.org (root server sites), IANA Root Zone Database (TLD count), checked November 2026.
    - Dyn, "Dyn Analysis Summary of Friday October 21 Attack", 2016.
