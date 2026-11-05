# When the internet is down

*Something does not load. Find which part is broken, from your device to the wider internet, in a few minutes. Four parts: stop at the one you need.*

[In one minute](#in-one-minute) · [Do it](#do-it) · [Expert](#expert) · [Now and next](#now-and-next)

## In one minute

"The internet is down" can mean many different things: your device is not connected to Wi-Fi; the Wi-Fi is fine but
the router has lost its link to your provider; names are not being turned into addresses (DNS); or only one website is
broken. Work **from near to far**: your device, then your router, then your provider, then the site. The first step
that fails tells you where the problem is. Often, restarting the router (wait 30 seconds before turning it back on)
fixes it, but knowing *which* part failed helps you fix it next time, or tell your provider exactly what is wrong.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 350" role="img" aria-labelledby="sk-n-neartofar-t"><title id="sk-n-neartofar-t">Five checks in a row, device, router, provider, names, site: the device and router pass, the provider check fails, so the problem is the link to the provider</title><defs><filter id="sk-n-neartofar-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-n-neartofar-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-n-neartofar-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-n-neartofar-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-n-neartofar-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="350" filter="url(#sk-n-neartofar-paper)"/><g filter="url(#sk-n-neartofar-pen)"><text x="30" y="44" class="h">Check from near to far</text><path class="p room" d="M30 110 L130 110 L130 164 L30 164Z"/><text x="80.0" y="143.0" text-anchor="middle" class="s">device</text><text x="80" y="190" text-anchor="middle" class="s">Wi-Fi on, joined?</text><text x="80" y="226" text-anchor="middle" class="l" style="fill:#3a2a1e">✓</text><path class="p " d="M132 137 L150 137" marker-end="url(#sk-n-neartofar-ah)"/><path class="p room" d="M152 110 L252 110 L252 164 L152 164Z"/><text x="202.0" y="143.0" text-anchor="middle" class="s">router</text><text x="202" y="190" text-anchor="middle" class="s">ping the router</text><text x="202" y="226" text-anchor="middle" class="l" style="fill:#3a2a1e">✓</text><path class="p " d="M254 137 L272 137" marker-end="url(#sk-n-neartofar-ah)"/><path class="p gold" d="M274 110 L374 110 L374 164 L274 164Z"/><text x="324.0" y="143.0" text-anchor="middle" class="s">provider</text><text x="324" y="190" text-anchor="middle" class="s">ping 1.1.1.1</text><text x="324" y="226" text-anchor="middle" class="l" style="fill:#a03a2a">✗</text><path class="p " d="M376 137 L394 137" marker-end="url(#sk-n-neartofar-ah)"/><path class="p soft" d="M396 110 L496 110 L496 164 L396 164Z"/><text x="446.0" y="143.0" text-anchor="middle" class="s">names</text><text x="446" y="190" text-anchor="middle" class="s">DNS lookup</text><path class="p " d="M498 137 L516 137" marker-end="url(#sk-n-neartofar-ah)"/><path class="p soft" d="M518 110 L618 110 L618 164 L518 164Z"/><text x="568.0" y="143.0" text-anchor="middle" class="s">the site</text><text x="568" y="190" text-anchor="middle" class="s">open the page</text><path class="p red" d="M324 238 Q330 268 362 270" marker-end="url(#sk-n-neartofar-ah)"/><text x="370" y="276" class="s">the first step that fails</text><text x="370" y="296" class="s">is where the problem is:</text><text x="370" y="316" class="s">here, the link to the provider.</text><text x="30" y="290" class="s">No need to test further:</text><text x="30" y="310" class="s">names and the site sit</text><text x="30" y="330" class="s">beyond the broken link.</text></g></svg><figcaption>Sketched for this page. One example of a failure.</figcaption></figure>

## Do it

Open a terminal (Windows: Command Prompt; macOS: Terminal) and go step by step:

| Step | Test | If it fails |
|---|---|---|
| 1. Is my device connected? | Wi-Fi icon shows connected; `ipconfig` (Windows) or `ifconfig` / `ip addr` shows an address like 192.168.x.x | Rejoin Wi-Fi; an address starting `169.254.` means no DHCP reply: restart the router |
| 2. Can I reach my router? | `ping 192.168.1.1` (your gateway: `ipconfig` shows it as "Default Gateway") | Wi-Fi or cable problem between you and the router |
| 3. Can I reach the internet by number? | `ping 1.1.1.1` | Router–provider link is down: check the router's lights, the modem, your provider's outage page (from a phone) |
| 4. Do names work? | `nslookup www.akadian.ca` | DNS problem: try another resolver (set DNS to 1.1.1.1 or 9.9.9.9) |
| 5. Is it just one site? | open other sites; check a "down for everyone?" service from your phone | The site itself is down; wait |

Also: try another device. If your phone works on the same Wi-Fi but the laptop does not, the problem is the laptop
(restart it, turn Wi-Fi off and on, forget and rejoin the network, check for a VPN or firewall app).

**Restart in order:** modem first (if separate), wait until its lights settle, then router, then your device.

**Calling your provider:** tell them the results: "my devices reach the router, but the router gets no internet; the
modem's online light is red since 9 am." It saves a long script.

## Expert

**What each step proves.** A valid address and gateway prove DHCP worked; a ping to the gateway proves layer 1–3 on the
LAN; a ping to a public IP proves routing and the access link; a name lookup proves DNS; a TCP connection
(`curl -v https://site`) proves the path for TCP and TLS to that site; HTTP status proves the application.
([Lab 3](../labs/03-Interfaces-and-Routes.md), [Lab 4](../labs/04-DNS-with-dig.md), [Lab 5](../labs/05-HTTP-and-TLS-with-curl.md)).

**Useful tools:**

| Symptom | Tool |
|---|---|
| Slow or lossy, not dead | `mtr -rwc 100 1.1.1.1` (loss that continues to the end is real; see [Lab 2](../labs/02-Ping-and-Traceroute.md)) |
| Where the path stops | `traceroute -n` / `tracert -d` |
| DNS doubt | `dig @1.1.1.1 name` versus `dig name` (your resolver) |
| TLS or certificate errors | `curl -v`, `openssl s_client`; check the device clock |
| Small pages work, large ones hang | MTU problem, often a VPN or PPPoE: `ping -M do -s 1472` |
| Works on IPv4, not IPv6 (or reverse) | `ping -6`, `curl -6`; broken IPv6 can cause slow starts |
| Everything works for a while, then fails | DHCP lease, overheating router, Wi-Fi interference, ISP flapping: check the router's log |

**Common causes in practice:** a device clock far off (breaks TLS); a captive portal on hotel or café Wi-Fi (open
any http:// page to see it); a full DHCP pool; two devices with the same static address; a VPN or security app
intercepting traffic; IPv6 advertised but broken upstream; the provider's DNS failing while routing is fine.

**For networks you run:** monitor from outside (a probe that tests DNS, ping and HTTPS every minute), keep router logs,
and write down your provider's support number and circuit ID where you can find them without the internet
([networks book, chapter 22](../books/networks/22-Running-a-Network.md)).

## Now and next

*Last checked: 5 November 2026.*

- Big outages increasingly come from **shared providers**, not your link: a cloud region, a CDN or a security software
  update (the July 2024 CrowdStrike update crashed about 8.5 million Windows machines; the October 2025 AWS us-east-1
  DNS problem broke many apps at once). If many unrelated sites fail together, check the big providers' status pages.
- **Wi-Fi 7 multi-link** and **5G home internet** with automatic failover make home connections more resilient; many
  routers can now use a phone or 5G modem as a backup link.
- **Network assurance** tools in routers increasingly run these checks automatically and say which step failed.

??? info "Sources"
    - RFC 792 (ICMP), RFC 2131 (DHCP), RFC 3927 (169.254/16 link-local addresses), RFC 8305 (Happy Eyeballs v2).
    - Microsoft, "Helping our customers through the CrowdStrike outage" (July 2024); AWS, summary of the October 2025 service disruption in us-east-1.
    - `ping(8)`, `traceroute(8)`, `mtr(8)`, `dig(1)` manuals.
