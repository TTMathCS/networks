# 10. Wi-Fi security

*Anyone within range can hear a Wi-Fi network, so encryption and authentication are essential. This chapter tells the story from broken WEP to WPA3, explains the 4-way handshake, enterprise 802.1X, and the attacks that still work, with the settings to use today.*

!!! abstract "In this chapter"
    **You will learn:** why WEP failed; WPA and TKIP; WPA2 with CCMP and the 4-way handshake; offline dictionary attacks
    on WPA2-Personal; KRACK; WPA3-Personal with SAE; WPA3-Enterprise and 802.1X/EAP; Enhanced Open (OWE); rogue APs,
    evil twins and deauthentication; recommended settings.

    **You need:** [Chapter 7](07-How-Wi-Fi-Works.md); basic cryptography ([Security, chapter 3](../security/03-The-Cryptography-Toolkit.md)).

## 10.1 WEP: how not to do it

**Wired Equivalent Privacy** (1997) encrypted frames with the RC4 stream cipher using a shared 40- or 104-bit key plus a
24-bit **initialisation vector (IV)** sent in the clear. Its flaws were fatal:

- 24-bit IVs repeat after a few million frames, and reused keystreams leak plaintext.
- RC4 with keys made by concatenating IV and secret has weak first bytes: Fluhrer, Mantin and Shamir (2001) showed how
  to recover the key from enough frames; by 2007 it took about a minute (the PTW attack).
- Its integrity check (CRC-32) is linear, so an attacker can modify frames without detection.

WEP was deprecated in 2004 and must never be used.

## 10.2 WPA and WPA2

**WPA** (2003) was a stop-gap running on WEP hardware (TKIP: per-frame keys and a message integrity code). **WPA2**
(802.11i, 2004) is the real fix: **AES in CCMP mode** (counter mode for encryption plus CBC-MAC for integrity), with
fresh keys for each session.

Two modes:

- **Personal (PSK)**: everyone shares a passphrase; it is turned into a 256-bit **pairwise master key** (PMK) with
  PBKDF2 (4,096 rounds of HMAC-SHA1, salted with the SSID).
- **Enterprise (802.1X)**: each user or device authenticates individually to a server (10.5); the PMK comes from that
  exchange.

## 10.3 The 4-way handshake

After association, AP and client prove that both know the PMK and derive session keys, without sending the PMK:

1. AP → client: a random number **ANonce**.
2. Client chooses **SNonce**, computes the **pairwise transient key** PTK = PRF(PMK, ANonce, SNonce, both MAC addresses),
   and sends SNonce with a **MIC** (keyed checksum) proving it knows the PMK.
3. AP computes the same PTK, checks the MIC, and sends the **group key** (for broadcast frames), encrypted, with its own
   MIC.
4. Client confirms. Both install the keys.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 400" role="img" aria-labelledby="sk-nw-4way-t"><title id="sk-nw-4way-t">Four messages between phone and router: a random number, the phone's random number with a proof, the group key with a proof, and a confirmation</title><defs><filter id="sk-nw-4way-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-4way-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-4way-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-4way-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-4way-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="400" filter="url(#sk-nw-4way-paper)"/><g filter="url(#sk-nw-4way-pen)"><text x="30" y="44" class="h">Proving the password without sending it</text><path class="p room" d="M60 70 L180 70 L180 110 L60 110Z"/><text x="120.0" y="96.0" text-anchor="middle" class="s">phone</text><path class="p gold" d="M460 70 L580 70 L580 110 L460 110Z"/><text x="520.0" y="96.0" text-anchor="middle" class="s">Wi-Fi router</text><path class="p dash" d="M120 112 L120 350 M520 112 L520 350"/><path class="p " d="M516 140 L124 154" marker-end="url(#sk-nw-4way-ah)"/><text x="320" y="136" text-anchor="middle" class="s">1 a random number (ANonce)</text><path class="p " d="M124 192 L516 206" marker-end="url(#sk-nw-4way-ah)"/><text x="320" y="188" text-anchor="middle" class="s">2 its own random number + a proof</text><path class="p " d="M516 244 L124 258" marker-end="url(#sk-nw-4way-ah)"/><text x="320" y="240" text-anchor="middle" class="s">3 the shared group key, locked + a proof</text><path class="p " d="M124 296 L516 310" marker-end="url(#sk-nw-4way-ah)"/><text x="320" y="292" text-anchor="middle" class="s">4 done: both install the keys</text><text x="30" y="385" class="s">Both mix the password-derived key with the two random numbers into fresh session keys.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

<figure class="play" data-play="wpa4way"><span class="ai-tag">AI-created</span><figcaption><b>Watch it.</b> The 4-way handshake: both sides end with the same session key (PTK), yet the password-based PMK never crosses the air.</figcaption></figure>

## 10.4 Attacks on WPA2

- **Offline dictionary attack** (WPA2-Personal): an attacker who captures one handshake (or, since 2018, one "PMKID"
  from the AP's first message) can test passphrases offline at high speed on GPUs, with no further contact with the
  network. A weak passphrase falls in minutes. A random passphrase of 12+ characters or five or more random words is
  out of reach. This is the main real-world weakness of WPA2-Personal.
- **KRACK** (key reinstallation attacks, Vanhoef and Piessens, 2017): by replaying message 3 of the handshake, an attacker
  could make a client reinstall an already-used key and reset its nonce, letting frames be decrypted. It was a
  protocol flaw affecting almost all devices; patches fixed it in clients and APs.
- **No forward secrecy**: in WPA2-Personal, anyone who knows the passphrase and captured a handshake can decrypt that
  session's traffic.

## 10.5 WPA3

**WPA3** (Wi-Fi Alliance, 2018, required for Wi-Fi 6 certification) fixes these:

- **WPA3-Personal** replaces the PSK step with **SAE** (Simultaneous Authentication of Equals, a "Dragonfly" password-
  authenticated key exchange). Each attempt to guess the password requires an online exchange with the AP, so captured
  traffic does not allow offline cracking, and every session gets **forward secrecy**. Early implementations had
  side-channel flaws (Dragonblood, 2019); the fix uses hash-to-element (H2E), required on 6 GHz.
- **Protected management frames** are mandatory, stopping forged deauthentication and disassociation frames.
- **WPA3-Enterprise 192-bit mode** for high-security networks (GCMP-256, stronger key exchange).
- **Transition mode** lets WPA2 and WPA3 clients share one SSID during migration; note it still exposes WPA2's offline
  attack for clients using it.

## 10.6 Enterprise: 802.1X and EAP

Organisations authenticate each user or device with **802.1X**:

- the **supplicant** (client) talks **EAP** to the **authenticator** (the AP), which relays it to an **authentication
  server** (RADIUS).
- **EAP-TLS** uses a certificate on each device: strongest, used with device management. **PEAP-MSCHAPv2** and
  **EAP-TTLS** use a username and password inside a TLS tunnel: easier, but clients must be configured to **check the
  server's certificate**, or an evil-twin AP can collect password hashes.
- Each user gets a unique PMK; revoking one user doesn't require changing a shared password. **Eduroam** gives roaming
  access at thousands of universities this way.

## 10.7 Open networks

Open Wi-Fi (cafés, airports) has no encryption at the Wi-Fi layer. **Enhanced Open** (OWE, RFC 8110) adds unauthenticated
encryption with a Diffie-Hellman exchange, so passive eavesdroppers can't read traffic, though it can't stop an active
impostor. Most important traffic is already protected end to end by HTTPS and QUIC; a VPN adds protection for the rest.

## 10.8 Other attacks

- **Rogue AP**: an unauthorised AP plugged into the wired network, bypassing security. Enterprise wireless intrusion
  detection (WIDS) looks for them.
- **Evil twin**: an attacker's AP with the same SSID, perhaps stronger, luring clients. WPA3/SAE and 802.1X with
  certificate checking defeat it; open networks don't.
- **Deauthentication flooding**: forged management frames disconnecting clients (to capture handshakes or deny service);
  stopped by protected management frames, though radio jamming cannot be stopped by protocol.
- **WPS PIN** brute force (2011): the eight-digit setup PIN was checked in two halves, about 11,000 guesses. Disable WPS.

## 10.9 Recommended settings (2026)

| Network | Use |
| --- | --- |
| Home | WPA3-Personal (or WPA2/WPA3 transition if old devices need it), long random passphrase, WPS off, firmware updated |
| Guests | separate SSID and VLAN, client isolation, its own passphrase or OWE |
| IoT | separate SSID and VLAN, firewall rules to the internet only |
| Office | WPA3-Enterprise with EAP-TLS, server certificate validation, PMF required |

## Check yourself

??? question "1. Why is a captured WPA2-Personal handshake dangerous, but a captured WPA3-SAE exchange not?"
    The WPA2 handshake lets an attacker test passwords offline at high speed; SAE requires an online exchange with the AP for every guess and gives forward secrecy.

??? question "2. What protects against forged deauthentication frames?"
    Protected management frames (802.11w), mandatory in WPA3.

??? question "3. With PEAP, what client setting stops an evil twin from collecting credentials?"
    Validating the authentication server's certificate (and its name) before sending credentials.

??? info "Sources"
    - S. Fluhrer, I. Mantin, A. Shamir, "Weaknesses in the Key Scheduling Algorithm of RC4", SAC 2001; E. Tews, R.-P. Weinmann, A. Pyshkin, "Breaking 104 bit WEP in less than 60 seconds", 2007.
    - IEEE 802.11-2020 (RSN, 4-way handshake, SAE, PMF); IEEE 802.1X-2020; RFC 5216 (EAP-TLS), RFC 8110 (OWE).
    - M. Vanhoef and F. Piessens, "Key Reinstallation Attacks", CCS 2017; M. Vanhoef and E. Ronen, "Dragonblood", IEEE S&P 2020.
    - Wi-Fi Alliance, *WPA3 Specification* v3.x and security considerations.
