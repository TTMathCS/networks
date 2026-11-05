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
