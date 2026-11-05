# Lab 13. Surveying your Wi-Fi

*Most home Wi-Fi problems come from a few causes: a crowded channel, a weak signal in the far room, or old settings. In this lab you measure your own Wi-Fi: signal strength, noise, channels used by neighbours, link rates and real throughput, and turn the numbers into better settings.*

!!! abstract "In this lab"
    **You will:** read your connection's signal (RSSI), link rate, channel and band; list nearby networks and their
    channels; map signal around your home; measure real throughput with iperf3; choose channels and access point
    placement; check your network's security settings.

    **You need:** a laptop with Wi-Fi (Linux, macOS or Windows; a Linux VM usually cannot see the Wi-Fi card, so use the
    host system or a Linux laptop); **your own** Wi-Fi network; [wireless book, chapters 7–10](../books/wireless/09-Designing-Wi-Fi.md). Time: 40 minutes.

!!! warning "Your own network"
    Listing nearby networks' names and channels is what every device does to show you the Wi-Fi menu, and is fine.
    Capturing other people's traffic or trying to join their networks is not.

## 1. Your current connection

| System | Command |
| --- | --- |
| Linux | `iw dev` then `iw dev wlan0 link` (use your interface name) |
| macOS | hold **Option** and click the Wi-Fi icon; or `system_profiler SPAirPortDataType` |
| Windows | `netsh wlan show interfaces` |

Write down: **SSID**, **BSSID** (the access point's radio MAC), **band and channel** (such as 5 GHz channel 36, 80 MHz
wide), **signal** in dBm, and **transmit rate** (tx bitrate, such as 866.7 Mbit/s with VHT or HE MCS index). macOS also
shows **noise**; signal minus noise is the **SNR**.

Rules of thumb for signal ([wireless book, chapter 2](../books/wireless/02-Antennas-and-Link-Budgets.md)):

| Signal | Quality |
| --- | --- |
| −30 to −55 dBm | excellent |
| −55 to −67 dBm | good; enough for video calls |
| −67 to −75 dBm | fair; rates drop |
| below −75 dBm | poor; expect slowness and drops |

Each 3 dB is a factor of two in power, so −70 dBm is about 1/32 of the power of −55 dBm.

## 2. Who else is on the air

```bash
sudo iw dev wlan0 scan | grep -E "^BSS|SSID:|freq:|signal:"     # Linux
```

On Windows: `netsh wlan show networks mode=bssid`. On macOS, Option-click the Wi-Fi icon and choose **Open Wireless
Diagnostics → Window → Scan**. Free apps (such as WiFi Analyzer on Android) draw the same as a chart.

Count networks per channel. In **2.4 GHz** only channels **1, 6 and 11** do not overlap (each is 20 MHz wide, spaced
5 MHz apart); a network on channel 3 interferes with both 1 and 6. In **5 GHz** there are many more 20 MHz channels,
bonded into 40, 80 or 160 MHz; in **6 GHz** (Wi-Fi 6E and 7) more still, and usually empty.

## 3. Map your home

Walk to each room with the laptop, wait 10 seconds, and note signal and tx rate:

| Place | Band / channel | Signal (dBm) | Rate (Mbit/s) |
| --- | --- | --- | --- |
| next to the router | | | |
| living room | | | |
| bedroom | | | |
| farthest room | | | |

You will typically see signal fall by 5–10 dB per interior wall, more through brick, concrete, floors, mirrors and
metal, and the 5 GHz and 6 GHz signals fall faster than 2.4 GHz. The rate follows the signal, because the access point
picks a lower **MCS** (modulation and coding) when the SNR drops ([wireless book,
chapter 4](../books/wireless/04-Modulation-and-Coding.md)).

## 4. Real throughput

The rate shown is the radio's raw rate; real throughput is usually about half or less, because of protocol overhead and
sharing airtime. Measure it with iperf3 between the laptop and a computer wired to the router:

```bash
iperf3 -s                         # on the wired computer
iperf3 -c <wired computer's IP>   # on the laptop: upload
iperf3 -c <wired computer's IP> -R   # download
```

Repeat in the near and far rooms. An internet speed test mixes in your provider's speed; iperf3 measures only your Wi-Fi.

## 5. Make it better

From your numbers:

- **Placement**: put the access point central and high, in the open, not in a cupboard or behind the TV. Moving it two
  metres often gains 5–10 dB.
- **Channel**: on 2.4 GHz pick the least crowded of 1, 6, 11 at 20 MHz width; on 5 GHz pick a free 80 MHz block. Many
  routers' "auto" works well; check what it chose.
- **More access points** if the far rooms are below −70 dBm: a mesh system with a wired backhaul (Ethernet between
  units) is best; wireless backhaul halves airtime.
- **Use 5 GHz and 6 GHz** for nearby devices; leave 2.4 GHz for range and small smart-home devices.

## 6. Check security settings

In your router's admin page (its address is your default gateway, [Lab 3](03-Interfaces-and-Routes.md)):

- Security **WPA3-Personal** or **WPA2/WPA3** mixed mode; never WEP, WPA (TKIP) or open.
- A long passphrase (at least 12 random characters or 4–5 random words) ([wireless book, chapter 10](../books/wireless/10-Wi-Fi-Security.md)).
- **WPS off** (its PIN method can be brute-forced).
- A changed admin password, and current firmware (automatic updates on if offered).
- A **guest network** for visitors and smart-home gadgets, isolated from your computers.
- Remote administration from the internet off; UPnP off unless a game or app needs it.

## Check yourself

??? question "1. Your laptop shows −72 dBm in the bedroom and −48 dBm next to the router. About how many times weaker is the bedroom signal?"
    24 dB weaker: 10^(2.4) ≈ 250 times less power.

??? question "2. A neighbour uses 2.4 GHz channel 4. Which of 1, 6 and 11 suffers least?"
    Channel 11: channel 4 overlaps with 1 and 6 (centres 15 and 10 MHz away, each 20 MHz wide), but not with 11.

??? question "3. Why is iperf3 throughput lower than the tx rate?"
    The tx rate is the raw PHY rate; contention, acknowledgements, headers and other devices sharing airtime take a large share.

??? question "4. Why put smart-home devices on a guest network?"
    They are often poorly maintained; isolating them stops a compromised gadget from reaching your computers.

??? info "Sources"
    - IEEE 802.11-2024; Wi-Fi Alliance, *WPA3 Specification* v3.x and Wi-Fi 6E/7 materials.
    - `iw(8)` documentation (wireless.wiki.kernel.org); Apple, *Wireless Diagnostics*; Microsoft, `netsh wlan` reference; iperf3 documentation (iperf.fr).
    - S. Viehböck, "Brute forcing Wi-Fi Protected Setup", 2011.
