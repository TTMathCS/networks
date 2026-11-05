# 3. Delay, loss and throughput

*Three numbers describe how well a network path performs: how long a packet takes, how many are lost, and how many bits per second get through. This chapter breaks delay into its four parts, explains the bandwidth-delay product, and shows why a nearly full link is slow.*

!!! abstract "In this chapter"
    **You will learn:** processing, queueing, transmission and propagation delay; round-trip time; throughput and
    the bottleneck link; the bandwidth-delay product; why queues explode near full load; jitter.

    **You need:** [Chapter 1](01-What-a-Network-Is.md); simple algebra.

## 3.1 The four delays at each hop

When a packet passes through a router, four things take time:

1. **Processing** $d_\text{proc}$: reading the header, choosing the output link, checking for errors. Microseconds or
   less in modern hardware.
2. **Queueing** $d_\text{queue}$: waiting behind other packets for the output link. Zero on an idle link, large on a
   busy one, and the only part that changes from moment to moment.
3. **Transmission** $d_\text{trans} = L / R$: pushing all $L$ bits of the packet onto a link of rate $R$ bits per
   second. A 1,500-byte packet (12,000 bits) takes 12 µs at 1 Gbit/s and 1.2 ms at 10 Mbit/s.
4. **Propagation** $d_\text{prop} = d / s$: the time for one bit to travel the link's length $d$ at signal speed
   $s$, about $2 \times 10^8$ m/s in fibre or copper (two-thirds of the speed of light). 1,000 km takes 5 ms.

$$d_\text{nodal} = d_\text{proc} + d_\text{queue} + d_\text{trans} + d_\text{prop}$$

Transmission and propagation are easy to confuse. Think of cars on a motorway with a toll booth: transmission is the
time for a convoy of ten cars to pass through the booth; propagation is the time to drive to the next booth.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 330" role="img" aria-labelledby="sk-nb-delays-t"><title id="sk-nb-delays-t">Inside a router a packet is processed, waits in a queue, is pushed onto the link bit by bit, then travels the wire to the next router</title><defs><filter id="sk-nb-delays-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nb-delays-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nb-delays-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nb-delays-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nb-delays-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="330" filter="url(#sk-nb-delays-paper)"/><g filter="url(#sk-nb-delays-pen)"><text x="30" y="44" class="h">Four waits at every router</text><path class="p soft" d="M30 110 L270 110 L270 250 L30 250Z"/><text x="40" y="132" class="s">router</text><path class="p gold" d="M60 170 L88 170 L88 196 L60 196Z"/><path class="p gold" d="M94 170 L122 170 L122 196 L94 196Z"/><path class="p gold" d="M128 170 L156 170 L156 196 L128 196Z"/><path class="p gold" d="M162 170 L190 170 L190 196 L162 196Z"/><path class="p room" d="M204 160 L250 160 L250 206 L204 206Z"/><text x="227" y="188" text-anchor="middle" class="s">out</text><text x="60" y="228" class="s">2 queueing: waiting in line</text><text x="160" y="154" class="s">1 processing</text><path class="p" d="M250 183 L590 183"/><path class="p gold" d="M252 175 L300 175 L300 191 L252 191Z"/><path class="p " d="M312 183 L360 183" marker-end="url(#sk-nb-delays-ah)"/><path class="p room" d="M590 150 L620 150 L620 216 L590 216Z"/><text x="605" y="240" text-anchor="middle" class="s">next</text><text x="282" y="160" class="s">3 transmission</text><text x="282" y="216" class="s">pushing every bit out</text><text x="282" y="234" class="s">L / R</text><text x="440" y="160" class="s">4 propagation</text><text x="440" y="216" class="s">travelling the wire</text><text x="440" y="234" class="s">d / s, 5 ms per 1,000 km</text><text x="30" y="290" class="s">Toll booth: transmission is the convoy passing the booth;</text><text x="30" y="310" class="s">propagation is the drive to the next booth.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

<figure class="play" data-play="delays"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> One packet crosses one link. Change its size, the link's speed and its length, then press Play: the orange part is transmission (<i>L</i>/<i>R</i>), the blue part propagation (<i>d</i>/<i>s</i>, at 2×10<sup>8</sup> m/s). On a slow link the packet is still leaving A when its first bit reaches B; on a long fast one the whole packet is in flight at once.</figcaption></figure>

## 3.2 Round-trip time

The **round-trip time (RTT)** is the time from sending a small packet to getting the reply. It sets how quickly any
conversation can go: opening a TCP connection costs one RTT, a TLS 1.3 handshake one more. Typical RTTs:

| Path | RTT |
| --- | --- |
| Same room, wired | under 1 ms |
| Across a city | 2–10 ms |
| Toronto to Vancouver (about 3,300 km) | about 60 ms |
| Toronto to Tokyo | about 150 ms |
| Via a geostationary satellite | about 600 ms |
| Earth to Mars | 6 to 44 minutes |

The speed of light sets a floor: across a fibre path of length $d$, RTT $\ge 2d / (2\times 10^8)$. No engineering
removes it; only moving the server closer helps, which is what content delivery networks do (Chapter 20).

## 3.3 Throughput and the bottleneck

**Throughput** is the rate at which bits actually arrive, end to end. Along a path of links with rates
$R_1, R_2, \dots, R_N$, it can be no more than the slowest one:

$$\text{throughput} \le \min(R_1, R_2, \dots, R_N)$$

That slowest link is the **bottleneck**. Today it is usually the access link (your home's connection or the Wi-Fi), not
the core. If $n$ flows share a link of rate $R$ fairly, each gets at most $R/n$.

## 3.4 The bandwidth-delay product

How many bits are "in flight" on a path at once? Multiply rate by round-trip time:

$$\text{BDP} = R \times \text{RTT}$$

At 1 Gbit/s and 100 ms, BDP = $10^9 \times 0.1 = 10^8$ bits, about 12.5 MB. A sender that waits for an
acknowledgement after every 64 KB would use only 0.5% of the link. To fill a "long fat pipe", a sender must keep at
least one BDP of data unacknowledged, which is why TCP needed window scaling (Chapter 16).

## 3.5 Queues and why full links are slow

Let $a$ be the average packet arrival rate (packets per second) at a link and $L$ the packet length. The **traffic
intensity** is

$$\rho = \frac{L a}{R}$$

the fraction of time the link is busy. If $\rho > 1$, packets arrive faster than they leave and the queue grows without
limit. Less obviously, delay rises steeply well before $\rho = 1$. For the simplest queue model (M/M/1, random
arrivals), the average time in the system is

$$T = \frac{1}{\mu - \lambda} = \frac{1/\mu}{1 - \rho}$$

where $\mu$ is the service rate and $\lambda$ the arrival rate. At 50% load packets take twice the bare service time;
at 90%, ten times; at 99%, a hundred times. [Math foundations, chapter 3](../math/03-Queues-and-Littles-Law.md) derives
this. Real buffers are finite, so near full load packets are also **dropped**.

## 3.6 Loss, jitter and bufferbloat

**Loss** happens when a buffer is full (congestion), when a radio frame is corrupted, or when a device fails.
**Jitter** is variation in delay from packet to packet; video calls hide it with a playout buffer of tens of
milliseconds.

In the 2000s, cheap memory let routers and home modems keep seconds of buffer. Queues filled and stayed full, adding
hundreds of milliseconds to every packet while throughput looked fine: **bufferbloat**. The fix is **active queue
management**: algorithms such as CoDel and FQ-CoDel (RFC 8289, RFC 8290) drop or mark packets when the *time* a packet
has waited exceeds a target (5 ms by default), keeping queues short.

## 3.7 Measuring

The tools are in the labs: `ping` measures RTT and loss, `traceroute` shows per-hop delay, `iperf3` measures
throughput, and a "responsiveness" test (RPM, round-trips per minute) measures delay *under load*, which is what users
feel. See [Lab 2](../../labs/02-Ping-and-Traceroute.md).

## Check yourself

??? question "1. A 1,500-byte packet crosses a 100 Mbit/s link 2,000 km long. What are its transmission and propagation delays?"
    Transmission: 12,000 / 10⁸ = 0.12 ms. Propagation: 2×10⁶ m / 2×10⁸ m/s = 10 ms.

??? question "2. What is the bandwidth-delay product of a 100 Mbit/s path with a 40 ms RTT?"
    10⁸ × 0.04 = 4×10⁶ bits = 500 KB.

??? question "3. In the M/M/1 model, how much longer do packets take at 95% load than on an empty link?"
    1/(1 − 0.95) = 20 times the bare service time.

??? info "Sources"
    - Kurose and Ross, *Computer Networking*, 8th ed., section 1.4.
    - L. Kleinrock, *Queueing Systems, Volume 1*, Wiley, 1975.
    - J. Gettys and K. Nichols, "Bufferbloat: Dark Buffers in the Internet", *ACM Queue*, 2011.
    - RFC 8289 (CoDel), RFC 8290 (FQ-CoDel), RFC 7323 (TCP window scaling); IETF draft on Responsiveness (RPM).
