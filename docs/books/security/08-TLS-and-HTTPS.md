# 8. TLS and HTTPS

*TLS is the lock icon: it protects the web, email between servers, APIs, and much more. This chapter shows what TLS 1.3 does in its handshake, how the browser decides to trust a server, the attacks that shaped the protocol, and how to configure a server well today.*

!!! abstract "In this chapter"
    **You will learn:** what TLS guarantees; the TLS 1.3 handshake step by step; certificate checking; HSTS;
    the historical attacks (BEAST, Heartbleed, POODLE, downgrade, FREAK/Logjam); 0-RTT and its replay risk;
    Encrypted Client Hello; QUIC; mutual TLS; a good configuration.

    **You need:** [Chapter 3](03-The-Cryptography-Toolkit.md); networks book [chapter 19](../networks/19-HTTP-and-QUIC.md).

## 8.1 What TLS promises

Between a client and a server, over any reliable byte stream, **TLS** (Transport Layer Security; formerly SSL) gives:
**confidentiality** (AEAD encryption), **integrity** (any change is detected) and **server authentication** (the
certificate proves the server's name). Client authentication is optional (mutual TLS, 8.6). TLS does **not** hide who
is talking to whom at the IP level, or the size and timing of traffic.

Versions: SSL 2 and 3 (1995–96) and TLS 1.0 and 1.1 are deprecated (RFC 8996). **TLS 1.2** (2008) is still widely
used; **TLS 1.3** (RFC 8446, 2018) is the current version and carries most web traffic.

## 8.2 The TLS 1.3 handshake

TLS 1.3 needs one round trip before data flows:

1. **ClientHello**: supported cipher suites, a random value, and a **key share**: the client's ephemeral X25519 public
   key (today often a hybrid X25519 + ML-KEM-768 share), plus the server name (**SNI**).
2. **ServerHello**: the server's choice and its own key share. Both sides now compute the shared secret by
   Diffie–Hellman, and derive keys with **HKDF**. Everything after this is encrypted.
3. The server sends, encrypted: **EncryptedExtensions**, its **Certificate** chain, **CertificateVerify** (a signature
   with its private key over the whole handshake so far) and **Finished** (a MAC over the handshake).
4. The client checks the certificate and signature, sends its own **Finished**, and application data flows.

<figure class="mars-fig">
<svg viewBox="0 0 640 220" role="img" aria-label="TLS 1.3 handshake in one round trip">
<line x1="120" y1="20" x2="120" y2="210" stroke="currentColor"/><line x1="520" y1="20" x2="520" y2="210" stroke="currentColor"/>
<text x="120" y="15" text-anchor="middle">Client</text><text x="520" y="15" text-anchor="middle">Server</text>
<line x1="120" y1="45" x2="520" y2="70" class="na" stroke-width="2"/><text x="320" y="48" text-anchor="middle" font-size="12">ClientHello + key share</text>
<line x1="520" y1="90" x2="120" y2="125" class="nb" stroke-width="2"/><text x="320" y="96" text-anchor="middle" font-size="12">ServerHello + key share</text>
<text x="320" y="117" text-anchor="middle" font-size="12">[Certificate, CertificateVerify, Finished] encrypted</text>
<line x1="120" y1="150" x2="520" y2="170" class="na" stroke-width="2"/><text x="320" y="152" text-anchor="middle" font-size="12">[Finished] + application data</text>
<line x1="520" y1="185" x2="120" y2="205" class="nc" stroke-width="2"/><text x="320" y="190" text-anchor="middle" font-size="12">application data</text>
</svg>
<figcaption>TLS 1.3: one round trip, keys agreed in the first two messages, certificate sent encrypted.</figcaption>
</figure>

TLS 1.3 removed everything that had caused trouble: static RSA key exchange (no forward secrecy), CBC-mode ciphers,
RC4, SHA-1, compression, renegotiation, and custom Diffie–Hellman groups. Only five AEAD cipher suites remain, and
every key exchange is ephemeral, so every connection has forward secrecy.

<figure class="play" data-play="tls13"><span class="ai-tag">AI-created</span><figcaption><b>Watch it.</b> TCP's round trip, then TLS 1.3's single round trip: the key share travels in the very first message, so the request can go with the client's Finished. Change the round-trip time to see when it leaves.</figcaption></figure>

## 8.3 How the client trusts the server

The client must check that the certificate chain leads to a trusted root, that the name in the certificate (its
**Subject Alternative Name**) matches the host it wanted, that it is within its dates, that it is not revoked, and
that the server's CertificateVerify signature checks with the certificate's key. Skipping the name check, as many
early mobile apps did, makes TLS worthless against an on-path attacker with any valid certificate.

**HSTS** (HTTP Strict Transport Security, RFC 6797) tells a browser to use only HTTPS for a site for a period, so an
attacker cannot downgrade the first `http://` request (an attack called SSL stripping, 2009). Sites can be put on the
browsers' built-in **preload list** so even the first visit is protected.

## 8.4 Lessons from attacks

| Year | Attack | Lesson |
| --- | --- | --- |
| 2011 | BEAST | predictable CBC IVs in TLS 1.0 |
| 2012 | CRIME | compression leaks secrets via size; TLS compression removed |
| 2013 | Lucky 13 | timing of MAC checks in CBC mode; use AEAD |
| 2014 | Heartbleed | an OpenSSL bounds bug leaked server memory, including private keys: implementation matters |
| 2014 | POODLE | SSL 3.0 padding oracle, reached by downgrading; kill old versions |
| 2015 | FREAK, Logjam | servers still accepting 1990s "export" crypto could be downgraded to it |
| 2016 | DROWN | a server still supporting SSL 2 endangered its TLS connections sharing the same key |

Two themes: **old options left on are dangerous** (an attacker forces the weakest one), and **implementations fail
even when the design is sound**. TLS 1.3 signs the whole handshake and includes a downgrade sentinel in the server's
random value, so forcing an older version is detected.

## 8.5 0-RTT, ECH and QUIC

**0-RTT**: a client returning to a server can send data in its first flight using a pre-shared key from the last
session. Fast, but that early data can be **replayed** by an attacker, so it must be used only for requests that are
safe to repeat (a GET, never "transfer money").

**Encrypted Client Hello** (ECH) encrypts the ClientHello, including the SNI, with a key the server publishes in DNS
(HTTPS records), so an on-path observer sees only that you contacted a shared front end, not which site. It was
standardised at the IETF in 2025 and is supported by major browsers and some large hosting providers.

**QUIC** (HTTP/3) builds TLS 1.3 into a UDP transport, encrypting even most transport headers, so middleboxes cannot
read or tamper with them.

## 8.6 Mutual TLS and good configuration

In **mutual TLS** (mTLS), the client also presents a certificate. Services inside data centres use it to prove which
service is calling (service meshes issue short-lived certificates automatically), and it is a building block of zero
trust (Chapter 15).

A good server configuration in 2026: TLS 1.3 and 1.2 only; for 1.2, only ECDHE key exchange with AEAD suites; a
certificate from an automated CA renewing itself (ACME, RFC 8555); HSTS; OCSP stapling or short-lived certificates; a
hybrid post-quantum key exchange enabled where your software supports it. Mozilla's SSL Configuration Generator gives
ready-made settings for common servers, and you can check a site from the command line with
`openssl s_client` ([Lab 5](../../labs/05-HTTP-and-TLS-with-curl.md)).

## Check yourself

??? question "1. Why does every TLS 1.3 connection have forward secrecy?"
    Static RSA key exchange was removed; all key exchanges are ephemeral (EC)DHE, with keys discarded after the session.

??? question "2. What does HSTS stop?"
    Downgrade of a site to plain HTTP (SSL stripping): the browser refuses to use http:// for that site.

??? question "3. Why must 0-RTT data be idempotent?"
    It can be replayed by an attacker, so sending it twice must be harmless.

??? question "4. What does ECH hide that ordinary TLS 1.3 shows?"
    The ClientHello's contents, especially the server name (SNI) the client wants.

??? info "Sources"
    - RFC 8446 (TLS 1.3), RFC 5246 (TLS 1.2), RFC 8996 (deprecating TLS 1.0/1.1), RFC 6797 (HSTS), RFC 8555 (ACME), RFC 9000/9001 (QUIC), IETF TLS Encrypted Client Hello specification (2025).
    - Mozilla, *Server Side TLS* guidelines and SSL Configuration Generator.
    - Z. Durumeric et al., "The Matter of Heartbleed", IMC 2014; D. Adrian et al., "Imperfect Forward Secrecy" (Logjam), CCS 2015; N. Aviram et al., "DROWN", USENIX Security 2016.
    - M. Marlinspike, "New Tricks for Defeating SSL in Practice" (sslstrip), Black Hat DC 2009.
