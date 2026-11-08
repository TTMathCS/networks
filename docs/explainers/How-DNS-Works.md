# How DNS works: the internet's phone book, and who keeps it

*What DNS is, what happens in the half-second between typing a name and seeing a page, and how a system with no
single owner is run for the whole world. For readers who have never looked under the hood; every term is explained
the first time, and the [glossary](#glossary) collects them.*

[What it is](#what-dns-is) · [Names as a tree](#a-name-is-read-from-right-to-left) · [A lookup, step by step](#a-lookup-step-by-step) · [Caching](#remembering-answers-caching-and-ttl) · [Records](#what-a-domains-page-holds) · [Who runs it](#who-runs-dns-for-the-whole-world) · [Buying a name](#how-a-name-gets-onto-the-internet) · [What goes wrong](#what-can-go-wrong) · [Try it](#try-it-yourself) · [Glossary](#glossary)

## What DNS is

Every computer on the internet has a number, its **IP address**, much like every phone has a phone number. Routers
deliver messages by number only. But people remember names: `www.wikipedia.org`, `mail.google.com`. The **Domain
Name System**, **DNS**, is the service that turns a name into the number, every time, for everyone, in a fraction of
a second.

The usual picture is a **phone book**: you know the name, you look up the number. Three differences make DNS
cleverer than a paper phone book:

- **No single book.** There is no one computer holding every name. The book is split into millions of small
  pages, each kept by whoever owns that part of the name, and the pages point to each other.
- **Every page is kept by its owner.** If a school changes its website's address, it edits its own page, and the
  whole world sees the change within minutes or hours. Nobody else has to approve it.
- **Answers are remembered.** Each answer comes with a "keep this for so long" label, so the same question is not
  asked again and again.

DNS was designed in 1983 (by Paul Mockapetris) to replace a single text file, `HOSTS.TXT`, that one office in
California emailed to every computer on the early internet. That file could not keep up once there were thousands
of computers; DNS has kept up with billions.

## A name is read from right to left

A domain name is a path through a **tree**, written backwards. Take `www.maplehill.example`:

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 450" role="img" aria-labelledby="sk-nd-tree-t"><title id="sk-nd-tree-t">The DNS tree: the root at the top, top-level domains such as ca, example and com below it, maplehill under example, and www and mail under maplehill</title><defs><filter id="sk-nd-tree-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nd-tree-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nd-tree-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nd-tree-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nd-tree-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="450" filter="url(#sk-nd-tree-paper)"/><g filter="url(#sk-nd-tree-pen)"><text x="30" y="44" class="h">Read a name from right to left</text><path class="p" d="M320 122 L130 168"/><path class="p" d="M320 122 L320 168"/><path class="p" d="M320 122 L530 168"/><path class="p" d="M320 212 L320 258"/><path class="p" d="M320 302 L210 348"/><path class="p" d="M320 302 L430 348"/><path class="p gold" d="M250 78 L390 78 L390 122 L250 122Z"/><text x="320.0" y="106.0" text-anchor="middle" class="l">. (root)</text><path class="p room" d="M60 168 L200 168 L200 212 L60 212Z"/><text x="130.0" y="196.0" text-anchor="middle" class="l">ca</text><path class="p room" d="M250 168 L390 168 L390 212 L250 212Z"/><text x="320.0" y="196.0" text-anchor="middle" class="l">example</text><path class="p room" d="M460 168 L600 168 L600 212 L460 212Z"/><text x="530.0" y="196.0" text-anchor="middle" class="l">com</text><path class="p room" d="M250 258 L390 258 L390 302 L250 302Z"/><text x="320.0" y="286.0" text-anchor="middle" class="l">maplehill</text><path class="p room" d="M140 348 L280 348 L280 392 L140 392Z"/><text x="210.0" y="376.0" text-anchor="middle" class="l">www</text><path class="p room" d="M360 348 L500 348 L500 392 L360 392Z"/><text x="430.0" y="376.0" text-anchor="middle" class="l">mail</text><text x="400" y="106" class="s">kept by IANA</text><text x="30" y="240" class="s">top-level domains, each run by a registry</text><text x="410" y="285" class="s">rented by the school</text><text x="30" y="430" class="l">www.maplehill.example.  =  www  →  maplehill  →  example  →  root</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

| Part | Level | Who decides what is under it |
|---|---|---|
| `.` (invisible, at the very end) | the **root** | the root zone, coordinated by IANA |
| `example` (or `com`, `org`, `ca`, `uk`…) | **top-level domain**, **TLD** | the TLD's **registry** |
| `maplehill` | the **domain** the school rents | the school (through its DNS host) |
| `www` | a **subdomain** or host name | the school again |

Every name really ends in a dot for the root: `www.maplehill.example.` Browsers hide it. Each dot is a border: the
owner of the part on the right decides who gets the parts on its left. The `.ca` registry says who owns
`something.ca`; the owner of `something.ca` alone decides what `www.something.ca` or `shop.something.ca` mean.

There are two kinds of top-level domain:

- **Generic TLDs** (gTLDs): `.com`, `.org`, `.net`, `.edu`, and since 2013 hundreds of newer ones like `.app`,
  `.school` or `.london`.
- **Country-code TLDs** (ccTLDs): two letters for a country or territory, like `.ca` (Canada), `.uk`, `.de`, `.jp`.
  Each country sets its own rules; `.ca`, for example, is only for people and organisations with a Canadian
  connection.

## A lookup, step by step

Here is what happens when you type `www.maplehill.example` into a browser for the very first time, with nothing
remembered anywhere.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 440" role="img" aria-labelledby="sk-nd-lookup-t"><title id="sk-nd-lookup-t">Your device asks a resolver; the resolver asks the root, which refers it to the .example servers, which refer it to ns1.opalstack.com, which gives the address; the resolver answers your device</title><defs><filter id="sk-nd-lookup-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nd-lookup-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nd-lookup-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nd-lookup-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nd-lookup-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="440" filter="url(#sk-nd-lookup-paper)"/><g filter="url(#sk-nd-lookup-pen)"><text x="30" y="44" class="h">One question, four servers</text><path class="p room" d="M30 180 L150 180 L150 250 L30 250Z"/><text x="90.0" y="221.0" text-anchor="middle" class="l">your device</text><path class="p gold" d="M220 180 L350 180 L350 250 L220 250Z"/><text x="285.0" y="210.0" text-anchor="middle" class="l">resolver</text><text x="285.0" y="232.0" text-anchor="middle" class="s">asks for you</text><path class="p " d="M152 205 L218 205" marker-end="url(#sk-nd-lookup-ah)"/><path class="p " d="M218 228 L152 228" marker-end="url(#sk-nd-lookup-ah)"/><text x="160" y="196" class="s">1</text><text x="160" y="250" class="s">5</text><path class="p room" d="M420 80 L620 80 L620 136 L420 136Z"/><text x="520.0" y="114.0" text-anchor="middle" class="l">root</text><path class="p" d="M352 215 L418 102" marker-end="url(#sk-nd-lookup-ah)"/><text x="400" y="98" class="s">2</text><text x="420" y="156" class="s">“ask .example”</text><path class="p room" d="M420 200 L620 200 L620 256 L420 256Z"/><text x="520.0" y="234.0" text-anchor="middle" class="l">.example servers</text><path class="p" d="M352 215 L418 222" marker-end="url(#sk-nd-lookup-ah)"/><text x="400" y="218" class="s">3</text><text x="420" y="276" class="s">“ask ns1.opalstack.com”</text><path class="p room" d="M420 320 L620 320 L620 376 L420 376Z"/><text x="520.0" y="354.0" text-anchor="middle" class="l">ns1.opalstack.com</text><path class="p" d="M352 215 L418 342" marker-end="url(#sk-nd-lookup-ah)"/><text x="400" y="338" class="s">4</text><text x="420" y="396" class="s">“203.0.113.10, keep 1 h”</text><text x="30" y="300" class="s">6 the browser connects</text><text x="30" y="322" class="s">   to 203.0.113.10</text><text x="30" y="400" class="s">The resolver remembers every answer,</text><text x="30" y="422" class="s">so next time it skips steps 2 to 4.</text></g></svg><figcaption>Sketched for this page. 203.0.113.10 is an address kept for examples.</figcaption></figure>

1. **Your device asks a resolver.** Your laptop or phone does not search the internet itself. It sends one small
   question, "what is the address of `www.maplehill.example`?", to a **recursive resolver**: a server whose job is
   to find answers for others. At home it is usually run by your internet provider (and your router passes the
   question on); you can also choose a public one, such as Cloudflare's `1.1.1.1`, Google's `8.8.8.8` or Quad9's
   `9.9.9.9`.
2. **The resolver asks a root server.** The resolver knows, built in, the addresses of the 13 named root servers.
   It asks one. The root does not know the answer, but it knows who is in charge of `.example`, and says: "ask
   these servers."
3. **The resolver asks the TLD servers.** The `.example` servers do not know the answer either, but they know who
   keeps `maplehill.example`'s page: "ask `ns1.opalstack.com`." (This step is called a **referral**.)
4. **The resolver asks the domain's own nameserver.** `ns1.opalstack.com` is **authoritative** for
   `maplehill.example`: it holds the real page. It answers: "`www.maplehill.example` is `203.0.113.10`, and you
   may keep this answer for 3,600 seconds."
5. **The resolver answers your device**, and remembers every answer it learned on the way.
6. **Your browser connects** to `203.0.113.10`, and the website starts to load. That journey is the subject of
   [How a web page reaches you](How-a-Page-Reaches-You.md).

All of this usually takes **between 20 and 200 milliseconds** the first time, and close to nothing afterwards.

!!! info "Two kinds of DNS server, two different jobs"
    A **recursive resolver** *asks* on your behalf and remembers answers; it owns nothing.
    An **authoritative nameserver** *knows* the real records for certain domains and answers only for those.
    When a domain's owner "changes DNS", they change the authoritative server's records. When you "change your DNS"
    on a laptop, you choose a different recursive resolver. Same three letters, opposite ends of the chain.

## Remembering answers: caching and TTL

If every lookup went to the root, the root servers would receive every question on Earth. Instead, every answer
comes with a **TTL**, "time to live", in seconds. Anyone who receives the answer may **cache** it (keep a copy) for
that long:

- The root's answer "`.example` is handled by these servers" has a TTL of two days, so a resolver asks the root
  about each TLD only every couple of days.
- A typical website's `A` record has a TTL of 5 minutes to 1 day, chosen by its owner.
- Your browser and your device keep their own small caches too.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 400" role="img" aria-labelledby="sk-nd-cache-t"><title id="sk-nd-cache-t">Caches at the browser, the device and the resolver each keep answers for up to their TTL; the root, TLD and domain servers are asked only when no fresh copy exists</title><defs><filter id="sk-nd-cache-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nd-cache-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nd-cache-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nd-cache-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nd-cache-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="400" filter="url(#sk-nd-cache-paper)"/><g filter="url(#sk-nd-cache-pen)"><text x="30" y="44" class="h">Who remembers what, and for how long</text><path class="p room" d="M30 80 L230 80 L230 130 L30 130Z"/><text x="130.0" y="111.0" text-anchor="middle" class="l">browser</text><text x="250" y="111" class="s">a short while</text><path class="p " d="M130 132 L130 148" marker-end="url(#sk-nd-cache-ah)"/><path class="p room" d="M30 150 L230 150 L230 200 L30 200Z"/><text x="130.0" y="181.0" text-anchor="middle" class="l">your device</text><text x="250" y="181" class="s">up to the TTL</text><path class="p " d="M130 202 L130 218" marker-end="url(#sk-nd-cache-ah)"/><path class="p gold" d="M30 220 L230 220 L230 270 L30 270Z"/><text x="130.0" y="251.0" text-anchor="middle" class="l">resolver</text><text x="250" y="251" class="s">up to the TTL, shared by all its users</text><path class="p " d="M130 272 L130 288" marker-end="url(#sk-nd-cache-ah)"/><path class="p room" d="M30 290 L230 290 L230 340 L30 340Z"/><text x="130.0" y="321.0" text-anchor="middle" class="l">root, TLD, domain</text><text x="250" y="321" class="s">asked only when no copy is fresh</text><text x="30" y="380" class="l">An answer: “203.0.113.10, TTL 3600” = keep it for one hour.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

Caching is why DNS is fast and why it survives enormous traffic, and also why changes are not instant. If you move
your website and the old record had a TTL of one day, some visitors may keep reaching the old address for up to a
day. This wait is often called **propagation**; really it is old copies expiring one by one. The trick: **lower
the TTL a day before a planned change**, make the change, then raise it again.

## What a domain's page holds

Each domain's page (its **zone**) is a list of **records**. Each record has a name, a type, a TTL and a value. The
common types:

| Type | What it says | Example value |
|---|---|---|
| **A** | the IPv4 address of this name | `203.0.113.10` |
| **AAAA** | the IPv6 address (the newer, longer kind) | `2001:db8::10` |
| **CNAME** | "this name is another name for…" (an alias) | `www` → `maplehill.example` |
| **MX** | where email for this domain is delivered, with a priority | `1 smtp.google.com` |
| **TXT** | free text read by other computers: SPF, DKIM, DMARC, proofs of ownership | `"v=spf1 include:_spf.google.com ~all"` |
| **NS** | which nameservers are authoritative for this zone | `ns1.opalstack.com` |
| **SOA** | "start of authority": the zone's housekeeping (serial number, timers) | — |
| **CAA** | which certificate authorities may issue HTTPS certificates for this name | `0 issue "letsencrypt.org"` |
| **HTTPS / SVCB** | how best to connect (HTTP/3, encryption keys) | — |

How the TXT records protect email is told in full in [How email gets delivered](Email-Delivery.md).

## Who runs DNS for the whole world

Nobody owns DNS, yet it works everywhere, every second. That is because the job is divided into layers, each with
clear duties, and coordinated by agreements rather than by one company.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 450" role="img" aria-labelledby="sk-nd-world-t"><title id="sk-nd-world-t">From top to bottom: ICANN sets policies, IANA keeps the root zone, 12 operators run the root servers, registries run each TLD, registrars rent names, and each domain holder keeps its own records</title><defs><filter id="sk-nd-world-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nd-world-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nd-world-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nd-world-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nd-world-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="450" filter="url(#sk-nd-world-paper)"/><g filter="url(#sk-nd-world-pen)"><text x="30" y="44" class="h">Who keeps which part</text><path class="p gold" d="M30 70 L250 70 L250 116 L30 116Z"/><text x="140.0" y="99.0" text-anchor="middle" class="l">ICANN</text><text x="270" y="99" class="s">sets the policies</text><path class="p " d="M140 117 L140 130" marker-end="url(#sk-nd-world-ah)"/><path class="p room" d="M30 132 L250 132 L250 178 L30 178Z"/><text x="140.0" y="161.0" text-anchor="middle" class="l">IANA (PTI)</text><text x="270" y="161" class="s">keeps the root zone: the list of TLDs</text><path class="p " d="M140 179 L140 192" marker-end="url(#sk-nd-world-ah)"/><path class="p room" d="M30 194 L250 194 L250 240 L30 240Z"/><text x="140.0" y="223.0" text-anchor="middle" class="l">12 root operators</text><text x="270" y="223" class="s">13 names, about 2,000 machines</text><path class="p " d="M140 241 L140 254" marker-end="url(#sk-nd-world-ah)"/><path class="p room" d="M30 256 L250 256 L250 302 L30 302Z"/><text x="140.0" y="285.0" text-anchor="middle" class="l">registries</text><text x="270" y="285" class="s">one per TLD: .com, .org, .ca …</text><path class="p " d="M140 303 L140 316" marker-end="url(#sk-nd-world-ah)"/><path class="p room" d="M30 318 L250 318 L250 364 L30 364Z"/><text x="140.0" y="347.0" text-anchor="middle" class="l">registrars</text><text x="270" y="347" class="s">the shops that rent names</text><path class="p " d="M140 365 L140 378" marker-end="url(#sk-nd-world-ah)"/><path class="p gold" d="M30 380 L250 380 L250 426 L30 426Z"/><text x="140.0" y="409.0" text-anchor="middle" class="l">you + your DNS host</text><text x="270" y="409" class="s">your own page of records</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

### ICANN and IANA: the coordinators

**ICANN**, the Internet Corporation for Assigned Names and Numbers, is a non-profit founded in 1998 and based in Los
Angeles. It sets the policies for generic top-level domains (which new TLDs may exist, the rules registries and
registrars must follow) through a "multistakeholder" process: governments, companies, technical experts and
ordinary users all take part in its meetings, held three times a year around the world. Since October 2016 ICANN
has done this without a supervising contract from the US government.

**IANA**, the Internet Assigned Numbers Authority, is the small team (today run by PTI, an ICANN affiliate) that does
the record-keeping: it maintains the list of every top-level domain and who runs it (the **root zone**), and also
hands out blocks of IP addresses and protocol numbers. When a new TLD is approved, or a country changes who runs its
ccTLD, IANA updates the root zone. The company **Verisign** then publishes the updated root zone file to the root
server operators.

### The root servers: 13 names, about 2,000 machines

The root zone is served by **13 root server identities**, named `a.root-servers.net` to `m.root-servers.net`. The
number 13 is a leftover from the 1980s (13 addresses fit in one small DNS reply). They are run by **12 independent
organisations**: universities, a US Army research lab, NASA, non-profits like ISC and RIPE NCC, ICANN itself, and
companies like Verisign. No single one is in charge, and they use different software on purpose, so a single bug
cannot stop them all.

Each identity is not one computer: thanks to **anycast** (many machines sharing one address, with the network sending
you to the nearest), they run on **about 2,000 machines** in hundreds of cities on every continent. In late 2025 the
count passed 2,000 for the first time. A question to "the root" from Toronto is answered in Toronto or nearby.

### Registries: one per top-level domain

A **registry** runs one TLD: it keeps the master list of every name under it and runs the authoritative servers for
the TLD. Examples: **Verisign** runs `.com` and `.net`; **Public Interest Registry** runs `.org`; **CIRA** runs `.ca`;
**Nominet** runs `.uk`. There are more than 1,200 TLDs in use, run by a few hundred registries.

### Registrars: the shops

You cannot buy a name from a registry directly. You rent it from a **registrar**: a shop accredited by ICANN (for
generic TLDs) or by the country's registry (for ccTLDs). GoDaddy, Namecheap, Network Solutions, Netfirms, Cloudflare,
Google Cloud and hundreds of others are registrars. The registrar passes your details and your chosen nameservers
to the registry, and collects the yearly fee (a small part of which goes to the registry and to ICANN).

### DNS hosts and resolvers: everyone else

- The **DNS host** of each domain runs that domain's authoritative nameservers: often the registrar or the web host,
  or a specialist (Cloudflare, Amazon Route 53, Google Cloud DNS, Azure DNS).
- The **resolvers** that ask the questions are run by internet providers, companies, schools and public services.

So a single lookup for `www.maplehill.example` may touch servers run by a root operator, a TLD registry and a web
host, in three different countries, coordinated by records kept by IANA under policies set at ICANN, and none of
them needs to know the others.

## How a name gets onto the internet

When someone rents a new domain, this is what happens behind the shop's "Buy" button:

1. **Registration.** The registrar checks the name is free, takes your details (the *registrant*) and payment, and
   tells the registry: "this name now belongs to this customer, for one year (or more)."
2. **Delegation.** The registrar also tells the registry your **nameservers**. The registry puts NS records for your
   domain into the TLD's zone. From now on, step 3 of every lookup will point to your nameservers.
3. **Records.** You (or your DNS host) put records on your page: an A record for the website, MX for mail, TXT for
   SPF and the rest.
4. **Renewal.** Every year, the fee keeps the name yours. If it lapses, most registrars allow a grace period of a
   month or more, then the name can be lost to someone else. **Turn on auto-renew and keep the registrar's email
   address current**: an expired domain takes down the website and every email address at once.

!!! tip "WHOIS: who holds a name"
    The public record of who registered a name, through which registrar, when it expires and which nameservers it
    uses, is called **WHOIS** (now delivered by a newer system, **RDAP**). Look up any domain at
    **lookup.icann.org**. Most personal details are hidden for privacy, but the registrar, dates and nameservers
    are always shown, which is exactly what you need to find out who keeps a domain's DNS.

## What can go wrong

| Problem | What you see | Why |
|---|---|---|
| The domain expired | the website and all email stop together | nobody renewed it; the registry removed the NS records |
| Records edited in the wrong place | changes "do nothing" | the nameservers point to another company; see [the email page](Email-Delivery.md#the-building-blocks) |
| Old answers still cached | some people see the old site, others the new | TTL not expired yet; wait, or lower TTLs before a move |
| The resolver is down | "server not found" for every site, though the connection works | try another resolver, such as 1.1.1.1 |
| False answers (**spoofing**, **cache poisoning**) | a fake site at a real name | an attacker tricked a resolver; **DNSSEC** signatures prevent this |
| Someone watches your lookups | nothing visible | plain DNS is not encrypted; **DNS over HTTPS (DoH)** or **over TLS (DoT)** hides it from the network |

**DNSSEC** adds signatures to DNS answers, in a chain from the root (whose key is created and guarded in public
"key ceremonies" held by ICANN) down to each signed domain, so a resolver can check an answer is genuine.
**Encrypted DNS** (DoH, DoT) keeps the café Wi-Fi and the internet provider from reading the names you look up.
Both are explained in more depth in the expert guide [DNS: names to addresses](../topics/DNS.md).

## Try it yourself

On any computer, in a terminal or command prompt:

```bash
nslookup www.wikipedia.org            # the address
nslookup -type=MX gmail.com           # where Gmail's own mail goes
nslookup -type=NS ca                  # the servers for the whole .ca TLD
```

On macOS or Linux, `dig` shows more, including each TTL counting down:

```bash
dig www.wikipedia.org
dig +trace www.wikipedia.org          # every step: root, TLD, authoritative
```

Or, with no command line at all, open **dns.google** in a browser, type any name and choose a record type.
[Lab 4](../labs/04-DNS-with-dig.md) walks through a full trace.

## Glossary

**Anycast**
: Many servers in different places sharing one IP address; the network delivers each question to the nearest.

**Authoritative nameserver**
: A server that holds the real records for a domain and answers questions about it.

**Cache / caching**
: Keeping a copy of an answer for reuse, for at most its TTL.

**ccTLD / gTLD**
: Country-code top-level domain (`.ca`, `.uk`) and generic top-level domain (`.com`, `.org`, `.app`).

**DNS**
: Domain Name System: the worldwide, shared system that turns names into addresses and holds other facts about names.

**DNSSEC**
: DNS Security Extensions: signatures that let a resolver check an answer has not been forged.

**DoH / DoT**
: DNS over HTTPS and DNS over TLS: encrypted lookups between your device and its resolver.

**ICANN**
: The non-profit that coordinates policy for names and numbers on the internet.

**IANA**
: The function, run by ICANN's affiliate PTI, that keeps the root zone and hands out IP address blocks and protocol numbers.

**IP address**
: The number that identifies a device on the internet (`203.0.113.10` in IPv4, `2001:db8::10` in IPv6).

**Referral**
: An answer that says "I don't know, but ask these servers."

**Registrant / registrar / registry**
: The one who rents a name / the shop that rents it out / the organisation that runs the whole TLD.

**Resolver (recursive resolver)**
: The server that does the asking for your device, following referrals and caching answers.

**Root zone / root servers**
: The top of the tree: the list of all TLDs and their servers, served by 13 identities on about 2,000 machines.

**TLD**
: Top-level domain: the last part of a name, such as `.com` or `.ca`.

**TTL**
: Time to live: how many seconds an answer may be kept before asking again.

**WHOIS / RDAP**
: The public lookup of who registered a domain, its registrar, dates and nameservers.

**Zone**
: The set of records one authority keeps for its part of the tree.

## Keep reading

- [How email gets delivered](Email-Delivery.md): DNS in action, through SPF, DKIM and DMARC.
- [How a web page reaches you](How-a-Page-Reaches-You.md): what happens after the address is found.
- In the books: [networks chapter 18, DNS](../books/networks/18-DNS.md) and [security chapter 7, DNS security](../books/security/07-DNS-Security.md).

??? info "Sources"
    - RFC 1034 and RFC 1035 (the DNS design, 1987); RFC 882/883 (the first DNS, P. Mockapetris, 1983); RFC 2606 (`.example`); RFC 5737 and RFC 3849 (example addresses); RFC 4033–4035 (DNSSEC); RFC 8484 (DoH); RFC 7858 (DoT); RFC 8499 (DNS terminology).
    - root-servers.org, *Root Server Technical Operations* (12 operators, 13 identities, live instance count; past 2,000 instances in late 2025 as reported on the RIPE DNS working-group list, October 2025).
    - IANA, *Root Zone Database* (iana.org/domains/root/db) and *Root Zone Management*; ICANN, *IANA Stewardship Transition* (completed 1 October 2016).
    - ICANN, *Registrar Accreditation Agreement* and *Expired Registration Recovery Policy* (grace periods); ICANN Lookup (lookup.icann.org) for WHOIS/RDAP.
    - Wikipedia, *List of Internet top-level domains* (about 1,260 actively delegated TLDs, March 2025), checked 8 November 2026.
