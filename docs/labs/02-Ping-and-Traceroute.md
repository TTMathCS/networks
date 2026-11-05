# Lab 2. Ping and traceroute

*The two oldest diagnostic tools are still the first ones every network engineer reaches for. In this lab you measure round-trip time and loss, find the speed of light in fibre, and watch the path your packets take across the internet.*

!!! abstract "In this lab"
    **You will:** measure RTT, jitter and loss with ping; estimate distance from delay; see each router on a path with
    traceroute and mtr; understand how TTL makes traceroute work; find the path MTU.

    **You need:** [Lab 1](01-Your-Lab.md) (or any computer: these tools exist on macOS and Windows). Time: 20–30 minutes.

## 1. Ping

`ping` sends ICMP **echo request** packets and times the **echo reply**:

```bash
ping -c 10 1.1.1.1
```

```
64 bytes from 1.1.1.1: icmp_seq=1 ttl=57 time=11.8 ms
...
10 packets transmitted, 10 received, 0% packet loss, time 9013ms
rtt min/avg/max/mdev = 11.2/12.0/13.9/0.7 ms
```

The summary gives the **round-trip time** (RTT) and **mdev**, a measure of variation (jitter). On Windows use
`ping -n 10`. Now try a server far away, for example a university on another continent (`ping -c 10 www.u-tokyo.ac.jp`,
or any site you know is hosted abroad). Some hosts block ping; try another if you get no replies.

## 2. Distance from delay

Light in fibre travels at about 200,000 km/s, two-thirds of its speed in vacuum, so each 1 ms of RTT covers at most
100 km of distance each way. If Toronto to Tokyo (about 10,300 km on the great circle) gave 160 ms, the theoretical
minimum would be $2 \times 10{,}300 / 200{,}000 = 103$ ms; the rest is the cables' longer route, router queues and
processing. Compare your own numbers: **delay sets a hard lower limit that no upgrade can beat**
([networks book, chapter 3](../books/networks/03-Delay-Loss-and-Throughput.md)).

Watch for **loss**: run `ping -c 100 -i 0.2 1.1.1.1` (five per second). Over Wi-Fi you may see a few percent lost
and occasional large times; over a cable, usually none.

## 3. Traceroute

Every IP packet has a **TTL** (time to live, called hop limit in IPv6). Each router lowers it by one and, when it
reaches zero, drops the packet and sends back an ICMP **time exceeded** message from its own address. Traceroute sends
packets with TTL 1, 2, 3 ... so each router on the path reveals itself in turn.

```bash
traceroute -n 1.1.1.1        # -n: no name lookups (faster)
traceroute www.akadian.ca    # with names
```

On Windows the command is `tracert`. Each line shows a hop and three RTT samples. Things you will see:

- `* * *`: that router does not send time-exceeded messages (or they are filtered). The path still continues.
- Router names often contain city codes or airport codes (`tor`, `yyz`, `nyc`, `fra`), showing where the path goes.
- RTT can jump at an ocean crossing, and later hops can show *smaller* times than earlier ones, because routers answer
  traceroute at low priority.
- Linux traceroute sends UDP by default; `-I` uses ICMP and `-T` TCP (useful where UDP is blocked; needs `sudo`).

## 4. mtr: both at once

`mtr` repeats traceroute continuously and shows loss and delay per hop:

```bash
mtr -rwc 50 1.1.1.1      # report mode, wide names, 50 cycles
```

Read it carefully: loss at one middle hop that does **not** continue to later hops is just that router limiting ICMP
replies, not real loss. Loss that starts at a hop and continues to the end is real.

## 5. Path MTU

Find the largest packet that crosses the path without fragmentation. On Linux, `-M do` sets "don't fragment":

```bash
ping -c 2 -M do -s 1472 1.1.1.1    # 1472 + 8 ICMP + 20 IP = 1500 bytes
ping -c 2 -M do -s 1473 1.1.1.1    # one byte more
```

The first should work on a normal Ethernet path; the second fails with "message too long". On some home
connections (PPPoE) the limit is 1492, so 1464 is the largest payload. Tunnels and VPNs lower it further
([Lab 11](11-A-WireGuard-VPN.md)).

## Check yourself

??? question "1. A ping to a server shows an RTT of 8 ms. What is the farthest it can be, in fibre?"
    8 ms round trip is 4 ms each way; at about 200,000 km/s that is at most about 800 km.

??? question "2. Why does traceroute see each router in turn?"
    It sends packets with TTL 1, 2, 3, ...; the router where TTL reaches zero replies with ICMP time exceeded from its own address.

??? question "3. In mtr, hop 5 shows 40% loss but hops 6 to 12 show 0%. Is there a problem at hop 5?"
    No. That router is just rate-limiting its ICMP replies; traffic through it is not being lost.

??? question "4. Why is 1472 the largest ping payload on a 1500-byte MTU path?"
    1500 minus the 20-byte IPv4 header minus the 8-byte ICMP header is 1472.

??? info "Sources"
    - RFC 792 (ICMP), RFC 1191 (path MTU discovery), RFC 1393 (traceroute using an IP option); `ping(8)`, `traceroute(8)`, `mtr(8)` manual pages.
    - R. Steenbergen, "A Practical Guide to (Correctly) Troubleshooting with Traceroute", NANOG 2009 tutorial.
