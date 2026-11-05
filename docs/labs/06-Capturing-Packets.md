# Lab 6. Capturing packets

*Seeing real packets makes the layers of a network concrete. In this lab you capture your own traffic with tcpdump and Wireshark, pick out a DNS lookup, a TCP three-way handshake, a TLS handshake and a connection close, and learn the filters that find what you want.*

!!! abstract "In this lab"
    **You will:** capture with tcpdump; write and read capture files; use capture and display filters; read a TCP
    handshake, sequence numbers and the close; see a DNS query and a TLS ClientHello in Wireshark; measure RTT from a
    capture.

    **You need:** [Lab 1](01-Your-Lab.md) with tcpdump, tshark or Wireshark; [networks book, chapter 16](../books/networks/16-TCP.md). Time: 30–40 minutes.

!!! warning "Your own traffic"
    Capture only on your own computer or VM and your own network. Capturing other people's traffic without permission
    is illegal in many countries.

## 1. A first capture

Find your interface name with `ip -br link`, then:

```bash
sudo tcpdump -i enp0s3 -n -c 20
```

`-n` shows numbers instead of names; `-c 20` stops after 20 packets. In another terminal run `ping -c 2 1.1.1.1` and
watch the ICMP echo request and reply appear.

## 2. Filters

tcpdump uses **capture filters** (BPF syntax), applied in the kernel so you only store what you need:

```bash
sudo tcpdump -i enp0s3 -n port 53            # DNS
sudo tcpdump -i enp0s3 -n host 1.1.1.1       # one host
sudo tcpdump -i enp0s3 -n 'tcp port 443 and tcp[tcpflags] & tcp-syn != 0'   # SYNs to/from 443
```

## 3. Capture a whole web visit

Save to a file while you fetch a page:

```bash
sudo tcpdump -i enp0s3 -n -w visit.pcap 'port 53 or host example.com' &
sleep 1; curl -s https://example.com > /dev/null; sleep 1
sudo kill %1
tcpdump -n -r visit.pcap | head -30
```

You should see, in order:

1. **DNS**: a query `A? example.com.` (and often `AAAA?`), and a reply with addresses.
2. **TCP handshake**: `Flags [S]` (SYN) from you, `Flags [S.]` (SYN-ACK) back, `Flags [.]` (ACK) from you.
3. **TLS**: your first data packet (`Flags [P.]`) is the ClientHello; the server answers with its hello and encrypted
   data.
4. Data packets and ACKs, then the **close**: `Flags [F.]` (FIN) from one side and from the other, each ACKed.

## 4. Read the handshake

Look at the first three TCP lines with absolute sequence numbers (`-S`):

```bash
tcpdump -n -S -r visit.pcap 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0' | head -3
```

Your SYN carries a random initial sequence number $x$; the SYN-ACK carries the server's number $y$ and `ack x+1`;
your ACK carries `ack y+1`. A SYN consumes one sequence number even though it carries no data. Also look at the
**options** in the SYN: `mss 1460` (maximum segment size), `sackOK`, `TS` (timestamps) and `wscale` (window scaling).

**RTT from the capture:** the time between your SYN and the server's SYN-ACK is one round trip, measured by your own
machine.

## 5. Wireshark

Open the file in Wireshark (`wireshark visit.pcap`), or use its terminal version `tshark -r visit.pcap`. Wireshark
decodes each layer: click a packet and expand Ethernet, IP, TCP, TLS. Useful **display filters** (different syntax from
capture filters):

| Filter | Shows |
| --- | --- |
| `dns` | DNS packets |
| `tcp.flags.syn == 1` | SYN and SYN-ACK |
| `tls.handshake.type == 1` | TLS ClientHello |
| `tls.handshake.extensions_server_name` | packets with an SNI (add as a column) |
| `tcp.analysis.retransmission` | retransmissions |

In the ClientHello, expand the extensions: you can read the **server name** in clear (unless ECH is used), the list of
cipher suites, `supported_versions` (including TLS 1.3), and the `key_share`. Everything after the ServerHello is
encrypted: Wireshark shows only "Application Data".

**Statistics → Conversations** lists every pair of hosts with bytes and packets, and **Statistics → I/O Graphs** plots
traffic over time.

## 6. What encryption hides, and what it does not

From the capture alone, without keys, you can tell which addresses you talked to, the server name (SNI), when, how much
data, and timing. You cannot read the pages or headers inside TLS. This is exactly the picture of
[security book, chapter 2](../books/security/02-Attackers-and-Attacks.md): content is protected; metadata is not.

## Check yourself

??? question "1. The SYN has seq 1000. What ack number does the SYN-ACK carry?"
    1001: the SYN consumes one sequence number.

??? question "2. What is the difference between a capture filter and a display filter?"
    Capture filters (BPF, in tcpdump or Wireshark's capture options) decide what is recorded; display filters (Wireshark syntax) only decide what is shown from a recording.

??? question "3. Which field in a TLS 1.3 ClientHello reveals the website name?"
    The server_name (SNI) extension, unless Encrypted Client Hello is used.

??? question "4. How can you measure the RTT to a server from your capture?"
    Time from your SYN to the server's SYN-ACK.

??? info "Sources"
    - `tcpdump(8)` and `pcap-filter(7)` manual pages (tcpdump.org); Wireshark User's Guide and display filter reference (wireshark.org).
    - RFC 9293 (TCP), RFC 8446 (TLS 1.3).
