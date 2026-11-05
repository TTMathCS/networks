# 22. Running a network

*Designing a network is the start; most of the work is running it: knowing what is happening, changing it safely, and finding faults fast. This chapter covers monitoring and telemetry, flow data, configuration management and automation, a troubleshooting method, and SD-WAN.*

!!! abstract "In this chapter"
    **You will learn:** SNMP and streaming telemetry; flow records (NetFlow, IPFIX, sFlow); logs and syslog; NETCONF,
    YANG and automation; intent and verification; a layer-by-layer troubleshooting method; SD-WAN and the managed
    campus; documentation and change control.

    **You need:** the earlier chapters; the [Labs](../../labs/index.md) use the same tools.

## 22.1 What to watch

Four kinds of data:

| Data | Answers | Tools |
| --- | --- | --- |
| **Counters and state** | Is the link up? How busy? Errors? | SNMP, streaming telemetry |
| **Flow records** | Who talked to whom, how much? | NetFlow v9, IPFIX, sFlow |
| **Logs and events** | What changed? What failed? | syslog, device event streams |
| **Active tests** | Can users actually reach things, how fast? | ping/HTTP probes, synthetic tests, RIPE Atlas |

**SNMP** (Simple Network Management Protocol, 1988; v3 adds authentication and encryption) lets a manager **poll**
devices every minute or so for values in a **MIB**, a tree of numbered objects: interface counters
(`ifHCInOctets`), CPU, temperature. Devices can also send **traps** when something happens. Utilisation from counters:

$$\text{utilisation} = \frac{\Delta \text{octets} \times 8}{\Delta t \times \text{link speed}}$$

Minute averages hide microbursts that fill buffers in milliseconds. **Streaming telemetry** (gNMI with gRPC, or
NETCONF/YANG notifications) pushes values every second or on change, in structured form.

**Flow records** summarise each flow (5-tuple, bytes, packets, start and end time) as seen by a router: invaluable for
capacity planning, billing and spotting attacks. sFlow samples one packet in $N$ instead. **Packet capture** (Wireshark,
tcpdump, [Lab 6](../../labs/06-Capturing-Packets.md)) gives full detail on one link for a short time.

<figure class="sketch"><span class="ai-tag">AI-created</span><svg viewBox="0 0 640 390" role="img" aria-labelledby="sk-nb-burst-t"><title id="sk-nb-burst-t">A link's use over one minute: mostly around a quarter full with three short spikes to 100 percent, while the minute average shows a calm 30 percent</title><defs><filter id="sk-nb-burst-pen"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter><filter id="sk-nb-burst-paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 .10 0"/></filter><pattern id="sk-nb-burst-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8a4a2a" stroke-width="1.1" opacity=".55"/></pattern><pattern id="sk-nb-burst-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#8a4a2a" opacity=".5"/><circle cx="6.5" cy="7" r=".8" fill="#8a4a2a" opacity=".4"/></pattern><marker id="sk-nb-burst-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#3a2a1e" stroke-width="1.6" stroke-linecap="round"/></marker></defs><rect width="640" height="390" filter="url(#sk-nb-burst-paper)"/><g filter="url(#sk-nb-burst-pen)"><text x="30" y="44" class="h">The average looks calm</text><path class="p" d="M70 320 L610 320 M70 320 L70 90"/><path class="p dash" d="M70 100 L610 100"/><text x="62" y="105" text-anchor="end" class="s">100%</text><text x="62" y="325" text-anchor="end" class="s">0</text><path class="p blue" d="M70.0 265.0 L74.5 242.0 L79.0 259.9 L83.5 270.3 L88.0 246.9 L92.5 245.8 L97.0 277.7 L101.5 281.8 L106.0 259.7 L110.5 269.0 L115.0 291.1 L119.5 272.4 L124.0 246.6 L128.5 260.6 L133.0 272.1 L137.5 247.7 L142.0 240.6 L146.5 270.9 L151.0 100.0 L155.5 100.0 L160.0 265.8 L164.5 291.9 L169.0 278.8 L173.5 251.7 L178.0 262.6 L182.5 275.6 L187.0 250.9 L191.5 237.6 L196.0 264.7 L200.5 275.8 L205.0 255.3 L209.5 260.8 L214.0 290.2 L218.5 283.4 L223.0 256.4 L227.5 264.9 L232.0 280.1 L236.5 256.2 L241.0 237.2 L245.5 260.0 L250.0 273.0 L254.5 252.4 L259.0 254.6 L263.5 286.0 L268.0 285.6 L272.5 259.8 L277.0 266.7 L281.5 284.6 L286.0 263.1 L290.5 239.2 L295.0 257.3 L299.5 271.4 L304.0 250.4 L308.5 248.1 L313.0 280.0 L317.5 100.0 L322.0 100.0 L326.5 100.0 L331.0 288.4 L335.5 270.6 L340.0 243.4 L344.5 256.8 L349.0 271.5 L353.5 249.9 L358.0 242.3 L362.5 272.9 L367.0 283.3 L371.5 261.3 L376.0 265.5 L380.5 290.3 L385.0 277.7 L389.5 248.7 L394.0 258.0 L398.5 273.4 L403.0 251.6 L407.5 238.3 L412.0 265.9 L416.5 279.9 L421.0 259.6 L425.5 261.9 L430.0 289.9 L434.5 283.5 L439.0 254.3 L443.5 260.2 L448.0 276.8 L452.5 255.6 L457.0 236.5 L461.5 259.9 L466.0 276.3 L470.5 257.0 L475.0 256.8 L479.5 287.0 L484.0 100.0 L488.5 100.0 L493.0 262.5 L497.5 280.9 L502.0 261.5 L506.5 237.4 L511.0 255.7 L515.5 273.3 L520.0 254.5 L524.5 250.8 L529.0 281.8 L533.5 288.2 L538.0 262.4 L542.5 264.1 L547.0 284.9 L551.5 268.6 L556.0 240.7 L560.5 253.7 L565.0 271.7 L569.5 253.1 L574.0 244.8 L578.5 275.0 L583.0 286.9 L587.5 263.9 L592.0 264.1 L596.5 287.7 L601.0 276.0 L605.5 245.8 L610.0 253.8"/><path class="p red" d="M70 255.8 L610 255.8"/><text x="178" y="150" class="s">red: the minute</text><text x="178" y="170" class="s">average, about 30%</text><text x="151.0" y="84" class="s">full for a few milliseconds: buffers fill, packets drop</text><text x="340.0" y="346" text-anchor="middle" class="s">one minute</text><text x="30" y="375" class="s">Polling once a minute shows the red line. Telemetry every second or on change catches the spikes.</text></g></svg><figcaption>Sketched for this page. An example, not a measurement.</figcaption></figure>

## 22.2 From box-by-box to code

Configuring hundreds of devices by hand through each one's command line causes most outages: a typo, a forgotten
device, an undocumented change. Modern practice treats network configuration like software:

- **A source of truth**: an inventory of devices, addresses, VLANs and circuits (e.g. NetBox), from which
  configurations are generated by templates.
- **Version control**: configurations in Git, changes reviewed like code.
- **Model-driven interfaces**: **NETCONF** (RFC 6241) and **RESTCONF** carry structured configuration described in
  **YANG** data models (RFC 7950), with transactions: a change is applied to all devices, or none.
- **Automation tools**: Ansible, Nornir or vendor controllers push the changes; **CI pipelines** test them first in a
  lab or simulator (containerlab, vendor virtual images).
- **Verification**: tools such as Batfish analyse the configurations of the whole network *before* deployment and
  answer questions like "can the guest VLAN reach the payroll servers?" or "does any single link failure isolate a
  site?"

**Intent-based networking** goes one step further: the operator states the goal ("these two groups may talk on port
443") and the system generates, deploys and continuously checks the configuration.

## 22.3 A troubleshooting method

When "the network is slow" or "it doesn't work", go layer by layer, from the bottom, and split the path in half:

1. **Physical**: is the link up? Errors on the interface (CRC errors suggest a bad cable or optic)? Wi-Fi signal and
   retries?
2. **Link**: correct VLAN? Does the host have the gateway's MAC address (`ip neigh`)? Duplex mismatch?
3. **Network**: does the host have the right address, mask and gateway (DHCP)? Can it ping the gateway? A remote
   address? Does `traceroute` stop somewhere? Are routes correct both ways?
4. **Transport**: is the port open (`nc -vz host 443`)? Firewall drops? Connections reset? MTU black hole (works for
   small requests, hangs on large)?
5. **Application**: does DNS resolve (`dig`)? Does TLS succeed (`openssl s_client`)? What does the server log say?

Change one thing at a time, write down what you find, and compare with a working case: the same test from another
host, or yesterday's flow records. Most faults are DNS, addresses, a recent change, or the physical layer.
[When the internet is down](../../topics/Internet-Is-Down.md) is a short version for home networks.

## 22.4 Enterprise WANs and SD-WAN

Companies once linked branches with private MPLS circuits from a carrier. **SD-WAN** instead builds encrypted tunnels
over any mix of links (broadband, 5G, MPLS), and a central controller steers each application over the best link at
the moment, measured continuously, with policies like "video calls over the lowest-loss link". The same controllers
manage branch firewalls and increasingly hand security to cloud services (**SASE**: security delivered from the cloud
near the user; [Security, chapter 15](../security/15-Zero-Trust.md)).

## 22.5 Change, capacity and documentation

- **Change control**: plan, review, schedule a window, have a rollback, check afterwards. Most outages follow changes.
- **Capacity planning**: watch 95th-percentile utilisation (the usual billing measure) and upgrade before peaks reach
  about 70–80%, since delay rises sharply near full load (Chapter 3).
- **Redundancy**: two of everything that matters, on separate paths and power, tested by actually failing them.
- **Documentation**: diagrams, address plans, runbooks. If it is not written down, it is lost when the one person who
  knew leaves.
- **Time**: every device on NTP, so logs from different devices line up.

## Check yourself

??? question "1. An interface counter rose by 450,000,000 octets in 60 s on a 1 Gbit/s link. What was the utilisation?"
    450×10⁶ × 8 / (60 × 10⁹) = 0.06, i.e. 6%.

??? question "2. Users can reach websites by IP address but not by name. Which layer and service do you check first?"
    The application layer's DNS: the resolver address the host was given, whether port 53 is blocked, and whether the resolver answers (dig).

??? question "3. What does a tool like Batfish add to configuration management?"
    It verifies the behaviour of the whole network's configuration (reachability, failure tolerance) before the change is deployed.

??? info "Sources"
    - RFC 3411–3418 (SNMPv3), RFC 7011 (IPFIX), RFC 3176 (sFlow), RFC 5424 (syslog), RFC 6241 (NETCONF), RFC 8040 (RESTCONF), RFC 7950 (YANG 1.1).
    - OpenConfig, gNMI specification; A. Fogel et al., "A General Approach to Network Configuration Analysis" (Batfish), NSDI 2015.
    - Google, *Site Reliability Engineering* (O'Reilly, 2016), chapters on monitoring and change management.
