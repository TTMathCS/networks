# The site's table of contents: one list per shelf. tools/nav.py writes the nav in mkdocs.yml from it.
START = [
 ("01-What-Is-a-Network", "What is a network?"),
 ("02-Packets", "Packets: a message in pieces"),
 ("03-Addresses-and-Names", "Addresses and names"),
 ("04-Wires-and-Radio", "Wires and radio waves"),
 ("05-Staying-Safe", "Staying safe on a network"),
 ("06-Talking-to-Mars", "Talking to Mars"),
]
BOOKS = {
 "networks": ("How networks work", [
  "01-What-a-Network-Is", "02-Layers-and-Protocols", "03-Delay-Loss-and-Throughput", "04-The-Physical-Layer",
  "05-Framing-and-Error-Detection", "06-Ethernet-and-Switches", "07-VLANs-and-Spanning-Tree", "08-IPv4-Addressing-and-Subnets",
  "09-NAT-DHCP-and-ARP", "10-IPv6", "11-Routers-and-Forwarding", "12-Routing-Algorithms", "13-OSPF-and-BGP",
  "14-UDP-Ports-and-Sockets", "15-Reliable-Delivery", "16-TCP", "17-Congestion-Control", "18-DNS",
  "19-HTTP-and-QUIC", "20-Email-Streaming-and-CDNs", "21-Data-Centres-and-SDN", "22-Running-a-Network",
  "23-Where-Networks-Go", "Glossary"]),
 "math": ("Math foundations", [
  "01-Bits-Binary-and-Masks", "02-Probability-for-Networks", "03-Queues-and-Littles-Law", "04-Graphs-and-Flows",
  "05-Information-and-Capacity", "06-Error-Correcting-Codes", "07-Signals-and-Fourier", "08-Modulation-Math",
  "09-Feedback-and-Fairness", "10-The-Math-of-Security", "Glossary"]),
 "wireless": ("Wireless and mobile", [
  "01-Radio-Waves-and-Spectrum", "02-Antennas-and-Link-Budgets", "03-Fading-and-Noise", "04-Modulation-and-Coding",
  "05-OFDM-and-OFDMA", "06-MIMO-and-Beamforming", "07-How-Wi-Fi-Works", "08-Wi-Fi-Generations",
  "09-Designing-Wi-Fi", "10-Wi-Fi-Security", "11-Bluetooth-NFC-and-UWB", "12-IoT-Radios",
  "13-Cellular-from-2G-to-5G", "14-Satellites-and-Deep-Space", "15-Where-Wireless-Goes", "Glossary"]),
 "security": ("Network security", [
  "01-What-Security-Means", "02-Attackers-and-Attacks", "03-The-Cryptography-Toolkit", "04-Authentication-and-Identity",
  "05-Attacks-on-the-Local-Network", "06-Attacks-on-IP-and-Routing", "07-DNS-Security", "08-TLS-and-HTTPS",
  "09-IPsec-and-VPNs", "10-SSH", "11-Firewalls-and-Segmentation", "12-Detection-and-Monitoring",
  "13-Denial-of-Service", "14-Web-Application-Security", "15-Zero-Trust", "16-Incident-Response",
  "17-Testing-Your-Own-Network", "18-Where-Security-Goes", "Glossary"]),
 "labs": ("Labs", [
  "01-Your-Lab", "02-Ping-and-Traceroute", "03-Interfaces-and-Routes", "04-DNS-with-dig", "05-HTTP-and-TLS-with-curl",
  "06-Capturing-Packets", "07-A-Network-on-One-Laptop", "08-Running-OSPF", "09-Socket-Programming",
  "10-A-Firewall-with-nftables", "11-A-WireGuard-VPN", "12-SSH-Keys-and-Hardening", "13-Surveying-Your-Wi-Fi",
  "14-Scanning-Your-Own-Network", "15-Crafting-Packets-with-Scapy"]),
}
TOPICS = [
 ("Home-Wi-Fi", "Set up home Wi-Fi well"),
 ("Internet-Is-Down", "When the internet is down"),
 ("HTTPS", "How HTTPS keeps a page private"),
 ("VPNs", "VPNs"),
 ("Firewalls", "Firewalls"),
 ("DNS", "DNS: names to addresses"),
]
