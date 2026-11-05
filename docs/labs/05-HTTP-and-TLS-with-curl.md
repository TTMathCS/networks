# Lab 5. HTTP and TLS with curl

*Behind every web page are a TLS handshake and a few lines of HTTP. In this lab you watch both: the request and response headers, redirects, HTTP/2 and HTTP/3, timing of each phase, and the server's certificate chain, using curl and openssl.*

!!! abstract "In this lab"
    **You will:** see HTTP requests and responses with `curl -v`; follow redirects; read security headers; time DNS,
    TCP, TLS and the first byte; open a TLS connection with `openssl s_client`; read a certificate chain; check which
    TLS versions a server accepts.

    **You need:** [Lab 1](01-Your-Lab.md) or any computer with curl and openssl (macOS and Windows 10+ include curl);
    [networks book, chapter 19](../books/networks/19-HTTP-and-QUIC.md); [security book, chapter 8](../books/security/08-TLS-and-HTTPS.md). Time: 30 minutes.

## 1. Look at HTTP

```bash
curl -sv https://example.com -o /dev/null
```

Lines starting with `*` are curl's notes (connecting, the TLS handshake); `>` are the request you sent; `<` the
response. You will see something like:

```
> GET / HTTP/2
> Host: example.com
> User-Agent: curl/8.5.0
> Accept: */*
< HTTP/2 200
< content-type: text/html
< cache-control: max-age=...
```

Just the response headers: `curl -sI https://www.akadian.ca`.

## 2. Redirects and HTTPS

```bash
curl -sI http://github.com | head -3
curl -sIL http://github.com | grep -iE "^(HTTP|location)"
```

The plain-HTTP request gets `301 Moved Permanently` with a `Location: https://...` header; `-L` follows it. Now look
for security headers on a large site:

```bash
curl -sI https://github.com | grep -iE "strict-transport|content-security|x-content-type|referrer"
```

`strict-transport-security` is HSTS: the browser will never use plain HTTP for this site again for `max-age` seconds.

## 3. Timing each phase

curl can report when each step finished:

```bash
curl -so /dev/null -w "dns %{time_namelookup}\ntcp %{time_connect}\ntls %{time_appconnect}\nfirst byte %{time_starttransfer}\ntotal %{time_total}\n" https://www.wikipedia.org
```

Each number is cumulative seconds from the start. TCP minus DNS is about one RTT (the handshake); TLS minus TCP is the
TLS handshake (one RTT for TLS 1.3); first byte minus TLS is the server's thinking time plus one RTT. Run it twice:
the second DNS time is usually near zero (cached).

## 4. HTTP/2 and HTTP/3

```bash
curl -s -o /dev/null -w "%{http_version}\n" https://www.cloudflare.com
curl -s -o /dev/null -w "%{http_version}\n" --http1.1 https://www.cloudflare.com
curl -s -o /dev/null -w "%{http_version}\n" --http3 https://www.cloudflare.com
```

The last works only if your curl was built with HTTP/3 support (`curl -V` lists `HTTP3` under features). HTTP/3 runs
over QUIC on UDP.

## 5. The TLS handshake with openssl

```bash
openssl s_client -connect www.akadian.ca:443 -servername www.akadian.ca </dev/null
```

Read the output from the top:

- **Certificate chain**: `0 s:` is the server's certificate (subject) and `i:` who issued it; `1 s:` the intermediate;
  the root is in your system's trust store and usually not sent.
- **Server certificate** in PEM form.
- `Protocol: TLSv1.3`, `Cipher: TLS_AES_256_GCM_SHA384` (or similar), and `Peer signature type`.
- `Server Temp Key: X25519` (or a hybrid such as `X25519MLKEM768` with recent OpenSSL and servers): the ephemeral key
  exchange.
- `Verify return code: 0 (ok)`: the chain checked out.

`-servername` sends SNI, so a server hosting many sites returns the right certificate.

## 6. Read the certificate

```bash
openssl s_client -connect www.akadian.ca:443 -servername www.akadian.ca </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

You see the name, the issuing CA, the validity dates (Let's Encrypt certificates last at most 90 days), and the
**Subject Alternative Names**: the list of host names the certificate is valid for.

## 7. Versions and failures

```bash
openssl s_client -connect example.com:443 -tls1_3 </dev/null 2>/dev/null | grep Protocol
openssl s_client -connect example.com:443 -tls1_1 </dev/null 2>&1 | tail -2
```

Modern servers accept TLS 1.3 and 1.2 and refuse 1.1 (your own OpenSSL may also refuse to try). See what a broken
certificate looks like using the test site badssl.com:

```bash
curl -s https://expired.badssl.com     ; echo "exit $?"
curl -s https://wrong.host.badssl.com  ; echo "exit $?"
```

curl refuses both (exit code 60: certificate problem). That refusal is TLS doing its job against an on-path attacker.
Never "fix" it with `-k` outside a lab.

## Check yourself

??? question "1. In the timing output, TCP connect is at 0.050 s and DNS at 0.010 s. About what is the RTT?"
    About 40 ms: the TCP handshake takes one round trip after DNS finishes.

??? question "2. What does the subjectAltName list tell you?"
    The exact host names (and wildcards) the certificate is valid for; the client checks the name it wanted is in it.

??? question "3. Why does openssl need -servername?"
    To send SNI, so a server with many sites on one address knows which certificate to present.

??? question "4. What does exit code 60 from curl mean, and why is `-k` dangerous?"
    The server's certificate could not be verified; `-k` skips verification and would let an attacker in the middle present any certificate.

??? info "Sources"
    - curl manual (curl.se/docs), `openssl-s_client(1)`, `openssl-x509(1)`; RFC 9110 (HTTP semantics), RFC 9113 (HTTP/2), RFC 9114 (HTTP/3), RFC 8446 (TLS 1.3), RFC 6797 (HSTS).
    - badssl.com test site (Chromium project).
