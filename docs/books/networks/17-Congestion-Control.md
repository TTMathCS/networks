# 17. Congestion control

*In October 1986 the link between Lawrence Berkeley Laboratory and UC Berkeley, 400 metres apart, fell from 32 kbit/s to 40 bit/s: senders retransmitting into full queues had caused congestion collapse. TCP's congestion control, added in 1988, saved the internet. This chapter explains how senders share a network they cannot see, from AIMD to CUBIC and BBR.*

!!! abstract "In this chapter"
    **You will learn:** what congestion is and why collapse happens; the congestion window; slow start and AIMD;
    Reno and the sawtooth; why AIMD is fair; the throughput formula; CUBIC; BBR; ECN and L4S.

    **You need:** [Chapters 15 and 16](15-Reliable-Delivery.md). [Math, chapter 9](../math/09-Feedback-and-Fairness.md)
    has the control theory.

## 17.1 The problem

Flow control stops a sender from swamping the receiver. But the network in between has no voice in TCP: if many senders
push more than a bottleneck can carry, its queue fills, delay rises, packets are dropped, senders retransmit, and the
retransmissions add more load. Throughput can fall to almost nothing while every link is busy: **congestion collapse**.

Each sender must therefore guess how much the path can take, using only what it observes: ACKs coming back (good), and
losses or rising delay (bad).

## 17.2 The congestion window

The sender keeps a **congestion window** `cwnd` (in bytes or segments) and never has more than
$\min(\text{cwnd}, \text{rwnd})$ unacknowledged. Since about one window is sent per RTT,

$$\text{rate} \approx \frac{\text{cwnd}}{\text{RTT}}$$

TCP is **self-clocking**: new segments are released as ACKs return, so the sending rate automatically follows the
bottleneck's pace.

## 17.3 Slow start

A new connection does not know the path's capacity. **Slow start** begins with a small window (10 segments today,
RFC 6928) and adds one segment per ACK, which **doubles** `cwnd` every RTT: exponential growth, despite the name. It
stops at the first loss or when `cwnd` reaches the **slow-start threshold** `ssthresh`.

## 17.4 AIMD: additive increase, multiplicative decrease

After slow start TCP is in **congestion avoidance**:

- **Additive increase**: add one segment per RTT (`cwnd += MSS × MSS / cwnd` per ACK).
- **Multiplicative decrease**: on a loss detected by duplicate ACKs, halve: `ssthresh = cwnd / 2`, `cwnd = ssthresh`
  (**fast recovery**, TCP Reno). On a timeout, assume the worst: `ssthresh = cwnd/2`, `cwnd = 1` segment, slow start
  again.

The window traces a **sawtooth**: up one segment per RTT until a loss, cut in half, climb again.

<figure class="mars-fig">
<svg viewBox="0 0 560 190" width="560" role="img" aria-label="TCP Reno congestion window: slow start curve, then sawtooth">
<g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="40" y1="160" x2="540" y2="160"/><line x1="40" y1="160" x2="40" y2="15"/></g>
<path class="na" fill="none" stroke-width="3" d="M40 158 L60 155 L80 148 L100 132 L120 100 L135 60 L135 100 L230 50 L230 100 L325 50 L325 100 L420 50 L420 100 L515 50"/>
<g font-size="12" fill="currentColor"><text x="60" y="180">time (RTTs)</text><text x="5" y="20">cwnd</text>
<text x="70" y="85">slow start</text><text x="250" y="40">loss: halve</text><text x="160" y="125">+1 segment per RTT</text></g>
</svg>
<figcaption>TCP Reno: slow start doubles the window each RTT; after the first loss, the window climbs by one segment per RTT and halves at each loss.</figcaption>
</figure>

## 17.5 Why AIMD is fair

Chiu and Jain (1989) showed that of all simple linear rules, only additive increase with multiplicative decrease makes
competing flows converge to equal shares. Picture two flows' rates as a point $(x_1, x_2)$. Additive increase moves the
point diagonally (both grow by the same amount); multiplicative decrease moves it toward the origin (both shrink in the
same ratio), which shrinks the *difference* between them. Repeat, and the point zig-zags toward the fair line
$x_1 = x_2$.

<figure class="play" data-play="aimd"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> Two flows share a link of 100 segments per round trip; flow 1 starts with 80, flow 2 with 5. Each round trip both add one; when the link overflows, both lose a packet. With AIMD (halving) the point zig-zags to the fair line; take a fixed amount off instead, or grow by a percentage, and the unfair split never goes away. A toy: real flows do not always lose packets at the same moment.</figcaption></figure>

A rough formula for a Reno flow's throughput with loss probability $p$ (Mathis and others, 1997):

$$\text{throughput} \approx \frac{\text{MSS}}{\text{RTT}} \cdot \sqrt{\frac{3}{2p}}$$

Two lessons: a flow with half the RTT gets twice the throughput (RTT unfairness), and filling a 10 Gbit/s long-distance
path with Reno would need a loss rate below about one in $10^{10}$, impossible in practice. Hence new algorithms.

## 17.6 CUBIC

**CUBIC** (Linux default since 2006, RFC 9438) grows the window as a cubic function of the time since the last loss,
centred on the window size $W_\text{max}$ where that loss happened:

$$W(t) = C\,(t - K)^3 + W_\text{max}, \qquad K = \sqrt[3]{W_\text{max}\,\beta / C}$$

with $\beta = 0.3$ (the window is cut to 70%) and $C = 0.4$. It climbs fast when far below $W_\text{max}$, slows to a
plateau near it (probing carefully where trouble was), then accelerates beyond. Growth depends on time, not on ACK
arrivals, so flows with different RTTs compete more fairly, and it fills high-BDP paths quickly.

## 17.7 BBR

Loss-based algorithms (Reno, CUBIC) only back off once buffers overflow: they keep queues full, adding delay
(bufferbloat, Chapter 3), and on links with random radio loss they slow down needlessly. **BBR** (Bottleneck Bandwidth
and Round-trip propagation time, Google 2016) instead builds a model of the path:

- `BtlBw`: the maximum delivery rate recently measured;
- `RTprop`: the minimum RTT recently measured;

and sends at about `BtlBw`, keeping about one BDP (`BtlBw × RTprop`) in flight: the point where the pipe is full but
the queue empty. It periodically probes for more bandwidth (sending 25% faster briefly) and for a lower RTT (draining
the queue). BBRv1 could be unfair to CUBIC and caused heavy loss in shallow buffers; BBRv2 and v3 also react to loss and
ECN. Google uses BBR on its services and in QUIC.

## 17.8 Signals from the network: ECN and L4S

Rather than dropping packets, a router with a growing queue can **mark** them: **Explicit Congestion Notification**
(RFC 3168) uses two bits in the IP header. The receiver echoes the mark (TCP's ECE flag), and the sender slows down as
if a packet were lost, but nothing was lost. **L4S** (RFC 9330–9332) goes further: routers mark early and often, using
a separate shallow queue, and scalable senders (such as TCP Prague) reduce their rate in proportion to the fraction
marked, keeping queueing delay around a millisecond. Cable and mobile networks began deploying it in 2024–2025.

## 17.9 Beyond TCP

Every sender on a shared network needs congestion control: QUIC uses the same algorithms (usually CUBIC or BBR), video
calls use delay-based schemes (Google Congestion Control in WebRTC), and data centres use their own (DCTCP, with ECN,
Chapter 21). Applications that open many parallel connections, or UDP flows with none, get more than their share: one
reason "fairness" between flows is still argued about.

## Check yourself

??? question "1. cwnd is 20 segments when three duplicate ACKs arrive (Reno). What happens to ssthresh and cwnd? And after a timeout instead?"
    Duplicate ACKs: ssthresh = 10, cwnd = 10, continue in congestion avoidance. Timeout: ssthresh = 10, cwnd = 1, slow start.

??? question "2. By the Mathis formula, how does throughput change if the loss rate falls from 1% to 0.25%?"
    It scales with 1/√p: √(0.01/0.0025) = 2, so throughput doubles.

??? question "3. What two quantities does BBR estimate, and what window does it aim for?"
    The bottleneck bandwidth (max delivery rate) and the round-trip propagation time (min RTT); it aims to keep about their product, one BDP, in flight.

??? info "Sources"
    - V. Jacobson, "Congestion Avoidance and Control", SIGCOMM 1988 (the 1986 collapse and the fix).
    - D. Chiu and R. Jain, "Analysis of the Increase and Decrease Algorithms for Congestion Avoidance", *Computer Networks and ISDN Systems*, 1989.
    - M. Mathis, J. Semke, J. Mahdavi, T. Ott, "The Macroscopic Behavior of the TCP Congestion Avoidance Algorithm", *CCR*, 1997.
    - RFC 5681 (TCP congestion control), RFC 6928 (initial window), RFC 9438 (CUBIC), RFC 3168 (ECN), RFC 9330 (L4S).
    - N. Cardwell et al., "BBR: Congestion-Based Congestion Control", *ACM Queue*, 2016.
