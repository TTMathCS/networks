# 19. HTTP and QUIC

*HTTP carries the web, and much else: app APIs, software updates, video. In thirty years it went from one request per TCP connection to many streams multiplexed over encrypted QUIC. This chapter follows that path: HTTP's messages, HTTP/1.1, HTTP/2, QUIC and HTTP/3, caching and cookies.*

!!! abstract "In this chapter"
    **You will learn:** requests, responses, methods and status codes; persistent connections; HTTP/2 framing and
    head-of-line blocking; why QUIC runs over UDP; QUIC's handshake, streams and connection migration; HTTP/3;
    caching; cookies and state.

    **You need:** [Chapters 16–18](16-TCP.md). TLS itself is [Security, chapter 8](../security/08-TLS-and-HTTPS.md).

## 19.1 Requests and responses

HTTP is a **request-response** protocol. In HTTP/1.1 the messages are text:

```http
GET /books/networks/ HTTP/1.1
Host: networks.akadian.ca
User-Agent: curl/8.10
Accept: text/html
```

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 18342
Cache-Control: max-age=600
ETag: "6729a1b3-47a6"

<!doctype html> ...
```

**Methods**: GET (read), HEAD (headers only), POST (submit), PUT (replace), PATCH (modify), DELETE, OPTIONS. GET, HEAD,
PUT and DELETE are **idempotent** (repeating them does no extra harm), which lets clients retry them safely.

**Status codes** by first digit: 1xx informational, 2xx success (200 OK, 204 No Content), 3xx redirection (301 moved
permanently, 304 not modified), 4xx client error (400, 401 unauthenticated, 403 forbidden, 404 not found, 429 too many
requests), 5xx server error (500, 502 bad gateway, 503 unavailable).

HTTP is **stateless**: each request stands alone. State (being logged in, a basket) is added with **cookies**: the
server sends `Set-Cookie: session=…; Secure; HttpOnly; SameSite=Lax`, and the browser returns it on later requests.

## 19.2 HTTP/1.0 and 1.1

HTTP/1.0 (1996) opened a new TCP connection per object: a page with 30 images paid 31 handshakes. **HTTP/1.1** (1997,
now RFC 9112) made connections **persistent** (keep-alive), required the `Host` header (so one IP address can host many
sites), and added chunked transfer and better caching. It allowed **pipelining** (sending several requests without
waiting), but responses must come back in order, so one slow response blocks the rest: **head-of-line blocking**.
Pipelining was never usable in practice; browsers opened six parallel connections per site instead.

## 19.3 HTTP/2

**HTTP/2** (2015, RFC 9113), from Google's SPDY, keeps HTTP's meaning but changes the wire format:

- **Binary framing**: messages are split into frames (HEADERS, DATA, SETTINGS, …).
- **Multiplexing**: many **streams** share one TCP connection; frames of different responses interleave, so one slow
  response no longer blocks others at the HTTP level.
- **Header compression** (HPACK): repeated headers such as cookies and user agents are sent as small table indexes.
- **Prioritisation** and **flow control** per stream. (Server push existed but was abandoned by browsers.)

But head-of-line blocking moved down a layer: TCP delivers bytes in order, so one lost packet stalls **every** stream
until it is retransmitted. On lossy mobile links, HTTP/2 over one connection could be slower than HTTP/1.1 over six.

## 19.4 QUIC

**QUIC** (RFC 9000, 2021, from Google's 2012 experiment) is a new transport protocol designed to fix this, and to be
deployable:

- It runs over **UDP**, because middleboxes block or tamper with new IP protocols but pass UDP; and it is implemented in
  user space (in the browser and server), so it can evolve without OS updates.
- It provides **streams** as part of the transport: a lost packet delays only the streams whose data it carried.
- **TLS 1.3 is built in**: the transport handshake and key exchange happen together, so a new connection needs one
  RTT (TCP + TLS 1.3 needs two), and a returning client can send data immediately (**0-RTT**, with care: 0-RTT data can
  be replayed by an attacker, so only safe requests should use it).
- **Almost everything is encrypted**, including packet numbers and most header fields, so middleboxes cannot ossify the
  protocol by depending on its details. Only a small invariant header and a **connection ID** are visible.
- **Connection migration**: a connection is identified by its connection ID, not the 5-tuple, so when a phone moves from
  Wi-Fi to 5G (a new IP address), the connection continues.
- Loss recovery and congestion control like TCP's, but with unique packet numbers (a retransmission gets a new number,
  so RTT samples are never ambiguous) and more precise ACKs.

## 19.5 HTTP/3

**HTTP/3** (RFC 9114, 2022) is HTTP over QUIC, with QPACK header compression (HPACK adapted to out-of-order streams). A
browser first connects with HTTP/2 or 1.1; the server advertises HTTP/3 with an `Alt-Svc` header or a DNS **HTTPS**
record, and the browser then races a QUIC connection. In 2025, roughly a third of web requests seen by large CDNs used
HTTP/3, and almost all browsers support it. Corporate firewalls that block UDP port 443 simply force the fallback.

## 19.6 Caching

The fastest request is the one never sent. HTTP caching (RFC 9111) works at three levels: the browser cache, shared
proxy caches, and CDNs (Chapter 20).

- `Cache-Control: max-age=600` lets a response be reused for 10 minutes without asking.
- After that, the client **revalidates**: `If-None-Match: "6729a1b3-47a6"` (the ETag) or `If-Modified-Since`. If
  nothing changed, the server answers `304 Not Modified` with no body.
- `no-store` forbids caching (private data); `private` allows only the browser to cache; `immutable` says the content
  never changes (used with file names that contain a content hash, such as `app.3f9a2c.js`).

## 19.7 REST, APIs and beyond

Most apps talk to their servers with HTTP **APIs**: JSON bodies, methods mapped to actions (REST style), or gRPC, which
sends binary Protocol Buffers over HTTP/2. **WebSockets** (RFC 6455) upgrade an HTTP connection to a two-way message
channel for chats and live updates; **WebTransport** does the same over HTTP/3. **WebRTC** carries browser video calls
peer to peer over UDP (SRTP media, with ICE for NAT traversal, Chapter 9).

## Check yourself

??? question "1. Why did HTTP/2 not fully solve head-of-line blocking?"
    It removed it at the HTTP level, but all streams share one TCP byte stream, so a single lost packet stalls every stream until it is retransmitted.

??? question "2. How many round trips before the first request can be sent: TCP + TLS 1.3, and QUIC (first visit)?"
    TCP + TLS 1.3: two (one for TCP, one for TLS). QUIC: one, since transport and crypto handshakes are combined.

??? question "3. A browser has a cached page with an ETag. The max-age has expired. What does it send, and what is the best answer?"
    A conditional GET with If-None-Match: the ETag. If unchanged, the server replies 304 Not Modified with no body.

??? info "Sources"
    - RFC 9110 (HTTP semantics), RFC 9111 (caching), RFC 9112 (HTTP/1.1), RFC 9113 (HTTP/2), RFC 9114 (HTTP/3), RFC 9204 (QPACK).
    - RFC 9000 (QUIC transport), RFC 9001 (QUIC with TLS), RFC 9002 (QUIC loss detection), RFC 8999 (QUIC invariants).
    - A. Langley et al., "The QUIC Transport Protocol: Design and Internet-Scale Deployment", SIGCOMM 2017.
    - Cloudflare Radar, HTTP version statistics (radar.cloudflare.com), checked November 2026.
