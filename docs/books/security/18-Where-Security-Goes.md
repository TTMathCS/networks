# 18. Where security goes

*Network security keeps changing as attackers, technology and the networks themselves change. This last chapter looks at the shifts under way in 2026: the move to post-quantum cryptography, passkeys replacing passwords, AI on both sides, memory-safe code, securing the software supply chain, and networks reaching the Moon and Mars. Each section ends with what is still open for research.*

!!! abstract "In this chapter"
    **You will learn:** the post-quantum migration and crypto-agility; the end of passwords; AI for attack and
    defence, and attacks on AI systems; memory safety; supply chain and secure-by-design; formal verification of
    protocols; IoT and operational technology; security for space networks; open research questions.

    **You need:** the rest of this book.

## 18.1 The post-quantum migration

Chapter 3 described the threat: a large quantum computer would break RSA and elliptic-curve cryptography. Nobody knows
when one will exist; estimates range from about a decade to never. But data recorded today can be decrypted later, and
replacing cryptography across the world's systems takes many years, so the move has begun:

- **Key exchange** first, because of "harvest now, decrypt later": hybrid X25519 + ML-KEM is already the default in
  major browsers, many servers and CDNs, recent OpenSSH, and being added to IPsec and other VPNs.
- **Signatures and certificates** next. ML-DSA signatures and keys are much larger than ECDSA's (a few kilobytes instead
  of tens of bytes), which makes TLS certificate chains heavier; proposals such as Merkle tree certificates aim to
  keep handshakes small.
- Governments have set timelines: the US NSA's CNSA 2.0 suite wants national security systems using quantum-resistant
  algorithms by around 2030–2033, and NIST plans to deprecate RSA and elliptic-curve algorithms around 2030 and disallow
  them by 2035.

The lasting lesson is **crypto-agility**: systems should be able to change algorithms by configuration, not by
redesign. Know where your cryptography is (a **cryptographic inventory**) before you need to change it.

*Open questions:* confidence in the new lattice assumptions; efficient post-quantum signatures; side-channel-safe
implementations.

## 18.2 After passwords

Passkeys (Chapter 4) are supported by all major platforms, and large services report sign-ins that are faster and far
more successful than with passwords. The remaining work is **account recovery** (when every device is lost, recovery is
often the weakest link), use across ecosystems, and enterprise adoption. Phishing-resistant MFA is becoming a baseline
requirement in government guidance.

## 18.3 AI on both sides

Machine learning has long been used for spam filtering and anomaly detection. Large language models change things in
both directions:

- **Attackers** write more convincing phishing in any language, clone voices for phone fraud, and speed up finding
  and exploiting known flaws.
- **Defenders** use AI to triage alerts, summarise incidents, write detection rules, and find bugs in code; in
  2024–2025 AI systems found real vulnerabilities in widely used open-source software, and DARPA's AI Cyber Challenge
  (final in 2025) had automated systems finding and patching flaws.
- **AI systems are themselves targets**: **prompt injection** (instructions hidden in web pages or documents that an
  AI agent reads and follows), data poisoning, and leaking secrets. An AI assistant with access to email and tools needs
  the same least-privilege and confirmation rules as any other powerful user. OWASP keeps a Top 10 for LLM applications.

*Open questions:* reliable defences against prompt injection; measuring whether AI helps attackers more than defenders.

## 18.4 Memory safety and secure by design

About two-thirds to 70% of serious vulnerabilities in large C and C++ code bases (reported by Microsoft and by Google's
Chromium team) are **memory-safety** bugs: buffer overflows and use-after-free. Languages such as Rust, Go, Java and
Swift prevent most of them. Android reported memory-safety bugs falling from 76% of its vulnerabilities in 2019 to 24%
in 2024 as new code moved to memory-safe languages. Government agencies now ask vendors to publish memory-safety
roadmaps and to be **secure by design**: safe defaults, no default passwords, MFA on by default, and taking
responsibility for customers' security outcomes.

## 18.5 The supply chain

SolarWinds (2020: a tampered update reached about 18,000 customers), Log4Shell (2021) and the xz backdoor (2024,
Chapter 10) showed that attackers target the software everyone depends on. Responses include SBOMs, signed builds and
provenance (SLSA, Sigstore), reproducible builds, funding for critical open-source maintainers, and regulations such
as the EU **Cyber Resilience Act** (in force from 2024, with obligations phasing in through 2027) requiring security
updates and vulnerability handling for products with digital elements.

## 18.6 Proving protocols correct

Protocols long had flaws found years after deployment. TLS 1.3 was the first major protocol designed alongside
**formal analysis**: tools such as Tamarin and ProVerif checked models of its handshake, and found issues in drafts
before release. Verified implementations of cryptography (such as HACL* and Fiat-Crypto code now used in Firefox,
Linux and Chrome) prove that code matches its specification and is free of certain bugs. Applying such methods to
whole systems, not just protocols, is an active research area.

## 18.7 Things, factories and space

**IoT** devices and **operational technology** (power grids, water plants, factories) run old software that is hard to
patch and was never meant to be on networks; attacks on them have physical effects. Segmentation, monitoring and new
labelling schemes (such as the US Cyber Trust Mark and the UK's ban on default passwords from 2024) are the main
tools.

**Space networks** need security too. Satellites have been attacked through their ground systems (a 2022 attack on a
satellite internet provider's modems disrupted service across Europe at the start of the war in Ukraine), and older
spacecraft links often had no encryption. CCSDS now defines the **Space Data Link Security** protocol (SDLS) for
authenticated encryption of spacecraft links. For a future Moon or Mars network built on delay-tolerant networking
(wireless book, [chapter 14](../wireless/14-Satellites-and-Deep-Space.md)), ordinary security protocols break: a TLS
handshake to Mars would take 6 to 44 minutes, and certificate revocation checks cannot be done online. **Bundle
Protocol Security** (BPSec, RFC 9172) signs and encrypts individual bundles instead of sessions, and key management for
networks with hours-long delays is an open research problem, one that people on Mars will have to solve.

## 18.8 What stays the same

Through all these changes the ideas of Chapter 1 hold: know what you protect and from whom, give least privilege, layer
defences, assume breach, watch, and practise your response. Tools change; principles do not.

## Check yourself

??? question "1. Why is key exchange being moved to post-quantum algorithms before signatures?"
    Encrypted traffic recorded today could be decrypted later by a quantum computer (harvest now, decrypt later); a signature only needs to be unforgeable at the time it is checked.

??? question "2. What is prompt injection?"
    Instructions hidden in content an AI system processes (a web page, email, document) that the system mistakes for its user's instructions and follows.

??? question "3. Why does a TLS handshake not work between Earth and Mars?"
    It needs interactive round trips; with one-way delays of 3 to 22 minutes the handshake alone would take tens of minutes and links come and go. Bundle-level security (BPSec) protects each bundle independently.

??? question "4. What does crypto-agility mean in practice?"
    Being able to change algorithms through configuration and updates, with an inventory of where cryptography is used, rather than redesigning systems.

??? info "Sources"
    - NIST IR 8547 (draft, 2024), *Transition to Post-Quantum Cryptography Standards*; NSA, *CNSA 2.0* (2022, updated); FIPS 203–205.
    - CISA, *Secure by Design* (2023) and *The Case for Memory Safe Roadmaps* (2023); Google Security Blog, "Eliminating Memory Safety Vulnerabilities at the Source" (2024).
    - OWASP Top 10 for LLM Applications (2025); DARPA AI Cyber Challenge results (2025).
    - RFC 9172 (BPSec); CCSDS 355.0-B (Space Data Link Security); Regulation (EU) 2024/2847 (Cyber Resilience Act).
    - K. Bhargavan et al., papers on verified TLS 1.3 and HACL*; C. Cremers et al., "A Comprehensive Symbolic Analysis of TLS 1.3", CCS 2017.
