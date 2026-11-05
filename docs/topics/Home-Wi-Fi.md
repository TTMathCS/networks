# Set up home Wi-Fi well

*Fast, reliable and safe Wi-Fi in every room. Four parts: stop at the one you need.*

[In one minute](#in-one-minute) · [Do it](#do-it) · [Expert](#expert) · [Now and next](#now-and-next)

## In one minute

Your Wi-Fi router is a small radio station. Its signal gets weaker with distance and with every wall, floor, mirror or
fridge in the way, and it shares the air with your neighbours' routers. Good Wi-Fi comes from three things: **put the
router in the middle of the home, out in the open**; **use the newer, faster bands (5 GHz, 6 GHz) for devices near the
router**; and **lock it with WPA3 (or WPA2) and a long password**. If one router cannot cover the whole home, add a
second one (a "mesh" system), ideally joined to the first by a cable.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 390" role="img" aria-labelledby="sk-n-walls-t"><title id="sk-n-walls-t">Two floor plans of four rooms: a router in a corner leaves the far room with a weak signal; a router in the middle reaches every room</title><defs><filter id="sk-n-walls-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-n-walls-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-n-walls-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-n-walls-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-n-walls-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="390" filter="url(#sk-n-walls-paper)"/><g filter="url(#sk-n-walls-pen)"><text x="30" y="44" class="h">Where the router sits</text><clipPath id="sk-n-walls-c0"><rect x="30" y="90" width="270" height="230"/></clipPath><g clip-path="url(#sk-n-walls-c0)"><circle cx="50" cy="300" r="50" class="p dash" opacity="1.00"/><circle cx="50" cy="300" r="100" class="p dash" opacity="0.78"/><circle cx="50" cy="300" r="150" class="p dash" opacity="0.56"/><circle cx="50" cy="300" r="200" class="p dash" opacity="0.34"/></g><path class="p" d="M30 90 L300 90 L300 320 L30 320Z M165 90 L165 180 M165 220 L165 320 M30 205 L90 205 M130 205 L300 205"/><path class="p gold" d="M38 292 L62 292 L62 308 L38 308Z"/><text x="165" y="345" text-anchor="middle" class="s">in a corner cupboard</text><clipPath id="sk-n-walls-c1"><rect x="340" y="90" width="270" height="230"/></clipPath><g clip-path="url(#sk-n-walls-c1)"><circle cx="425" cy="200" r="50" class="p dash" opacity="1.00"/><circle cx="425" cy="200" r="100" class="p dash" opacity="0.78"/><circle cx="425" cy="200" r="150" class="p dash" opacity="0.56"/><circle cx="425" cy="200" r="200" class="p dash" opacity="0.34"/></g><path class="p" d="M340 90 L610 90 L610 320 L340 320Z M475 90 L475 180 M475 220 L475 320 M340 205 L400 205 M440 205 L610 205"/><path class="p gold" d="M413 192 L437 192 L437 208 L413 208Z"/><text x="475" y="345" text-anchor="middle" class="s">in the middle, in the open</text><text x="250" y="116" class="s">weak</text><text x="560" y="116" class="s">good</text><text x="30" y="375" class="s">Each ring is weaker, and every wall, floor or fridge takes away more.</text></g></svg><figcaption>Sketched for this page. Not to scale.</figcaption></figure>

## Do it

1. **Place it.** Central, at chest height or higher, not in a cupboard, not behind the TV or near a microwave.
2. **Update it.** Log in to the router (its address is usually printed on it, often `192.168.1.1` or `192.168.0.1`),
   install firmware updates, and turn on automatic updates.
3. **Change the admin password** from the default.
4. **Security:** choose **WPA3-Personal**, or **WPA2/WPA3 mixed** if older devices must connect. Never WEP, WPA/TKIP or
   "open". Use a passphrase of at least four random words or 12 random characters.
5. **Turn off WPS** (the push-button / PIN pairing) and **remote management**. Turn off **UPnP** unless a game console
   needs it.
6. **Guest network:** on for visitors and smart-home gadgets, isolated from your computers.
7. **One name for all bands** (band steering) works for most homes; if a device misbehaves, give 2.4 GHz its own name.
8. **Check the coverage**: stand in each room and look at the signal (on a laptop, see
   [Lab 13](../labs/13-Surveying-Your-Wi-Fi.md)). Below about −70 dBm, or one bar, add a mesh point halfway, or a wired
   access point in that room.

Speed check: compare a speed test right next to the router with one in the far room. If even next to the router it is
slow, the problem is your internet plan or provider, not the Wi-Fi.

## Expert

**Signal and rate.** Received power falls with distance squared in free space (about 6 dB per doubling) and much faster
indoors, plus 3–15 dB per wall depending on material. The access point picks a modulation and coding scheme (MCS) from
the signal-to-noise ratio: Wi-Fi 6 needs roughly 30+ dB SNR for 1024-QAM and drops to BPSK near 5 dB, so rate falls in
steps as you walk away ([wireless book, chapters 2–4](../books/wireless/02-Antennas-and-Link-Budgets.md)).

**Channels.** 2.4 GHz: only 1, 6 and 11 do not overlap; use 20 MHz width. 5 GHz: 80 MHz is the usual home choice; DFS
channels (52–144) are often empty but the router must leave them if it detects radar. 6 GHz (Wi-Fi 6E/7): many clean
160 and 320 MHz channels, shorter range ([wireless book, chapter 9](../books/wireless/09-Designing-Wi-Fi.md)).

**Airtime is the real limit.** All devices on a channel take turns. One old or distant device sending at a low rate uses
far more airtime per byte, slowing everyone; more access points at lower power, each with fewer devices, beat one
powerful router.

**Mesh.** Wireless backhaul spends airtime twice (to the satellite and onward); a tri-band mesh with a dedicated backhaul
radio helps, and Ethernet or MoCA backhaul is best.

**Security details.** WPA3-Personal uses SAE (a password-authenticated key exchange), so captured handshakes cannot be
cracked offline as WPA2-PSK's can; it also requires protected management frames, stopping forged "deauth" disconnects.
Transition mode keeps WPA2 clients working but leaves them as exposed as before. Enterprise networks use 802.1X with
certificates ([wireless book, chapter 10](../books/wireless/10-Wi-Fi-Security.md)).

**Common mistakes:** router in a corner cupboard; maximum transmit power (clients cannot talk back as loudly, and it
increases interference); 40 MHz on 2.4 GHz in a busy building; many repeaters chained wirelessly; a forgotten old WEP or
open network for one old device; IoT gadgets on the main network.

## Now and next

*Last checked: 5 November 2026.*

- **Wi-Fi 7** (802.11be, certified from January 2024): 320 MHz channels in 6 GHz, 4096-QAM, and **multi-link
  operation**, where a device uses two bands at once for speed and reliability. Worth it with 6 GHz-capable devices.
- **6 GHz** is open for Wi-Fi in the US, Canada, South Korea and others across 1,200 MHz; Europe and some countries
  allow only the lower 500 MHz so far.
- **Wi-Fi 8** (802.11bn, "ultra-high reliability") is being written for around 2028: focus on reliability and low
  latency, coordination between access points, rather than peak speed.
- **Wi-Fi sensing** (802.11bf) uses Wi-Fi signals to detect motion and presence; useful and a new privacy question.

More: [wireless book, chapter 8](../books/wireless/08-Wi-Fi-Generations.md) and [chapter 15](../books/wireless/15-Where-Wireless-Goes.md).

??? info "Sources"
    - IEEE 802.11-2024, 802.11ax-2021, 802.11be; Wi-Fi Alliance, *Wi-Fi CERTIFIED 7* (2024) and *WPA3 Specification*.
    - CISA and NSA, *Best Practices for Securing Your Home Network* (2023).
    - Innovation, Science and Economic Development Canada, decision on 5925–7125 MHz (2022); FCC 6 GHz Report and Order (2020).
