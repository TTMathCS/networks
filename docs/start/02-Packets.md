# 2. Packets: a message in pieces

*When you send a photo, it does not travel as one big lump. It is cut into many small pieces called packets, each one numbered and addressed, and they are put back together at the other end.*

## Everything is numbers

A computer stores everything as numbers: letters, colours of each dot in a photo, notes of a song. And each number is
stored as a row of **bits**, tiny switches that are either off (0) or on (1). The letter "A" is 01000001. A photo
from a phone is millions of bits.

To send a message, the computer sends its bits along a link, one after another, very fast: a home Wi-Fi link can
carry hundreds of millions of bits each second.

## Why cut a message into pieces?

Imagine sending a whole book through the post as one giant parcel. If it gets lost, you lose everything, and while it
blocks the conveyor belt nobody else's letters can move. Now imagine sending it as 300 postcards, one page each,
numbered 1 to 300. If postcard 57 gets lost, you only send page 57 again. And other people's postcards can travel
between yours, so nobody waits long.

Networks do exactly this. A message is cut into **packets** of about 1,500 bytes (a byte is 8 bits), each carrying:

- a **header**, like the front of a postcard: who it is to, who it is from, and its number;
- a **payload**: one small piece of the message itself.

<figure class="mars-fig">
<svg viewBox="0 0 520 150" width="520" role="img" aria-label="A message split into numbered packets, each with a header and a piece of the message">
<g fill="none" stroke="currentColor" stroke-width="2">
<rect x="10" y="20" width="160" height="40" rx="5" class="soft"/>
<rect x="210" y="20" width="90" height="40" rx="5"/><rect x="210" y="20" width="32" height="40" class="soft-acc"/>
<rect x="315" y="20" width="90" height="40" rx="5"/><rect x="315" y="20" width="32" height="40" class="soft-acc"/>
<rect x="420" y="20" width="90" height="40" rx="5"/><rect x="420" y="20" width="32" height="40" class="soft-acc"/>
<path d="M175 40 h28" marker-end="url(#a2)"/></g>
<defs><marker id="a2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L10,5L0,10z" fill="currentColor"/></marker></defs>
<g font-size="14" fill="currentColor" text-anchor="middle">
<text x="90" y="45">your photo</text><text x="226" y="45">1</text><text x="331" y="45">2</text><text x="436" y="45">3</text>
<text x="272" y="45">piece</text><text x="377" y="45">piece</text><text x="482" y="45">piece</text>
<text x="360" y="95">the coloured part is the header:</text><text x="360" y="115">to, from, and the packet's number</text></g>
</svg>
<figcaption>A message becomes numbered packets. Each one can travel on its own and be put back in order at the end.</figcaption>
</figure>

## Many roads

Between your home and a website there are many routers, each joined to several others, like towns joined by roads.
Each router reads a packet's header and sends it one step closer to where it is going. Two packets of the same
message may even take different roads and arrive in a different order. That is fine: the numbers let the receiving
computer put them back in order.

If a road is broken, routers notice and send packets another way. This is why the internet keeps working when a
cable is cut somewhere: the packets go around.

## What if a packet is lost?

Sometimes a packet is lost: a router was too busy, or radio noise scrambled it. The receiver checks which numbers
arrived. For anything that must be perfect, like a file or a web page, it says "I got 1 to 56 and 58 to 300; please
send 57 again". For a video call, a lost piece is usually just skipped: a tiny glitch is better than waiting.

<figure class="play" data-play="packets"><span class="ai-tag">AI-created</span><figcaption><b>Watch it.</b> A message cut into six numbered packets. They take different roads, arrive out of order and are put back together by their numbers. Packet 3 is lost on the way, so the receiver asks for it again.</figcaption></figure>

## Activity: the postcard race

Write a sentence of ten words on ten small cards, one word each, numbered 1 to 10. Shuffle them and give them to ten
"routers" (friends) standing between you and a receiver across the room, who each pass cards along. Take one card away
on the way. Can the receiver rebuild the sentence and ask for exactly the missing card?

## Check yourself

??? question "1. What are the two parts of a packet?"
    A header (to, from, its number and other details) and a payload (one small piece of the message).

??? question "2. Why is it better to send 300 small packets than one huge one?"
    A lost packet costs only one small resend, and other people's packets can travel in between, so links are shared fairly.

??? question "3. Packets arrive as 3, 1, 2. How does the receiver fix that?"
    It uses the numbers in the headers to put them back in order.

??? info "Sources"
    - Paul Baran, *On Distributed Communications*, RAND, 1964, and Donald Davies's packet switching work at NPL, 1965 (the origin of packets).
    - Kurose and Ross, *Computer Networking*, 8th ed., sections 1.3 and 3.4.
    - RFC 894 (Ethernet's 1,500-byte packets).

[← What is a network?](01-What-Is-a-Network.md) · [Next: Addresses and names →](03-Addresses-and-Names.md)
