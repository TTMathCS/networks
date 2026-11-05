# 4. Wires and radio waves

*Bits travel as electricity in copper, as flashes of light in glass fibre, or as radio waves through the air. Wi-Fi, Bluetooth and phones all use radio.*

## Copper: electricity

The oldest way is a copper wire. The sender changes the voltage (how hard electricity pushes) many millions of times
a second, and the receiver reads each change as a 0 or a 1. The network cable behind a computer, an **Ethernet**
cable, has eight thin copper wires twisted in pairs. The twists cancel out electrical noise from nearby wires and
motors.

## Glass: light

A **fibre-optic** cable is a strand of very pure glass, thinner than a hair. A tiny laser flashes on and off, and the
light bounces along inside the glass for tens of kilometres before it needs a boost. Light in glass travels at about
two-thirds of its speed in empty space, roughly 200,000 kilometres a second, and one fibre can carry many colours of
light at once, each with its own stream of bits. That is why the cables under the oceans are all fibre: one cable
carries hundreds of terabits (hundreds of millions of millions of bits) every second.

<figure class="play" data-play="lightspeed"><span class="ai-tag">AI-created</span><figcaption><b>Watch it.</b> A race over 1,000 km, slowed down a million times: radio through the air at nearly 300,000 km a second, light in glass at about 200,000. Glass is the slower road, but it carries far more.</figcaption></figure>

## Radio: waves through the air

Radio is a wave of electric and magnetic energy, like light but invisible to our eyes. A radio wave has a
**frequency**: how many times it wiggles each second, measured in **hertz** (Hz). Wi-Fi uses waves that wiggle
2.4 billion, 5 billion or 6 billion times a second: 2.4, 5 and 6 GHz.

<figure class="mars-fig">
<svg viewBox="0 0 520 140" width="520" role="img" aria-label="A slow wave and a fast wave">
<g fill="none" stroke-width="2.5">
<path class="na" d="M10 40 C 45 0, 85 0, 120 40 S 195 80, 230 40 S 305 0, 340 40 S 415 80, 450 40"/>
<path class="nb" d="M10 105 C 22 85, 38 85, 50 105 S 78 125, 90 105 S 118 85, 130 105 S 158 125, 170 105 S 198 85, 210 105 S 238 125, 250 105 S 278 85, 290 105 S 318 125, 330 105 S 358 85, 370 105 S 398 125, 410 105 S 438 85, 450 105"/></g>
<g font-size="14" fill="currentColor"><text x="460" y="45">lower frequency</text><text x="460" y="110">higher frequency</text></g>
</svg>
<figcaption>Lower frequencies travel further and pass through walls better; higher frequencies carry more bits but fade faster.</figcaption>
</figure>

There is a trade-off everywhere in radio:

- **Lower frequencies** reach further and pass through walls better. That is why 2.4 GHz Wi-Fi reaches the garden.
- **Higher frequencies** have room for more bits each second, but fade faster. 6 GHz Wi-Fi is very fast in the same
  room and weak two walls away.

## Who uses which radio?

| Radio | How far | Used for |
| --- | --- | --- |
| NFC | a few centimetres | tapping a card or phone to pay |
| Bluetooth | about 10 metres | headphones, watches, keyboards |
| Wi-Fi | a house or a school floor | laptops, phones, TVs at home |
| Mobile phone network (4G, 5G) | a few kilometres per tower | phones on the move |
| Satellite | the whole planet | ships, remote places, and Mars! |

## Sharing the air

When two people talk at once in a room, nobody understands either. Radio has the same problem. Wi-Fi devices
politely **listen before they talk**: if the air is busy, they wait a short random time and try again. Phone networks
are stricter: the tower gives each phone its own slices of time and frequency, like a teacher choosing who speaks.

## Activity: the noisy room

Two students stand far apart and try to pass a message by voice while others chat. Then try with "listen first": the
sender waits for a quiet moment. Then try with a "tower": a leader points at who may speak. Which works best with
many people?

## Check yourself

??? question "1. What carries the bits in a fibre-optic cable?"
    Flashes of light from a tiny laser, travelling inside a strand of glass.

??? question "2. Why might 2.4 GHz Wi-Fi reach your garden when 6 GHz does not?"
    Lower frequencies travel further and pass through walls better; higher ones fade faster.

??? question "3. How do Wi-Fi devices avoid talking at the same time?"
    They listen first, and if the air is busy they wait a short random time before trying.

??? info "Sources"
    - IEEE 802.3 (Ethernet) and IEEE 802.11 (Wi-Fi) standards.
    - Tanenbaum, Feamster and Wetherall, *Computer Networks*, 6th ed., chapter 2.
    - Bluetooth SIG and NFC Forum ranges (typical, not maximum).

[← Addresses and names](03-Addresses-and-Names.md) · [Next: Staying safe →](05-Staying-Safe.md)
