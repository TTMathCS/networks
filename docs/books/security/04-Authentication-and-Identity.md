# 4. Authentication and identity

*Before a network gives access, it must answer two questions: who are you (authentication), and what may you do (authorisation). This chapter covers passwords and how they are stored, multi-factor authentication and passkeys, network login with 802.1X and RADIUS, Kerberos, and single sign-on.*

!!! abstract "In this chapter"
    **You will learn:** factors of authentication; storing passwords safely; MFA and why passkeys resist phishing;
    AAA, RADIUS and 802.1X; Kerberos; SSO with SAML and OpenID Connect; authorisation models.

    **You need:** [Chapter 3](03-The-Cryptography-Toolkit.md).

## 4.1 Factors

Proof of identity comes in three kinds of **factor**: something you **know** (password, PIN), something you **have**
(phone, security key, smart card), something you **are** (fingerprint, face). **Multi-factor authentication** (MFA)
needs two different kinds, so a stolen password alone is not enough. Two passwords are still one factor.

The three As of network access, **AAA**, are **authentication** (who), **authorisation** (what they may do) and
**accounting** (a record of what they did).

## 4.2 Passwords

A server should never store passwords, only a slow, salted hash of each:

- A **salt** is a random value per user, stored next to the hash, so two users with the same password get different
  hashes and precomputed tables ("rainbow tables") are useless.
- A **slow, memory-hard** function (Argon2id, scrypt or bcrypt) makes each guess cost real time and memory. A fast hash
  like SHA-256 lets one graphics card try billions of guesses per second.

How strong is a password? If it is chosen at random from $N$ possibilities, its **entropy** is $\log_2 N$ bits. A
random 10-character password from 62 letters and digits has $10 \log_2 62 \approx 59.5$ bits; four random words from a
7,776-word list have $4 \log_2 7776 \approx 51.7$ bits. Human-chosen passwords have far less than their length
suggests, because attackers try the common ones first. NIST's guidance (SP 800-63B) therefore asks systems to check new
passwords against lists of breached ones, allow long passphrases, and stop forcing periodic changes and composition
rules, which push people to predictable patterns. A **password manager** gives each site a unique random password, which
defeats credential stuffing.

Online guessing is limited by **rate limiting** and lockouts; offline guessing (after a database is stolen) is limited
only by the hash's cost.

<figure class="play" data-play="guess"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> How long a <em>random</em> password lasts once a database is stolen: entropy is length × log<sub>2</sub>(alphabet), and on average the attacker tries half of all choices. The two guessing rates are rough examples of a fast hash on one graphics card and a slow, memory-hard one.</figcaption></figure>

## 4.3 MFA and passkeys

Not all second factors are equal:

| Factor | Weakness |
| --- | --- |
| SMS code | SIM swap (attacker moves your number), interception; phishable |
| Authenticator app code (TOTP) | phishable: a fake site can ask for the code and use it at once |
| Push approval | "MFA fatigue": attackers send prompts until a tired user taps Accept; number matching helps |
| FIDO2 security key or **passkey** | resists phishing |

**TOTP** (RFC 6238) computes a 6-digit code from a shared secret and the current 30-second time step:
$\text{code} = \text{Truncate}(\text{HMAC}(K, \lfloor t/30 \rfloor)) \bmod 10^6$.

**Passkeys** (FIDO2: WebAuthn plus CTAP) use public-key signatures. When you register, your device makes a key pair for
that website and gives it only the public key. To log in, the site sends a random challenge; your device signs it,
after unlocking with your fingerprint or PIN. Two things make this phishing-resistant: the private key never leaves the
device, and the browser includes the real website origin in what is signed, so a signature made for a look-alike site
is useless on the real one. There is no shared secret on the server to steal either.

## 4.4 Network access: RADIUS and 802.1X

How does an office switch port or Wi-Fi network know who you are? With **IEEE 802.1X** port-based access control:

<figure class="mars-fig">
<svg viewBox="0 0 640 150" role="img" aria-label="802.1X: supplicant, authenticator and authentication server">
<rect x="10" y="50" width="140" height="50" rx="8" class="na-f"/><text x="80" y="72" text-anchor="middle">Supplicant</text><text x="80" y="90" text-anchor="middle" font-size="12">your laptop</text>
<rect x="250" y="50" width="140" height="50" rx="8" class="nb-f"/><text x="320" y="72" text-anchor="middle">Authenticator</text><text x="320" y="90" text-anchor="middle" font-size="12">switch or AP</text>
<rect x="490" y="50" width="140" height="50" rx="8" class="nc-f"/><text x="560" y="72" text-anchor="middle">Auth server</text><text x="560" y="90" text-anchor="middle" font-size="12">RADIUS</text>
<line x1="150" y1="75" x2="250" y2="75" stroke="currentColor" stroke-width="2"/><text x="200" y="65" text-anchor="middle" font-size="12">EAPOL</text>
<line x1="390" y1="75" x2="490" y2="75" stroke="currentColor" stroke-width="2"/><text x="440" y="65" text-anchor="middle" font-size="12">RADIUS (EAP inside)</text>
<text x="320" y="135" text-anchor="middle" font-size="12">The port stays closed except for EAP until the server says "Accept".</text>
</svg>
<figcaption>802.1X. The authenticator relays EAP messages but does not judge them; the server decides.</figcaption>
</figure>

The **supplicant** (your device) talks **EAP** (Extensible Authentication Protocol) to the **authenticator** (switch
or access point), which relays it inside **RADIUS** to the **authentication server**. Common EAP methods:
**EAP-TLS** (both sides use certificates; the strongest), **PEAP** or **EAP-TTLS** (a TLS tunnel protecting a
password). On success the server can also tell the switch which VLAN to put you in (Chapter 11).

RADIUS is old (RFC 2865, 2000) and protects its messages with MD5-based tricks. The **Blast-RADIUS** attack (2024)
showed an on-path attacker could forge an "Accept" for some setups; the fixes are the Message-Authenticator attribute
on every packet and running RADIUS over TLS (**RadSec**). **TACACS+** is used instead for logging admins into network
devices, with per-command authorisation and accounting.

## 4.5 Kerberos

Inside Windows domains and many universities, **Kerberos** (MIT, 1980s; RFC 4120) avoids sending passwords over the
network. You prove yourself once to the **Key Distribution Center**, which gives you a **ticket-granting ticket**; with
it you get **service tickets** for each server, encrypted with keys you never see. It is single sign-on for a local
network. Attacks on it target stolen tickets and weak service-account passwords ("Kerberoasting"); defences are long
random service passwords, AES-only encryption types and watching for unusual ticket requests.

## 4.6 Single sign-on on the web

Organisations now log people into hundreds of cloud services from one **identity provider** (IdP). **SAML 2.0** (XML
assertions) and **OpenID Connect** (built on **OAuth 2.0**, with signed JSON Web Tokens) carry the proof: you log in at
the IdP, which sends the service a signed statement of who you are. One strong login with phishing-resistant MFA then
protects everything, but the IdP becomes the most valuable target, and tokens stolen from a browser or a misconfigured
app can bypass MFA entirely, so tokens must be short-lived and bound to the device where possible.

## 4.7 Authorisation

Once identity is known, rules decide access. **Role-based access control** (RBAC) gives permissions to roles
("network admin", "helpdesk") and roles to people. **Attribute-based** control (ABAC) decides from attributes (device
health, location, time, data label). Both serve least privilege (Chapter 1), and both are the basis of zero trust
(Chapter 15).

## Check yourself

??? question "1. Why salt password hashes?"
    So identical passwords give different hashes and precomputed tables cannot be used; each user's hash must be attacked separately.

??? question "2. How many bits of entropy do 6 random words from a 7,776-word list give?"
    6 × log2(7776) ≈ 6 × 12.92 ≈ 77.5 bits.

??? question "3. Why does a passkey resist phishing when a TOTP code does not?"
    The signature covers the real site's origin and is made by a key that never leaves the device, so a fake site gets nothing it can reuse; a TOTP code typed into a fake site works on the real one for 30 seconds.

??? question "4. In 802.1X, which device decides whether you may connect?"
    The authentication server (RADIUS). The switch or access point only relays and enforces the answer.

??? info "Sources"
    - NIST SP 800-63B-4, *Digital Identity Guidelines: Authentication* (2024–2025 revision).
    - RFC 6238 (TOTP), RFC 2865 (RADIUS), RFC 3748 (EAP), RFC 5216 (EAP-TLS), RFC 4120 (Kerberos), RFC 6749 (OAuth 2.0); IEEE 802.1X-2020; W3C WebAuthn Level 2/3; FIDO Alliance CTAP 2.1.
    - S. Goldberg et al., "RADIUS/UDP Considered Harmful" (Blast-RADIUS), USENIX Security 2024.
    - A. Biryukov, D. Dinu, D. Khovratovich, "Argon2", RFC 9106.
