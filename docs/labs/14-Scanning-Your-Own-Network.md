# Lab 14. Scanning your own network

*Do you know every device on your home network and every port it has open? In this lab you find out, with Nmap, the same way a security tester begins, and fix what you find. Everything here is done only on your own network.*

!!! abstract "In this lab"
    **You will:** find your subnet; discover live hosts with a ping sweep and ARP; identify devices; scan their ports;
    detect services and versions; scan UDP; check what your router exposes to the internet; fix findings and scan again.

    **You need:** [Lab 1](01-Your-Lab.md) (a VM in **bridged** mode, so it sits on your home network) or Nmap on your own
    computer; your own home network; [security book, chapter 17](../books/security/17-Testing-Your-Own-Network.md). Time: 40 minutes.

!!! warning "Only your own network"
    Scan only networks you own or have written permission to test. Do not run this lab on school, work, café or hotel
    networks. If you share a home network, tell the others first: a scan can briefly upset fragile devices.

## 1. Your subnet

```bash
ip -br addr          # e.g. 192.168.1.42/24 on Linux
ip route | grep default
```

(macOS: `ipconfig getifaddr en0`; Windows: `ipconfig`.) If your address is 192.168.1.42/24, the subnet is
192.168.1.0/24 and the router is usually 192.168.1.1.

## 2. Who is there

```bash
sudo nmap -sn 192.168.1.0/24
```

`-sn` means "no port scan, just discovery". On the local subnet Nmap uses **ARP requests**, which every device must
answer, so even devices that ignore ping show up, with their MAC address and the vendor from its first three bytes
(`MAC Address: 3C:22:FB:... (Apple)`). Make a list: phones, laptops, TV, printer, speakers, cameras, the router.
Anything you cannot identify deserves a look (phones may use **private random MAC addresses**, which show no vendor).

## 3. Ports on one device

Pick one device, for example the router:

```bash
sudo nmap 192.168.1.1                 # top 1,000 TCP ports, SYN scan
sudo nmap -p- 192.168.1.1             # all 65,535 TCP ports (slower)
```

States: **open** (a service answers), **closed** (the host answers "nothing here"), **filtered** (no answer:
firewalled). A router often shows 53 (DNS), 80 and 443 (admin page), and sometimes 22 or 23 (SSH or Telnet), 1900 or
5000 (UPnP).

## 4. What is running

```bash
sudo nmap -sV -O 192.168.1.1
```

`-sV` probes open ports for the service and version ("lighttpd 1.4.59", "dnsmasq 2.89"); `-O` guesses the operating
system. Versions let you check for known flaws: search the product and version with "CVE", or look at the vendor's
security advisories ([security book, chapter 2](../books/security/02-Attackers-and-Attacks.md)).

Scan the rest of the home quickly:

```bash
sudo nmap -sV --top-ports 100 192.168.1.0/24 -oN home-scan.txt
```

`-oN` saves a readable report, so you can compare later.

## 5. UDP

```bash
sudo nmap -sU --top-ports 20 192.168.1.1
```

UDP scanning is slow and uncertain ("open|filtered"), but finds things TCP scans miss: DNS (53), DHCP (67), NTP (123),
SNMP (161, which on old printers can reveal a lot), and SSDP/UPnP (1900).

## 6. What the internet sees

Scanning from inside shows what your neighbours on the LAN can reach. What matters most is what the **internet** can
reach. Ways to check:

- In your router's admin page, look at **port forwarding** and **UPnP** lists: each entry is a hole opened to the
  internet. Remove any you do not recognise.
- Look up your public address on a search engine of internet scans (Shodan or Censys, free search) to see what they
  have recorded for it.
- Check that **remote administration** of the router is off.
- If you have IPv6, check the router's IPv6 firewall blocks unsolicited inbound connections
  ([security book, chapter 11](../books/security/11-Firewalls-and-Segmentation.md)).

## 7. Fix and rescan

Typical findings and fixes:

| Finding | Fix |
| --- | --- |
| Telnet (23) open on router or camera | turn it off; update firmware; replace if impossible |
| Admin page on HTTP (80) only | use HTTPS if offered; strong admin password |
| UPnP open, unknown port forwards | turn UPnP off or remove the forwards |
| Old firmware versions | update; enable automatic updates |
| Unknown device | identify it (router's DHCP list, MAC vendor); block it if not yours and change the Wi-Fi password |
| Smart gadgets next to laptops | move them to the guest network ([Lab 13](13-Surveying-Your-Wi-Fi.md)) |

Run the same scan again and compare with `ndiff`:

```bash
sudo nmap -sV --top-ports 100 192.168.1.0/24 -oX after.xml
ndiff before.xml after.xml       # (save your first scan with -oX before.xml)
```

Repeat every few months: a home network changes as devices come and go.

## Check yourself

??? question "1. Why does `nmap -sn` on your own subnet find devices that ignore ping?"
    On the local link it uses ARP, which every IPv4 device must answer to communicate at all.

??? question "2. What is the difference between closed and filtered?"
    Closed: the host replied (TCP RST) that nothing listens. Filtered: no reply, usually because a firewall dropped the probe.

??? question "3. Why are UPnP port forwards a risk?"
    Devices (or malware on them) can open inbound ports to the internet without you noticing.

??? question "4. Which scan options give versions of services, and why do versions matter?"
    `-sV`; versions can be matched with published CVEs and advisories to find devices needing updates.

??? info "Sources"
    - G. Lyon, *Nmap Network Scanning* and the Nmap Reference Guide (nmap.org/book); `ndiff(1)`.
    - CISA and NSA, *Best Practices for Securing Your Home Network* (2023); IEEE OUI registry (MAC vendors).
