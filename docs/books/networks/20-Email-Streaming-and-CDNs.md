# 20. Email, streaming and CDNs

*Three applications show three different designs: email is store-and-forward between independent servers; video streaming adapts its quality to the network second by second; content delivery networks move the content close to the user. This chapter covers each, plus peer-to-peer.*

!!! abstract "In this chapter"
    **You will learn:** how an email travels (SMTP, MX records, IMAP); SPF, DKIM and DMARC; adaptive bitrate streaming
    (DASH, HLS); how a CDN picks a server; peer-to-peer and BitTorrent; real-time media.

    **You need:** [Chapters 18 and 19](18-DNS.md).

## 20.1 How email travels

Email predates the web (SMTP, 1982) and is still built from independent servers:

1. Your mail app **submits** the message to your provider's server with **SMTP** on port 587 (authenticated, TLS).
2. Your server looks up the recipient domain's **MX** records in DNS and connects to the best one on port 25 with SMTP.
3. The receiving server stores it in the recipient's mailbox.
4. The recipient's app fetches it with **IMAP** (port 993, keeps mail on the server, synchronised across devices) or the
   older POP3, or a webmail interface over HTTPS.

If the receiving server is down, the sending server keeps the message and retries for days: store-and-forward.

An SMTP conversation is plain text: `EHLO`, `MAIL FROM:`, `RCPT TO:`, `DATA`, the message, a line with `.`, `QUIT`. Servers
upgrade to TLS with `STARTTLS` when both support it (MTA-STS, RFC 8461, lets a domain insist on it).

## 20.2 Who really sent this?

SMTP lets anyone write any "From" address, which spam and phishing exploit. Three DNS-published mechanisms fix this:

- **SPF** (RFC 7208): a TXT record listing which servers may send mail for the domain.
- **DKIM** (RFC 6376): the sending server signs headers and body; the public key is in DNS. Survives forwarding.
- **DMARC** (RFC 7489): ties them to the visible From domain and tells receivers what to do on failure (`none`,
  `quarantine`, `reject`) and where to send reports.

Since 2024 Google and Yahoo require bulk senders to use all three.

## 20.3 Streaming video

Video is the majority of internet traffic by volume. Modern streaming does not use a special protocol: it uses plain
HTTP, in pieces.

- The video is encoded at several **bitrates** (for example 0.4, 1.5, 3, 6 and 15 Mbit/s, from small to 4K), and each
  version is cut into **segments** of 2–6 seconds.
- A **manifest** file lists them: **DASH** (MPEG standard, `.mpd`) or **HLS** (Apple, `.m3u8`).
- The player downloads segments over HTTP, keeping a **buffer** of maybe 10–30 seconds, and for each next segment
  chooses a bitrate: **adaptive bitrate (ABR)**. Throughput-based players pick what recent downloads achieved;
  buffer-based players (such as BOLA) pick higher quality as the buffer fills.

Because segments are ordinary files, every HTTP cache and CDN can serve them. Live streaming uses short segments (or
chunks of segments: low-latency HLS and CMAF) to get delay down to a few seconds. Codecs matter as much as networks:
AV1 and HEVC need about half the bits of the older H.264 for the same quality.

## 20.4 Content delivery networks

A server in one city cannot give fast service worldwide: the speed of light alone adds 100+ ms across an ocean, and one
site cannot absorb global demand. A **CDN** keeps copies of content in many locations close to users:

- **Where**: CDNs place servers inside ISPs' networks ("enter deep", like Akamai with thousands of locations) or in large
  sites at internet exchanges ("bring home", like the big cloud CDNs). Video services run their own (Netflix Open
  Connect puts boxes inside ISPs).
- **Choosing a server**: either **DNS-based** (the CDN's authoritative DNS answers each resolver with the address of a
  nearby server; the EDNS Client Subnet option hints at the user's location) or **anycast** (every site announces the same
  addresses; BGP routes each user to the nearest, Chapter 13).
- **Caching**: the edge server fetches from the origin on a miss and keeps the object as HTTP caching headers allow.
  Popular content is nearly always a hit.

CDNs also terminate TLS, absorb denial-of-service attacks, and run code at the edge. A large share of web traffic now
flows from a handful of CDN and cloud networks directly into access ISPs, flattening the internet's old hierarchy.

## 20.5 Peer-to-peer

In **peer-to-peer (P2P)** systems, users' machines serve each other. Distributing a file of size $F$ to $N$ peers takes
at least $NF/u_s$ time from a single server with upload rate $u_s$, growing linearly with $N$; with P2P, each peer also
uploads, and the time grows far more slowly because total upload capacity grows with $N$.

**BitTorrent** splits files into pieces of e.g. 256 KB; peers trade pieces, fetching the **rarest first** (so every piece
stays available) and preferring to upload to peers that upload to them (**tit-for-tat**, with occasional "optimistic
unchoking" of a random peer). Peers find each other through a tracker or a **distributed hash table** (Kademlia), which
maps keys to peers using XOR distance between IDs, so any key is found in $O(\log N)$ hops. Kademlia-style DHTs also
underpin IPFS and several blockchain networks. Software updates (some game launchers, Windows Delivery Optimization) use
P2P inside networks to save bandwidth.

## 20.6 Real-time media

Calls and live games cannot buffer for seconds. They send over UDP using **RTP** (sequence numbers, timestamps) with
SRTP encryption, conceal small losses (audio codecs such as Opus fill gaps), use forward error correction, and adapt
bitrate to delay-based congestion signals. Group calls route through a **selective forwarding unit** (SFU) that receives
each participant's stream once and forwards appropriate quality layers to each other participant. Signalling (who calls
whom) uses SIP in telephony and custom HTTPS/WebSocket protocols in apps.

## Check yourself

??? question "1. Alice at a.org emails bob@b.net. Which DNS lookup does Alice's server need, and which protocol does it then use?"
    The MX records of b.net; then SMTP (port 25) to the chosen mail server.

??? question "2. A streaming player's buffer is nearly empty and measured throughput is 4 Mbit/s. Which of 1.5, 3 and 6 Mbit/s should it pick next?"
    A conservative choice below the throughput, such as 1.5 or 3 Mbit/s; with a near-empty buffer, a buffer-based player would pick the lowest to avoid a stall.

??? question "3. Name the two ways a CDN can steer a user to a nearby server."
    DNS-based redirection (answering with a nearby server's address) and anycast (routing a shared address to the nearest site via BGP).

??? info "Sources"
    - RFC 5321 (SMTP), RFC 9051 (IMAP4rev2), RFC 7208 (SPF), RFC 6376 (DKIM), RFC 7489 (DMARC), RFC 8461 (MTA-STS).
    - ISO/IEC 23009-1 (MPEG-DASH), RFC 8216 (HLS); K. Spiteri et al., "BOLA", INFOCOM 2016.
    - E. Nygren, R. Sitaraman, J. Sun, "The Akamai Network", *ACM SIGOPS OSR*, 2010.
    - B. Cohen, "Incentives Build Robustness in BitTorrent", 2003; P. Maymounkov and D. Mazières, "Kademlia", IPTPS 2002.
    - Google, "Email sender guidelines" (2024); Sandvine, *Global Internet Phenomena Report* (video share of traffic).
