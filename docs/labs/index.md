# Labs

*Fifteen hands-on labs that turn the books into things you have done yourself: from ping and traceroute to building a whole network inside one laptop, running a routing protocol, writing socket programs, and setting up a firewall and a VPN. Each lab takes 20 to 45 minutes of work, and the text of each page reads in about five minutes.*

!!! warning "Your own machines only"
    Every lab runs on your own computer, your own virtual machines, or your own home network. Scanning, capturing or
    attacking networks you do not own or have written permission to test is illegal in most countries
    ([security book, chapter 17](../books/security/17-Testing-Your-Own-Network.md)).

**You need:** a computer where you can install software. Most labs use **Linux** (a virtual machine is fine, see
[Lab 1](01-Your-Lab.md)); labs 2, 4, 5 and 6 also work on macOS and Windows with small changes.

| Lab | You will | Goes with |
| --- | --- | --- |
| [1. Your lab](01-Your-Lab.md) | set up a Linux VM with the tools | — |
| [2. Ping and traceroute](02-Ping-and-Traceroute.md) | measure delay and see the path | [networks ch. 3](../books/networks/03-Delay-Loss-and-Throughput.md) |
| [3. Interfaces and routes](03-Interfaces-and-Routes.md) | read addresses, routes, ARP and sockets | [networks ch. 8–11](../books/networks/08-IPv4-Addressing-and-Subnets.md) |
| [4. DNS with dig](04-DNS-with-dig.md) | follow a lookup from the root, check DNSSEC | [networks ch. 18](../books/networks/18-DNS.md) |
| [5. HTTP and TLS with curl](05-HTTP-and-TLS-with-curl.md) | see headers, the TLS handshake, certificates | [security ch. 8](../books/security/08-TLS-and-HTTPS.md) |
| [6. Capturing packets](06-Capturing-Packets.md) | watch a TCP handshake in Wireshark and tcpdump | [networks ch. 16](../books/networks/16-TCP.md) |
| [7. A network on one laptop](07-A-Network-on-One-Laptop.md) | build hosts, a switch and a router with namespaces | [networks ch. 6, 11](../books/networks/11-Routers-and-Forwarding.md) |
| [8. Running OSPF](08-Running-OSPF.md) | run a real routing protocol with FRR | [networks ch. 13](../books/networks/13-OSPF-and-BGP.md) |
| [9. Socket programming](09-Socket-Programming.md) | write a TCP and a UDP program in Python | [networks ch. 14](../books/networks/14-UDP-Ports-and-Sockets.md) |
| [10. A firewall with nftables](10-A-Firewall-with-nftables.md) | write and test a stateful firewall | [security ch. 11](../books/security/11-Firewalls-and-Segmentation.md) |
| [11. A WireGuard VPN](11-A-WireGuard-VPN.md) | connect two namespaces through an encrypted tunnel | [security ch. 9](../books/security/09-IPsec-and-VPNs.md) |
| [12. SSH keys and hardening](12-SSH-Keys-and-Hardening.md) | log in with keys, harden a server | [security ch. 10](../books/security/10-SSH.md) |
| [13. Surveying your Wi-Fi](13-Surveying-Your-Wi-Fi.md) | measure your own Wi-Fi and pick channels | [wireless ch. 9](../books/wireless/09-Designing-Wi-Fi.md) |
| [14. Scanning your own network](14-Scanning-Your-Own-Network.md) | find devices and open ports at home with Nmap | [security ch. 17](../books/security/17-Testing-Your-Own-Network.md) |
| [15. Crafting packets with Scapy](15-Crafting-Packets-with-Scapy.md) | build packets by hand and see how stacks answer | [networks ch. 2](../books/networks/02-Layers-and-Protocols.md) |
