# 6. Talking to Mars

*On Earth, a message crosses the world in a tenth of a second. To Mars it takes between 3 and 22 minutes, and the planets keep moving. Talking to Mars needs giant dishes, relay satellites and a different kind of network.*

## How far is Mars?

Mars and Earth both go around the Sun, at different speeds. At their closest they are about 55 million kilometres
apart; on opposite sides of the Sun, about 400 million. Radio travels at the speed of light, 300,000 kilometres a
second, so a message takes:

| Mars and Earth | Distance | One way | There and back |
| --- | --- | --- | --- |
| closest | about 55 million km | about 3 minutes | about 6 minutes |
| farthest | about 400 million km | about 22 minutes | about 44 minutes |

Compare: a packet from Toronto to Tokyo and back takes about 0.15 seconds.

So you can never have a chat with Mars. You say "hello", and the answer arrives after your dinner is cold. A rover
cannot be driven with a joystick either: it gets a day's instructions in one go and drives itself.

## Giant ears on Earth

Radio spreads out as it travels, like the ripples from a stone in a pond. By the time a signal from Mars reaches us,
it is unimaginably faint: far weaker than the energy of a single snowflake landing. To catch it, NASA's **Deep Space
Network** uses dish antennas up to 70 metres across, in three places spread around the Earth:

- Goldstone, California
- Madrid, Spain
- Canberra, Australia

They are about a third of the way around the world from each other, so as the Earth turns, at least one of them can
always see Mars.

## Relay satellites

A rover is small and has little power, so it cannot shout all the way to Earth. Instead it talks to **orbiters**:
spacecraft circling Mars a few hundred kilometres up, such as NASA's Mars Reconnaissance Orbiter and MAVEN and
Europe's Trace Gas Orbiter. When one passes overhead, the rover sends its pictures up by UHF radio in a few minutes;
the orbiter stores them and later sends them on to Earth with its big antenna. Most of the pictures from Mars rovers
arrived this way.

This is the same idea as your home router, but stretched across space: the rover is the laptop, the orbiter is the
router, and the Deep Space Network is the internet's front door.

## A network that waits

On Earth, if a link breaks, packets are lost and sent again a moment later. Between planets, links are broken most of
the time: Mars turns, orbiters go behind the planet, the Sun gets in the way. So space networks use **store and
forward**: each stop keeps the message safely until the next link opens, like a letter waiting in a post office.
Engineers call this **delay-tolerant networking**, and it was tested on the International Space Station.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 340" role="img" aria-labelledby="sk-n-wait-t"><title id="sk-n-wait-t">A message goes from rover to orbiter to a big dish on Earth to the team; links open only now and then, and each stop keeps the message until the next one opens</title><defs><filter id="sk-n-wait-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-n-wait-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-n-wait-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-n-wait-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-n-wait-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="340" filter="url(#sk-n-wait-paper)"/><g filter="url(#sk-n-wait-pen)"><text x="30" y="44" class="h">Keep it until the next link opens</text><path class="p room" d="M30 120 L140 120 L140 176 L30 176Z"/><text x="85.0" y="154.0" text-anchor="middle" class="s">rover</text><path class="p gold" d="M190 120 L300 120 L300 176 L190 176Z"/><text x="245.0" y="154.0" text-anchor="middle" class="s">orbiter</text><path class="p room" d="M350 120 L460 120 L460 176 L350 176Z"/><text x="405.0" y="154.0" text-anchor="middle" class="s">big dish</text><path class="p room" d="M510 120 L620 120 L620 176 L510 176Z"/><text x="565.0" y="154.0" text-anchor="middle" class="s">team</text><path class="p " d="M142 148 L188 148" marker-end="url(#sk-n-wait-ah)"/><path class="p " d="M302 148 L348 148" marker-end="url(#sk-n-wait-ah)"/><path class="p " d="M462 148 L508 148" marker-end="url(#sk-n-wait-ah)"/><text x="196" y="105" class="s">UHF, a few minutes</text><text x="340" y="105" class="s">3 to 22 minutes one way</text><path class="p" d="M60 240 L600 240"/><text x="40" y="226" class="s">link open:</text><path class="p rust" d="M70 234 L110 234 L110 246 L70 246Z"/><path class="p rust" d="M230 234 L290 234 L290 246 L230 246Z"/><path class="p rust" d="M400 234 L480 234 L480 246 L400 246Z"/><path class="p rust" d="M540 234 L590 234 L590 246 L540 246Z"/><text x="60" y="275" class="s">Gaps: Mars turns, the orbiter goes behind the planet, the Sun gets in the way.</text><text x="60" y="300" class="s">Nothing is thrown away in a gap: each stop holds the message, like a letter</text><text x="60" y="320" class="s">waiting in a post office. This is delay-tolerant networking.</text></g></svg><figcaption>Sketched for this page. The open times are an example, not a real schedule.</figcaption></figure>

## The future: a Mars internet

People living on Mars would have their own local network: Wi-Fi in homes, cables under the streets, maybe radios on
rovers between towns. Messages to Earth would still take minutes, so web pages from Earth might be copied to Mars
ahead of time, and video calls with Earth would really be video letters.

## Activity: the slow call

Two students sit far apart. Every message must be written down and carried by a walker who takes three minutes (use a
timer). Plan a short game of noughts and crosses this way. How would you play faster? (Send many moves at once, like
"if you go here, I go there": exactly how rovers get their instructions.)

## Check yourself

??? question "1. Why can't you have a live conversation with someone on Mars?"
    Each message takes 3 to 22 minutes to arrive, so every answer comes many minutes later.

??? question "2. Why does the Deep Space Network have dishes in three countries?"
    As Earth turns, at least one of the three can always point at Mars.

??? question "3. What does a Mars orbiter do for a rover?"
    It collects the rover's data by radio when passing overhead and relays it to Earth with its bigger antenna.

??? info "Sources"
    - NASA JPL, *Deep Space Network* (deepspace.jpl.nasa.gov) and *Mars Relay Network* pages, checked November 2026.
    - NASA Mars Exploration, *Communications with Earth* (rover data relayed through orbiters).
    - CCSDS 734.2-B-1 and RFC 9171 (Bundle Protocol for delay-tolerant networking); NASA DTN tests on the ISS.

[← Staying safe](05-Staying-Safe.md) · [Back to Start](index.md)
