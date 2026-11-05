# 1. Bits, binary and masks

*Every header field is a group of bits, and much of networking is reading and combining them. This chapter covers base 2 and base 16, bitwise operations, masks and prefixes, byte order, and one's-complement arithmetic, with the network examples that use each.*

!!! abstract "In this chapter"
    **You will learn:** converting between binary, decimal and hex; AND, OR, XOR, NOT and shifts; masks and why
    `addr & mask` gives the network; counting addresses in a prefix; big- and little-endian; one's complement and the
    Internet checksum.

    **You need:** school arithmetic.

## 1.1 Positional bases

In base 10, $507 = 5\cdot 10^2 + 0\cdot 10^1 + 7\cdot 10^0$. In **base 2** the digits are 0 and 1 and the weights are
powers of 2:

$$11000000_2 = 128 + 64 = 192$$

A byte (8 bits) holds 0 to 255. To convert decimal to binary, take the largest power of 2 that fits, subtract, repeat:
$168 = 128 + 32 + 8 = 10101000_2$.

**Base 16 (hex)** uses digits 0–9 and a–f (10–15). One hex digit is exactly 4 bits, so conversion is by groups:
$1010\,1000_2 = \text{a8}_{16} = 168$. MAC addresses, IPv6 addresses and packet dumps are written in hex for this
reason.

| Decimal | Binary | Hex |
| --- | --- | --- |
| 0 | 0000 0000 | 00 |
| 15 | 0000 1111 | 0f |
| 128 | 1000 0000 | 80 |
| 192 | 1100 0000 | c0 |
| 255 | 1111 1111 | ff |

With $n$ bits there are $2^n$ values: 16 bits give 65,536 ports, 32 bits about $4.29 \times 10^9$ IPv4 addresses,
128 bits about $3.4 \times 10^{38}$ IPv6 addresses. Useful: $2^{10} = 1024 \approx 10^3$, so $2^{32} = 4 \cdot 2^{30}
\approx 4 \times 10^9$.

## 1.2 Bitwise operations

Applied bit by bit:

| a | b | a AND b | a OR b | a XOR b |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |

- **AND with a mask** keeps the bits where the mask is 1 and clears the rest: extracting the network part of an address,
  or one flag from a flags field.
- **OR** sets bits: turning a flag on.
- **XOR** flips the bits where the other operand is 1. $a \oplus a = 0$ and $a \oplus 0 = a$, so XOR is its own
  inverse: the basis of parity, CRCs (Chapter 6) and stream ciphers.
- **NOT** flips every bit; the **shifts** `<<` and `>>` move bits left or right, multiplying or dividing by powers of 2.

Reading a field: TCP's flags are one byte; SYN is bit value `0x02` and ACK `0x10`. A SYN-ACK has flags `0x12`, and
`flags & 0x02` is non-zero exactly when SYN is set. Wireshark display filters (`tcp.flags.syn == 1`) do this for you.

## 1.3 Masks and prefixes

A **prefix length** $p$ means the mask has $p$ ones then $32 - p$ zeros:

$$\text{mask}(p) = \underbrace{1\cdots1}_{p}\underbrace{0\cdots0}_{32-p} = 2^{32} - 2^{32-p}$$

For any address $a$:

- network $= a \;\&\; \text{mask}$
- broadcast $= a \;|\; \lnot\text{mask}$
- two addresses are on the same subnet exactly when $a \;\&\; \text{mask} = b \;\&\; \text{mask}$.

A /$p$ prefix contains $2^{32-p}$ addresses. Because blocks of size $2^k$ always start at multiples of $2^k$, a network
address must have its last $32 - p$ bits zero: `10.20.3.128/25` is valid, `10.20.3.100/25` is not a network address.

**Worked example.** Is `172.16.45.200` in `172.16.32.0/20`? A /20 covers 16 values of the third byte (32–47), and 45
is among them, so yes. In bits: $45 = 0010\,1101$, mask byte for /20 is $1111\,0000$, AND gives $0010\,0000 = 32$. ✓

**Aggregation** works because prefixes nest: two /24s whose first 23 bits are equal (the third byte differs only in
its last bit, as with 4 and 5) form one /23.

## 1.4 Byte order

A 16-bit number like port 443 = `0x01BB` takes two bytes. **Big-endian** stores the most significant byte first
(`01 BB`); **little-endian** stores it last (`BB 01`). Internet protocols use big-endian, called **network byte
order**; most CPUs (x86, ARM in its usual mode) are little-endian. That is why socket code calls `htons()` ("host to
network short") before putting a port in a header, and why `struct.pack("!H", 443)` in Python uses `!` for network
order.

## 1.5 One's-complement arithmetic and the checksum

The Internet checksum (networks book, Chapter 5) adds 16-bit words with **end-around carry**: if the sum overflows 16
bits, the carry is added back into the low end. Then it takes the complement.

**Example.** Words `0x4500` and `0xC004`. Sum $= \text{0x10504}$: overflow, so $\text{0x0504} + 1 = \text{0x0505}$.
Checksum $= \lnot\text{0x0505} = \text{0xFAFA}$. The receiver adds all three words: $\text{0x0505} + \text{0xFAFA} =
\text{0xFFFF}$, all ones, so no error is detected.

Nice properties follow from the arithmetic: the order of words doesn't matter (so it can be computed in any order, or
updated incrementally when a router changes only the TTL, RFC 1624), and byte order barely matters. Weaknesses too:
swapping two words, or errors that add a value to one word and subtract it from another, go unnoticed.

## 1.6 Powers and logarithms

Logs answer "how many bits?": you need $\lceil \log_2 N \rceil$ bits to number $N$ things, and a binary trie on IPv4
addresses has depth 32. Decibels (wireless book) are logarithms too: $10\log_{10}$ of a power ratio. Rules used all
the time: $\log_2(xy) = \log_2 x + \log_2 y$, $\log_2 x = \ln x / \ln 2$, and $\log_2 1000 \approx 10$.

## Check yourself

??? question "1. Convert 0xC0A8 to two decimal bytes."
    C0 = 192, A8 = 168: 192.168.

??? question "2. What is the mask of a /27 in dotted decimal, and how many addresses does it hold?"
    27 ones: 255.255.255.224 (224 = 1110 0000); 2⁵ = 32 addresses.

??? question "3. Why does x XOR k XOR k give x back?"
    XOR is associative and k ⊕ k = 0, and x ⊕ 0 = x.

??? question "4. Compute the one's-complement sum of 0xFFFF and 0x0001."
    0x10000 overflows: 0x0000 + 1 = 0x0001.

??? info "Sources"
    - RFC 1071 (computing the Internet checksum), RFC 1624 (incremental update), RFC 4632 (CIDR).
    - C. Petzold, *Code*, 2nd ed., 2022 (binary from first principles).
    - D. Knuth, *The Art of Computer Programming*, Vol. 4A, section 7.1.3 (bitwise tricks).
