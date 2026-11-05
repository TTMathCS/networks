# Lab 12. SSH keys and hardening

*SSH is the door to every server you run. In this lab you set up key-based login, use an agent and a jump host, forward a port, turn off passwords and root login, and check what your server offers, on your own VM.*

!!! abstract "In this lab"
    **You will:** make an Ed25519 key with a passphrase; install it on a server; use ssh-agent; write
    `~/.ssh/config`; forward a port and use ProxyJump; harden `sshd_config`; audit the server's algorithms; watch the
    log for login attempts.

    **You need:** [Lab 1](01-Your-Lab.md) VM with `openssh-server`, reachable from your own computer (set the VM's
    network to bridged or add a port-forward 2222 → 22 in your VM program); [security book, chapter 10](../books/security/10-SSH.md). Time: 35 minutes.

## 1. Make a key

On your own computer (macOS, Linux, or Windows PowerShell; all include OpenSSH):

```bash
ssh-keygen -t ed25519 -C "lab key"
```

Accept the default file (`~/.ssh/id_ed25519`) and **set a passphrase**: it encrypts the private key on disk, so a
stolen laptop does not give away your servers. You now have `id_ed25519` (private, never share) and `id_ed25519.pub`
(public). If you own a FIDO2 security key, `ssh-keygen -t ed25519-sk` makes a key that needs the device to be touched.

## 2. First login and the host key

```bash
ssh -p 2222 you@localhost        # or ssh you@<VM address> with bridged networking
```

The first time, SSH shows the server's **host key fingerprint** and asks whether to trust it. Check it against the
server itself: inside the VM run `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`. If they match, answer yes; the key
is saved in `~/.ssh/known_hosts`. This is trust on first use.

## 3. Install the public key

```bash
ssh-copy-id -p 2222 you@localhost
```

(On Windows, append the contents of `id_ed25519.pub` to `~/.ssh/authorized_keys` on the server by hand.) Log in
again: SSH now asks for the key's passphrase, not the account password.

Start an agent so you type the passphrase once per session: `eval "$(ssh-agent)"; ssh-add` (macOS keeps it in the
keychain with `ssh-add --apple-use-keychain`).

## 4. A config file

Save typing with `~/.ssh/config` on your computer:

```
Host lab
    HostName localhost
    Port 2222
    User you
    IdentityFile ~/.ssh/id_ed25519
```

Now `ssh lab` is enough, and `scp file.txt lab:` copies a file.

## 5. Forward a port

On the VM, start a web server that listens only on the VM itself: `python3 -m http.server 8000 --bind 127.0.0.1`.
From your computer it is unreachable, but through SSH:

```bash
ssh -L 8080:127.0.0.1:8000 lab
```

Open http://localhost:8080 in your browser: the request travels inside the encrypted SSH connection and arrives at the
VM's local port. Admins use this to reach databases and admin pages that are never exposed.

**Jump hosts:** if you have a second VM reachable only from the first, `ssh -J lab you@10.0.2.20` goes through `lab`
without your key ever being on it. In config: `ProxyJump lab`.

## 6. Harden the server

In the VM, create `/etc/ssh/sshd_config.d/50-hardening.conf`:

```
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
MaxAuthTries 3
LoginGraceTime 30
AllowUsers you
X11Forwarding no
AllowAgentForwarding no
```

Check the syntax and reload, **keeping your current session open** in case of mistakes:

```bash
sudo sshd -t && sudo systemctl reload ssh
```

From your computer, test that a password login is now refused:
`ssh -o PubkeyAuthentication=no -p 2222 you@localhost` should fail with "Permission denied (publickey)".

## 7. Audit and watch

What the server offers:

```bash
ssh -Q kex                 # key exchange algorithms your client supports
ssh -vv lab exit 2>&1 | grep -E "kex: algorithm|host key algorithm|cipher"
```

Recent OpenSSH negotiates `mlkem768x25519-sha256` or `sntrup761x25519-sha512` (post-quantum hybrids) and
`chacha20-poly1305@openssh.com` or AES-GCM. The open-source tool `ssh-audit` gives a fuller report.

Watch login attempts on the VM: `sudo journalctl -u ssh -f`. Failed attempts show as `Connection closed by
authenticating user` or `Invalid user`. A server on the public internet sees these within minutes; with passwords
off, they are only noise. Tools like fail2ban block addresses that keep trying.

## 8. Keep the keys tidy

- One key per device, not one key copied everywhere; remove a lost laptop's key from `authorized_keys`.
- Restrict automation keys: `restrict,command="/usr/local/bin/backup" ssh-ed25519 AAAA...`.
- For many servers, use SSH certificates with short lifetimes instead (security book, 10.6).

## Check yourself

??? question "1. What does the passphrase on a private key protect against?"
    Someone who copies the key file (a stolen laptop or backup) cannot use it without the passphrase.

??? question "2. You run `ssh -L 5433:127.0.0.1:5432 db-server`. Where does a connection to localhost:5433 on your computer end up?"
    At port 5432 on db-server's own loopback interface, carried through the SSH connection.

??? question "3. Why keep an SSH session open while reloading sshd after changes?"
    Existing sessions survive the reload; if the new settings lock you out, you can still fix them.

??? question "4. Which line stops password-guessing attacks from ever succeeding?"
    `PasswordAuthentication no` (with keyboard-interactive also off): only key holders can log in.

??? info "Sources"
    - OpenSSH manual pages: `ssh(1)`, `ssh-keygen(1)`, `ssh_config(5)`, `sshd_config(5)` (openssh.com); OpenSSH 9.0 and 10.0 release notes.
    - NIST IR 7966, *Security of Interactive and Automated Access Management Using Secure Shell (SSH)* (2015); ssh-audit project.
