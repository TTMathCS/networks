# 5. Staying safe on a network

*Packets pass through many hands on their way. Locks (encryption) keep them private, keys and passwords prove who you are, and a little care stops most tricks.*

## Postcards can be read

A packet is like a postcard: every router that passes it on could read it. On a shared Wi-Fi in a café, other people
nearby could too. So anything private must be **locked** before it is sent. Locking a message so only the right
person can read it is called **encryption**; it turns "meet at 3" into something like `x9$Lq…` that looks like
nonsense to everyone else.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 350" role="img" aria-labelledby="sk-n-postcard-t"><title id="sk-n-postcard-t">A message sent as a postcard can be read by every router on the way; the same message locked by encryption shows the routers only scrambled characters</title><defs><filter id="sk-n-postcard-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-n-postcard-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-n-postcard-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-n-postcard-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-n-postcard-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="350" filter="url(#sk-n-postcard-paper)"/><g filter="url(#sk-n-postcard-pen)"><text x="30" y="44" class="h">Postcard or locked box?</text><path class="p soft" d="M30 84 L140 84 L140 136 L30 136Z"/><text x="85.0" y="116.0" text-anchor="middle" class="s">you</text><circle cx="230" cy="110" r="24" class="p room"/><text x="230" y="115" text-anchor="middle" class="s">router</text><text x="230" y="74" text-anchor="middle" class="s">sees “meet at 3”</text><circle cx="350" cy="110" r="24" class="p room"/><text x="350" y="115" text-anchor="middle" class="s">router</text><text x="350" y="74" text-anchor="middle" class="s">sees “meet at 3”</text><circle cx="470" cy="110" r="24" class="p room"/><text x="470" y="115" text-anchor="middle" class="s">router</text><text x="470" y="74" text-anchor="middle" class="s">sees “meet at 3”</text><path class="p soft" d="M560 84 L620 84 L620 136 L560 136Z"/><text x="590.0" y="116.0" text-anchor="middle" class="s">friend</text><path class="p dash" d="M142 110 L204 110"/><path class="p dash" d="M256 110 L324 110"/><path class="p dash" d="M376 110 L444 110"/><path class="p dash" d="M496 110 L554 110" marker-end="url(#sk-n-postcard-ah)"/><path class="p soft" d="M30 224 L140 224 L140 276 L30 276Z"/><text x="85.0" y="256.0" text-anchor="middle" class="s">you</text><circle cx="230" cy="250" r="24" class="p room"/><text x="230" y="255" text-anchor="middle" class="s">router</text><text x="230" y="214" text-anchor="middle" class="s">sees “x9$Lq…”</text><circle cx="350" cy="250" r="24" class="p room"/><text x="350" y="255" text-anchor="middle" class="s">router</text><text x="350" y="214" text-anchor="middle" class="s">sees “x9$Lq…”</text><circle cx="470" cy="250" r="24" class="p room"/><text x="470" y="255" text-anchor="middle" class="s">router</text><text x="470" y="214" text-anchor="middle" class="s">sees “x9$Lq…”</text><path class="p soft" d="M560 224 L620 224 L620 276 L560 276Z"/><text x="590.0" y="256.0" text-anchor="middle" class="s">friend</text><path class="p dash" d="M142 250 L204 250"/><path class="p dash" d="M256 250 L324 250"/><path class="p dash" d="M376 250 L444 250"/><path class="p dash" d="M496 250 L554 250" marker-end="url(#sk-n-postcard-ah)"/><path class="p gold" d="M30 160 L110 160 L110 196 L30 196Z"/><text x="70" y="184" text-anchor="middle" class="s">meet at 3</text><text x="124" y="184" class="s">written on the card: anyone on the way can read it</text><path class="p" d="M74 304 L74 296 Q85 282 96 296 L96 304"/><path class="p gold" d="M66 304 L104 304 L104 330 L66 330Z"/><text x="124" y="322" class="s">locked before it leaves: only the friend has the key</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## The padlock in your browser

When a web address starts with **https** and your browser shows a padlock, two things are true:

1. **Private:** everything between you and that website is encrypted. Routers on the way see only scrambled bits.
2. **The right website:** the site proved it really is, say, `akadian.ca`, by showing a certificate, a kind of ID
   card signed by an organisation your browser trusts.

The padlock does **not** mean the website is honest or safe. A tricky site can have a padlock too. It only means
nobody in the middle can read or change what you send.

## Proving who you are

Websites need to know it is really you. The ways to prove it are:

- **Something you know**: a password.
- **Something you have**: your phone, which gets a code or a tap to approve.
- **Something you are**: a fingerprint or your face, checked on your own device.

Using two of these together (**two-step login**) stops most break-ins: a thief who learns your password still does not
have your phone. Newer **passkeys** go further: your device keeps a secret key that never leaves it and works only on
the real website, so a fake website cannot trick it out.

## Common tricks

| Trick | What it looks like | What to do |
| --- | --- | --- |
| **Phishing** | A message: "Your account is locked, log in here" with a link to a fake site | Don't click. Open the app or type the address yourself. |
| **Fake Wi-Fi** | A free network called "Airport_Free_WiFi" set up by someone nearby | Use networks you know; https still protects you. |
| **Guessing passwords** | Computers try millions of common passwords | Long, different password for each site; a password manager remembers them. |
| **Old software** | Holes in old apps let attackers in | Turn on automatic updates. |

## Firewalls: a guard at the door

Your home router and computer have a **firewall**: a guard that checks each packet coming in. Packets that answer
something you asked for (a web page you opened) are let in. Strangers knocking uninvited are turned away. That is why
most attacks from the internet never even reach your laptop.

## Golden rules

1. Think before you click a link in a message, even from a friend.
2. Use long passwords, never the same one twice, and turn on two-step login.
3. Keep software updated.
4. Only test or explore networks you own or have permission to use. Getting into other people's computers without
   permission is against the law almost everywhere, even "just to look".

## Activity: the locked box

Put a note in a box with a padlock and send it around the class. Only the person with the key can read it, even
though everyone touches the box. Now: how would you get the key to your friend without anyone copying it on the way?
(Real networks solve this with a clever trick called public-key cryptography: see
[cryptography.akadian.ca](https://cryptography.akadian.ca/).)

## Check yourself

??? question "1. What does the padlock in the browser promise, and what does it not promise?"
    It promises the connection is private and that you reached the website named in the address. It does not promise the site is honest.

??? question "2. Why does two-step login help even if someone steals your password?"
    They would also need your phone (or other device), which they don't have.

??? question "3. A message says your account is locked and gives a link. What should you do?"
    Don't use the link. Open the app or type the website address yourself to check.

??? info "Sources"
    - CISA, *Secure Our World* guidance, and the UK NCSC, *Cyber Aware* (everyday advice).
    - NIST SP 800-63B, *Digital Identity Guidelines: Authentication* (passwords, two factors).
    - FIDO Alliance, *Passkeys* overview; RFC 8446 (TLS 1.3, the lock behind https).

[← Wires and radio waves](04-Wires-and-Radio.md) · [Next: Talking to Mars →](06-Talking-to-Mars.md)
