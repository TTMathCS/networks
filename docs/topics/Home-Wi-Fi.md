# Set up home Wi-Fi well

*Fast, reliable and safe Wi-Fi in every room. Four parts: stop at the one you need.*

[In one minute](#in-one-minute) · [Do it](#do-it) · [Expert](#expert) · [Now and next](#now-and-next)

## In one minute

Your Wi-Fi router is a small radio station. Its signal gets weaker with distance and with every wall, floor, mirror or
fridge in the way, and it shares the air with your neighbours' routers. Good Wi-Fi comes from three things: **put the
router in the middle of the home, out in the open**; **use the newer, faster bands (5 GHz, 6 GHz) for devices near the
router**; and **lock it with WPA3 (or WPA2) and a long password**. If one router cannot cover the whole home, add a
second one (a "mesh" system), ideally joined to the first by a cable.

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
