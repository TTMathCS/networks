# 1. What is a network?

*A network is a group of devices joined so they can send each other messages. Your home has one, your school has one, and the internet joins millions of them together.*

## Two cans and a string

Take two tin cans, punch a hole in each, and tie them together with a long string. Pull the string tight and speak
into one can: your friend hears you in the other. That is the smallest network there is: **two devices** (the cans),
a **link** between them (the string), and a **message** (your voice).

Real networks have the same three parts:

- **Devices**: phones, laptops, game consoles, printers, smart speakers, and the big computers called **servers**
  that store websites and videos.
- **Links**: the paths messages travel along. Some are cables, some are radio waves (like Wi-Fi), some are thin
  strands of glass carrying light.
- **Messages**: everything you send or receive: a chat, a photo, a game move, a video.

## More than two

Two cans work for two people. What about a whole class? You could tie a string from every child to every other child,
but with 30 children you would need 435 strings! Networks solve this the way a post office does: everyone sends
their messages to **one central box**, and the box passes each message on to the right person.

In your home that central box is the **router**, usually a small box with blinking lights. Every phone and laptop in
the house talks to the router, and the router passes messages between them and out to the rest of the world.

<figure class="mars-fig">
<svg viewBox="0 0 520 230" width="520" role="img" aria-label="Four devices around a router, and the router linked to the internet">
<g fill="none" stroke="currentColor" stroke-width="2">
<rect x="215" y="95" width="90" height="44" rx="8" class="soft"/>
<line x1="215" y1="117" x2="110" y2="50"/><line x1="215" y1="117" x2="110" y2="185"/>
<line x1="305" y1="117" x2="410" y2="50"/><line x1="305" y1="117" x2="410" y2="185" class="na" stroke-width="3"/>
</g>
<g font-size="15" fill="currentColor" text-anchor="middle">
<text x="260" y="122">router</text><text x="80" y="45">phone</text><text x="80" y="200">laptop</text>
<text x="440" y="45">printer</text><text x="450" y="200">the internet</text></g>
</svg>
<figcaption>A home network: every device talks to the router, and the router also joins the home to the internet.</figcaption>
</figure>

## A network of networks

Your home network is small. Your school has a bigger one. A company that sells internet access (an **internet service
provider**) joins thousands of homes and schools together. And those companies join each other, all around the
world, through cables on land and under the sea. That giant network of networks is the **internet**.

No one owns the whole internet and no one switches it on or off. It works because every piece follows the same
rules about how to send and receive messages. Those rules are called **protocols**, and you will meet many of them on
this site.

<figure class="play" data-play="mesh"><span class="ai-tag">AI-created</span><figcaption><b>Try it.</b> Tap a link to cut it, and tap again to mend it. The message from A to H finds the way with the fewest hops among the links that are left. Cut enough and the network splits in two.</figcaption></figure>

## Fun facts

- About 600 cables lie on the sea floor or are being laid, some longer than 20,000 kilometres, carrying almost all messages between
  continents.
- The first message on the internet's ancestor, ARPANET, was sent in 1969. It was meant to be "LOGIN", but the
  computer crashed after "LO".
- There are more devices on the internet than people on Earth.

## Activity: the human network

Stand in a circle. One person in the middle is the router. Everyone else writes a short note with a friend's name on
it and hands it to the router, who walks it over. Now try with two routers, each with their own group, who must hand
notes to each other. You have built a network of networks!

## Check yourself

??? question "1. What are the three parts of every network?"
    Devices, the links between them, and the messages they send.

??? question "2. Why does a home have a router instead of a cable from every device to every other device?"
    With a central box, each device needs only one link. Joining every pair directly would need far too many links.

??? question "3. What is the internet?"
    A network of networks: home, school and company networks joined together all over the world, following the same
    rules (protocols).

??? info "Sources"
    - Kurose and Ross, *Computer Networking: A Top-Down Approach*, 8th ed., chapter 1.
    - TeleGeography, *Submarine Cable Map* (submarinecablemap.com), checked November 2026.
    - Leonard Kleinrock, "The first message transmission", UCLA, 29 October 1969.

[Next: Packets →](02-Packets.md)
