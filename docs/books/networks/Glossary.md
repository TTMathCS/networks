# Glossary

*The terms of [How networks work](index.md), with the chapter where each is explained.*

| Term | Meaning | Ch. |
| --- | --- | --- |
| ACK | acknowledgement: "I received up to here" | 15 |
| Anycast | one address announced from many places; routing picks the nearest | 13 |
| ARP | finds the MAC address for an IPv4 address on the local link | 9 |
| AS (autonomous system) | a network run by one organisation, with its own number | 1, 13 |
| Bandwidth | a range of frequencies (Hz), or loosely a bit rate | 4 |
| BBR | congestion control that models bottleneck bandwidth and minimum RTT | 17 |
| BDP (bandwidth-delay product) | rate × RTT: data in flight to fill a path | 3 |
| BGP | the path-vector routing protocol between autonomous systems | 13 |
| Bottleneck | the slowest link on a path, which limits throughput | 3 |
| Broadcast domain | the set of hosts that receive each other's broadcasts | 7 |
| Bufferbloat | excessive buffering that adds large delay under load | 3 |
| CDN | content delivery network: copies of content near users | 20 |
| CIDR | prefix notation like /24; classless addressing | 8 |
| Clos / leaf-spine | data-centre fabric where every leaf links to every spine | 21 |
| CNAME | DNS alias record | 18 |
| Congestion window (cwnd) | the sender's limit on unacknowledged data, set by congestion control | 17 |
| CRC | cyclic redundancy check: polynomial error detection | 5 |
| CSMA/CD, CSMA/CA | listen before sending; detect or avoid collisions | 5 |
| CUBIC | the default Linux congestion control, cubic window growth | 17 |
| Data plane / control plane | per-packet forwarding / computing the routes | 11 |
| DHCP | gives a host its address, gateway and DNS server | 9 |
| Dijkstra's algorithm | shortest paths from one node; used by link-state routing | 12 |
| Distance-vector | routing by exchanging distance tables with neighbours | 12 |
| DNS | the distributed system that maps names to addresses | 18 |
| DSCP | 6 bits in the IP header marking a traffic class | 11 |
| ECMP | equal-cost multipath: spreading flows over equal paths | 12, 21 |
| ECN | routers mark packets instead of dropping them | 17 |
| Encapsulation | each layer wrapping data in its own header | 2 |
| End-to-end argument | put functions like reliability at the ends, not in the network | 2 |
| Ethernet | the standard wired link layer (IEEE 802.3) | 6 |
| EtherType | field naming the protocol inside an Ethernet frame | 6 |
| FEC | forward error correction: redundancy to fix errors without resending | 5, 15 |
| Flow control | stopping a sender from overflowing the receiver | 15 |
| Fragmentation | splitting a packet too big for a link | 8 |
| Go-Back-N | resend everything from the lost packet on | 15 |
| Head-of-line blocking | one delayed item holding up all behind it | 19 |
| HTTP/2, HTTP/3 | multiplexed HTTP over TCP; HTTP over QUIC | 19 |
| ICMP | IP's error and diagnostic messages (ping, traceroute) | 9 |
| IGP | interior gateway protocol: OSPF, IS-IS inside one AS | 13 |
| IPv4 / IPv6 | the internet protocol with 32-bit / 128-bit addresses | 8, 10 |
| IXP | internet exchange point where networks peer | 1 |
| Jitter | variation in delay between packets | 3 |
| Link-state | routing where every router learns the whole map | 12 |
| Longest-prefix match | forwarding rule: the most specific matching route wins | 11 |
| MAC address | 48-bit hardware address of an interface | 6 |
| MPLS | label-based forwarding in ISP cores | 13 |
| MSS | maximum segment size: largest TCP payload (often 1,460) | 16 |
| MTU | maximum transmission unit: largest packet a link carries | 2, 8 |
| Multiplexing | sharing one channel among many flows | 1, 14 |
| MX | DNS record naming a domain's mail servers | 18, 20 |
| NAT | rewriting addresses so many hosts share one public address | 9 |
| Neighbor Discovery | IPv6's replacement for ARP, using ICMPv6 | 10 |
| Nyquist limit | at most 2B symbols per second in B hertz | 4 |
| OSPF | the common link-state interior routing protocol | 13 |
| Packet switching | sharing links by sending independent packets | 1 |
| Peering / transit | free exchange of customer traffic / paid access to everything | 1 |
| Port | 16-bit number selecting a program on a host | 14 |
| Propagation delay | time for a signal to cross a link: distance / speed | 3 |
| Protocol | agreed message formats, order and actions | 2 |
| QUIC | encrypted, multiplexed transport over UDP | 19 |
| Queueing delay | time a packet waits behind others | 3 |
| RPKI | signed records of which AS may originate which prefix | 13 |
| RTT | round-trip time | 3 |
| SDN | software-defined networking: central control of simple switches | 21 |
| Selective Repeat | resend only lost packets; receiver buffers the rest | 15 |
| Shannon capacity | $C = B\log_2(1+S/N)$, the maximum reliable rate | 4 |
| SLAAC | IPv6 hosts configuring their own addresses | 10 |
| Slow start | doubling the congestion window each RTT at first | 17 |
| Socket | the program's endpoint for network communication | 14 |
| Spanning tree (STP) | protocol that blocks links to remove loops in Ethernet | 7 |
| Statistical multiplexing | the gain from sharing capacity among bursty users | 1 |
| Subnet mask | the prefix written as 255.255.255.0 | 8 |
| Switch | forwards frames within a LAN by MAC address | 6 |
| TCP | reliable, ordered byte-stream transport | 16 |
| Three-way handshake | SYN, SYN-ACK, ACK | 16 |
| Throughput | bits per second actually delivered | 3 |
| TIME_WAIT | waiting state after closing a TCP connection | 16 |
| Transmission delay | time to put a packet on a link: L / R | 3 |
| TTL | IPv4 hop counter (IPv6: hop limit); also DNS cache lifetime | 8, 18 |
| UDP | minimal, connectionless transport | 14 |
| VLAN | virtual LAN: one switch acting as several | 7 |
| VXLAN | Ethernet frames carried in UDP for virtual networks | 7, 21 |
| WDM | many wavelengths of light on one fibre | 4 |
