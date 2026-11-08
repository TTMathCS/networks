# How email gets delivered: domains, DNS, SPF, DKIM and DMARC

*A real-world case study, told for school staff and small-organisation admins who have never met these words. Every
term is explained the first time it appears, and there is a [glossary](#glossary) at the end.*

[The story](#the-story) · [Building blocks](#the-building-blocks) · [SPF](#spf-the-guest-list) · [DKIM](#dkim-the-wax-seal) · [DMARC](#dmarc-the-rulebook) · [Why now](#why-it-broke-now) · [The case](#the-case-study) · [Checklist](#check-your-own-domain) · [Mistakes](#common-mistakes) · [Glossary](#glossary)

!!! note "About the names on this page"
    The school, its domain and its people are made up. The domain **maplehill.example** uses `.example`, an ending
    kept for examples that can never belong to anyone. The companies named (Netfirms, Opalstack, Google, Microsoft)
    are real, because the setup is a very common one, but the case is told without anything that identifies the
    real organisation.

## The story

On an ordinary Monday, the office of a small school, Maple Hill, sent its weekly newsletter to parents, as it had for
years. By lunchtime the replies started: not from parents, but from computers. Every parent with a **Hotmail**,
**Outlook.com** or **Yahoo** address got nothing, and the school got back a short, cold message for each one:

```text
550 5.7.1 Message rejected: Message lacks SPF/DKIM/DMARC Auth Records
```

Parents with **Gmail** addresses received the newsletter as usual. Nothing had changed at the school: same
computers, same email account, same newsletter. So what happened?

The short answer: the school's domain had never published three small notes in the internet's phone book, called
**SPF**, **DKIM** and **DMARC**. For years nobody checked. Then the big email companies started checking, one after
the other, and mail without them began to bounce. The rest of this page explains what each of those words means,
why Gmail still let the mail through, and exactly how the school fixed it in an afternoon.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 400" role="img" aria-labelledby="sk-ne-bounce-t"><title id="sk-ne-bounce-t">The school sends one newsletter; Gmail delivers it, while Outlook and Yahoo refuse it with a 550 error sent back to the school</title><defs><filter id="sk-ne-bounce-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ne-bounce-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ne-bounce-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ne-bounce-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ne-bounce-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="400" filter="url(#sk-ne-bounce-paper)"/><g filter="url(#sk-ne-bounce-pen)"><text x="30" y="44" class="h">Same newsletter, three different answers</text><path class="p gold" d="M30 160 L180 160 L180 240 L30 240Z"/><text x="105.0" y="195.0" text-anchor="middle" class="l">school office</text><text x="105.0" y="217.0" text-anchor="middle" class="s">one newsletter</text><path class="p " d="M182 200 L368 110" marker-end="url(#sk-ne-bounce-ah)"/><path class="p room" d="M370 80 L550 80 L550 140 L370 140Z"/><text x="460.0" y="116.0" text-anchor="middle" class="l">Gmail</text><path class="p blue" d="M571 110 L578 118 L591 101" style="stroke-width:3"/><text x="370" y="162" class="s">delivered to the inbox</text><path class="p " d="M182 200 L368 215" marker-end="url(#sk-ne-bounce-ah)"/><path class="p room" d="M370 185 L550 185 L550 245 L370 245Z"/><text x="460.0" y="221.0" text-anchor="middle" class="l">Outlook / Hotmail</text><path class="p red" d="M571 206 L589 224 M589 206 L571 224" style="stroke-width:3"/><text x="370" y="267" class="s">550 rejected</text><path class="p red dash" d="M368 233 Q260 255 182 228" marker-end="url(#sk-ne-bounce-ah)"/><path class="p " d="M182 200 L368 320" marker-end="url(#sk-ne-bounce-ah)"/><path class="p room" d="M370 290 L550 290 L550 350 L370 350Z"/><text x="460.0" y="326.0" text-anchor="middle" class="l">Yahoo</text><path class="p red" d="M571 311 L589 329 M589 311 L571 329" style="stroke-width:3"/><text x="370" y="372" class="s">550 rejected</text><path class="p red dash" d="M368 338 Q260 360 182 228" marker-end="url(#sk-ne-bounce-ah)"/><text x="30" y="300" class="s">back to the school:</text><text x="30" y="320" class="s">“no SPF, DKIM, DMARC”</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

!!! info "What a 550 bounce means"
    A **bounce** is the note a mail server sends back when it will not deliver a message. The number tells you what
    kind: codes starting with **5** (like 550) are *permanent*: "no, and do not try again". Codes starting with **4**
    are *temporary*: "not now, try later". The words after the code are the receiving company's own explanation.

## The building blocks

Before the three checks make sense, four everyday ideas are needed: the **name**, the **phone book**, the **house**
and the **post office**.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 430" role="img" aria-labelledby="sk-ne-four-ideas-t"><title id="sk-ne-four-ideas-t">Four ideas: the domain name rented from a registrar, DNS as the phone book, the web host as the house, the email provider as the post office</title><defs><filter id="sk-ne-four-ideas-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ne-four-ideas-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ne-four-ideas-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ne-four-ideas-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ne-four-ideas-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="430" filter="url(#sk-ne-four-ideas-paper)"/><g filter="url(#sk-ne-four-ideas-pen)"><text x="30" y="44" class="h">Four everyday ideas</text><path class="p room" d="M30 70 L310 70 L310 230 L30 230Z"/><text x="150" y="110" class="b">the name</text><text x="150" y="150" class="l">maplehill.example</text><text x="150" y="178" class="s">rented from a registrar</text><path class="p room" d="M330 70 L610 70 L610 230 L330 230Z"/><text x="450" y="110" class="b">the phone book</text><text x="450" y="150" class="l">DNS</text><text x="450" y="178" class="s">name → number</text><path class="p room" d="M30 250 L310 250 L310 410 L30 410Z"/><text x="150" y="290" class="b">the house</text><text x="150" y="330" class="l">web host</text><text x="150" y="358" class="s">where the website lives</text><path class="p room" d="M330 250 L610 250 L610 410 L330 410Z"/><text x="450" y="290" class="b">the post office</text><text x="450" y="330" class="l">email provider</text><text x="450" y="358" class="s">sends and receives mail</text><path class="p" d="M60 210 L60 110 M50 120 L110 120 L120 132 L110 144 L50 144Z"/><path class="p gold" d="M355 110 L420 110 L420 200 L355 200Z"/><path class="p" d="M365 130 L410 130 M365 150 L410 150 M365 170 L400 170"/><path class="p gold" d="M50 330 L85 295 L120 330 L120 390 L50 390Z"/><path class="p" d="M78 390 L78 360 L94 360 L94 390"/><path class="p gold" d="M350 320 L420 320 L420 370 L350 370Z"/><path class="p" d="M350 320 L385 348 L420 320"/></g></svg><figcaption>Sketched for this page.</figcaption></figure>

### Domain name and registrar

A **domain name** (or just **domain**) is the name an organisation uses on the internet: `maplehill.example`. It
appears in web addresses (`www.maplehill.example`) and in email addresses (`office@maplehill.example`).

Nobody owns a domain forever; you **rent** it, usually by the year, from a **registrar**: a company allowed to
sell names, such as Netfirms, Network Solutions, GoDaddy, Namecheap or Cloudflare. The registrar's main job is to
keep your name in your hands and renewed. It also stores one very important setting: **which nameservers** hold your
domain's phone-book page (see below). If the yearly fee is not paid, the name stops working: website and email
both.

### DNS and nameservers: the internet's phone book

Computers do not find each other by name; they use numbers called **IP addresses** (like `203.0.113.10`). The
**Domain Name System**, **DNS**, is the internet's phone book: it turns names into those numbers, and stores a few
other facts about each name.

Each domain has its own page in this phone book, kept on a few computers called **nameservers** (or *DNS servers*).
Whoever runs your nameservers is your **DNS host**. It can be your registrar, your web host, or a company that does
only DNS (like Cloudflare). The registrar tells the world *who* your DNS host is; the DNS host keeps *what is written*
on your page.

!!! tip "The most important sentence on this page"
    You must change your records **where your nameservers are**, not where you bought the name. If the registrar
    says your nameservers are `ns1.opalstack.com`, then your phone-book page lives at Opalstack, and any record you
    type into the registrar's own DNS screen is ignored by the whole internet.

The full story of how a lookup travels, and who runs DNS worldwide, is in [How DNS works](How-DNS-Works.md).

### DNS records: the lines on your page

Your page in the phone book is a short list of **records**. Each record has a **name** (which part of the domain it
is about), a **type**, a **value**, and a **TTL** ("time to live": how many seconds others may remember it before
asking again). Three types matter for this story:

| Type | Everyday meaning | Example |
|---|---|---|
| **A** | "The house is at this street number": the address of the computer that shows your website | `www.maplehill.example  A  203.0.113.10` |
| **MX** | "Deliver letters for this name to this post office": where *incoming* email goes | `maplehill.example  MX  1 smtp.google.com` |
| **TXT** | "A note pinned to the page": free text that other computers read | `maplehill.example  TXT  "v=spf1 …"` |

**SPF, DKIM and DMARC are all TXT records.** That is all they are: three short notes, written in a fixed format, on
your domain's page.

### Why four different companies can be involved

Because each job is separate, small organisations often end up with a different company for each:

| Job | Analogy | Who did it at Maple Hill |
|---|---|---|
| **Registrar**: keeps the name rented | the land registry | Netfirms (part of the Network Solutions family) |
| **DNS host**: keeps the phone-book page | the phone company | Opalstack's nameservers |
| **Web host**: runs the website | the house | Opalstack |
| **Email provider**: sends and receives mail | the post office | Google Workspace |

This is perfectly normal, and it works well, but it means nobody looks after the whole picture. The registrar
thinks "email is Google's job"; Google thinks "DNS is your job"; the web host thinks "we only host the website". The
three email checks fell into that gap.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 430" role="img" aria-labelledby="sk-ne-four-t"><title id="sk-ne-four-t">The registrar points to the DNS host; the DNS host page holds A, MX and TXT records; the A record leads to the web host and the MX record to the email provider</title><defs><filter id="sk-ne-four-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ne-four-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ne-four-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ne-four-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ne-four-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="430" filter="url(#sk-ne-four-paper)"/><g filter="url(#sk-ne-four-pen)"><text x="30" y="44" class="h">One name, four companies</text><path class="p room" d="M30 80 L230 80 L230 170 L30 170Z"/><text x="130.0" y="109.0" text-anchor="middle" class="l">registrar</text><text x="130.0" y="131.0" text-anchor="middle" class="s">keeps the name rented,</text><text x="130.0" y="153.0" text-anchor="middle" class="s">says where the page is</text><path class="p " d="M232 125 L300 125" marker-end="url(#sk-ne-four-ah)"/><path class="p gold" d="M302 70 L610 70 L610 250 L302 250Z"/><text x="456" y="100" class="l" text-anchor="middle">DNS host: the phone-book page</text><text x="320" y="140" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">A</text><text x="370" y="140" class="s">→ the website’s address</text><text x="320" y="176" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">MX</text><text x="370" y="176" class="s">→ where mail is delivered</text><text x="320" y="212" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">TXT</text><text x="370" y="212" class="s">→ SPF, DKIM, DMARC notes</text><path class="p dash" d="M300 140 L130 290" marker-end="url(#sk-ne-four-ah)"/><path class="p dash" d="M490 252 L490 290" marker-end="url(#sk-ne-four-ah)"/><text x="500" y="278" class="s">MX</text><text x="150" y="230" class="s">A</text><path class="p room" d="M30 295 L230 295 L230 375 L30 375Z"/><text x="130.0" y="330.0" text-anchor="middle" class="l">web host</text><text x="130.0" y="352.0" text-anchor="middle" class="s">runs the website</text><path class="p room" d="M370 295 L610 295 L610 375 L370 375Z"/><text x="490.0" y="330.0" text-anchor="middle" class="l">email provider</text><text x="490.0" y="352.0" text-anchor="middle" class="s">sends and receives mail</text><text x="30" y="410" class="s">Each can be a different company. Records go to the DNS host.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## SPF: the guest list

**SPF** (Sender Policy Framework) is a **guest list**: a list, published by you, of the servers allowed to send
email using your domain's name.

When a message arrives claiming to be from `maplehill.example`, the receiving server (say, Outlook.com) notes the
IP address of the computer that is handing it the message, looks up the domain's SPF record, and checks: *is this
computer on the guest list?*

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 390" role="img" aria-labelledby="sk-ne-spf-t"><title id="sk-ne-spf-t">A receiving server takes the sender’s address and checks it against the domain’s SPF guest list in DNS: Google’s and the web host’s servers pass, anyone else is suspicious</title><defs><filter id="sk-ne-spf-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ne-spf-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ne-spf-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ne-spf-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ne-spf-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="390" filter="url(#sk-ne-spf-paper)"/><g filter="url(#sk-ne-spf-pen)"><text x="30" y="44" class="h">SPF: is this sender on the guest list?</text><path class="p room" d="M30 110 L200 110 L200 190 L30 190Z"/><text x="115.0" y="145.0" text-anchor="middle" class="l">sending server</text><text x="115.0" y="167.0" text-anchor="middle" class="s">address 209.85.220.41</text><path class="p " d="M202 150 L368 150" marker-end="url(#sk-ne-spf-ah)"/><text x="220" y="135" class="s">mail “from” maplehill</text><path class="p gold" d="M370 110 L610 110 L610 190 L370 190Z"/><text x="490.0" y="145.0" text-anchor="middle" class="l">receiving server</text><text x="490.0" y="167.0" text-anchor="middle" class="s">Outlook.com, Yahoo, Gmail</text><path class="p " d="M490 192 L490 228" marker-end="url(#sk-ne-spf-ah)"/><text x="500" y="216" class="s">look up</text><path class="p room" d="M330 230 L610 230 L610 370 L330 370Z"/><text x="345" y="258" class="s">guest list for maplehill.example</text><text x="345" y="290" class="l">Google’s servers</text><path class="p blue" d="M576 284 L583 292 L596 275" style="stroke-width:3"/><text x="345" y="322" class="l">the web host’s servers</text><path class="p blue" d="M576 316 L583 324 L596 307" style="stroke-width:3"/><text x="345" y="354" class="l">anyone else: ~ suspicious</text><text x="30" y="250" class="s">209.85.220.41 is one of</text><text x="30" y="270" class="s">Google’s servers, so</text><text x="30" y="290" class="l">SPF says PASS.</text></g></svg><figcaption>Sketched for this page. 209.85.220.41 stands for one of Google’s sending servers.</figcaption></figure>

A real SPF record looks like this:

```text
v=spf1 include:_spf.google.com include:spf.opalstack.com ~all
```

Read it left to right:

| Part | Meaning |
|---|---|
| `v=spf1` | "This is an SPF record, version 1." Every SPF record starts this way. |
| `include:_spf.google.com` | "Also allow every server on *Google's* guest list." Google keeps that list up to date, so you never have to. |
| `include:spf.opalstack.com` | "Also allow the web host's mail servers" (for messages the website sends itself, such as contact-form emails). |
| `~all` | "Anyone else: **soft fail**." Treat with suspicion, but do not automatically refuse. |

**`~all` or `-all`?** The ending says what to do with everyone *not* on the list. `~all` (*soft fail*) means
"probably not us"; `-all` (*fail*) means "definitely not us, refuse it". Start with `~all` while you are
setting things up, because a forgotten sender (a newsletter service, a printer that emails scans, the website's
contact form) will only be marked suspicious, not lost. Move to `-all` once you are sure the list is complete. (Some
records end in `?all`, "no opinion", which protects almost nothing.)

!!! warning "Only ONE SPF record per domain"
    A domain may have **exactly one** TXT record starting with `v=spf1`. Two of them, for example one added for
    Google and another added later for a newsletter service, do not add up: the standard says the result is an
    error, and many receivers treat the domain as having *no* valid SPF at all. To add a sender, **edit the one
    record** and add another `include:`.

Two more small rules: an SPF record may cause at most **10 further DNS lookups** in total (each `include:` costs at
least one), and SPF checks the hidden "envelope" sender address that servers use between themselves, not
necessarily the *From* address you see. That second point is why SPF alone is not enough, and why DMARC exists.

## DKIM: the wax seal

**DKIM** (DomainKeys Identified Mail) is a **tamper-proof wax seal** on every message.

In the old days, an important letter was closed with wax and pressed with a ring only its owner had. Anyone could
look at the seal and recognise the ring's pattern; nobody else could make it; and a broken seal showed that someone
had opened the letter on the way.

DKIM does the same with mathematics (a *digital signature*, the same idea that protects HTTPS):

1. Your email provider keeps a secret **private key** (the ring). It never leaves the provider.
2. For every message it sends, it uses the private key to compute a **signature** from the message's important
   parts (the From line, the subject, the body) and attaches it as a hidden `DKIM-Signature` line.
3. You publish the matching **public key** (the pattern of the seal) in DNS, as a TXT record.
4. The receiving server reads the signature, fetches your public key from DNS, and checks the two fit. If even one
   comma in the message was changed on the way, the check fails.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 395" role="img" aria-labelledby="sk-ne-dkim-t"><title id="sk-ne-dkim-t">The provider signs each letter with a secret private key; the receiver fetches the public key from DNS at google._domainkey and checks the seal: unchanged letters pass, altered or forged ones fail</title><defs><filter id="sk-ne-dkim-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ne-dkim-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ne-dkim-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ne-dkim-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ne-dkim-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="395" filter="url(#sk-ne-dkim-paper)"/><g filter="url(#sk-ne-dkim-pen)"><text x="30" y="44" class="h">DKIM: a seal only you can make</text><path class="p room" d="M30 90 L200 90 L200 170 L30 170Z"/><text x="115.0" y="125.0" text-anchor="middle" class="l">your provider</text><text x="115.0" y="147.0" text-anchor="middle" class="s">keeps the private key</text><circle cx="60" cy="210" r="16" class="p gold"/><path class="p" d="M76 210 L130 210 M115 210 L115 222 M125 210 L125 222"/><text x="140" y="216" class="s">secret</text><path class="p room" d="M250 110 L370 110 L370 180 L250 180Z"/><path class="p" d="M250 110 L310 150 L370 110"/><circle cx="345" cy="170" r="13" class="p rust"/><text x="250" y="210" class="s">signed letter</text><path class="p " d="M202 130 L246 140" marker-end="url(#sk-ne-dkim-ah)"/><path class="p " d="M374 145 L438 145" marker-end="url(#sk-ne-dkim-ah)"/><path class="p gold" d="M440 100 L610 100 L610 190 L440 190Z"/><text x="525.0" y="140.0" text-anchor="middle" class="l">receiver</text><text x="525.0" y="162.0" text-anchor="middle" class="s">checks the seal</text><path class="p " d="M525 192 L525 236" marker-end="url(#sk-ne-dkim-ah)"/><path class="p room" d="M330 238 L610 238 L610 318 L330 318Z"/><text x="345" y="265" class="s">DNS: google._domainkey</text><text x="345" y="290" class="s">public key “p=MIIBIjAN…”</text><text x="30" y="290" class="s">Key fits, letter unchanged:</text><text x="30" y="314" class="b">PASS</text><path class="p blue" d="M81 308 L88 316 L101 299" style="stroke-width:3"/><text x="30" y="350" class="s">One comma changed on the way, or a forger:</text><text x="30" y="374" class="b">FAIL</text><path class="p red" d="M81 359 L99 377 M99 359 L81 377" style="stroke-width:3"/></g></svg><figcaption>Sketched for this page.</figcaption></figure>

### Where the public key lives: selectors

The public key sits at a special name built like this:

```text
<selector>._domainkey.<your domain>
```

For Google Workspace the usual **selector** is `google`, so the name is:

```text
google._domainkey.maplehill.example
```

and its value is a long TXT record such as:

```text
v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu3x…(about 400 characters)…IDAQAB
```

A **selector** is simply a label for one key, so a domain can have several keys at once: one for Google
(`google`), one for a newsletter service (for example `s1`), and later a new key while the old one is retired. The
signature on each message names its selector (`s=google`) and its domain (`d=maplehill.example`), so the receiver
knows exactly which DNS name to look up.

### 1024 or 2048 bits?

The number of **bits** is the size of the key: bigger is harder to forge. Use **2048-bit** keys; 1024-bit is the
oldest size still accepted, and Yahoo's guidance names 1024 as the minimum. The only reason to choose 1024 is an
old DNS host whose screen cannot hold a long TXT value. (A 2048-bit key is longer than 255 characters, the most one
piece of a TXT record can hold, so a good DNS host splits it into pieces for you; see the [mistakes](#common-mistakes).)

!!! warning "Publishing the key is only half of it: you must also ACTIVATE it"
    Putting the public key in DNS does nothing on its own. You must also tell your email provider to **start
    signing**. In Google Workspace this is the **Start authentication** button (Admin console → Apps → Google
    Workspace → Gmail → **Authenticate email**). Until it is clicked, Google keeps signing with its *own* default
    key, which does not carry your domain's name. In Microsoft 365 the equivalent is the switch that enables DKIM
    for the domain in the Microsoft Defender portal.

## DMARC: the rulebook

SPF and DKIM each answer a narrow question. **DMARC** (Domain-based Message Authentication, Reporting and
Conformance) ties them together and adds two things: **a rulebook** telling receivers what to do when the checks
fail, and **reports** telling you what is happening.

The DMARC record always lives at the name `_dmarc.<your domain>`:

```text
_dmarc.maplehill.example   TXT   "v=DMARC1; p=none; rua=mailto:dmarc-reports@maplehill.example"
```

| Part | Meaning |
|---|---|
| `v=DMARC1` | "This is a DMARC record." |
| `p=none` | the **policy**: what to do with mail that fails. See the three choices below. |
| `rua=mailto:…` | "Send a daily summary report (an *aggregate report*) to this address." Optional but very useful. |

**The three policies**, from gentle to strict:

| Policy | What the receiver does with failing mail | When to use it |
|---|---|---|
| `p=none` | delivers it as normal, but includes it in reports | the start: you watch and learn, nothing is lost |
| `p=quarantine` | puts it in the **spam/junk** folder | after the reports show all your real mail passes |
| `p=reject` | **refuses** it outright | the goal: nobody can send mail pretending to be you |

Even `p=none` matters a great deal: the big providers require a DMARC record to *exist*, and `p=none` is enough to
meet that rule. It is the safe first step.

!!! info "What the reports look like"
    Aggregate reports arrive as small zipped XML files, one per receiving company per day, listing which servers
    sent mail with your name and whether each passed. They are not meant to be read by eye; free and paid services
    (search for "DMARC report analyser") turn them into simple charts. Use a separate mailbox or group for them,
    because there can be many.

### How the three work together: alignment

Here is the clever part. SPF checks the hidden envelope sender. DKIM checks the domain written in the signature
(`d=`). Neither, on its own, checks the **From** address a parent actually sees. A scammer could send mail that
passes SPF for *their own* domain while showing `From: office@maplehill.example`.

DMARC closes that gap with **alignment**: it passes only if **at least one** of these is true:

- **SPF passed**, *and* the envelope domain it checked matches the visible From domain; or
- **DKIM passed**, *and* the signing domain (`d=`) matches the visible From domain.

"Matches" normally means the same main domain: `mail.maplehill.example` aligns with `maplehill.example` (this is
called *relaxed* alignment, the default).

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 410" role="img" aria-labelledby="sk-ne-align-t"><title id="sk-ne-align-t">Before the fix, SPF and DKIM passed for Google’s own domains, which do not match the From domain, so DMARC failed; after the fix, DKIM is signed by maplehill.example and DMARC passes</title><defs><filter id="sk-ne-align-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ne-align-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ne-align-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ne-align-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ne-align-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="410" filter="url(#sk-ne-align-paper)"/><g filter="url(#sk-ne-align-pen)"><text x="30" y="44" class="h">DMARC: does a check match From?</text><text x="30" y="84" class="b">before the fix</text><path class="p room" d="M30 100 L310 100 L310 150 L30 150Z"/><text x="42" y="122" class="s">visible From:</text><text x="42" y="142" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">office@maplehill.example</text><text x="42" y="190" class="s">SPF checked:</text><text x="42" y="212" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">maplehill.example: none</text><text x="42" y="258" class="s">DKIM signed by d=</text><text x="42" y="280" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">…gappssmtp.com</text><path class="p red" d="M279 197 L297 215 M297 197 L279 215" style="stroke-width:3"/><text x="278" y="280" class="l">≠</text><path class="p rust" d="M30 310 L310 310 L310 350 L30 350Z"/><text x="170" y="336" class="s" text-anchor="middle">no pass that matches: FAIL</text><text x="330" y="84" class="b">after the fix</text><path class="p room" d="M330 100 L610 100 L610 150 L330 150Z"/><text x="342" y="122" class="s">visible From:</text><text x="342" y="142" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">office@maplehill.example</text><text x="342" y="190" class="s">SPF checked:</text><text x="342" y="212" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">maplehill.example</text><text x="342" y="258" class="s">DKIM signed by d=</text><text x="342" y="280" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">maplehill.example</text><path class="p blue" d="M576 205 L583 213 L596 196" style="stroke-width:3"/><path class="p blue" d="M576 273 L583 281 L596 264" style="stroke-width:3"/><path class="p gold" d="M330 310 L610 310 L610 350 L330 350Z"/><text x="470" y="336" class="s" text-anchor="middle">both match: PASS</text><text x="30" y="390" class="s">DMARC passes when SPF or DKIM passes AND its domain matches the From line.</text></g></svg><figcaption>Sketched for this page. Before the fix there was no SPF record to check, and Google signed with its own default domain.</figcaption></figure>

This is exactly why Maple Hill's mail looked fine for years yet failed in the end. SPF had nothing to check (there
was no SPF record), and Google had been signing every message with **Google's own** default domain, not
`maplehill.example`. The signature was valid, but it did not *align*, and there was no DMARC record at all.

## Why it broke now

None of these three checks is new: SPF and DKIM were standardised in the 2000s, DMARC in 2015. For years they were
recommended, not required, so a school could live without them. Then the largest mailbox providers turned the
recommendations into rules:

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 290" role="img" aria-labelledby="sk-ne-timeline-t"><title id="sk-ne-timeline-t">Timeline: October 2023 Google and Yahoo announce rules; February 2024 they start checking; May 2025 Outlook sends failing mail to Junk; November 2025 Gmail rejects more; 2026 small senders report 550 bounces</title><defs><filter id="sk-ne-timeline-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ne-timeline-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ne-timeline-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ne-timeline-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ne-timeline-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="290" filter="url(#sk-ne-timeline-paper)"/><g filter="url(#sk-ne-timeline-pen)"><text x="30" y="44" class="h">From advice to rules</text><path class="p" d="M40 170 L610 170" marker-end="url(#sk-ne-timeline-ah)"/><circle cx="90" cy="170" r="7" class="p gold"/><text x="90" y="100" class="l" text-anchor="middle">Oct 2023</text><text x="90" y="122" class="s" text-anchor="middle">Google and Yahoo</text><text x="90" y="142" class="s" text-anchor="middle">announce rules</text><circle cx="205" cy="170" r="7" class="p gold"/><text x="205" y="215" class="l" text-anchor="middle">Feb 2024</text><text x="205" y="237" class="s" text-anchor="middle">Gmail and Yahoo</text><text x="205" y="257" class="s" text-anchor="middle">start checking</text><circle cx="335" cy="170" r="7" class="p gold"/><text x="335" y="100" class="l" text-anchor="middle">May 2025</text><text x="335" y="122" class="s" text-anchor="middle">Outlook / Hotmail:</text><text x="335" y="142" class="s" text-anchor="middle">fails go to Junk</text><circle cx="450" cy="170" r="7" class="p gold"/><text x="450" y="215" class="l" text-anchor="middle">Nov 2025</text><text x="450" y="237" class="s" text-anchor="middle">Gmail starts</text><text x="450" y="257" class="s" text-anchor="middle">rejecting more</text><circle cx="555" cy="170" r="7" class="p gold"/><text x="555" y="100" class="l" text-anchor="middle">2026</text><text x="555" y="122" class="s" text-anchor="middle">small senders</text><text x="555" y="142" class="s" text-anchor="middle">see 550 bounces</text></g></svg><figcaption>Sketched for this page. Dates from the providers’ own pages, listed in Sources.</figcaption></figure>

| When | Who | What changed |
|---|---|---|
| October 2023 | Google and Yahoo | Both announce new rules for anyone sending to their users. |
| **1 February 2024** | **Google (Gmail)** | Every sender must pass **SPF or DKIM**. "Bulk senders" (close to 5,000 or more messages a day to Gmail) must have **SPF and DKIM and a DMARC record** (`p=none` is enough), with one of them aligned. |
| **February 2024**, rolled out gradually | **Yahoo** (and AOL) | The same idea: SPF or DKIM for everyone; SPF, DKIM and DMARC for bulk senders. Yahoo does not publish a fixed number for "bulk". |
| **5 May 2025** | **Microsoft** (Outlook.com, Hotmail, Live) | Domains sending more than 5,000 messages a day must pass SPF, DKIM and DMARC (`p=none` or stricter, aligned). Failing mail first goes to **Junk**; Microsoft said **rejection** would follow, with the code `550 5.7.515`. |
| **November 2025** | **Google** | Gmail starts "ramping up enforcement": non-compliant mail now meets temporary and permanent rejections. |

So why did a *small* school, far below 5,000 messages a day, get caught? Unknown in full, because the providers do
not publish every rule they apply. What is visible: since late 2025 many small senders have reported rejections
from Microsoft and Yahoo with wording like Maple Hill's, and Microsoft's own help forum is full of such questions.
The safe reading is simple: **treat SPF, DKIM and DMARC as required for every domain that sends email**, whatever
its size.

**And why did Gmail still accept the mail?** The most likely reason: Gmail's rule for *small* senders asks only
for SPF **or** DKIM to pass, and every message from Google Workspace already carried a valid DKIM signature made
with Google's own default key. That was enough for Gmail. Gmail's stricter rule, an aligned DMARC pass, applies to
bulk senders. Microsoft and Yahoo were the ones that refused mail without the full set.

## The case study

Here is how Maple Hill's setup looked when the problem was investigated, and what was found.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 425" role="img" aria-labelledby="sk-ne-case-t"><title id="sk-ne-case-t">The domain’s DNS page before the fix had NS, A, MX and an old junk TXT line but no SPF, DKIM or DMARC; after the fix SPF, DKIM and DMARC are added, the junk line removed, and DKIM signing started in Google Admin</title><defs><filter id="sk-ne-case-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ne-case-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ne-case-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ne-case-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ne-case-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="425" filter="url(#sk-ne-case-paper)"/><g filter="url(#sk-ne-case-pen)"><text x="30" y="44" class="h">The domain’s DNS page, before and after</text><text x="450" y="84" class="s" text-anchor="middle">before</text><text x="540" y="84" class="s" text-anchor="middle">after</text><path class="p room" d="M30 96 L610 96 L610 370 L30 370Z"/><text x="44" y="126" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">NS</text><text x="110" y="126" class="s">ns1.opalstack.com</text><path class="p blue" d="M441 121 L448 129 L461 112" style="stroke-width:3"/><path class="p blue" d="M531 121 L538 129 L551 112" style="stroke-width:3"/><text x="44" y="162" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">A</text><text x="110" y="162" class="s">website at Opalstack</text><path class="p blue" d="M441 157 L448 165 L461 148" style="stroke-width:3"/><path class="p blue" d="M531 157 L538 165 L551 148" style="stroke-width:3"/><text x="44" y="198" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">MX</text><text x="110" y="198" class="s">1 smtp.google.com</text><path class="p blue" d="M441 193 L448 201 L461 184" style="stroke-width:3"/><path class="p blue" d="M531 193 L538 201 L551 184" style="stroke-width:3"/><text x="44" y="234" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">SPF</text><text x="110" y="234" class="s"></text><text x="110" y="234" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">v=spf1 include:_spf.google.com …</text><text x="445" y="235" class="l">–</text><path class="p blue" d="M531 229 L538 237 L551 220" style="stroke-width:3"/><text x="44" y="270" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">DKIM</text><text x="110" y="270" class="s"></text><text x="110" y="270" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">google._domainkey: v=DKIM1; p=…</text><text x="445" y="271" class="l">–</text><path class="p blue" d="M531 265 L538 273 L551 256" style="stroke-width:3"/><text x="44" y="306" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">DMARC</text><text x="110" y="306" class="s"></text><text x="110" y="306" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">_dmarc: v=DMARC1; p=none; …</text><text x="445" y="307" class="l">–</text><path class="p blue" d="M531 301 L538 309 L551 292" style="stroke-width:3"/><text x="44" y="342" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">junk</text><text x="110" y="342" class="s"></text><text x="110" y="342" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">an old meaningless TXT line</text><path class="p blue" d="M441 337 L448 345 L461 328" style="stroke-width:3"/><text x="535" y="343" class="l">–</text><text x="30" y="400" class="l">And one click: Start authentication in Google Admin.</text></g></svg><figcaption>Sketched for this page. maplehill.example is a made-up name.</figcaption></figure>

| Piece | Where it was | Fine? |
|---|---|---|
| Domain rented at | Netfirms (registrar) | yes, renewed |
| Nameservers | `ns1.opalstack.com`, `ns2.opalstack.com` | yes: so **all records live at Opalstack** |
| Website (A record) | Opalstack's server | yes |
| Incoming mail (MX) | Google (`smtp.google.com`) | yes: mail *arriving* worked |
| SPF | **none** | no |
| DKIM for Google | **none** (only an old, meaningless TXT line left from an earlier setup) | no |
| DMARC | **none** | no |
| DKIM signing in Google Admin | **never started** | no |

### The fix, in four steps

1. **SPF.** At Opalstack (the DNS host, not Netfirms), one TXT record on the bare domain (name `@` or left blank):
   ```text
   v=spf1 include:_spf.google.com include:spf.opalstack.com ~all
   ```
   Google for staff mail, Opalstack for the website's contact form, soft fail for everyone else.
2. **DKIM.** In Google Admin → Apps → Google Workspace → Gmail → **Authenticate email**, choose the domain, click
   **Generate new record** (2048-bit, selector `google`), and copy the value. At Opalstack, add a TXT record named
   `google._domainkey` with that value, pasted **in one piece**.
3. **DMARC.** At Opalstack, a TXT record named `_dmarc`:
   ```text
   v=DMARC1; p=none; rua=mailto:dmarc-reports@maplehill.example
   ```
4. **Activate.** Back in Google Admin, after the DKIM record is visible in DNS (minutes to a few hours, up to 48),
   click **Start authentication**. The status changes to "Authenticating email with DKIM".

The useless old TXT line was deleted at the same time. A test message to a Hotmail address and a Yahoo address
arrived in the inbox the same day, and Gmail's **Show original** showed `SPF: PASS`, `DKIM: PASS`, `DMARC: PASS`.

## Check your own domain

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 385" role="img" aria-labelledby="sk-ne-steps-t"><title id="sk-ne-steps-t">Six steps: find who keeps your DNS, read the records, add SPF DKIM and DMARC, activate DKIM signing, test with Show original, then tighten DMARC over weeks</title><defs><filter id="sk-ne-steps-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ne-steps-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ne-steps-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ne-steps-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ne-steps-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="385" filter="url(#sk-ne-steps-paper)"/><g filter="url(#sk-ne-steps-pen)"><text x="30" y="44" class="h">Fix your own domain in six steps</text><path class="p room" d="M30 80 L200 80 L200 170 L30 170Z"/><text x="115.0" y="120.0" text-anchor="middle" class="b">1 find</text><text x="115.0" y="142.0" text-anchor="middle" class="s">who keeps your DNS</text><path class="p " d="M202 125 L233 125" marker-end="url(#sk-ne-steps-ah)"/><path class="p room" d="M235 80 L405 80 L405 170 L235 170Z"/><text x="320.0" y="120.0" text-anchor="middle" class="b">2 read</text><text x="320.0" y="142.0" text-anchor="middle" class="s">what is there now</text><path class="p " d="M407 125 L438 125" marker-end="url(#sk-ne-steps-ah)"/><path class="p gold" d="M440 80 L610 80 L610 170 L440 170Z"/><text x="525.0" y="120.0" text-anchor="middle" class="b">3 add</text><text x="525.0" y="142.0" text-anchor="middle" class="s">SPF, DKIM, DMARC</text><path class="p " d="M525 172 L525 226" marker-end="url(#sk-ne-steps-ah)"/><path class="p gold" d="M440 230 L610 230 L610 320 L440 320Z"/><text x="525.0" y="270.0" text-anchor="middle" class="b">4 activate</text><text x="525.0" y="292.0" text-anchor="middle" class="s">DKIM signing</text><path class="p " d="M438 275 L407 275" marker-end="url(#sk-ne-steps-ah)"/><path class="p room" d="M235 230 L405 230 L405 320 L235 320Z"/><text x="320.0" y="270.0" text-anchor="middle" class="b">5 test</text><text x="320.0" y="292.0" text-anchor="middle" class="s">“Show original”</text><path class="p " d="M233 275 L202 275" marker-end="url(#sk-ne-steps-ah)"/><path class="p room" d="M30 230 L200 230 L200 320 L30 320Z"/><text x="115.0" y="270.0" text-anchor="middle" class="b">6 tighten</text><text x="115.0" y="292.0" text-anchor="middle" class="s">DMARC, over weeks</text><text x="30" y="365" class="s">Steps 3 and 4 go together: a key in DNS does nothing until signing starts.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

### 1. Find who keeps your DNS

Look up your domain's registration record (*WHOIS*, now also called *RDAP*) at **lookup.icann.org**, or any
"WHOIS lookup" site. Find the line **Name Server**. Its name tells you your DNS host:

| Nameservers look like | Your DNS is at |
|---|---|
| `ns1.opalstack.com` | Opalstack |
| `ns-cloud-a1.googledomains.com` or `ns-….awsdns-….` | Google Cloud DNS, Amazon Route 53 |
| `…ns.cloudflare.com` | Cloudflare |
| `ns1.netfirms.com`, `ns….domaincontrol.com` | the registrar itself (Netfirms, GoDaddy) |

Log in **there** for every change below.

### 2. Read your current records

Use a free checker. Good ones:

- **dns.google** (Google's public lookup page): type `maplehill.example` and choose `TXT`, then `MX`; type
  `_dmarc.maplehill.example` with `TXT`; type `google._domainkey.maplehill.example` with `TXT`.
- **MXToolbox** (mxtoolbox.com): "SPF Record Lookup", "DKIM Lookup" (give the selector), "DMARC Lookup"; it also
  explains each problem in words.
- From a command line: `nslookup -type=TXT maplehill.example` or `dig TXT _dmarc.maplehill.example +short`.

Write down what you find, especially any existing `v=spf1` record: you will **edit** it, not add a second one.

### 3. Add the records

=== "Google Workspace"

    | Name | Type | Value |
    |---|---|---|
    | `@` (the bare domain) | MX | `1 smtp.google.com` (older setups list five `aspmx` servers; those still work) |
    | `@` | TXT | `v=spf1 include:_spf.google.com ~all` (add other senders as more `include:` parts) |
    | `google._domainkey` | TXT | the key from Admin console → Gmail → **Authenticate email** |
    | `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:you@yourdomain` |

    Then click **Start authentication** in the Admin console.

=== "Microsoft 365"

    | Name | Type | Value |
    |---|---|---|
    | `@` | MX | the value Microsoft 365 shows you under *Settings → Domains* (it ends in `mail.protection.outlook.com`) |
    | `@` | TXT | `v=spf1 include:spf.protection.outlook.com ~all` |
    | `selector1._domainkey` and `selector2._domainkey` | **CNAME** (not TXT) | the two values shown in the Defender portal's DKIM page; Microsoft keeps the keys and rotates them for you |
    | `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:you@yourdomain` |

    Then turn on **Sign messages for this domain with DKIM signatures** for the domain in the Defender portal
    (Email & collaboration → Policies & rules → Threat policies → Email authentication settings → DKIM).

!!! tip "Other services that send as you"
    Newsletter tools, school-management systems, online forms, the photocopier: anything that sends mail with
    `@yourdomain` in the From line needs its own `include:` in your one SPF record, and ideally its own DKIM
    selector. Each service's help pages give the exact values.

### 4. Wait, then test

DNS changes reach the world as old cached answers expire: usually within minutes to an hour, at most the record's
**TTL** (often 3,600 seconds = 1 hour), occasionally up to two days.

Then send a test message from your domain to a Gmail address. In Gmail, open it, click the **⋮** (three dots) menu
and choose **Show original**. The top of that page shows three lines:

```text
SPF:    PASS with IP 209.85.220.41
DKIM:   'PASS' with domain maplehill.example
DMARC:  'PASS'
```

The DKIM line must name **your** domain. If it names something like `…gappssmtp.com`, Google is still using its
default key: go back and click **Start authentication**. Send a second test to an Outlook.com or Hotmail address
and check it lands in the inbox. Free testers such as **mail-tester.com** give a score and a list of problems.

### 5. Later: tighten DMARC

After two to four weeks of reports showing that all your real mail passes, move one step at a time:

```text
p=none  →  p=quarantine  →  p=reject
```

Wait a few weeks at each step and keep reading the reports. `p=reject` is the goal: it makes it very hard for
anyone to send fake mail in your school's name, which protects parents from scams that pretend to be you. If you
want to go gently, `pct=25` applies the policy to a quarter of failing mail first.

<figure class="sketch sketch-wide"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 350" role="img" aria-labelledby="sk-ne-ladder-t"><title id="sk-ne-ladder-t">Three steps: p=none to watch reports, then p=quarantine sending fakes to junk, then p=reject refusing them, a few weeks apart</title><defs><filter id="sk-ne-ladder-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ne-ladder-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ne-ladder-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ne-ladder-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ne-ladder-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="350" filter="url(#sk-ne-ladder-paper)"/><g filter="url(#sk-ne-ladder-pen)"><text x="30" y="44" class="h">Climb one step at a time</text><path class="p room" d="M30 240 L220 240 L220 330 L30 330Z"/><text x="44" y="270" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">p=none</text><text x="44" y="298" class="s">watch the reports</text><text x="36" y="226" class="s">after a few weeks</text><path class="p dash" d="M170 210 Q205 200 224 178" marker-end="url(#sk-ne-ladder-ah)"/><path class="p room" d="M230 170 L420 170 L420 330 L230 330Z"/><text x="244" y="200" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">p=quarantine</text><text x="244" y="228" class="s">fakes go to junk</text><text x="236" y="156" class="s">after a few weeks</text><path class="p dash" d="M370 140 Q405 130 424 108" marker-end="url(#sk-ne-ladder-ah)"/><path class="p gold" d="M430 100 L620 100 L620 330 L430 330Z"/><text x="444" y="130" style="font-family:'IBM Plex Mono',monospace;font-size:14px;font-style:normal;fill:#3a2a1e">p=reject</text><text x="444" y="158" class="s">fakes are refused</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## Common mistakes

| Mistake | What goes wrong | Do instead |
|---|---|---|
| **Two SPF records** (one per service) | SPF returns an error; receivers may treat you as having none | one `v=spf1` record with several `include:` parts |
| **DKIM pasted with line breaks or extra quotes** | the key no longer decodes; every DKIM check fails | paste the value exactly as given, in one line; let the DNS host split long values itself; check with a DKIM lookup |
| **Records edited at the registrar while the nameservers point elsewhere** | the changes are invisible to the world | find the nameservers first ([step 1](#1-find-who-keeps-your-dns)) and edit there |
| **Clicking "Generate new record" after DNS is set** | Google makes a new key; the one in DNS no longer matches, so DKIM fails | generate once; if you do generate again, update DNS with the new value before signing starts |
| **Forgetting to activate DKIM** | the key sits in DNS, unused; mail is still signed with the provider's default domain, so DMARC does not align | click **Start authentication** (Google) or enable signing (Microsoft) |
| **Jumping straight to `p=reject`** | a forgotten sender (newsletter, form) is suddenly blocked | start at `p=none`, read reports, then tighten |
| **Too many `include:` parts** | more than 10 lookups: SPF error | remove services you no longer use; ask a provider for a combined include |
| **Name typed with the domain twice** | the record ends up at `_dmarc.maplehill.example.maplehill.example` | many DNS screens add your domain automatically: type only `_dmarc` |

## Glossary

**Alignment**
: The DMARC rule that the domain checked by SPF or DKIM must match the domain in the visible From address.

**A record**
: A DNS record giving the IPv4 address of a name, such as the computer serving your website. (**AAAA** is the same for IPv6.)

**Bounce / 550 error**
: A message sent back when mail is not delivered. Codes beginning with 5 (like 550) are permanent refusals; codes beginning with 4 are temporary.

**DKIM**
: DomainKeys Identified Mail: a digital signature added by the sending server, checked with a public key published in DNS. The wax seal.

**DMARC**
: Domain-based Message Authentication, Reporting and Conformance: a DNS record that says what receivers should do when SPF and DKIM fail to align (none, quarantine, reject) and where to send reports. The rulebook.

**DNS**
: The Domain Name System: the internet's phone book, which turns names into addresses and holds other facts about each domain.

**Domain**
: A name on the internet, such as `maplehill.example`, rented from a registrar.

**DNS host**
: The company whose nameservers hold your domain's records.

**MX record**
: Mail exchanger: a DNS record naming the server that receives email for a domain. The number before it is a priority (lower is tried first).

**Nameserver**
: A computer that answers DNS questions for a domain. The registrar records which nameservers are yours.

**Propagation / TTL**
: TTL (time to live) is how long, in seconds, other computers may remember a DNS answer. "Propagation" is the wait while old remembered answers expire after a change.

**Registrar**
: A company accredited to rent out domain names and record their nameservers.

**Selector**
: The label in front of `._domainkey` that names one DKIM key, such as `google` in `google._domainkey.maplehill.example`.

**SPF**
: Sender Policy Framework: a TXT record listing the servers allowed to send mail for a domain. The guest list.

**TXT record**
: A DNS record holding free text; SPF, DKIM and DMARC are all TXT records.

## Keep reading

- [How DNS works](How-DNS-Works.md): what happens in the half-second between typing a name and getting an answer, and who runs DNS for the whole world.
- [How a web page reaches you](How-a-Page-Reaches-You.md): addresses, routers, HTTPS and the journey of one click.
- [DNS: names to addresses](../topics/DNS.md) (the expert guide) and [Email, streaming and CDNs](../books/networks/20-Email-Streaming-and-CDNs.md) in the networks book.

??? info "Sources"
    - Google, *Email sender guidelines* and *Email sender guidelines FAQ* (Gmail Help, support.google.com/mail/answer/81126 and support.google.com/a/answer/14229414): requirements from 1 February 2024; bulk senders close to 5,000 messages a day; enforcement ramping up from November 2025. Checked 8 November 2026.
    - Google, *New Gmail protections for a safer, less spammy inbox* (blog.google, October 2023).
    - Yahoo, *Sender Best Practices* (senders.yahooinc.com/best-practices) and Postmaster blog, *More Secure, Less Spam* (2023): SPF or DKIM for all senders, SPF, DKIM and DMARC for bulk senders, from February 2024, rolled out gradually; DKIM keys of at least 1024 bits.
    - Microsoft, *Strengthening Email Ecosystem: Outlook's New Requirements for High-Volume Senders* (Microsoft Tech Community, April 2025): more than 5,000 messages a day; from 5 May 2025 to Junk, rejection later with `550 5.7.515`. Microsoft Support, *Fix NDR error "550 5.7.515" in Outlook.com*.
    - Microsoft Q&A forum, threads on "550 5.7.1 Message rejected: Message lacks SPF/DKIM/DMARC Auth Records" (2026): reports from small senders.
    - Google Workspace Admin Help, *Set up DKIM* and *Turn on DKIM for your domain* (selector `google`, 2048-bit keys, Start authentication, up to 48 hours). Microsoft Learn, *Set up DKIM to sign mail from your Microsoft 365 domain* and *Set up SPF*.
    - RFC 7208 (SPF: one record, 10-lookup limit), RFC 6376 (DKIM), RFC 7489 (DMARC), RFC 2606 (`.example` kept for examples), RFC 5321 and RFC 3463 (reply and status codes).
