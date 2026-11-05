# 14. UDP, ports and sockets

*IP delivers packets to a host; the transport layer delivers data to the right program. This chapter covers ports and multiplexing, UDP (the thinnest possible transport), and the socket interface that every network program uses.*

!!! abstract "In this chapter"
    **You will learn:** ports and the 5-tuple; multiplexing and demultiplexing; the 8-byte UDP header; when to use UDP;
    the Berkeley sockets API for UDP and TCP clients and servers; ephemeral ports.

    **You need:** [Chapter 2](02-Layers-and-Protocols.md) and [Chapter 8](08-IPv4-Addressing-and-Subnets.md). Some Python helps.

## 14.1 Ports

A host runs many networked programs at once. A 16-bit **port number** says which one a packet is for:

| Range | Name | Examples |
| --- | --- | --- |
| 0–1023 | well-known (system) ports | 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 123 NTP, 443 HTTPS |
| 1024–49151 | registered | 1194 OpenVPN, 3306 MySQL, 5060 SIP |
| 49152–65535 | dynamic / **ephemeral** | chosen by the OS for the client side of a connection |

A server **listens** on a known port; a client's OS picks a random ephemeral port for its end (Linux by default uses
32768–60999). Randomising it also makes blind spoofing attacks harder.

## 14.2 Multiplexing and the 5-tuple

The sending side gathers data from many sockets and hands it to IP with port numbers in the headers
(**multiplexing**); the receiving side reads the ports to deliver it (**demultiplexing**).

- A **UDP** socket is identified by its (destination address, destination port): datagrams from anyone to that port
  arrive at the same socket.
- A **TCP** connection is identified by the full **5-tuple**: protocol, source address, source port, destination address,
  destination port. A web server on port 443 has thousands of connections at once, all on its port 443, told apart by the
  clients' addresses and ports.

Firewalls, NATs and load balancers all track flows by this 5-tuple.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 405" role="img" aria-labelledby="sk-nb-5tuple-t"><title id="sk-nb-5tuple-t">Three connections reach one web server on port 443; two come from the same address but different ports, so each is still told apart</title><defs><filter id="sk-nb-5tuple-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nb-5tuple-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nb-5tuple-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nb-5tuple-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nb-5tuple-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="405" filter="url(#sk-nb-5tuple-paper)"/><g filter="url(#sk-nb-5tuple-pen)"><text x="30" y="44" class="h">Thousands of connections on one port</text><path class="p gold" d="M440 120 L610 120 L610 290 L440 290Z"/><text x="525.0" y="205.0" text-anchor="middle" class="s">web server</text><text x="525.0" y="223.0" text-anchor="middle" class="s">port 443</text><path class="p room" d="M30 110 L160 110 L160 160 L30 160Z"/><text x="95.0" y="135.0" text-anchor="middle" class="s">client</text><text x="95.0" y="153.0" text-anchor="middle" class="s">203.0.113.5</text><path class="p " d="M162 135 L436 175" marker-end="url(#sk-nb-5tuple-ah)"/><text x="180" y="116" style="font-family:'IBM Plex Mono',monospace;font-size:13px;fill:#3a2a1e">TCP 203.0.113.5:51000</text><path class="p room" d="M30 200 L160 200 L160 250 L30 250Z"/><text x="95.0" y="225.0" text-anchor="middle" class="s">client</text><text x="95.0" y="243.0" text-anchor="middle" class="s">203.0.113.5</text><path class="p " d="M162 225 L436 205" marker-end="url(#sk-nb-5tuple-ah)"/><text x="180" y="206" style="font-family:'IBM Plex Mono',monospace;font-size:13px;fill:#3a2a1e">TCP 203.0.113.5:51001</text><path class="p room" d="M30 290 L160 290 L160 340 L30 340Z"/><text x="95.0" y="315.0" text-anchor="middle" class="s">client</text><text x="95.0" y="333.0" text-anchor="middle" class="s">198.51.100.9</text><path class="p " d="M162 315 L436 235" marker-end="url(#sk-nb-5tuple-ah)"/><text x="180" y="296" style="font-family:'IBM Plex Mono',monospace;font-size:13px;fill:#3a2a1e">TCP 198.51.100.9:40122</text><text x="30" y="370" class="s">Every row ends at the same server and port 443. The five values together, protocol,</text><text x="30" y="390" class="s">both addresses and both ports, tell the connections apart.</text></g></svg><figcaption>Sketched for this page. The addresses are kept for examples.</figcaption></figure>

## 14.3 UDP

The **User Datagram Protocol** (RFC 768, 1980) adds almost nothing to IP:

| Field | Bits |
| --- | --- |
| Source port | 16 |
| Destination port | 16 |
| Length (header + data) | 16 |
| Checksum (over data and a "pseudo-header" of IP addresses) | 16 |

No connection, no acknowledgements, no ordering, no retransmission, no flow or congestion control. A datagram arrives
once, whole, or not at all (it may also arrive twice or out of order).

Why use something so bare?

- **No setup delay**: the first datagram carries data. A DNS lookup is one packet each way.
- **No head-of-line blocking**: a lost packet doesn't hold up later ones. Live voice and video prefer a glitch to a delay.
- **Control**: the application decides what to retransmit, and when. QUIC (Chapter 19) builds its own reliability and
  encryption on top of UDP precisely because UDP passes through middleboxes that would block a new protocol.
- **Small and stateless**: a server can answer millions of clients without keeping per-client state.

Uses: DNS, DHCP, NTP, SNMP, voice and video (RTP), games, QUIC/HTTP3, WireGuard, many VPNs.

The cost: UDP applications must be careful about congestion (RFC 8085 gives guidelines), and UDP's lack of a
handshake lets attackers **spoof** source addresses, which makes UDP services useful for reflection attacks
([Security, chapter 13](../security/13-Denial-of-Service.md)).

## 14.4 Sockets

Almost every network program, in every language, uses the **Berkeley sockets** interface, designed for BSD Unix in
1983. A socket is an endpoint the OS gives the program; the program reads and writes it like a file.

A UDP echo server and client in Python:

```python
# udp_server.py: reply with whatever arrives
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)   # IPv4, UDP
s.bind(("0.0.0.0", 9999))                              # listen on port 9999, every interface
while True:
    data, addr = s.recvfrom(2048)                      # one datagram, and who sent it
    s.sendto(data.upper(), addr)
```

```python
# udp_client.py
import socket
c = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
c.settimeout(2)                                        # UDP may lose it: don't wait forever
c.sendto(b"hello mars", ("127.0.0.1", 9999))
print(c.recvfrom(2048))                                # (b'HELLO MARS', ('127.0.0.1', 9999))
```

A TCP server has more steps, because it manages connections:

| Server | Client | Meaning |
| --- | --- | --- |
| `socket(AF_INET, SOCK_STREAM)` | `socket(...)` | create |
| `bind((addr, port))` | | choose the local port |
| `listen(backlog)` | | accept connection requests |
| `accept()` → new socket | `connect((addr, port))` | the three-way handshake (Chapter 16) happens here |
| `recv` / `send` | `send` / `recv` | a byte stream, not messages |
| `close()` | `close()` | the closing handshake |

`accept` returns a **new socket** for each client, while the listening socket keeps waiting for more. Because TCP is a
**byte stream**, one `send` of 10,000 bytes may arrive as several `recv` calls, and two small sends may arrive as one:
applications must mark message boundaries themselves (a length prefix, or a delimiter such as HTTP's blank line).
[Lab 9](../../labs/09-Socket-Programming.md) builds both servers and a chat program.

Servers handling many clients use one thread per connection, or one thread watching many sockets at once with
`select`, `epoll` (Linux) or `kqueue` (BSD, macOS): the basis of `asyncio`, nginx and Node.js.

## 14.5 Other transports

- **SCTP** (RFC 9260): message-oriented, several streams per connection, multihoming; used inside mobile networks
  (signalling) and in WebRTC data channels (over DTLS).
- **DCCP**: congestion-controlled unreliable datagrams; little used.
- **QUIC** (Chapter 19): streams and reliability over UDP, now carrying a large share of web traffic.

## Check yourself

??? question "1. Two browser tabs connect to the same web server port 443. How does the server's OS keep their data apart?"
    The connections have different 5-tuples: the client's ephemeral source ports differ (and possibly addresses).

??? question "2. Name two reasons a voice call uses UDP rather than TCP."
    No head-of-line blocking (a lost packet shouldn't delay later audio) and no retransmissions of audio that would arrive too late to play; also lower setup delay.

??? question "3. A TCP client sends 'HELLO' then 'WORLD'. Can the server's first recv return 'HELLOWORLD'?"
    Yes. TCP is a byte stream with no message boundaries; the application must add its own framing.

??? info "Sources"
    - RFC 768 (UDP), RFC 8085 (UDP usage guidelines), RFC 6335 (port registry procedures), RFC 6056 (port randomisation), RFC 9260 (SCTP).
    - W. R. Stevens, B. Fenner, A. Rudoff, *UNIX Network Programming, Vol. 1*, 3rd ed., 2003.
    - Python documentation, `socket` module (docs.python.org).
