# 16. TCP

*The Transmission Control Protocol carries most of the internet's bytes: web pages, email, file transfers, SSH. It turns IP's best effort into a reliable, ordered byte stream between two programs. This chapter follows a TCP connection from handshake to close.*

!!! abstract "In this chapter"
    **You will learn:** the TCP header; the three-way handshake and why it needs random sequence numbers; how data and
    ACKs flow; estimating RTT and setting the retransmission timer; fast retransmit; window scaling; closing and
    TIME_WAIT; the state machine; common tuning.

    **You need:** [Chapter 15](15-Reliable-Delivery.md).

## 16.1 The header

| Field | Bits | Purpose |
| --- | --- | --- |
| Source port, destination port | 16 + 16 | the programs |
| Sequence number | 32 | byte number of the first data byte in this segment |
| Acknowledgement number | 32 | next byte expected from the other side (cumulative) |
| Data offset | 4 | header length |
| Flags | 8 | **SYN**, **ACK**, **FIN**, **RST**, PSH, URG, ECE, CWR |
| Receive window | 16 | free buffer space (flow control), scaled |
| Checksum, urgent pointer | 16 + 16 | |
| Options | 0–40 bytes | MSS, window scale, SACK, timestamps |

TCP numbers **bytes**, not packets. A segment carrying bytes 1001–2460 has sequence number 1001; the reply ACK says
2461.

## 16.2 The three-way handshake

1. Client → server: **SYN**, sequence number $x$ (chosen at random), plus options (maximum segment size, window
   scaling, SACK permitted, timestamps).
2. Server → client: **SYN-ACK**, its own random sequence number $y$, acknowledging $x + 1$.
3. Client → server: **ACK** of $y + 1$. Data may ride on this segment.

Why random initial sequence numbers? So that segments from an old connection between the same ports cannot be mistaken
for the new one, and so that an off-path attacker cannot guess the numbers and inject data (RFC 6528). The handshake
costs one RTT before any data flows; **TCP Fast Open** (RFC 7413) lets a returning client send data in the SYN using a
cookie, though it is little deployed. TLS adds another RTT on top (Chapter 19).

A flood of SYNs from spoofed addresses can fill a server's table of half-open connections (**SYN flood**); servers answer
with **SYN cookies**, encoding the state in their sequence number so they need to store nothing until the final ACK.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 410" role="img" aria-labelledby="sk-nb-handshake-t"><title id="sk-nb-handshake-t">Client and server exchange SYN with a random number x, SYN-ACK with y and x plus 1, and ACK with y plus 1, costing one round trip before data</title><defs><filter id="sk-nb-handshake-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nb-handshake-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nb-handshake-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nb-handshake-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nb-handshake-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="410" filter="url(#sk-nb-handshake-paper)"/><g filter="url(#sk-nb-handshake-pen)"><text x="30" y="44" class="h">SYN, SYN-ACK, ACK</text><path class="p room" d="M60 70 L180 70 L180 110 L60 110Z"/><text x="120.0" y="96.0" text-anchor="middle" class="s">client</text><path class="p gold" d="M460 70 L580 70 L580 110 L460 110Z"/><text x="520.0" y="96.0" text-anchor="middle" class="s">server</text><path class="p dash" d="M120 112 L120 370 M520 112 L520 370"/><path class="p " d="M124 130 L516 190" marker-end="url(#sk-nb-handshake-ah)"/><text x="320" y="152.0" text-anchor="middle" class="l">SYN</text><text x="300" y="186.0" text-anchor="middle" class="s">seq = x (random)</text><path class="p " d="M516 200 L124 260" marker-end="url(#sk-nb-handshake-ah)"/><text x="320" y="222.0" text-anchor="middle" class="l">SYN-ACK</text><text x="300" y="256.0" text-anchor="middle" class="s">seq = y, ack = x + 1</text><path class="p " d="M124 270 L516 330" marker-end="url(#sk-nb-handshake-ah)"/><text x="320" y="292.0" text-anchor="middle" class="l">ACK</text><text x="300" y="326.0" text-anchor="middle" class="s">ack = y + 1, data may ride along</text><path class="p" d="M96 130 L96 260"/><text x="30" y="200" class="s">one</text><text x="30" y="218" class="s">round</text><text x="30" y="236" class="s">trip</text><text x="30" y="395" class="s">Time runs downward; each arrow slants because the trip takes time.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## 16.3 Data and acknowledgements

Each side sends up to its window of unacknowledged bytes. The receiver ACKs cumulatively and, usually, **delays** ACKs
(up to about 40–200 ms, or every second full segment) to halve their number. Segments are at most the **MSS**, typically
1,460 bytes on Ethernet (1,500 − 40).

**Nagle's algorithm** holds back tiny segments while earlier data is unacknowledged, which stops a program that writes
one byte at a time from sending one packet per byte. Combined with delayed ACKs it can add 40 ms or more of latency to
request-response protocols, so interactive programs set `TCP_NODELAY`.

<figure class="play" data-play="handshake"><span class="ai-tag">AI-created</span><figcaption><b>Watch it.</b> The three-way handshake and the first 100 bytes, with made-up starting numbers: the SYN uses up one sequence number, and every ACK names the next byte expected.</figcaption></figure>

## 16.4 The retransmission timer

TCP must guess how long to wait before resending. It measures RTT samples and keeps a smoothed estimate and a variation
(Jacobson and Karels, 1988; RFC 6298):

$$\text{SRTT} \leftarrow (1 - \alpha)\,\text{SRTT} + \alpha\, R \qquad \alpha = 1/8$$

$$\text{RTTVAR} \leftarrow (1 - \beta)\,\text{RTTVAR} + \beta\, |\text{SRTT} - R| \qquad \beta = 1/4$$

$$\text{RTO} = \text{SRTT} + 4\,\text{RTTVAR} \qquad (\text{at least } 1 \text{ s by the RFC; Linux uses } 200 \text{ ms})$$

Samples are not taken from retransmitted segments (Karn's algorithm: you can't tell which copy was ACKed), and each
timeout **doubles** the RTO (exponential backoff), so a dead path is not hammered.

## 16.5 Fast retransmit and recovery

A timeout means a long stall. TCP usually learns of a loss sooner: when segment 5 is lost but 6, 7 and 8 arrive, the
receiver ACKs "5" three more times. On **three duplicate ACKs** the sender resends segment 5 at once (fast retransmit)
and, with SACK, fills exactly the reported holes. Congestion control then reduces the sending rate (Chapter 17).

## 16.6 Window scaling and long fat networks

The 16-bit window field allows at most 65,535 bytes in flight: on a 100 ms path that caps throughput at about 5 Mbit/s.
The **window scale** option (RFC 7323), agreed in the SYNs, multiplies the window by up to $2^{14}$, allowing 1 GB.
**Timestamps** give an RTT sample on every ACK and protect against wrapped sequence numbers at high speed (PAWS).

## 16.7 Closing

Each direction is closed separately:

1. A sends **FIN**; B ACKs it. A will send no more, but can still receive (a half-closed connection).
2. When B finishes, it sends **FIN**; A ACKs it.
3. A waits in **TIME_WAIT** for twice the maximum segment lifetime (60 s on Linux) before forgetting the connection,
   so a delayed duplicate cannot be confused with a new connection on the same ports, and so it can re-ACK B's FIN if
   that ACK was lost.

A **RST** (reset) aborts a connection at once: sent when a segment arrives for a port with no listener, or by firewalls.
Busy servers can accumulate thousands of TIME_WAIT sockets; the usual remedies are letting the client close first or
reusing connections (HTTP keep-alive).

## 16.8 The state machine

The main states, which `ss -tan` shows on Linux: LISTEN, SYN-SENT, SYN-RECEIVED, **ESTABLISHED**, FIN-WAIT-1,
FIN-WAIT-2, CLOSE-WAIT (the other side closed; *your* program hasn't yet, a common sign of a bug if they pile up),
LAST-ACK, CLOSING, TIME-WAIT, CLOSED.

## 16.9 Tuning in practice

- Buffers: modern OSes auto-tune socket buffers up to several MB; raise the maximum for very high BDP paths.
- Congestion control: Linux defaults to CUBIC; BBR can be chosen per socket or system-wide (Chapter 17).
- Keep-alive: off by default; when on, probes after 2 hours idle unless configured, so applications usually send their
  own heartbeats.
- `ss -ti` shows each connection's RTT, congestion window and retransmissions ([Lab 3](../../labs/03-Interfaces-and-Routes.md)).

## Check yourself

??? question "1. A client's SYN has sequence number 1000. What acknowledgement number is in the server's SYN-ACK?"
    1001: the SYN consumes one sequence number.

??? question "2. SRTT is 100 ms, RTTVAR is 10 ms, and a new sample R = 140 ms arrives. Compute the new SRTT, RTTVAR and RTO (update RTTVAR first, using the old SRTT)."
    RTTVAR = 0.75×10 + 0.25×|100 − 140| = 17.5 ms; SRTT = 0.875×100 + 0.125×140 = 105 ms; RTO = 105 + 4×17.5 = 175 ms (before any minimum is applied).

??? question "3. Why does the side that closes first sit in TIME_WAIT?"
    To absorb delayed segments from the old connection so they cannot corrupt a new one on the same ports, and to resend the final ACK if it was lost.

??? info "Sources"
    - RFC 9293 (TCP, 2022, consolidating RFC 793 and its updates), RFC 6298 (RTO), RFC 7323 (window scale, timestamps), RFC 2018 (SACK), RFC 6528 (ISN), RFC 4987 (SYN floods and SYN cookies), RFC 7413 (Fast Open).
    - V. Jacobson, "Congestion Avoidance and Control", SIGCOMM 1988.
    - Linux `tcp(7)` manual page.
