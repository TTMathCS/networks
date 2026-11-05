# 6. Error-correcting codes

*Shannon proved good codes exist; it took fifty years to build ones that reach his limit. This chapter gives the algebra (finite fields and polynomials), then the codes networks use: parity and Hamming codes, CRCs, Reed-Solomon, convolutional and turbo codes, LDPC and polar codes.*

!!! abstract "In this chapter"
    **You will learn:** Hamming distance and what it lets a code detect and correct; linear codes, generator and
    parity-check matrices; the Hamming(7,4) code worked by hand; polynomial codes and why CRCs catch bursts; Reed-Solomon
    over GF(2⁸); convolutional codes and Viterbi; turbo, LDPC and polar codes and where each is used.

    **You need:** [Chapter 1](01-Bits-Binary-and-Masks.md) (XOR), [Chapter 5](05-Information-and-Capacity.md); a little matrix multiplication.

## 6.1 Distance

The **Hamming distance** between two bit strings is the number of positions where they differ. The **minimum distance**
$d$ of a code is the smallest distance between any two codewords. Then the code can:

- **detect** up to $d - 1$ errors (fewer flips cannot turn one codeword into another);
- **correct** up to $t = \lfloor (d - 1)/2 \rfloor$ errors (the received word is still closest to the right codeword).

A single parity bit gives $d = 2$: detect 1 error, correct none. Repeating each bit three times gives $d = 3$: correct 1,
at the cost of tripling the data. The **rate** $k/n$ ($k$ data bits in $n$ code bits) measures efficiency.

## 6.2 Linear codes

Working with bits where addition is XOR (the field **GF(2)**), a **linear code** is the set of all $c = u G$ for data
vectors $u$ and a $k \times n$ **generator matrix** $G$. A **parity-check matrix** $H$ satisfies $H c^T = 0$ exactly
for codewords. If a received word is $r = c + e$ (error pattern $e$), the **syndrome** $s = H r^T = H e^T$ depends only
on the error, which lets the receiver identify it.

## 6.3 Hamming(7,4)

Richard Hamming (Bell Labs, 1950) built a code with 4 data bits, 3 parity bits and $d = 3$: it corrects any single
error. Place data bits $d_1..d_4$ at positions 3, 5, 6, 7 and parity bits at positions 1, 2, 4 (the powers of 2). Each
parity bit covers the positions whose binary number has its bit set:

- $p_1$ (position 1) covers 1, 3, 5, 7
- $p_2$ (position 2) covers 2, 3, 6, 7
- $p_4$ (position 4) covers 4, 5, 6, 7

each chosen to make its group's parity even.

**Example.** Data 1011 → positions 3, 5, 6, 7 = 1, 0, 1, 1. $p_1 = 1 \oplus 0 \oplus 1 = 0$; $p_2 = 1 \oplus 1 \oplus 1 =
1$; $p_4 = 0 \oplus 1 \oplus 1 = 0$. Codeword (positions 1–7): `0 1 1 0 0 1 1`.

Flip position 6: received `0 1 1 0 0 0 1`. Recheck: group 1 (1,3,5,7) = 0,1,0,1 even ✓; group 2 (2,3,6,7) = 1,1,0,1
odd ✗; group 4 (4,5,6,7) = 0,0,0,1 odd ✗. The failing checks are 2 and 4: $2 + 4 = 6$, the position of the error. Flip
it back. The syndrome literally spells the error's position in binary.

Extended with one overall parity bit, it becomes **SECDED** (single error correct, double error detect), used in ECC
memory.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 395" role="img" aria-labelledby="sk-nm-hamming-t"><title id="sk-nm-hamming-t">Three overlapping circles for the parity checks p1, p2 and p4; bit 6 sits where the p2 and p4 circles overlap, and both of those checks fail after it flips</title><defs><filter id="sk-nm-hamming-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nm-hamming-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nm-hamming-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nm-hamming-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nm-hamming-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="395" filter="url(#sk-nm-hamming-paper)"/><g filter="url(#sk-nm-hamming-pen)"><text x="30" y="44" class="h">Two checks fail: they point at bit 6</text><circle cx="220" cy="160" r="85" class="p dash" style="fill:none"/><circle cx="320" cy="160" r="85" class="p red" style="fill:none"/><circle cx="270" cy="245" r="85" class="p red" style="fill:none"/><text x="40" y="100" class="s">p₁: even ✓</text><text x="440" y="100" class="s">p₂: odd ✗</text><text x="400" y="330" class="s">p₄: odd ✗</text><circle cx="175" cy="130" r="17" class="p soft"/><text x="175" y="136" text-anchor="middle" class="l">0</text><text x="191" y="116" class="s" style="font-size:11px">1</text><circle cx="365" cy="130" r="17" class="p soft"/><text x="365" y="136" text-anchor="middle" class="l">1</text><text x="381" y="116" class="s" style="font-size:11px">2</text><circle cx="270" cy="120" r="17" class="p soft"/><text x="270" y="126" text-anchor="middle" class="l">1</text><text x="286" y="106" class="s" style="font-size:11px">3</text><circle cx="270" cy="300" r="17" class="p soft"/><text x="270" y="306" text-anchor="middle" class="l">0</text><text x="286" y="286" class="s" style="font-size:11px">4</text><circle cx="215" cy="225" r="17" class="p soft"/><text x="215" y="231" text-anchor="middle" class="l">0</text><text x="231" y="211" class="s" style="font-size:11px">5</text><circle cx="325" cy="225" r="17" class="p gold"/><text x="325" y="231" text-anchor="middle" class="l">0</text><text x="341" y="211" class="s" style="font-size:11px">6</text><circle cx="270" cy="190" r="17" class="p soft"/><text x="270" y="196" text-anchor="middle" class="l">1</text><text x="286" y="176" class="s" style="font-size:11px">7</text><text x="470" y="180" class="s">received</text><text x="470" y="200" style="font-family:'IBM Plex Mono',monospace;font-size:15px;fill:#3a2a1e">0110001</text><text x="470" y="240" class="s">2 + 4 = 6:</text><text x="470" y="260" class="s">flip bit 6 back</text><text x="30" y="380" class="s">Each bit sits in the circles of the checks that cover it; small numbers are positions.</text></g></svg><figcaption>Sketched for this page. The example on this page: 0110011 sent, bit 6 flipped.</figcaption></figure>

## 6.4 Polynomial codes and CRCs

Treat a string of bits as a polynomial over GF(2): `1101` is $x^3 + x^2 + 1$. A **cyclic code** with generator
polynomial $g(x)$ of degree $r$ consists of all multiples of $g(x)$; a CRC appends the remainder of $D(x)\,x^r$ divided
by $g(x)$ so the result is a multiple (networks book, Chapter 5, works an example).

**Why CRCs catch bursts.** An error pattern $e(x)$ goes undetected only if $g(x)$ divides it. A burst of length
$\le r$ is $x^i\, b(x)$ with $b(x)$ of degree $< r$ and constant term 1. If $g(x)$ has a constant term, it shares no
factor with $x^i$, and it cannot divide $b(x)$, whose degree is smaller. So every burst of length up to $r$ is caught.
If $(x + 1)$ divides $g(x)$, every error with an odd number of flipped bits is caught too (such $e(x)$ has $e(1) = 1$,
so it is not divisible by $x+1$). Engineers choose $g(x)$ (like Ethernet's CRC-32 or iSCSI's CRC-32C) to maximise the
minimum distance at typical frame lengths.

## 6.5 Reed-Solomon

**Reed-Solomon codes** (1960) work on symbols (often bytes) rather than bits, in the finite field **GF(2⁸)** with 256
elements. A message of $k$ symbols defines a polynomial of degree $< k$; the codeword is its values at $n$ points.
Any $k$ correct values determine the polynomial (as two points determine a line), so the code corrects up to
$(n - k)/2$ wrong symbols, or $n - k$ **erasures** (symbols known to be missing). Because a burst of bit errors
corrupts few bytes, RS is excellent against bursts. Used in: CDs and DVDs, QR codes, DSL, DVB, 100G Ethernet's
RS(528,514) FEC, deep-space links (concatenated with convolutional codes, from Voyager onward).

## 6.6 Convolutional and turbo codes

A **convolutional code** passes the bits through a shift register and outputs combinations (XORs) of the last few
bits. It is decoded with the **Viterbi algorithm** (1967), a dynamic program over the encoder's states that finds the
most likely transmitted sequence. Used in GSM, older Wi-Fi (802.11a/g) and deep space.

**Turbo codes** (Berrou, Glavieux and Thitimajshima, 1993) run two convolutional encoders on the data, one on a shuffled
(**interleaved**) copy, and decode **iteratively**: two decoders exchange soft beliefs ("this bit is 1 with probability
0.8") until they agree. They came within about 0.5 dB of the Shannon limit, astonishing at the time. Used in 3G and 4G
data channels and many space missions (CCSDS).

## 6.7 LDPC and polar codes

**Low-density parity-check (LDPC)** codes (Gallager, 1962, forgotten, rediscovered by MacKay and Neal in 1996) have a
large, sparse parity-check matrix $H$. Decoding is **belief propagation** on a graph of bits and checks, highly
parallel in hardware, and well-designed LDPC codes come within a fraction of a dB of capacity. Used in Wi-Fi (802.11n
onward), 5G data channels, 10GBASE-T, DVB-S2 and satellite links.

**Polar codes** (Arıkan, 2009) are the first codes *proved* to reach capacity with practical encoding and decoding: a
recursive transform turns $N$ uses of a channel into some almost-perfect and some almost-useless channels, and data is
sent only on the good ones. 5G uses them for control channels.

| Code | Where in networks |
| --- | --- |
| Parity, CRC | detection on every link |
| Hamming / SECDED | memory, some short links |
| Reed-Solomon | 100G+ Ethernet, DSL, optical, storage, deep space |
| Convolutional + Viterbi | older Wi-Fi, GSM, space |
| Turbo | 3G/4G, space (CCSDS) |
| LDPC | Wi-Fi 4–7, 5G data, DVB-S2, 10GBASE-T, CCSDS |
| Polar | 5G control |

## Check yourself

??? question "1. A code has minimum distance 5. How many errors can it correct? Detect?"
    Correct ⌊4/2⌋ = 2; detect 4.

??? question "2. Encode data 0110 with Hamming(7,4) as above."
    Positions 3,5,6,7 = 0,1,1,0. p₁ = 0⊕1⊕0 = 1, p₂ = 0⊕1⊕0 = 1, p₄ = 1⊕1⊕0 = 0. Codeword 1 1 0 0 1 1 0.

??? question "3. Why is Reed-Solomon good against burst errors?"
    It corrects whole symbols (bytes); a burst of many bit errors touches only a few symbols.

??? info "Sources"
    - R. Hamming, "Error Detecting and Error Correcting Codes", *Bell System Technical Journal*, 1950.
    - I. Reed and G. Solomon, "Polynomial Codes over Certain Finite Fields", *J. SIAM*, 1960.
    - C. Berrou, A. Glavieux, P. Thitimajshima, "Near Shannon Limit Error-Correcting Coding and Decoding: Turbo-codes", ICC 1993.
    - R. Gallager, *Low-Density Parity-Check Codes*, MIT Press, 1963; E. Arıkan, "Channel Polarization", *IEEE Trans. IT*, 2009.
    - S. Lin and D. Costello, *Error Control Coding*, 2nd ed., 2004; 3GPP TS 38.212 (5G coding).
