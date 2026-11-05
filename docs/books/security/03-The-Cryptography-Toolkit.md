# 3. The cryptography toolkit

*Almost every network defence ends in cryptography: it hides data, proves it was not changed, and proves who sent it. This chapter is a working toolkit: what each tool does, which ones to use today, and the mistakes that break them. The full story of each algorithm is on cryptography.akadian.ca.*

!!! abstract "In this chapter"
    **You will learn:** symmetric encryption and AEAD; hash functions; MACs; public-key encryption and key exchange;
    digital signatures; certificates and PKI; random numbers; which algorithms to choose in 2026; the post-quantum change.

    **You need:** [Chapter 1](01-What-Security-Means.md); [Math foundations, chapter 10](../math/10-The-Math-of-Security.md)
    for modular arithmetic.

## 3.1 What each tool gives

| Tool | Gives | Today's choice |
| --- | --- | --- |
| Symmetric encryption (AEAD) | confidentiality + integrity with a shared key | AES-GCM, ChaCha20-Poly1305 |
| Hash function | a short fingerprint of any data | SHA-256, SHA-3, BLAKE2/3 |
| MAC | integrity + authenticity with a shared key | HMAC-SHA-256 (or built into AEAD) |
| Key exchange | a shared secret over an open channel | X25519 (ECDH), now with ML-KEM hybrids |
| Digital signature | integrity + authenticity + non-repudiation with a public key | Ed25519, ECDSA P-256, RSA-PSS; ML-DSA coming |
| Certificate | binds a public key to a name, signed by a CA | X.509 |
| Password hashing | slows guessing of stolen password hashes | Argon2id, scrypt, bcrypt |

## 3.2 Symmetric encryption

Both sides share one secret key. **AES** (2001, block size 128 bits, keys of 128 or 256 bits) is built into most
processors and runs at many gigabytes per second; **ChaCha20** is a fast stream cipher in software, popular on phones.

Encryption alone does not stop tampering: an attacker who flips a bit of ciphertext in counter mode flips the same bit
of plaintext. So modern protocols use **AEAD** (authenticated encryption with associated data): **AES-GCM** or
**ChaCha20-Poly1305** encrypt and add a tag; the receiver rejects any message whose tag does not match. "Associated
data", such as a packet header, is authenticated but left readable.

The rule that must never be broken: **never reuse a nonce with the same key.** In GCM, two messages under the same
key and nonce leak the XOR of their plaintexts and let an attacker forge tags. Protocols use a counter as nonce for
this reason.

## 3.3 Hashes and MACs

A **cryptographic hash** maps any input to a fixed-size output (256 bits for SHA-256) such that nobody can find two
inputs with the same hash (**collision resistance**) or an input for a given hash (**preimage resistance**). Because
of the birthday paradox, an $n$-bit hash resists collisions only up to about $2^{n/2}$ tries, which is why 128-bit
security needs 256-bit hashes. **MD5** and **SHA-1** are broken for collisions (a practical SHA-1 collision was shown in
2017) and must not be used for signatures.

A **MAC** (message authentication code) is a keyed checksum: only someone with the key can make a valid tag. **HMAC**
builds one from any hash: $\text{HMAC}(K, m) = H\big((K \oplus \text{opad}) \,\|\, H((K \oplus \text{ipad}) \,\|\, m)\big)$.

## 3.4 Public-key cryptography

Each party has a **private key** (kept secret) and a **public key** (shared). This solves the problem symmetric
encryption cannot: agreeing on a key with someone you have never met.

- **Key exchange.** In **Diffie–Hellman** (1976), both sides combine their own private value with the other's public
  value and reach the same secret; an eavesdropper sees only the public values. Today this is done on elliptic curves
  (**ECDH**, usually **X25519**). Using fresh key pairs for each session gives **forward secrecy**: stealing a server's
  long-term key later does not unlock past sessions.
- **Signatures.** The private key signs; anyone with the public key verifies. **RSA** (1977; security from factoring)
  and elliptic-curve signatures (**ECDSA**, **Ed25519**) are used today. Signatures give non-repudiation, which a MAC
  cannot, because only one party holds the signing key.

Public-key operations are thousands of times slower than AES, so protocols use them only to agree on keys and prove
identity, then switch to symmetric AEAD for the data. TLS, SSH, IPsec and WireGuard all work this way.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 310" role="img" aria-labelledby="sk-ns-padlock-t"><title id="sk-ns-padlock-t">Open padlocks stand for a public key anyone may use to lock a box; the one key that opens them is the private key, kept by its owner</title><defs><filter id="sk-ns-padlock-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-ns-padlock-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-ns-padlock-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-ns-padlock-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-ns-padlock-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="310" filter="url(#sk-ns-padlock-paper)"/><g filter="url(#sk-ns-padlock-pen)"><text x="30" y="44" class="h">Hand out padlocks, keep the key</text><path class="p" d="M61 120 L61 110 Q70 94 79 110"/><path class="p gold" d="M55 120 L85 120 L85 142 L55 142Z"/><path class="p" d="M111 120 L111 110 Q120 94 129 110"/><path class="p gold" d="M105 120 L135 120 L135 142 L105 142Z"/><path class="p" d="M161 120 L161 110 Q170 94 179 110"/><path class="p gold" d="M155 120 L185 120 L185 142 L155 142Z"/><text x="40" y="180" class="s">public key: open padlocks,</text><text x="40" y="200" class="s">given to anyone</text><path class="p room" d="M260 110 L360 110 L360 170 L260 170Z"/><path class="p" d="M301 150 L301 140 Q310 124 319 140 L319 150"/><path class="p gold" d="M295 150 L325 150 L325 172 L295 172Z"/><text x="310" y="200" text-anchor="middle" class="s">a stranger snaps one</text><text x="310" y="220" text-anchor="middle" class="s">shut on a box</text><circle cx="470" cy="130" r="16" class="p gold"/><path class="p gold" d="M486 130 L560 130 L560 142 M540 130 L540 142"/><text x="440" y="180" class="s">private key: only you</text><text x="440" y="200" class="s">can open it again</text><path class="p " d="M200 130 L252 130" marker-end="url(#sk-ns-padlock-ah)"/><path class="p " d="M366 140 L430 140" marker-end="url(#sk-ns-padlock-ah)"/><text x="40" y="270" class="s">No secret was ever shared, yet only you can read what arrives. In practice this</text><text x="40" y="290" class="s">slow step only agrees on a key; fast symmetric ciphers then carry the data.</text></g></svg><figcaption>Sketched for this page. A picture of the idea, not of the maths.</figcaption></figure>

## 3.5 Certificates and PKI

A public key alone does not say whose it is. A **certificate** (X.509) binds a public key to a name (such as
`www.example.com`) and is signed by a **certificate authority** (CA). Your browser or operating system trusts a set of
root CAs; a root signs intermediate CAs, which sign server certificates, forming a **chain**. Verifying a certificate
means checking each signature up to a trusted root, the name, the dates, and revocation.

Weak points and their fixes:

- A CA mis-issues a certificate (DigiNotar was hacked in 2011 and its certificates used against Gmail users in Iran).
  Fix: **Certificate Transparency**, public append-only logs of every certificate, which browsers require, so
  mis-issuance can be found.
- Revocation is slow and often unchecked. Fix: short-lived certificates (the free CA Let's Encrypt issues 90-day
  certificates, with shorter ones added in 2025, and the CA/Browser Forum has voted to bring the maximum lifetime of
  public certificates down to 47 days by 2029).

## 3.6 Randomness

Keys, nonces and many protocol values must be unpredictable. Use the operating system's generator
(`/dev/urandom`, `getrandom()`, `secrets` in Python), never `rand()` or a time-seeded generator. History is full of
failures: Debian's OpenSSL package produced only 32,768 possible keys between 2006 and 2008 after a line of code was
removed, and studies in 2012 found many embedded devices sharing RSA factors because they generated keys at first boot
before collecting any randomness.

## 3.7 Choosing algorithms, and the quantum change

Rules for 2026: use well-known libraries and protocols (TLS 1.3, SSH, WireGuard), never invent your own; prefer
AES-GCM or ChaCha20-Poly1305, SHA-256 or better, X25519 and Ed25519 or ECDSA P-256; RSA at least 2048 bits (3072 for
long-lived keys).

A large quantum computer running **Shor's algorithm** would break RSA, Diffie–Hellman and elliptic curves (not AES or
SHA-2, which only need larger sizes against Grover's algorithm). Data recorded today could be decrypted later
("harvest now, decrypt later"). In August 2024 NIST published the first post-quantum standards: **ML-KEM** (FIPS 203,
key exchange), **ML-DSA** (FIPS 204) and **SLH-DSA** (FIPS 205) for signatures. Browsers and servers already use the
**hybrid** X25519MLKEM768 key exchange in TLS 1.3, so a break of either part alone is not enough. Moving signatures and
certificates is slower, and is under way (Chapter 18).

## Check yourself

??? question "1. Why is encryption without a MAC or AEAD dangerous on a network?"
    An attacker can change ciphertext and cause predictable changes in the plaintext (or use error responses as an oracle) without knowing the key. AEAD rejects any altered message.

??? question "2. What property does forward secrecy give, and how is it achieved?"
    Past sessions stay safe even if a long-term private key is stolen later. It comes from using fresh (ephemeral) Diffie–Hellman keys per session and deleting them afterwards.

??? question "3. A 160-bit hash gives about how much collision resistance?"
    About $2^{80}$ work (birthday bound $2^{n/2}$), which is no longer considered enough.

??? question "4. Which of these does a quantum computer threaten: AES-256, SHA-256, RSA-3072, X25519?"
    RSA-3072 and X25519 (Shor's algorithm). AES-256 and SHA-256 keep a large safety margin.

??? info "Sources"
    - NIST FIPS 197 (AES), FIPS 180-4 (SHA-2), FIPS 202 (SHA-3), SP 800-38D (GCM), FIPS 186-5 (signatures); FIPS 203, 204, 205 (post-quantum, 2024).
    - RFC 2104 (HMAC), RFC 8439 (ChaCha20-Poly1305), RFC 7748 (X25519), RFC 8032 (Ed25519), RFC 5280 (X.509), RFC 9162 (Certificate Transparency 2.0).
    - M. Stevens et al., "The First Collision for Full SHA-1", CRYPTO 2017; N. Heninger et al., "Mining Your Ps and Qs", USENIX Security 2012.
    - CA/Browser Forum Ballot SC-081 (2025) on certificate lifetimes; IETF draft "Hybrid key exchange in TLS 1.3".
