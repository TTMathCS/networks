# 15. Reliable delivery

*How do you send data perfectly over a channel that loses, corrupts and reorders packets? This chapter builds a reliable protocol step by step, from stop-and-wait to sliding windows, the ideas inside TCP, QUIC and every file transfer.*

!!! abstract "In this chapter"
    **You will learn:** checksums, acknowledgements, timeouts and sequence numbers, and why each is needed;
    stop-and-wait and its utilisation; pipelining; Go-Back-N and Selective Repeat; window size limits; flow control.

    **You need:** [Chapter 3](03-Delay-Loss-and-Throughput.md) and [Chapter 14](14-UDP-Ports-and-Sockets.md).

## 15.1 Building it piece by piece

Start with a perfect channel: just send. Now add problems one at a time, and the fix each one forces:

| Problem | Fix |
| --- | --- |
| Bits get corrupted | a **checksum**, so the receiver can tell |
| The sender doesn't know if it arrived | the receiver sends an **acknowledgement (ACK)** |
| ACKs can be corrupted too, and a resend could be mistaken for new data | **sequence numbers**, so the receiver can spot duplicates |
| Packets (or ACKs) can be lost entirely, so the sender waits forever | a **timeout**: resend if no ACK arrives in time |

These four tools (checksum, ACK, sequence number, timer) are all of reliable transfer. The rest is making it fast.

## 15.2 Stop-and-wait

The simplest protocol sends one packet, waits for its ACK, and only then sends the next. One bit of sequence number
(0, 1, 0, 1, …) is enough to detect duplicates; this is the **alternating-bit protocol**.

It works, but it is slow. With packet size $L$, link rate $R$ and round-trip time RTT, the sender is busy for $L/R$ out of
every $\text{RTT} + L/R$:

$$U = \frac{L/R}{\text{RTT} + L/R}$$

For 1,500-byte packets on a 1 Gbit/s link across a continent (RTT 30 ms): $L/R = 12$ µs, so
$U = 0.000012 / 0.030012 \approx 0.04\%$. The link sits idle 99.96% of the time.

## 15.3 Pipelining

The fix is to send many packets before the first ACK returns: keep a **window** of up to $N$ unacknowledged packets in
flight. Utilisation rises to about $N$ times higher, and the link is full when the window covers one bandwidth-delay
product (Chapter 3): in the example, 30 ms × 1 Gbit/s = 3.75 MB, or 2,500 packets.

Pipelining needs a larger range of sequence numbers, buffers at both ends, and a strategy for losses. There are two
classic ones.

## 15.4 Go-Back-N

- The sender may have up to $N$ unacknowledged packets, numbered in order. It keeps **one timer**, for the oldest
  unacknowledged packet.
- The receiver accepts only the next expected packet in order, discards anything out of order, and sends a
  **cumulative ACK**: "I have everything up to $n$".
- On timeout, the sender resends **every** unacknowledged packet, from the oldest.

<figure class="mars-fig">
<svg viewBox="0 0 560 120" width="560" role="img" aria-label="A sliding window over sequence numbers">
<g stroke="currentColor" stroke-width="1.5" fill="none">
<rect x="20" y="40" width="35" height="30" class="soft-acc"/><rect x="55" y="40" width="35" height="30" class="soft-acc"/><rect x="90" y="40" width="35" height="30" class="soft-acc"/>
<rect x="125" y="40" width="35" height="30" class="soft"/><rect x="160" y="40" width="35" height="30" class="soft"/><rect x="195" y="40" width="35" height="30" class="soft"/><rect x="230" y="40" width="35" height="30" class="soft"/>
<rect x="265" y="40" width="35" height="30"/><rect x="300" y="40" width="35" height="30"/><rect x="335" y="40" width="35" height="30"/><rect x="370" y="40" width="35" height="30"/><rect x="405" y="40" width="35" height="30"/>
<rect x="123" y="34" width="179" height="42" class="na" stroke-width="3"/></g>
<g font-size="12" fill="currentColor" text-anchor="middle">
<text x="37" y="60">0</text><text x="72" y="60">1</text><text x="107" y="60">2</text><text x="142" y="60">3</text><text x="177" y="60">4</text><text x="212" y="60">5</text><text x="247" y="60">6</text><text x="282" y="60">7</text><text x="317" y="60">8</text><text x="352" y="60">9</text>
<text x="72" y="100">acknowledged</text><text x="195" y="100">sent, not yet ACKed</text><text x="300" y="100">may send</text><text x="400" y="100">not yet allowed</text><text x="212" y="25">window, N = 5</text></g>
</svg>
<figcaption>A sliding window: as ACKs arrive the window slides right, allowing new packets to be sent.</figcaption>
</figure>

Go-Back-N is simple (the receiver keeps no buffer) but wasteful: one lost packet in a large window causes many correct
packets to be resent.

## 15.5 Selective Repeat

- The receiver **buffers** out-of-order packets and ACKs each one individually.
- The sender keeps a timer per packet and resends **only** the ones not acknowledged.
- When the missing packet arrives, the receiver delivers it and all the buffered ones after it, in order.

There is a subtle limit: with $k$-bit sequence numbers (numbers $0$ to $2^k - 1$, wrapping round), the window must be at
most **half** the sequence space, $N \le 2^{k-1}$. Otherwise, after all ACKs of a window are lost, the receiver cannot
tell a resend of an old packet from a new packet that reuses the same number. (Go-Back-N allows $N \le 2^k - 1$.)

TCP mixes the two: cumulative ACKs like Go-Back-N, plus **selective acknowledgements (SACK)** telling the sender exactly
which later blocks have arrived, so it resends only the gaps.

## 15.6 Faster loss detection

Waiting for a timeout is slow: timers must be longer than the RTT, which varies. A faster signal: if the receiver keeps
acknowledging the same packet while later ones arrive, something is missing. TCP treats **three duplicate ACKs** as a
loss and resends immediately (**fast retransmit**, Chapter 16). Modern stacks use time-based detection (RACK, RFC 8985):
a packet is lost if a packet sent sufficiently later has been acknowledged.

## 15.7 Flow control

The receiver may be slower than the network: a phone writing to a slow card. **Flow control** stops the sender
overflowing the receiver's buffer: each ACK carries the space left (the **receive window**), and the sender never has
more than that outstanding. Flow control protects the *receiver*; **congestion control** (Chapter 17) protects the
*network*. TCP's sending window is the smaller of the two.

## 15.8 Forward error correction instead

On long-delay or lossy links, a retransmission costs at least one RTT. An alternative is to send redundancy so that the
receiver can rebuild lost packets: for every $k$ data packets send $n - k$ repair packets, and any $k$ of the $n$ are
enough. Fountain codes (RaptorQ, RFC 6330) do this for broadcast video and satellite links; deep-space links lean
heavily on it, since a Mars round trip is up to 44 minutes ([Wireless, chapter 14](../wireless/14-Satellites-and-Deep-Space.md)).

## Check yourself

??? question "1. Why are sequence numbers needed even if packets are never reordered?"
    ACKs can be lost or corrupted, so the sender may resend a packet the receiver already has; sequence numbers let the receiver recognise the duplicate.

??? question "2. With 1,000-byte packets at 100 Mbit/s and a 20 ms RTT, what window (in packets) keeps the link full?"
    BDP = 10⁸ × 0.02 = 2×10⁶ bits = 250,000 bytes, so about 250 packets.

??? question "3. With 3-bit sequence numbers, what is the largest Selective Repeat window?"
    2² = 4 (half of the 8 numbers).

??? info "Sources"
    - Kurose and Ross, *Computer Networking*, 8th ed., section 3.4 (building rdt 1.0 to 3.0, GBN and SR).
    - K. Bartlett, R. Scantlebury, P. Wilkinson, "A Note on Reliable Full-Duplex Transmission over Half-Duplex Links", *CACM*, 1969 (alternating bit).
    - RFC 2018 (TCP SACK), RFC 8985 (RACK-TLP), RFC 6330 (RaptorQ).
