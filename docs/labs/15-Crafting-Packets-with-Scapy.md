# Lab 15. Crafting packets with Scapy

*Scapy lets you build any packet field by field, send it, and read the answer. It is the best way to see protocols as the stack sees them, and to understand how tools like ping, traceroute and Nmap work inside. All experiments here target your own lab namespaces from Lab 7.*

!!! abstract "In this lab"
    **You will:** build and show packets layer by layer; send a ping and read the reply; write your own traceroute;
    do a TCP handshake by hand and see why the kernel resets it; probe ports like Nmap; build a DNS query; read a
    capture file.

    **You need:** [Lab 7](07-A-Network-on-One-Laptop.md)'s network (h1, r, h3) running; Scapy (`sudo apt install python3-scapy`); root.
    [Networks book, chapter 2](../books/networks/02-Layers-and-Protocols.md). Time: 40 minutes.

## 1. Start Scapy in a host

```bash
sudo ip netns exec h1 scapy
```

You get a Python prompt with Scapy loaded. Layers are classes, stacked with `/`:

```python
>>> p = IP(dst="10.0.2.13")/ICMP()
>>> p.show()          # every field, with defaults filled in
>>> ls(TCP)           # all TCP fields and their defaults
>>> bytes(p).hex()    # the raw bytes on the wire
```

`show()` lists version 4, ihl, ttl 64, proto icmp, the checksum computed automatically, and the ICMP type 8
(echo request). Any field can be set: `IP(dst="10.0.2.13", ttl=1)`.

## 2. Ping by hand

```python
>>> r = sr1(IP(dst="10.0.2.13")/ICMP()/b"hello", timeout=2)
>>> r.summary()
'IP / ICMP 10.0.2.13 > 10.0.1.11 echo-reply 0 / Raw'
>>> r.ttl
63
```

`sr1` sends one packet and returns the first answer. TTL 63 tells you one router (r) is on the way.

## 3. Your own traceroute

```python
>>> for ttl in range(1, 5):
...     r = sr1(IP(dst="10.0.2.13", ttl=ttl)/ICMP(), timeout=1, verbose=0)
...     if r is None: print(ttl, "*")
...     else: print(ttl, r.src, r.sprintf("%ICMP.type%"))
...     if r is not None and r.src == "10.0.2.13": break
1 10.0.1.1 time-exceeded
2 10.0.2.13 echo-reply
```

That is the whole idea of traceroute ([Lab 2](02-Ping-and-Traceroute.md)) in five lines.

## 4. A TCP handshake by hand

Start a listener on h3 (`sudo ip netns exec h3 python3 -m http.server 80 &`), then in Scapy:

```python
>>> syn = IP(dst="10.0.2.13")/TCP(sport=40000, dport=80, flags="S", seq=1000)
>>> synack = sr1(syn, timeout=2)
>>> synack[TCP].flags, synack[TCP].seq, synack[TCP].ack
('SA', 284730155, 1001)
```

The server answers SYN-ACK with its own random sequence number and `ack 1001`. But capture on h1 at the same time
(`ip netns exec h1 tcpdump -n port 80`) and you will see your own kernel immediately send a **RST**: it never opened a
connection from port 40000, so it rejects the unexpected SYN-ACK. To finish the handshake from Scapy, first stop the
kernel's reply with a firewall rule in h1:
`ip netns exec h1 nft add table ip t; ip netns exec h1 nft add chain ip t o '{ type filter hook output priority 0; }'; ip netns exec h1 nft add rule ip t o tcp flags rst drop`.
Then send the ACK:

```python
>>> ack = IP(dst="10.0.2.13")/TCP(sport=40000, dport=80, flags="A", seq=1001, ack=synack[TCP].seq + 1)
>>> send(ack)
```

`ss -tn` in h3 now shows an ESTABLISHED connection that no program on h1 knows about. This is why off-path attackers
need to guess sequence numbers, and why the numbers are random ([security book, chapter 6](../books/security/06-Attacks-on-IP-and-Routing.md)).

## 5. Probe ports like Nmap

```python
>>> ans, unans = sr(IP(dst="10.0.2.13")/TCP(dport=[22, 80, 443], flags="S"), timeout=2, verbose=0)
>>> for s, r in ans:
...     print(s[TCP].dport, "open" if r[TCP].flags == "SA" else "closed")
80 open
22 closed
443 closed
```

A SYN-ACK means open, a RST closed, no answer filtered: exactly Nmap's SYN scan
([security book, chapter 17](../books/security/17-Testing-Your-Own-Network.md)).

## 6. DNS and capture files

Build a DNS query (from your VM's main namespace, which has internet access):

```python
>>> r = sr1(IP(dst="1.1.1.1")/UDP(dport=53)/DNS(rd=1, qd=DNSQR(qname="www.akadian.ca")), timeout=2)
>>> r[DNS].an.rdata if r[DNS].an else r[DNS].rcode
```

Read the capture from [Lab 6](06-Capturing-Packets.md) and count packets per protocol:

```python
>>> pkts = rdpcap("visit.pcap")
>>> pkts.summary()
>>> sum(1 for p in pkts if p.haslayer(TCP) and p[TCP].flags == "S")
```

## 7. Use it responsibly

Scapy can build malformed and spoofed packets as easily as correct ones. That is what makes it a superb learning and
testing tool, and why the same rule applies as for every lab: only on your own networks. Clean up the firewall rule in
h1 (`ip netns exec h1 nft delete table ip t`) and the namespaces when you are done.

## Check yourself

??? question "1. Why did the reply to your ping have TTL 63?"
    h3 sent it with TTL 64 and the router r decremented it once on the way back.

??? question "2. Why does the kernel send a RST when Scapy does a handshake?"
    The kernel's TCP stack has no record of a connection from that port, so it rejects the unexpected SYN-ACK with a reset.

??? question "3. In your traceroute loop, what ICMP type do intermediate routers return?"
    Time exceeded (type 11), sent when the TTL reaches zero.

??? question "4. What does the server's SYN-ACK acknowledge, and why?"
    Your sequence number plus one (1001), because the SYN consumes one sequence number.

??? info "Sources"
    - Scapy documentation (scapy.readthedocs.io): Usage, Building packets, Send and receive.
    - P. Biondi, "Network packet manipulation with Scapy", Hack.lu 2005; RFC 9293 (TCP), RFC 792 (ICMP), RFC 1035 (DNS).
