# Lab 11. A WireGuard VPN

*In this lab you connect two private networks through an encrypted WireGuard tunnel across an "internet" you build yourself, then look at the packets an eavesdropper would see. WireGuard's whole configuration fits on one screen, which makes it the clearest way to see how a VPN works.*

!!! abstract "In this lab"
    **You will:** build two sites joined by an untrusted link; make WireGuard key pairs; configure peers and allowed
    IPs; bring the tunnel up and route a private subnet through it; capture traffic outside and inside the tunnel;
    measure the MTU cost; see what happens with a wrong key.

    **You need:** [Lab 7](07-A-Network-on-One-Laptop.md); `wireguard-tools` installed; [security book, chapter 9](../books/security/09-IPsec-and-VPNs.md). Time: 40 minutes.

## 1. The plan

Two gateways, `gwA` and `gwB`, joined by a link standing in for the internet (203.0.113.0/24, a documentation range).
Each gateway also has a private LAN on a dummy interface: 10.1.0.0/24 behind A, 10.2.0.0/24 behind B. The tunnel uses
addresses 10.99.0.1 and 10.99.0.2.

```bash
ip netns add gwA; ip netns add gwB
ip link add inetA type veth peer name inetB
ip link set inetA netns gwA; ip link set inetB netns gwB
ip -n gwA addr add 203.0.113.1/24 dev inetA; ip -n gwB addr add 203.0.113.2/24 dev inetB
ip -n gwA link set inetA up; ip -n gwB link set inetB up
ip -n gwA link set lo up; ip -n gwB link set lo up
ip -n gwA link add lan type dummy; ip -n gwA addr add 10.1.0.1/24 dev lan; ip -n gwA link set lan up
ip -n gwB link add lan type dummy; ip -n gwB addr add 10.2.0.1/24 dev lan; ip -n gwB link set lan up
```

## 2. Keys

Each side makes a private key and derives its public key:

```bash
umask 077
wg genkey | tee a.key | wg pubkey > a.pub
wg genkey | tee b.key | wg pubkey > b.pub
cat a.pub b.pub
```

The keys are Curve25519 keys in base64. The private key never leaves its machine; the public key is what you give the
other side, like an SSH public key.

## 3. Configure the tunnel

On A:

```bash
ip -n gwA link add wg0 type wireguard
ip netns exec gwA wg set wg0 private-key ./a.key listen-port 51820 \
   peer $(cat b.pub) endpoint 203.0.113.2:51820 allowed-ips 10.99.0.2/32,10.2.0.0/24
ip -n gwA addr add 10.99.0.1/24 dev wg0
ip -n gwA link set wg0 up
ip -n gwA route add 10.2.0.0/24 dev wg0
```

On B, the mirror image:

```bash
ip -n gwB link add wg0 type wireguard
ip netns exec gwB wg set wg0 private-key ./b.key listen-port 51820 \
   peer $(cat a.pub) endpoint 203.0.113.1:51820 allowed-ips 10.99.0.1/32,10.1.0.0/24
ip -n gwB addr add 10.99.0.2/24 dev wg0
ip -n gwB link set wg0 up
ip -n gwB route add 10.1.0.0/24 dev wg0
```

**Allowed IPs** do two jobs ("cryptokey routing"): when sending, a packet for 10.2.0.x is encrypted to peer B; when
receiving, a packet decrypted from B is accepted only if its inner source is in B's allowed list.

## 4. Test and inspect

```bash
ip netns exec gwA ping -c 3 -I 10.1.0.1 10.2.0.1     # LAN to LAN through the tunnel
ip netns exec gwA wg show
```

`wg show` lists the peer, its endpoint, `latest handshake: N seconds ago` and bytes transferred. The first ping may be
slightly slower: it triggers the handshake (one round trip).

## 5. What an eavesdropper sees

Capture on the "internet" link while pinging:

```bash
ip netns exec gwB tcpdump -n -i inetB        # outside the tunnel
ip netns exec gwB tcpdump -n -i wg0          # inside the tunnel
```

Outside you see only UDP packets between 203.0.113.1:51820 and 203.0.113.2:51820, with sizes but no content, not even
the inner addresses. Inside you see the plain ICMP between 10.1.0.1 and 10.2.0.1. Every two minutes, or after a quiet
period, a new handshake gives fresh keys (forward secrecy).

## 6. The MTU cost

WireGuard adds 60 bytes over IPv4 (20 outer IP + 8 UDP + 32 WireGuard header and tag), 80 over IPv6, so the tunnel
interface defaults to MTU 1420. Check:

```bash
ip -n gwA link show wg0 | grep mtu
ip netns exec gwA ping -c 1 -M do -s 1392 -I 10.1.0.1 10.2.0.1   # 1392 + 28 = 1420: fits
ip netns exec gwA ping -c 1 -M do -s 1393 -I 10.1.0.1 10.2.0.1   # too big
```

Mismatched MTUs are the most common cause of VPNs where small requests work but large pages hang
([Lab 2](02-Ping-and-Traceroute.md)).

## 7. A wrong key

Replace B's idea of A's public key with a random one:

```bash
ip netns exec gwB wg set wg0 peer $(cat a.pub) remove
ip netns exec gwB wg set wg0 peer $(wg genkey | wg pubkey) endpoint 203.0.113.1:51820 allowed-ips 10.1.0.0/24
ip netns exec gwA ping -c 2 -W 1 -I 10.1.0.1 10.2.0.1
```

Pings fail, and B sends **nothing** back to A's handshake attempts: WireGuard ignores unauthenticated packets, so a
scanner cannot even tell a WireGuard server is listening.

Clean up: `ip netns del gwA; ip netns del gwB`, and delete the key files.

## Check yourself

??? question "1. Which IP addresses can an eavesdropper on the internet link see?"
    Only the gateways' outer addresses (203.0.113.1 and .2) and UDP port 51820; the inner 10.x addresses are encrypted.

??? question "2. What two jobs does allowed-ips do?"
    It selects which peer (and key) to encrypt an outgoing packet to, and it filters which inner source addresses are accepted from each peer.

??? question "3. Why is the default WireGuard MTU 1420?"
    1500 minus 80 bytes, the overhead over IPv6 (the larger case); over IPv4 the overhead is 60 bytes.

??? question "4. Why can a port scanner not detect a WireGuard server?"
    It sends no reply to packets that do not carry a valid handshake for a known peer's key.

??? info "Sources"
    - J. A. Donenfeld, "WireGuard: Next Generation Kernel Network Tunnel", NDSS 2017; wireguard.com (Quick Start, Protocol, Routing & Network Namespace Integration).
    - `wg(8)`, `wg-quick(8)` manual pages.
