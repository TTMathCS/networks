# 14. Web application security

*Most of what people do on a network goes through web applications and APIs, and that is where most attacks land once the network layers are secure. This chapter gives a network engineer's tour: the browser's security model, injection, cross-site scripting and request forgery, server-side request forgery, authentication and session flaws, API security, and the headers and tools that help.*

!!! abstract "In this chapter"
    **You will learn:** the same-origin policy and CORS; the OWASP Top 10; SQL injection and parameterised queries;
    XSS and Content Security Policy; CSRF and SameSite cookies; SSRF and cloud metadata; session and access-control
    flaws; API security; security headers; web application firewalls.

    **You need:** networks book [chapter 19](../networks/19-HTTP-and-QUIC.md); [Chapter 8](08-TLS-and-HTTPS.md).

## 14.1 The browser's model

A web page from one **origin** (scheme + host + port, such as `https://bank.example:443`) may not read data from
another origin: the **same-origin policy**. It is what stops a page you visit from reading your email in another tab.
**CORS** (cross-origin resource sharing) lets a server opt in to being read by named other origins; a misconfigured CORS
policy that reflects any origin and allows credentials undoes the protection.

**Cookies** carry sessions. Flags harden them: `Secure` (only over HTTPS), `HttpOnly` (scripts cannot read it),
`SameSite=Lax` or `Strict` (not sent on most cross-site requests).

## 14.2 The OWASP Top 10

The Open Worldwide Application Security Project publishes a list of the most important risk categories, updated every
few years from data across many applications. The 2021 list:

1. Broken access control
2. Cryptographic failures
3. Injection (including XSS)
4. Insecure design
5. Security misconfiguration
6. Vulnerable and outdated components
7. Identification and authentication failures
8. Software and data integrity failures
9. Security logging and monitoring failures
10. Server-side request forgery

A 2025 edition kept broken access control first and added software supply chain failures and mishandling of
exceptional conditions. The point for a network engineer: most items are not fixed by the network; they need secure
code and configuration.

## 14.3 Injection

**Injection** happens when data is mixed into a command and changes its meaning. The classic is **SQL injection**:

```python
# unsafe: the input becomes part of the SQL
cur.execute("SELECT * FROM users WHERE name = '" + name + "'")
# input  ' OR '1'='1  returns every user
```

The fix is **parameterised queries**, which send the command and the data separately so data can never become code:

```python
cur.execute("SELECT * FROM users WHERE name = %s", (name,))
```

The same idea applies to operating-system commands, LDAP queries and templates: never build commands by gluing
strings; use APIs that keep data separate.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 360" role="img" aria-labelledby="sk-ns-inject-t"><title id="sk-ns-inject-t">A query glued together with typed text becomes a different command; a parameterised query sends the command and the data separately</title><defs><filter id="sk-ns-inject-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ns-inject-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ns-inject-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ns-inject-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ns-inject-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="360" filter="url(#sk-ns-inject-paper)"/><g filter="url(#sk-ns-inject-pen)"><text x="30" y="44" class="h">Keep data out of the command</text><text x="30" y="90" class="l">glued together</text><text x="30" y="122" style="font-family:'IBM Plex Mono',monospace;font-size:12.5px;fill:#3a2a1e">SELECT * FROM users WHERE name = '</text><text x="296" y="122" style="font-family:'IBM Plex Mono',monospace;font-size:12.5px;fill:#a03a2a">' OR '1'='1</text><text x="380" y="122" style="font-family:'IBM Plex Mono',monospace;font-size:12.5px;fill:#3a2a1e">'</text><path class="p red" d="M296 130 L378 130"/><text x="30" y="156" class="s">The red part was typed into the name box. It became part of the command: now every user matches.</text><text x="30" y="230" class="l">sent apart</text><path class="p room" d="M30 250 L330 250 L330 300 L30 300Z"/><text x="180.0" y="281.0" text-anchor="middle" class="s">command: … WHERE name = %s</text><path class="p gold" d="M370 250 L570 250 L570 300 L370 300Z"/><text x="470.0" y="281.0" text-anchor="middle" class="s">data: anything typed</text><text x="30" y="340" class="s">The database fills the slot with the data as plain text, so it can never become code.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

<figure class="play" data-play="sqli"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> Type a name, or press the button for the classic attack, and switch between the unsafe and the parameterised query. The three-user table is made up.</figcaption></figure>

## 14.4 Cross-site scripting and request forgery

**Cross-site scripting** (XSS): an attacker gets their script into a page others view (a comment containing
`<script>`), and it runs with the site's origin, reading what the victim sees and acting as them. Defences: escape
output for its context (modern templating frameworks do it by default), and a **Content Security Policy** (CSP) header
that tells the browser which scripts may run, such as `Content-Security-Policy: script-src 'self'`, so injected inline
scripts are refused.

**Cross-site request forgery** (CSRF): a malicious page makes the victim's browser send a request to another site
where they are logged in ("transfer 100 dollars"), and the browser adds the cookie automatically. Defences:
`SameSite` cookies (browsers now default to Lax), anti-CSRF tokens in forms, and checking the `Origin` header.

## 14.5 Server-side request forgery

In **SSRF**, an attacker makes the server fetch a URL of their choosing ("import a picture from this link"), reaching
places only the server can: internal admin pages, or the cloud **metadata service** at `169.254.169.254`, which hands
out the server's temporary cloud credentials. The 2019 Capital One breach used SSRF this way to read over 100 million
customer records from cloud storage. Defences: allow-lists of destinations; blocking internal and link-local addresses
(after resolving names, to defeat DNS tricks); cloud metadata protections such as AWS's IMDSv2, which needs a session
token from a PUT request that simple SSRF cannot make; and egress filtering (Chapter 11).

## 14.6 Sessions, access control and APIs

**Broken access control** tops the list because it is easy to get wrong: an API returns order 1234 to anyone who asks
for `/api/orders/1234` without checking it belongs to them (**IDOR**, insecure direct object reference). Every request
must check authorisation on the server, never rely on what the user interface hides.

Sessions need long random identifiers, renewal at login (against session fixation), expiry, and logout that really ends
them on the server. **JSON Web Tokens** must have their signatures checked with a fixed algorithm (old libraries
accepted `"alg": "none"`).

**APIs** add their own risks (OWASP has a separate API Security Top 10): object- and function-level authorisation,
unrestricted resource use (no rate limits, Chapter 13), and exposing more data than the client needs. An API gateway
can enforce authentication, schemas and rate limits centrally.

## 14.7 Headers, WAFs and the supply chain

Useful response headers: `Strict-Transport-Security` (Chapter 8), `Content-Security-Policy`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `frame-ancestors` in CSP (against clickjacking). A **web
application firewall** (WAF) inspects HTTP requests and blocks known attack patterns; it buys time ("virtual patching")
but cannot fix logic flaws like IDOR.

Modern applications are mostly other people's code: hundreds of open-source packages. **Vulnerable components** (Log4Shell
in December 2021, a remote-code flaw in the Log4j logging library present in countless Java applications) and
**poisoned packages** (typosquatted or hijacked libraries) are now major risks. Defences: a software bill of materials
(**SBOM**), automated dependency scanning and updates, and verifying build provenance (frameworks such as SLSA).

## Check yourself

??? question "1. Why do parameterised queries stop SQL injection?"
    The query text and the data are sent separately; the database never parses the data as SQL, whatever characters it contains.

??? question "2. What does SameSite=Lax do against CSRF?"
    The browser does not attach the cookie to cross-site sub-requests and form POSTs from other sites, so a forged request arrives without the session.

??? question "3. Why is 169.254.169.254 important in SSRF attacks?"
    It is the cloud instance metadata service, which can hand out the server's temporary cloud credentials to anything that can make the server request it.

??? question "4. Can a WAF fix an IDOR flaw? Why?"
    Generally no: the requests are well-formed and look normal; only the application knows whether the object belongs to the user.

??? info "Sources"
    - OWASP Top 10 (2021, 2025 editions), OWASP API Security Top 10 (2023), OWASP Cheat Sheet Series.
    - RFC 6454 (origin), RFC 6265 and RFC 6265bis (cookies), W3C *Content Security Policy Level 3*, Fetch Standard (CORS).
    - US Department of Justice and Capital One public statements on the 2019 breach; CISA guidance on Log4j (CVE-2021-44228).
    - SLSA framework (slsa.dev); NTIA, *The Minimum Elements for a Software Bill of Materials* (2021).
