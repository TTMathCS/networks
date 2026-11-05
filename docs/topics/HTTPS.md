# How HTTPS keeps a page private

*What the lock in your browser means, what it does not mean, and how to set HTTPS up on a server. Four parts: stop at the one you need.*

[In one minute](#in-one-minute) · [Do it](#do-it) · [Expert](#expert) · [Now and next](#now-and-next)

## In one minute

When the address starts with **https://** and the browser shows no warning, two things are true. First, everything
between you and the website is **scrambled** (encrypted), so people on the same Wi-Fi, your internet provider, or
anyone in between cannot read or change it. Second, the website **proved its name** with a certificate signed by an
organisation your browser trusts, so you really are talking to `yourbank.com` and not an impostor in the middle.

What it does **not** mean: that the site is honest. A phishing site at `y0urbank-login.com` can have a perfectly good
lock. Check the name in the address bar, not just the lock.

## Do it

**As a visitor:**

- Never click through a certificate warning on a site where you log in or pay; it is exactly what an attacker in the
  middle causes.
- Check the address is the site you meant; bookmarks are safer than links in messages.
- Turn on your browser's "HTTPS-only" mode (Firefox, Chrome, Edge and Safari all have one).

**As a site owner** (Linux server with nginx or Apache):

1. Point your domain's DNS at the server.
2. Get a free certificate from **Let's Encrypt** with an ACME client, which also renews it automatically:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d example.com -d www.example.com
   ```
   (or use Caddy, which does HTTPS automatically).
3. Redirect all http:// to https:// (certbot offers this).
4. Add HSTS once everything works over HTTPS:
   `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`
5. Test: `curl -sI https://example.com`, and an online TLS checker such as SSL Labs.

Hosting platforms (GitHub Pages, Cloudflare, Netlify and others) do all of this for you; this site gets its certificate
the same way.

## Expert

**Protocol.** Use TLS 1.3 (RFC 8446), with TLS 1.2 for older clients only with ECDHE and AEAD suites. TLS 1.3 needs one
round trip, always gives forward secrecy, and sends the certificate encrypted
([security book, chapter 8](../books/security/08-TLS-and-HTTPS.md)). See the handshake yourself with
`openssl s_client` ([Lab 5](../labs/05-HTTP-and-TLS-with-curl.md)).

**Certificates.** Domain-validated certificates from an ACME CA are standard; extended validation adds nothing visible in
browsers any more. Serve the full chain (leaf + intermediates). Add a **CAA** DNS record naming your CA. Watch
**Certificate Transparency** logs (crt.sh or a monitoring service) for certificates you did not request.

**A good nginx baseline** (Mozilla "intermediate" profile, simplified):

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
ssl_prefer_server_ciphers off;
ssl_session_tickets off;
add_header Strict-Transport-Security "max-age=63072000" always;
```

**Common mistakes:** missing intermediate certificate (works in your browser, fails in apps); certificate renewal not
automated, or automated but the web server not reloaded; mixed content (an https page loading http scripts, which
browsers block); HSTS `preload` with `includeSubDomains` before every subdomain supports HTTPS; apps that disable
certificate checking "for testing" and ship that way; TLS terminated at a load balancer with plain HTTP to the servers
across an untrusted network.

**What still leaks:** the IP address, the server name in SNI (unless ECH is used), and the size and timing of traffic.

## Now and next

*Last checked: 5 November 2026.*

- **Post-quantum key exchange** is on by default in Chrome, Firefox, Edge and Safari, and at large CDNs: the hybrid
  **X25519MLKEM768** protects today's traffic against future quantum computers. OpenSSL 3.5 (April 2025) supports it.
- **Shorter certificates:** the CA/Browser Forum voted in 2025 to cut maximum certificate lifetime in steps from 398
  days to 47 days by March 2029; Let's Encrypt offers six-day certificates. Automation is no longer optional.
- **Encrypted Client Hello** hides the site name; supported in major browsers and at Cloudflare, standardised at the
  IETF in 2025.
- **Post-quantum certificates** (ML-DSA) are larger; work on Merkle tree certificates and trust anchor negotiation aims
  to keep handshakes small.

??? info "Sources"
    - RFC 8446 (TLS 1.3), RFC 8555 (ACME), RFC 6797 (HSTS), RFC 8659 (CAA), RFC 9162 (Certificate Transparency).
    - Mozilla, *Server Side TLS* and SSL Configuration Generator (ssl-config.mozilla.org); Let's Encrypt documentation.
    - CA/Browser Forum Ballot SC-081v3 (2025); OpenSSL 3.5 release notes.
