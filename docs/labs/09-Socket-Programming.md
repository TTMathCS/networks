# Lab 9. Socket programming

*Every network program, from a web browser to a game, talks through sockets. In this lab you write a TCP echo server and client, a UDP version, and a tiny HTTP client, in Python, and see how the code matches what the transport layer does.*

!!! abstract "In this lab"
    **You will:** write a TCP server that accepts many clients; write a TCP client; see why TCP is a byte stream and
    frame messages; write a UDP sender and receiver and lose packets on purpose; speak HTTP by hand over a socket; add TLS.

    **You need:** Python 3 (any computer); [networks book, chapter 14](../books/networks/14-UDP-Ports-and-Sockets.md). Time: 40 minutes.

## 1. A TCP echo server

Save as `echo_server.py`:

```python
import socket, threading

def handle(conn, addr):
    with conn:
        print("connected", addr)
        while True:
            data = conn.recv(4096)       # up to 4096 bytes; b"" means the peer closed
            if not data:
                break
            conn.sendall(data.upper())   # send everything back, in capitals
    print("closed", addr)

srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)   # IPv4, TCP
srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
srv.bind(("127.0.0.1", 5000))
srv.listen()
print("listening on 127.0.0.1:5000")
while True:
    conn, addr = srv.accept()            # blocks until a client completes the handshake
    threading.Thread(target=handle, args=(conn, addr), daemon=True).start()
```

The calls map onto TCP: `bind` picks the address and port, `listen` tells the kernel to accept handshakes, `accept`
returns a new socket for each completed connection (the listening socket keeps listening), and the thread lets many
clients be served at once.

## 2. A client

Save as `echo_client.py`:

```python
import socket
with socket.create_connection(("127.0.0.1", 5000)) as s:   # does the three-way handshake
    s.sendall(b"hello, network\n")
    print(s.recv(4096))
```

Run the server in one terminal, the client in another. You can also use `nc 127.0.0.1 5000` and type lines. Look at the
connection with `ss -tn | grep 5000` while it is open (Linux) or `netstat -an | grep 5000` (macOS, Windows).

## 3. TCP is a stream, not messages

TCP delivers bytes in order, but **not** in the chunks you sent: two `send` calls may arrive in one `recv`, and one may
be split across several. Programs must mark where messages end. Two common ways: a delimiter (one message per line),
or a length prefix:

```python
import struct
def send_msg(sock, payload: bytes):
    sock.sendall(struct.pack("!I", len(payload)) + payload)   # 4-byte big-endian length

def recv_exact(sock, n):
    buf = b""
    while len(buf) < n:
        chunk = sock.recv(n - len(buf))
        if not chunk:
            raise ConnectionError("closed early")
        buf += chunk
    return buf

def recv_msg(sock):
    (n,) = struct.unpack("!I", recv_exact(sock, 4))
    return recv_exact(sock, n)
```

`!` means network byte order (big-endian), the convention for numbers on the wire. Almost every protocol (HTTP/2
frames, TLS records, DNS over TCP) uses one of these two methods.

## 4. UDP

UDP has no connection: each `sendto` is one datagram, delivered whole or not at all, possibly out of order. Save as
`udp_recv.py`:

```python
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind(("127.0.0.1", 6000))
seen = set()
s.settimeout(3)
try:
    while True:
        data, addr = s.recvfrom(2048)
        seen.add(int(data))
except socket.timeout:
    print("received", len(seen), "of 1000; missing", 1000 - len(seen))
```

and `udp_send.py`:

```python
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
for i in range(1000):
    s.sendto(str(i).encode(), ("127.0.0.1", 6000))
```

Start the receiver, then the sender. On loopback you will usually get all 1000. Now send to a receiver inside
[Lab 7](07-A-Network-on-One-Laptop.md)'s network with `netem loss 5%` on a link: about 50 go missing, and nothing tells
the sender. Reliability, if you need it, is your job (or QUIC's) on top of UDP.

## 5. HTTP by hand

HTTP/1.1 is text over TCP. Speak it yourself:

```python
import socket
with socket.create_connection(("example.com", 80)) as s:
    s.sendall(b"GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n")
    reply = b""
    while chunk := s.recv(4096):
        reply += chunk
print(reply.split(b"\r\n\r\n")[0].decode())   # just the headers
```

The request is a line, headers, and an empty line (`\r\n\r\n`). `Connection: close` asks the server to close when done,
so the loop ends.

## 6. Add TLS

Wrap the socket with Python's `ssl` module; it checks the certificate and host name by default:

```python
import socket, ssl
ctx = ssl.create_default_context()
with socket.create_connection(("example.com", 443)) as raw:
    with ctx.wrap_socket(raw, server_hostname="example.com") as s:
        print(s.version(), s.cipher()[0])
        s.sendall(b"GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n")
        print(s.recv(200))
```

It prints something like `TLSv1.3 TLS_AES_256_GCM_SHA384`. Change `server_hostname` to a wrong name and the handshake
fails with a certificate error: the name check from
[security book, chapter 8](../books/security/08-TLS-and-HTTPS.md) in action.

## Check yourself

??? question "1. Why does the server need a new socket for each client from accept()?"
    Each TCP connection is identified by both ends' addresses and ports; the listening socket keeps accepting while each accepted socket carries one conversation.

??? question "2. A client sends two 10-byte messages quickly. The server's first recv returns 20 bytes. Is something wrong?"
    No. TCP is a byte stream and may combine them; the protocol needs framing (delimiter or length prefix) to split messages.

??? question "3. Why did the UDP sender not notice lost datagrams?"
    UDP has no acknowledgements or retransmission; a lost datagram simply never arrives.

??? question "4. What does `server_hostname` do in wrap_socket?"
    It sends SNI and sets the name the certificate must match; verification fails if the certificate is not for that name.

??? info "Sources"
    - Python documentation: `socket`, `ssl`, `struct` modules (docs.python.org); `socket(7)`, `tcp(7)`, `udp(7)` Linux manual pages.
    - W. R. Stevens, B. Fenner, A. M. Rudoff, *UNIX Network Programming*, Vol. 1, 3rd ed., Addison-Wesley, 2003.
    - RFC 9293 (TCP), RFC 768 (UDP), RFC 9112 (HTTP/1.1).
