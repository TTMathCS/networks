# 15. Zero trust

*The old model trusted everything inside the firewall. Cloud services, laptops at home and attackers who get inside broke it. Zero trust says: trust no network location; check every request on identity, device and context. This chapter explains the idea, its parts, how it is built, and its limits.*

!!! abstract "In this chapter"
    **You will learn:** why the perimeter model failed; NIST's zero trust tenets; policy decision and enforcement
    points; identity, device health and least-privilege access; Google's BeyondCorp; zero trust network access
    (ZTNA) and SASE; service identity inside data centres; how to start.

    **You need:** [Chapter 4](04-Authentication-and-Identity.md), [Chapter 11](11-Firewalls-and-Segmentation.md).

## 15.1 The castle and the moat

The traditional design was a hard shell and a soft middle: a strong firewall at the edge, and broad trust inside. A
VPN user joined "the inside" and could reach most of it. Three things broke this:

- **Attackers get in.** A single phishing email puts them on a laptop inside the moat, and then lateral movement is easy
  (Chapter 2).
- **The inside is everywhere.** Applications moved to cloud services and staff work from home and phones; there is no
  single perimeter to defend.
- **Location is a weak signal.** Being on the office network says little about who you are or whether your device is
  safe.

The phrase "zero trust" was coined by John Kindervag at Forrester in 2010; the idea grew from earlier work such as the
Jericho Forum's "de-perimeterisation" (2004).

## 15.2 The tenets

NIST SP 800-207 (2020) defines zero trust architecture with tenets, summarised:

1. All data sources and services are **resources**.
2. All communication is secured **regardless of network location**.
3. Access is granted **per session**, with least privilege.
4. Access is decided by **dynamic policy**: identity, device state, application, behaviour, and other attributes.
5. The organisation **monitors** the integrity and security of all assets.
6. Authentication and authorisation are **strictly enforced before** access, continually.
7. The organisation **collects** as much information as it can and uses it to improve.

In short: *never trust, always verify; assume breach; least privilege*.

## 15.3 The parts

<figure class="mars-fig">
<svg viewBox="0 0 640 200" role="img" aria-label="Zero trust: subject, policy enforcement point, policy decision point, resource">
<rect x="10" y="110" width="120" height="50" rx="8" class="na-f"/><text x="70" y="132" text-anchor="middle">User +</text><text x="70" y="150" text-anchor="middle">device</text>
<rect x="250" y="110" width="140" height="50" rx="8" class="nd-f"/><text x="320" y="140" text-anchor="middle">Enforcement (PEP)</text>
<rect x="510" y="110" width="120" height="50" rx="8" class="nc-f"/><text x="570" y="140" text-anchor="middle">Application</text>
<rect x="240" y="15" width="160" height="50" rx="8" class="nb-f"/><text x="320" y="38" text-anchor="middle">Decision (PDP)</text><text x="320" y="55" text-anchor="middle" font-size="11">identity, device, risk, policy</text>
<line x1="130" y1="135" x2="250" y2="135" stroke="currentColor" stroke-width="2"/><line x1="390" y1="135" x2="510" y2="135" stroke="currentColor" stroke-width="2"/>
<line x1="320" y1="65" x2="320" y2="110" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4"/>
<text x="320" y="190" text-anchor="middle" font-size="12">Every request: the PEP asks the PDP; only allowed sessions reach the application.</text>
</svg>
<figcaption>NIST's logical model: the control plane decides, the data plane enforces.</figcaption>
</figure>

- **Policy decision point** (PDP): a policy engine that weighs signals and decides; a policy administrator that sets
  up or tears down the session.
- **Policy enforcement point** (PEP): the gate in the data path: an identity-aware proxy, an agent, a gateway.
- **Signals**: identity from the identity provider with strong MFA (Chapter 4); **device posture** (managed? disk
  encrypted? updated? EDR running?); location and time; behaviour and threat intelligence; the sensitivity of the
  resource.

A decision might read: "Alice, finance group, passkey login 10 minutes ago, company laptop with current patches →
may use the payroll app, read-only from outside the office; re-check every hour."

## 15.4 BeyondCorp

Google built the best-known early example after the 2009 "Operation Aurora" intrusion. From 2011 it moved employees
off the VPN: every internal application sits behind an **access proxy** on the internet; each request is checked
against a device inventory (with device certificates) and the user's identity and group; the office network is treated
like any café. Google described it in papers from 2014 onward. The model spread as **ZTNA** (zero trust network
access) products, which replace "join the network" VPNs with per-application access, and **SASE** (secure access service
edge), which delivers ZTNA, secure web gateways and firewalls as a cloud service near the user.

## 15.5 Inside the data centre

The same idea applies between services: each workload gets a cryptographic **identity** (for example a SPIFFE ID in a
short-lived X.509 certificate), all service-to-service traffic uses **mutual TLS** (Chapter 8), and policy says which
services may call which, enforced by sidecar proxies or the kernel (a **service mesh**). Combined with
micro-segmentation (Chapter 11), a compromised web server can reach only what its identity allows.

## 15.6 Starting, and the limits

Zero trust is an approach, not a product. CISA's **Zero Trust Maturity Model** (version 2.0, 2023) describes five
pillars, identity, devices, networks, applications and workloads, data, each moving from traditional to optimal. A
sensible order for most organisations:

1. Strong identity: one identity provider, phishing-resistant MFA for everyone, starting with admins.
2. Know your devices: inventory, management, health checks.
3. Put the most important applications behind identity-aware access instead of the VPN.
4. Segment the network and remove broad internal access.
5. Log every access decision and feed it to detection (Chapter 12).

Limits: zero trust moves trust into the identity provider and policy engine, which become critical targets; poor
policies can be as permissive as the old network; legacy systems that cannot do modern authentication need gateways;
and none of it helps if a legitimate, authorised user's session is stolen and used within its rights, which is why
continuous evaluation and short sessions matter.

## Check yourself

??? question "1. In one sentence, what is the main difference from the perimeter model?"
    Network location grants no trust; every request is authenticated and authorised on identity, device and context.

??? question "2. What is the job of the policy enforcement point?"
    It sits in the data path and lets a session through only if the policy decision point allows it.

??? question "3. Why is device posture part of the decision?"
    A correct password from an infected or unmanaged device is still risky; checking the device blocks stolen credentials used elsewhere and compromised machines.

??? question "4. What becomes the most valuable target in a zero trust design?"
    The identity provider and policy engine, since they decide all access.

??? info "Sources"
    - NIST SP 800-207, *Zero Trust Architecture* (2020); CISA, *Zero Trust Maturity Model* v2.0 (2023).
    - R. Ward and B. Beyer, "BeyondCorp: A New Approach to Enterprise Security", *;login:* 39(6), 2014, and later BeyondCorp papers.
    - J. Kindervag, *No More Chewy Centers: Introducing the Zero Trust Model of Information Security*, Forrester, 2010.
    - SPIFFE specification (spiffe.io); US OMB Memorandum M-22-09 (2022).
