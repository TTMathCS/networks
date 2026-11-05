# Lab 1. Your lab

*A safe place to experiment: a Linux virtual machine on your own computer, with the networking tools the other labs use. Nothing you do inside it can harm anyone else's network, and if you break it you can start again in minutes.*

!!! abstract "In this lab"
    **You will:** install a virtual machine program; install Ubuntu (or Debian) Linux in it; install the tools for
    every lab; take a snapshot to return to.

    **You need:** a computer with about 4 GB of free memory and 25 GB of disk; an internet connection. Time: 30–45 minutes.

## 1. Why a virtual machine

A **virtual machine** (VM) is a whole computer simulated in software. It has its own operating system, network card and
disk, so you can change routes, firewalls and network settings without affecting your real computer. Linux is used
because nearly all network equipment and servers run on it or behave like it, and its tools are free.

Choices that work well:

| Your computer | Free VM program |
| --- | --- |
| Windows | VirtualBox, Hyper-V, or **WSL 2** (Ubuntu inside Windows) |
| Mac with Apple chip | **UTM** (use the ARM64 version of Ubuntu) |
| Mac with Intel chip, Linux | VirtualBox, or GNOME Boxes / virt-manager on Linux |

A Raspberry Pi with Raspberry Pi OS also works for most labs. WSL 2 works for labs 2–6, 9 and 12; for labs with
namespaces and firewalls (7, 8, 10, 11) use a full VM.

## 2. Install Linux

1. Download **Ubuntu Server** or **Ubuntu Desktop** (LTS version, such as 24.04) from ubuntu.com, choosing the right
   processor type (x86-64 or ARM64).
2. In your VM program, create a new VM: 2 processors, 2–4 GB memory, 25 GB disk, network in **NAT** mode (the
   default; your VM reaches the internet through your computer and is hidden from your home network).
3. Start it from the downloaded image and follow the installer. Pick a username and a strong password.
4. After it restarts, log in and update it:

```bash
sudo apt update && sudo apt full-upgrade -y
```

## 3. Install the tools

One command installs what the labs need:

```bash
sudo apt install -y iproute2 iputils-ping traceroute mtr-tiny dnsutils curl openssl \
  tcpdump tshark nmap nftables wireguard-tools openssh-server frr python3-scapy \
  iw ethtool netcat-openbsd iperf3 bridge-utils
```

What each does, briefly: `iproute2` (the `ip` and `ss` commands), `ping`, `traceroute` and `mtr` (paths and delay),
`dnsutils` (`dig`), `curl` and `openssl` (web and TLS), `tcpdump` and `tshark` (packet capture; the installer may ask
whether ordinary users may capture: answer yes for a lab VM), `nmap` (scanning), `nftables` (firewall),
`wireguard-tools` (VPN), `openssh-server` (SSH), `frr` (routing protocols), `python3-scapy` (packet crafting), `iw`
(Wi-Fi), `iperf3` (throughput tests). On a desktop VM, also install Wireshark: `sudo apt install -y wireshark`.

Check a few:

```bash
ip -br addr        # your interfaces and addresses
ping -c 3 1.1.1.1  # three pings to a public resolver
dig +short akadian.ca
nmap --version
```

## 4. Snapshots

Before experimenting, take a **snapshot** in your VM program (VirtualBox: Machine → Take Snapshot; UTM: clone the VM).
If a lab leaves the network broken, restore the snapshot instead of debugging for an hour. Take a new one after each
lab that you want to keep.

## 5. Safety rules for all labs

- Scan, capture and attack only your own VM, your own lab networks, and devices you own at home.
- On a shared network (school, office, café), do not run scanners or packet capture on other people's traffic.
- Keep the VM updated; it has real tools and an SSH server.
- Lab passwords and keys are for the lab; never reuse real ones.

## What you have now

A Linux machine you fully control, with root access through `sudo`, connected to the internet through NAT, and with
every tool for the following fourteen labs.

## Check yourself

??? question "1. Why does NAT mode keep your VM hidden from your home network?"
    The VM sits on a private network inside your VM program, which translates its traffic to your computer's address; devices at home cannot start connections to it.

??? question "2. What does `ip -br addr` show?"
    A brief list of each interface, its state (UP/DOWN) and its IPv4 and IPv6 addresses.

??? question "3. Why take a snapshot before a lab?"
    So you can return to a working state in seconds if the lab changes network settings in a way that is hard to undo.

??? info "Sources"
    - Ubuntu Server documentation (ubuntu.com/server/docs); VirtualBox and UTM user manuals; Microsoft, *Install WSL*.
    - Manual pages of iproute2, nmap, tcpdump, nftables, wireguard-tools, FRR.
