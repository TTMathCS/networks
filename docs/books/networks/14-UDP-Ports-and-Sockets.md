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
