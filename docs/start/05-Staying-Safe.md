# 5. Staying safe on a network

*Packets pass through many hands on their way. Locks (encryption) keep them private, keys and passwords prove who you are, and a little care stops most tricks.*

## Postcards can be read

A packet is like a postcard: every router that passes it on could read it. On a shared Wi-Fi in a café, other people
nearby could too. So anything private must be **locked** before it is sent. Locking a message so only the right
person can read it is called **encryption**; it turns "meet at 3" into something like `x9$Lq…` that looks like
nonsense to everyone else.

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
