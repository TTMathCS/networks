# 6. MIMO and beamforming

*With several antennas at each end, a radio link can send several data streams at once on the same frequency, or focus its energy toward one user, or serve several users at once. Multipath, the enemy of Chapter 3, becomes an asset. This chapter explains MIMO, spatial streams, beamforming, MU-MIMO and massive MIMO.*

!!! abstract "In this chapter"
    **You will learn:** the MIMO channel matrix; spatial multiplexing and why it needs multipath; the capacity gain;
    diversity versus multiplexing; transmit beamforming and channel sounding; multi-user MIMO; massive MIMO in 5G;
    what "2×2" and "4×4" mean on a router box.

    **You need:** [Chapters 3 and 5](03-Fading-and-Noise.md); vectors and matrices help.

## 6.1 The channel as a matrix

With $N_t$ transmit and $N_r$ receive antennas, each pair has its own channel coefficient $h_{ij}$ (a complex number per
subcarrier). Sending a vector $\mathbf{x}$ of $N_t$ symbols, the receiver gets

$$\mathbf{y} = \mathbf{H}\mathbf{x} + \mathbf{n}$$

where $\mathbf{H}$ is the $N_r \times N_t$ **channel matrix**. In a room full of reflections, the entries are different
and roughly independent: each antenna hears a different mix of the transmitted streams.

## 6.2 Spatial multiplexing

If $\mathbf{H}$ is well conditioned (its rows and columns are "different enough"), the receiver can solve for
$\mathbf{x}$, separating up to $\min(N_t, N_r)$ independent streams sent simultaneously on the same frequency. Each one
is a **spatial stream**. A 2×2 link can carry two streams: double the data rate without more bandwidth or power.

Foschini and Telatar showed in the 1990s that capacity grows linearly with the number of antennas:

$$C \approx \min(N_t, N_r)\; B \log_2\!\left(1 + \frac{S}{N}\right) \quad \text{(rich scattering, high S/N)}$$

This was a surprise, since it seems to beat Shannon. It doesn't: each antenna pair is a separate channel in space, and
multipath is what makes them separate. In an open field with a single direct path, $\mathbf{H}$ has rank 1 and only one
stream fits. Indoors, Wi-Fi typically supports 2 streams to a phone and 2–4 to a laptop.

Receivers separate streams with linear methods (zero-forcing, MMSE) or near-optimal ones (maximum likelihood,
sphere decoding). In practice the best approach uses the **singular value decomposition** $\mathbf{H} = \mathbf{U}\boldsymbol{\Sigma}\mathbf{V}^*$:
if the transmitter knows $\mathbf{H}$, sending along the columns of $\mathbf{V}$ turns the channel into independent
parallel channels with gains $\sigma_i$.

## 6.3 Diversity or multiplexing

Extra antennas can be spent two ways: more streams (**multiplexing gain**) or more reliable single streams
(**diversity gain**, Chapter 3: combining signals that fade independently). Zheng and Tse (2003) showed there is a precise
trade-off between them. Rate control chooses dynamically: far from the access point, one robust stream (often with
space-time block coding); close by, two or more.

## 6.4 Beamforming

With several transmit antennas, the transmitter can adjust each one's phase and amplitude so the waves add in phase at
the receiver and partly cancel elsewhere: **beamforming**. With $N$ antennas, the gain at the target is up to $N$ times
(10 log₁₀ $N$ dB) in received power; 4 antennas give up to 6 dB, extending range or raising the MCS.

To beamform, the transmitter must know the channel. Wi-Fi uses **explicit sounding** (802.11ac onward): the access point
sends a null data packet; each client measures $\mathbf{H}$ and sends back a compressed **steering matrix**; the access
point then shapes its transmissions. Cellular networks also use the uplink's reference signals, assuming the channel is
the same in both directions (reciprocity, true when uplink and downlink share a frequency, as in TDD).

At mmWave frequencies (5G FR2, 60 GHz Wi-Fi), beamforming is essential: path loss is high, but antennas are tiny, so a
phone holds arrays of several elements and base stations hundreds, forming pencil beams and **beam tracking** as users
move.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 360" role="img" aria-labelledby="sk-nw-beam-t"><title id="sk-nw-beam-t">Four antennas send slightly delayed waves that add up in one direction, forming a beam towards a laptop</title><defs><filter id="sk-nw-beam-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nw-beam-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nw-beam-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nw-beam-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nw-beam-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="360" filter="url(#sk-nw-beam-paper)"/><g filter="url(#sk-nw-beam-pen)"><text x="30" y="44" class="h">Four antennas, one strong direction</text><path class="p gold" d="M60 130 L74 130 L74 150 L60 150Z"/><path class="p dash" d="M109.1 120.8 A40 40 0 0 1 109.1 159.2" opacity=".35"/><path class="p dash" d="M144.2 101.6 A80 80 0 0 1 144.2 178.4" opacity=".35"/><path class="p dash" d="M179.3 82.5 A120 120 0 0 1 179.3 197.5" opacity=".35"/><path class="p dash" d="M214.4 63.3 A160 160 0 0 1 214.4 216.7" opacity=".35"/><path class="p gold" d="M60 170 L74 170 L74 190 L60 190Z"/><path class="p dash" d="M109.1 160.8 A40 40 0 0 1 109.1 199.2" opacity=".35"/><path class="p dash" d="M144.2 141.6 A80 80 0 0 1 144.2 218.4" opacity=".35"/><path class="p dash" d="M179.3 122.5 A120 120 0 0 1 179.3 237.5" opacity=".35"/><path class="p dash" d="M214.4 103.3 A160 160 0 0 1 214.4 256.7" opacity=".35"/><path class="p gold" d="M60 210 L74 210 L74 230 L60 230Z"/><path class="p dash" d="M109.1 200.8 A40 40 0 0 1 109.1 239.2" opacity=".35"/><path class="p dash" d="M144.2 181.6 A80 80 0 0 1 144.2 258.4" opacity=".35"/><path class="p dash" d="M179.3 162.5 A120 120 0 0 1 179.3 277.5" opacity=".35"/><path class="p dash" d="M214.4 143.3 A160 160 0 0 1 214.4 296.7" opacity=".35"/><path class="p gold" d="M60 250 L74 250 L74 270 L60 270Z"/><path class="p dash" d="M109.1 240.8 A40 40 0 0 1 109.1 279.2" opacity=".35"/><path class="p dash" d="M144.2 221.6 A80 80 0 0 1 144.2 298.4" opacity=".35"/><path class="p dash" d="M179.3 202.5 A120 120 0 0 1 179.3 317.5" opacity=".35"/><path class="p dash" d="M214.4 183.3 A160 160 0 0 1 214.4 336.7" opacity=".35"/><path class="p red" d="M80 190 C250 120 400 110 526 118 C400 150 260 210 80 210Z" style="fill:#a03a2a;fill-opacity:.15"/><path class="p room" d="M530 100 L620 100 L620 140 L530 140Z"/><text x="575.0" y="126.0" text-anchor="middle" class="s">laptop</text><text x="70" y="320" class="s">Each antenna is given a small delay so the waves line up at the laptop</text><text x="70" y="340" class="s">and partly cancel elsewhere. Four antennas: up to 4 times the power, 6 dB.</text></g></svg><figcaption>Sketched for this page.</figcaption></figure>

## 6.5 Multi-user MIMO

An access point with 4 antennas talking to 1-antenna phones wastes spatial capacity if it serves one at a time.
**MU-MIMO** sends different streams to several users at once, forming each user's beam so that it has nulls at the other
users. Wi-Fi 5 introduced downlink MU-MIMO (up to 4 users); Wi-Fi 6 added uplink MU-MIMO (8 users); Wi-Fi 7 extends the
same ideas to 16 streams. It works best with stationary users and good channel knowledge; feedback overhead and moving
clients often limit real gains.

## 6.6 Massive MIMO

5G base stations in the mid band typically have **64 transmit and 64 receive** antenna elements (often arranged as 192
physical elements). With many more antennas than users, Marzetta (2010) showed that channels to different users become
nearly orthogonal, so simple processing serves a dozen or more users at once on the same frequency, each with a sharp
beam, and the energy per bit falls. This is the main source of 5G's capacity gain in the 3.5 GHz band, along with wider
channels.

## 6.7 Reading the box

"AX3000 2×2" or "BE19000 4×4" on a router: the number sums the maximum link rates of all bands; "4×4" means four
transmit and four receive chains on a band, so up to four spatial streams in total, shared among clients. A typical
phone has 2×2, so it alone can use at most 2 streams. Real throughput depends on S/N, distance, interference and
airtime sharing (Chapter 9), not on the box number.

## Check yourself

??? question "1. Why can't spatial multiplexing send two streams in an open field with only a direct path?"
    The channel matrix has rank 1: every antenna hears essentially the same mix, so the streams can't be separated.

??? question "2. How much received-power gain can 8-antenna beamforming give at most?"
    A factor of 8, about 9 dB.

??? question "3. A 4×4 access point serves four 1×1 phones. What feature lets it send to all four at once?"
    Downlink MU-MIMO, beamforming each stream with nulls toward the other phones.

??? info "Sources"
    - G. Foschini and M. Gans, "On Limits of Wireless Communications in a Fading Environment when Using Multiple Antennas", *Wireless Personal Comm.*, 1998; E. Telatar, "Capacity of Multi-antenna Gaussian Channels", *European Trans. Telecom.*, 1999.
    - L. Zheng and D. Tse, "Diversity and Multiplexing: A Fundamental Tradeoff in Multiple-Antenna Channels", *IEEE Trans. IT*, 2003.
    - T. Marzetta, "Noncooperative Cellular Wireless with Unlimited Numbers of Base Station Antennas", *IEEE Trans. Wireless Comm.*, 2010.
    - IEEE 802.11ac-2013 and 802.11ax-2021 (sounding, MU-MIMO); E. Björnson, J. Hoydis, L. Sanguinetti, *Massive MIMO Networks*, 2017 (free online).
