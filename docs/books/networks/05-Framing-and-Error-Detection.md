# 5. Framing and error detection

*A link delivers a stream of bits, some of them wrong. The link layer cuts the stream into frames, finds where each starts and ends, and detects (or corrects) errors. This chapter covers framing, parity, the Internet checksum, CRCs and how links share a medium.*

!!! abstract "In this chapter"
    **You will learn:** byte stuffing and bit stuffing; parity; the Internet checksum; how a cyclic redundancy check
    works and what it catches; error detection versus correction; multiple access (ALOHA, CSMA/CD, token passing).

    **You need:** [Chapter 4](04-The-Physical-Layer.md); binary numbers ([Math, chapter 1](../math/01-Bits-Binary-and-Masks.md)).

## 5.1 Framing

The receiver sees an endless stream of bits. Where does a frame begin? Three classic answers:

- **A flag with byte stuffing.** PPP marks frame boundaries with the byte `0x7E`. If `0x7E` appears inside the data,
  it is sent as `0x7D 0x5E` (an escape byte followed by a modified byte), and `0x7D` itself as `0x7D 0x5D`.
- **A flag with bit stuffing.** HDLC uses the pattern `01111110`. Inside the data, after any five 1s in a row the
  sender inserts a 0, so six 1s never appear except in a flag; the receiver removes the extra 0s.
- **A preamble and a length.** Ethernet starts each frame with 7 bytes of `10101010` (so the receiver can lock its
  clock) and a start-of-frame byte `10101011`; the physical layer marks the end. Faster Ethernets use special control
  codes from the line code (Chapter 4) as boundaries.

## 5.2 Parity

The simplest check adds one **parity bit** so the number of 1s is even. It catches any single flipped bit, but misses
two flips. **Two-dimensional parity** arranges data in a grid with a parity bit per row and per column: a single error
shows up in one row and one column, which pinpoints it, so it can even be *corrected*.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 415" role="img" aria-labelledby="sk-nb-parity-t"><title id="sk-nb-parity-t">A four by four grid of bits with a parity bit for each row and column; one bit flipped in transit makes its row and its column odd, which pinpoints it</title><defs><filter id="sk-nb-parity-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nb-parity-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nb-parity-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nb-parity-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nb-parity-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="415" filter="url(#sk-nb-parity-paper)"/><g filter="url(#sk-nb-parity-pen)"><text x="30" y="44" class="h">One flip, found by row and column</text><path class="p room" d="M120 90 L162 90 L162 132 L120 132Z"/><text x="141.0" y="118.0" text-anchor="middle" class="l">1</text><path class="p room" d="M162 90 L204 90 L204 132 L162 132Z"/><text x="183.0" y="118.0" text-anchor="middle" class="l">0</text><path class="p room" d="M204 90 L246 90 L246 132 L204 132Z"/><text x="225.0" y="118.0" text-anchor="middle" class="l">1</text><path class="p room" d="M246 90 L288 90 L288 132 L246 132Z"/><text x="267.0" y="118.0" text-anchor="middle" class="l">1</text><path class="p gold" d="M288 90 L330 90 L330 132 L288 132Z"/><text x="309.0" y="118.0" text-anchor="middle" class="l">1</text><path class="p room" d="M120 132 L162 132 L162 174 L120 174Z"/><text x="141.0" y="160.0" text-anchor="middle" class="l">0</text><path class="p room" d="M162 132 L204 132 L204 174 L162 174Z"/><text x="183.0" y="160.0" text-anchor="middle" class="l">1</text><path class="p room" d="M204 132 L246 132 L246 174 L204 174Z"/><text x="225.0" y="160.0" text-anchor="middle" class="l">0</text><path class="p room" d="M246 132 L288 132 L288 174 L246 174Z"/><text x="267.0" y="160.0" text-anchor="middle" class="l">0</text><path class="p gold" d="M288 132 L330 132 L330 174 L288 174Z"/><text x="309.0" y="160.0" text-anchor="middle" class="l">0</text><path class="p room" d="M120 174 L162 174 L162 216 L120 216Z"/><text x="141.0" y="202.0" text-anchor="middle" class="l">1</text><path class="p room" d="M162 174 L204 174 L204 216 L162 216Z"/><text x="183.0" y="202.0" text-anchor="middle" class="l">1</text><path class="p room" d="M204 174 L246 174 L246 216 L204 216Z"/><text x="225.0" y="202.0" text-anchor="middle" class="l">0</text><path class="p room" d="M246 174 L288 174 L288 216 L246 216Z"/><text x="267.0" y="202.0" text-anchor="middle" class="l">1</text><path class="p gold" d="M288 174 L330 174 L330 216 L288 216Z"/><text x="309.0" y="202.0" text-anchor="middle" class="l">1</text><path class="p room" d="M120 216 L162 216 L162 258 L120 258Z"/><text x="141.0" y="244.0" text-anchor="middle" class="l">0</text><path class="p room" d="M162 216 L204 216 L204 258 L162 258Z"/><text x="183.0" y="244.0" text-anchor="middle" class="l">0</text><path class="p room" d="M204 216 L246 216 L246 258 L204 258Z"/><text x="225.0" y="244.0" text-anchor="middle" class="l">1</text><path class="p room" d="M246 216 L288 216 L288 258 L246 258Z"/><text x="267.0" y="244.0" text-anchor="middle" class="l">1</text><path class="p gold" d="M288 216 L330 216 L330 258 L288 258Z"/><text x="309.0" y="244.0" text-anchor="middle" class="l">0</text><path class="p gold" d="M120 258 L162 258 L162 300 L120 300Z"/><text x="141.0" y="286.0" text-anchor="middle" class="l">0</text><path class="p gold" d="M162 258 L204 258 L204 300 L162 300Z"/><text x="183.0" y="286.0" text-anchor="middle" class="l">0</text><path class="p gold" d="M204 258 L246 258 L246 300 L204 300Z"/><text x="225.0" y="286.0" text-anchor="middle" class="l">1</text><path class="p gold" d="M246 258 L288 258 L288 300 L246 300Z"/><text x="267.0" y="286.0" text-anchor="middle" class="l">1</text><path class="p gold" d="M288 258 L330 258 L330 300 L288 300Z"/><text x="309.0" y="286.0" text-anchor="middle" class="l">0</text><circle cx="225.0" cy="153.0" r="17" class="p red" fill="none"/><path class="p red" d="M338 153.0 L370 153.0"/><text x="376" y="158.0" class="s">row 2: odd count of 1s</text><path class="p red" d="M225.0 306 L225.0 330"/><text x="164" y="348" class="s">column 3: odd too</text><text x="376" y="284" class="s">gold: parity bits, chosen</text><text x="376" y="304" class="s">so every line has even 1s</text><text x="30" y="400" class="s">The crossing points to the one wrong bit, so it can be flipped back: corrected, not just caught.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## 5.3 The Internet checksum

IP (version 4), UDP and TCP use a 16-bit **checksum**: treat the data as 16-bit words, add them using **one's-complement
arithmetic** (carries out of the top bit wrap around and are added back in), and send the complement of the sum. The
receiver adds everything including the checksum and expects all 1s.

It is fast in software but weak: it cannot detect two words swapped, or errors that cancel. That is acceptable because
links below it use CRCs, and it is end to end (Chapter 2).

## 5.4 Cyclic redundancy checks

Almost every link (Ethernet, Wi-Fi, USB, disks) uses a **cyclic redundancy check (CRC)**. Treat the $d$ data bits as a
polynomial with coefficients 0 or 1, all arithmetic done without carries (addition is XOR). Sender and receiver agree a
**generator** polynomial $G(x)$ of degree $r$. The sender appends $r$ bits $R$ chosen so that the whole frame is exactly
divisible by $G$:

$$R = \text{remainder of } \frac{D(x) \cdot x^r}{G(x)}$$

The receiver divides what arrived by $G$; any non-zero remainder means an error.

**Worked example.** Data `101110`, generator `1001` ($x^3 + 1$, so $r = 3$). Append three 0s: `101110000`. Long division
with XOR (each step XORs the generator under the leftmost 1):

```
101110000
1001          XOR the generator under the leading 1
001010000
  1001
000011000
    1001
000001010
     1001
000000011     remainder 011
```

The frame sent is `101110011`. Divide it by `1001` and the remainder is 0.

With a well-chosen generator of degree $r$, a CRC detects every burst of errors up to $r$ bits long, every odd number
of bit errors (if $x+1$ divides $G$), and all but a fraction $2^{-r}$ of other error patterns. Ethernet's CRC-32 uses

$$G(x) = x^{32} + x^{26} + x^{23} + x^{22} + x^{16} + x^{12} + x^{11} + x^{10} + x^{8} + x^{7} + x^{5} + x^{4} + x^{2} + x + 1$$

Hardware computes CRCs with a shift register and a few XOR gates, at line rate.
[Math foundations, chapter 6](../math/06-Error-Correcting-Codes.md) explains the algebra.

## 5.5 Detect, or correct?

When errors are rare and a resend is cheap (wired Ethernet: about one bit in $10^{12}$ wrong), **detect and
retransmit**. When errors are common or a resend is costly (radio, deep space, fast optics), **forward error
correction (FEC)** adds enough redundancy to fix errors at the receiver. Wi-Fi and 5G use LDPC codes; 5G control
channels use polar codes; the Deep Space Network uses turbo and LDPC codes; 100 Gbit/s Ethernet uses Reed-Solomon FEC.

## 5.6 Sharing one medium

When many stations share one cable or one radio channel, they need a **multiple access** protocol. Three families:

| Family | Idea | Examples |
| --- | --- | --- |
| **Channel partitioning** | give each station a fixed slice of time, frequency or code | TDMA, FDMA, CDMA, OFDMA in cellular |
| **Random access** | send when you have data; if two collide, back off a random time | ALOHA, CSMA/CD (old Ethernet), CSMA/CA (Wi-Fi) |
| **Taking turns** | a token or a controller decides who sends | Token Ring, Bluetooth, DOCSIS upstream scheduling |

**ALOHA** (University of Hawaii, 1971) simply sent and retried on collision; slotted ALOHA reaches at most $1/e \approx
37\%$ efficiency. **CSMA/CD**, used by classic shared Ethernet, listens before sending and stops as soon as it detects a
collision, then waits a random number of slot times chosen by **binary exponential backoff** (after the $n$-th
collision, a random number from 0 to $2^{\min(n,10)} - 1$). Modern Ethernet is full-duplex and switched, so collisions no
longer happen; Wi-Fi cannot detect collisions while sending, so it avoids them instead (CSMA/CA,
[Wireless, chapter 7](../wireless/07-How-Wi-Fi-Works.md)).

## Check yourself

??? question "1. In HDLC bit stuffing, what is sent for the data bits 0111111?"
    After the first five 1s a 0 is inserted, then the sixth 1 follows: 01111101.

??? question "2. Why do links use a CRC when TCP already has a checksum?"
    The CRC is far stronger (catches all short bursts and most other patterns) and runs in hardware per link; the weaker checksum is an end-to-end safety net.

??? question "3. Why does Wi-Fi avoid collisions rather than detecting them like old Ethernet?"
    A radio cannot hear others while it is transmitting (its own signal is far stronger), so it cannot detect a collision as it happens.

??? info "Sources"
    - W. Peterson and D. Brown, "Cyclic Codes for Error Detection", *Proc. IRE*, 1961.
    - RFC 1071 (computing the Internet checksum), RFC 1662 (PPP framing).
    - N. Abramson, "The ALOHA System", AFIPS 1970; IEEE 802.3-2022 (CRC-32, CSMA/CD).
    - Peterson and Davie, *Computer Networks: A Systems Approach*, 6th ed., chapter 2.
