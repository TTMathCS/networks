# 10. The math of security

*TLS, SSH, VPNs and DNSSEC all rest on a few pieces of number theory: arithmetic modulo $n$, groups where some operations are easy and their inverses hard, and the gap between multiplying and factoring. This chapter gives those pieces at the level needed to understand the protocols; [cryptography.akadian.ca](https://cryptography.akadian.ca/) has the full story.*

!!! abstract "In this chapter"
    **You will learn:** modular arithmetic and inverses; Euclid's algorithm; fast exponentiation; Fermat and Euler;
    RSA in one page; groups and the discrete logarithm; Diffie-Hellman; elliptic curves in brief; hash functions and the
    birthday bound; why quantum computers matter; security levels in bits.

    **You need:** [Chapters 1 and 2](01-Bits-Binary-and-Masks.md).

## 10.1 Arithmetic modulo n

$a \bmod n$ is the remainder after dividing by $n$. Clock arithmetic: $9 + 5 \equiv 2 \pmod{12}$. Addition and
multiplication work as usual and can be reduced at any step: $(a \cdot b) \bmod n = ((a \bmod n)(b \bmod n)) \bmod n$,
so numbers never grow beyond $n^2$.

A number $a$ has a **multiplicative inverse** modulo $n$ (some $x$ with $ax \equiv 1$) exactly when $\gcd(a, n) = 1$.
The **extended Euclidean algorithm** finds it: run Euclid's gcd steps and track how each remainder is a combination of
$a$ and $n$. Example: the inverse of 7 mod 40. $40 = 5 \cdot 7 + 5$, $7 = 1 \cdot 5 + 2$, $5 = 2 \cdot 2 + 1$; back
substitute: $1 = 5 - 2\cdot2 = 5 - 2(7 - 5) = 3\cdot5 - 2\cdot7 = 3(40 - 5\cdot7) - 2\cdot7 = 3\cdot40 - 17\cdot7$. So
$-17 \equiv 23$ is the inverse: $7 \cdot 23 = 161 = 4\cdot40 + 1$. ✓

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 375" role="img" aria-labelledby="sk-nm-clock-t"><title id="sk-nm-clock-t">A clock face with an arrow five hours on from 9, ending at 2: arithmetic modulo 12</title><defs><filter id="sk-nm-clock-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nm-clock-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nm-clock-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nm-clock-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nm-clock-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="375" filter="url(#sk-nm-clock-paper)"/><g filter="url(#sk-nm-clock-pen)"><text x="30" y="44" class="h">9 + 5 on a clock is 2</text><circle cx="220" cy="220" r="130" class="p room"/><text x="220.0" y="120.0" text-anchor="middle" class="l">12</text><text x="273.0" y="134.2" text-anchor="middle" class="l">1</text><text x="311.8" y="173.0" text-anchor="middle" class="l">2</text><text x="326.0" y="226.0" text-anchor="middle" class="l">3</text><text x="311.8" y="279.0" text-anchor="middle" class="l">4</text><text x="273.0" y="317.8" text-anchor="middle" class="l">5</text><text x="220.0" y="332.0" text-anchor="middle" class="l">6</text><text x="167.0" y="317.8" text-anchor="middle" class="l">7</text><text x="128.2" y="279.0" text-anchor="middle" class="l">8</text><text x="114.0" y="226.0" text-anchor="middle" class="l">9</text><text x="128.2" y="173.0" text-anchor="middle" class="l">10</text><text x="167.0" y="134.2" text-anchor="middle" class="l">11</text><path class="p red" d="M72.0 220.0 A148 148 0 0 1 348.2 146.0" marker-end="url(#sk-nm-clock-ah)"/><text x="60" y="80" class="s">5 steps on from 9</text><text x="400" y="150" class="s">Past 12 the count starts over:</text><text x="400" y="170" class="s">only the remainder after</text><text x="400" y="190" class="s">dividing by 12 is kept.</text><text x="400" y="240" class="s">9 + 5 = 14, and 14 mod 12 = 2.</text><text x="400" y="290" class="s">Cryptography does the same</text><text x="400" y="310" class="s">with clocks hundreds of digits</text><text x="400" y="330" class="s">long.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## 10.2 Fast exponentiation

Computing $a^e \bmod n$ with $e$ hundreds of digits long seems impossible, but **square-and-multiply** needs only about
$2\log_2 e$ multiplications: write $e$ in binary; square at each bit, and multiply by $a$ when the bit is 1. $3^{13}$:
$13 = 1101_2$, so $3 \to 3^2 \cdot 3 = 3^3 \to 3^6 \to 3^{12}\cdot 3 = 3^{13}$, four steps. A 2048-bit exponent takes
about 3,000 multiplications.

<figure class="play" data-play="modpow"><span class="ai-tag">AI-created</span><figcaption><b>Watch it.</b> Square-and-multiply for the example 3<sup>13</sup>, here modulo 1,000 to keep the numbers short. Press Play to step through, or type another exponent: the steps grow with its number of bits, not its size.</figcaption></figure>

## 10.3 Fermat, Euler and RSA

**Fermat's little theorem**: if $p$ is prime and $p \nmid a$, then $a^{p-1} \equiv 1 \pmod p$. **Euler's theorem**
generalises it: $a^{\varphi(n)} \equiv 1 \pmod n$ when $\gcd(a,n)=1$, where $\varphi(n)$ counts the numbers below $n$
coprime to $n$. For $n = pq$ with distinct primes, $\varphi(n) = (p-1)(q-1)$.

**RSA** (Rivest, Shamir, Adleman, 1977):

1. Choose large primes $p, q$; $n = pq$; $\varphi = (p-1)(q-1)$.
2. Choose $e$ coprime to $\varphi$ (usually 65537); compute $d = e^{-1} \bmod \varphi$.
3. Public key $(n, e)$; private key $d$.
4. Encrypt or verify: $c = m^e \bmod n$. Decrypt or sign: $m = c^d \bmod n$.

It works because $ed = 1 + k\varphi$, so $m^{ed} = m \cdot (m^{\varphi})^k \equiv m$. Its security rests on the belief that
recovering $d$ requires factoring $n$, which for 2048-bit $n$ is far beyond classical computers. Real RSA always uses
padding (OAEP, PSS); "textbook" RSA is insecure. TLS 1.3 uses RSA only for signatures in certificates.

**Toy example**: $p = 5$, $q = 11$, $n = 55$, $\varphi = 40$, $e = 7$, $d = 23$ (from 10.1). Encrypt $m = 2$: $2^7 = 128
\equiv 18$. Decrypt: $18^{23} \bmod 55 = 2$. ✓

## 10.4 Groups and discrete logarithms

A **group** is a set with an operation that is associative, has an identity, and has inverses. The non-zero numbers
modulo a prime $p$ under multiplication form a group, and it is **cyclic**: some **generator** $g$ produces every element
as $g^x$.

Given $g$ and $x$, computing $y = g^x \bmod p$ is fast (10.2). Given $g$ and $y$, finding $x$, the **discrete
logarithm**, has no known fast classical algorithm for well-chosen large groups. That asymmetry is a trapdoor.

## 10.5 Diffie-Hellman

Diffie and Hellman (1976) showed two parties can agree on a secret over a public channel:

1. Public: prime $p$ and generator $g$.
2. Alice picks secret $a$, sends $A = g^a$. Bob picks secret $b$, sends $B = g^b$.
3. Alice computes $B^a = g^{ab}$; Bob computes $A^b = g^{ab}$. Same value.

An eavesdropper sees $g^a$ and $g^b$ but not $g^{ab}$ without solving a discrete log. Every TLS 1.3, SSH and WireGuard
connection does this (in elliptic-curve form) with fresh secrets per connection, which gives **forward secrecy**: a
stolen long-term key cannot decrypt past sessions. DH alone does not authenticate: a man in the middle can run it with
each side, which is why the exchange is signed with a certificate or known host key.

## 10.6 Elliptic curves in brief

The points on a curve $y^2 = x^3 + ax + b$ over a finite field, with a geometric "addition" rule (draw a line through
two points, take the third intersection, reflect), form a group. The discrete log there (given $P$ and $kP$, find $k$)
is much harder than in $\bmod p$ groups of the same size, so keys are far smaller: a 256-bit curve gives about the
security of 3072-bit RSA. **X25519** (Curve25519, Bernstein 2006) is the default key exchange in TLS 1.3, SSH and
WireGuard; **Ed25519** and **ECDSA P-256** are the common signatures.

## 10.7 Hash functions and the birthday bound

A cryptographic **hash** (SHA-256, SHA-3) maps any input to a fixed-size output such that finding a collision, or an
input with a given hash, is infeasible. Because of the birthday bound (Chapter 2), an $n$-bit hash resists collisions
only up to about $2^{n/2}$ work: SHA-256 gives 128-bit collision resistance. MD5 and SHA-1 collisions have been found
in practice, so they are retired for signatures. Hashes appear in message authentication codes (HMAC), key derivation
(HKDF) and certificate signatures.

## 10.8 Security levels and quantum computers

Security is measured in bits: $k$-bit security means about $2^k$ operations to break. 128 bits is the modern minimum
for long-term use: AES-128, X25519, SHA-256 collisions, RSA-3072.

**Shor's algorithm** would let a large quantum computer factor and solve discrete logs (including on elliptic curves) in
polynomial time, breaking RSA, DH and ECC. **Grover's algorithm** only square-roots brute-force search, so AES-256 stays
safe. Hence the move to **post-quantum** algorithms built on other hard problems, such as lattice problems (learning
with errors): ML-KEM for key exchange and ML-DSA for signatures (NIST, 2024). See [Security, chapter 3](../security/03-The-Cryptography-Toolkit.md).

## Check yourself

??? question "1. Find the inverse of 3 modulo 11."
    4, since 3·4 = 12 ≡ 1 (mod 11).

??? question "2. With p = 23, g = 5, a = 6, b = 15, what shared secret do Alice and Bob get?"
    A = 5⁶ mod 23 = 8, B = 5¹⁵ mod 23 = 19; secret = 19⁶ mod 23 = 2 = 8¹⁵ mod 23.

??? question "3. Why does a 256-bit hash give only 128-bit collision resistance?"
    By the birthday bound, about 2^(n/2) random inputs give a collision, so 2¹²⁸ for n = 256.

??? info "Sources"
    - W. Diffie and M. Hellman, "New Directions in Cryptography", *IEEE Trans. IT*, 1976; R. Rivest, A. Shamir, L. Adleman, *CACM*, 1978.
    - D. Bernstein, "Curve25519: new Diffie-Hellman speed records", PKC 2006; RFC 7748 (X25519), RFC 8032 (Ed25519).
    - J. Katz and Y. Lindell, *Introduction to Modern Cryptography*, 3rd ed., CRC, 2020.
    - NIST SP 800-57 Part 1 Rev. 5 (security strengths); NIST FIPS 203 and 204 (2024).
