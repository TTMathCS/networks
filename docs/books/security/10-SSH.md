# 10. SSH

*SSH is how administrators log in to servers, routers and cloud machines, copy files, and forward ports securely. This chapter explains SSH's layers and handshake, host and user keys, trust on first use, agent and port forwarding, certificates, and hardening. For the commands for every key type, see the SSH guide on cryptography.akadian.ca.*

!!! abstract "In this chapter"
    **You will learn:** what SSH replaced; its three layers; the key exchange and host key check; known_hosts and
    trust on first use; public-key login; the SSH agent and forwarding; port forwarding and jump hosts; SSH
    certificates; attacks (Terrapin, brute force) and hardening.

    **You need:** [Chapter 3](03-The-Cryptography-Toolkit.md).

## 10.1 From Telnet to SSH

Telnet, rlogin and FTP sent passwords in plain text. In 1995, after a password-sniffing attack at his university,
Tatu Ylönen wrote **SSH** (Secure Shell). Version 2, standardised by the IETF in 2006 (RFCs 4251–4254), is what
OpenSSH and every network device use today; SSH-1 had design flaws and is gone. SSH runs on TCP port 22.

## 10.2 Three layers

1. **Transport layer** (RFC 4253): key exchange, server authentication, encryption and integrity.
2. **User authentication** (RFC 4252): password, public key, or keyboard-interactive (for one-time codes).
3. **Connection layer** (RFC 4254): many **channels** inside one connection: shells, commands, file transfer (SFTP),
   forwarded ports.

## 10.3 The handshake and the host key

Client and server send version strings and lists of algorithms, then do a Diffie–Hellman key exchange (today
`curve25519-sha256`, or the post-quantum hybrids `sntrup761x25519-sha512` and `mlkem768x25519-sha256`, the default in
recent OpenSSH). The server signs the exchange hash with its **host key**, proving it is the real server.

How does the client know the host key is right? SSH uses **trust on first use** (TOFU): the first time, it shows the
key's fingerprint and asks; if accepted, the key is stored in `~/.ssh/known_hosts`. Next time, a different key gives a
loud warning, "REMOTE HOST IDENTIFICATION HAS CHANGED", which means either the server was rebuilt or someone is in the
middle. Never click through it without checking. Better ways to distribute host keys: SSHFP records in DNSSEC-signed
DNS, or host certificates (10.6).

## 10.4 Public-key login

Instead of a password, a user creates a key pair (`ssh-keygen -t ed25519`), puts the **public** key in the server's
`~/.ssh/authorized_keys`, and keeps the **private** key, protected by a passphrase. At login, the client signs a value
derived from the session with the private key; the server checks it with the stored public key. The private key never
crosses the network, and a fake server cannot reuse the signature, which is bound to that session. Keys can also live
on a hardware token (`ed25519-sk` with a FIDO2 key), so they cannot be copied from the disk.

Options in `authorized_keys` limit what a key may do: `from="10.0.0.0/8"`, `command="backup.sh"`,
`no-port-forwarding`, `restrict`.

## 10.5 Agent, forwarding and jump hosts

The **ssh-agent** holds unlocked private keys in memory so you type the passphrase once. **Agent forwarding**
(`ssh -A`) lets a remote server use your agent to log in further, but anyone with root on that server can use your
agent while you are connected. Prefer **ProxyJump** (`ssh -J bastion target`): the connection to the target is tunnelled
through the bastion, but authentication happens end to end from your laptop, and the bastion never touches your keys.

**Port forwarding** carries other traffic inside SSH:

| Option | Does |
| --- | --- |
| `-L 8080:db.internal:5432` | local port 8080 reaches db.internal:5432 via the server |
| `-R 9000:localhost:3000` | the server's port 9000 reaches your local port 3000 |
| `-D 1080` | a SOCKS proxy: any app can send through the server |

Useful for admins, and also how attackers tunnel out of networks, so servers that do not need forwarding should turn
it off.

## 10.6 SSH certificates

With many servers and many people, copying public keys everywhere becomes unmanageable, and TOFU prompts train people
to click "yes". OpenSSH **certificates** fix both: an internal CA signs user keys (with a list of allowed login names
and an expiry, often hours) and host keys. Servers trust the user CA (`TrustedUserCAKeys`), clients trust the host CA
(`@cert-authority` in known_hosts). Leavers' access simply expires; no prompts appear for new servers. Large companies
issue short-lived SSH certificates after a single-sign-on login with MFA.

## 10.7 Attacks and hardening

- **Brute force.** Every SSH server on the internet sees constant password guessing. Turning off passwords
  (`PasswordAuthentication no`) ends it; rate limiting (fail2ban) reduces log noise.
- **Terrapin** (2023) let an on-path attacker delete messages at the start of the encrypted stream with
  ChaCha20-Poly1305 or CBC-with-encrypt-then-MAC modes, weakening some extension negotiation. The fix ("strict key
  exchange") is in OpenSSH 9.6 and later; update both sides.
- **Supply chain.** In 2024 a backdoor planted over two years in the xz compression library nearly reached stable
  Linux distributions and would have let its author log in to OpenSSH servers on some systems; it was caught by a
  developer noticing a half-second slowdown. Defence in depth (not exposing SSH where it is not needed) still matters.
- **regreSSHion** (CVE-2024-6387): a race condition in OpenSSH's server allowing remote code execution on some
  glibc Linux systems; patched in 9.8.

A short hardening list: keys or certificates only; no root login (`PermitRootLogin no`); modern algorithms only
(current OpenSSH defaults are good); keep it updated; expose SSH only via VPN or a bastion where possible; log and
watch logins. [Lab 12](../../labs/12-SSH-Keys-and-Hardening.md) walks through these.

## Check yourself

??? question "1. What does the 'REMOTE HOST IDENTIFICATION HAS CHANGED' warning mean?"
    The server's host key differs from the one stored in known_hosts: either it was legitimately replaced, or someone is intercepting the connection. Check out of band before continuing.

??? question "2. Why is ProxyJump safer than agent forwarding?"
    With ProxyJump the bastion only relays an encrypted connection; with agent forwarding, root on the bastion can use your agent to log in elsewhere while you are connected.

??? question "3. Which command gives you local access to a database at db.internal:5432 through server gw?"
    `ssh -L 5432:db.internal:5432 gw` (then connect to localhost:5432).

??? question "4. What two problems do SSH certificates solve?"
    Distributing and revoking user keys across many servers (certificates expire and name allowed users), and trust-on-first-use prompts for host keys (hosts present CA-signed certificates).

??? info "Sources"
    - RFC 4251–4254 (SSH), RFC 4255 (SSHFP), RFC 8709 (Ed25519 in SSH), RFC 8731 (curve25519-sha256); OpenSSH release notes 9.0–10.0 and PROTOCOL.certkeys.
    - F. Bäumer, M. Brinkmann, J. Schwenk, "Terrapin Attack: Breaking SSH Channel Integrity by Sequence Number Manipulation", USENIX Security 2024.
    - Qualys, "regreSSHion: RCE in OpenSSH's server" (CVE-2024-6387), 2024; CVE-2024-3094 (xz backdoor).
    - T. Ylönen, "SSH – Secure Login Connections over the Internet", USENIX Security 1996.
