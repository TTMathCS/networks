# Math foundations

*The mathematics behind networks, one idea per chapter, each tied to where it is used. Proofs are given where they are short and teach something; longer ones are sketched with a source. Pages are five to six minutes.*

**You need:** school algebra and logarithms. Each chapter says what else it uses. Fuller treatments of every topic are
on [math.akadian.ca](https://math.akadian.ca/books/).

| Chapter | The idea | Used in |
| --- | --- | --- |
| [1. Bits, binary and masks](01-Bits-Binary-and-Masks.md) | base 2 and 16, bitwise AND/OR/XOR, prefixes | addressing, subnets, checksums |
| [2. Probability for networks](02-Probability-for-Networks.md) | binomial, geometric and Poisson laws | packet switching, loss, retransmission |
| [3. Queues and Little's law](03-Queues-and-Littles-Law.md) | $L = \lambda W$, the M/M/1 queue | router buffers, delay under load |
| [4. Graphs and flows](04-Graphs-and-Flows.md) | shortest paths, spanning trees, max-flow min-cut | routing, spanning tree, capacity |
| [5. Information and capacity](05-Information-and-Capacity.md) | entropy, mutual information, Shannon's theorem | every link's speed limit |
| [6. Error-correcting codes](06-Error-Correcting-Codes.md) | finite fields, Hamming, CRC, Reed-Solomon, LDPC | Ethernet, Wi-Fi, 5G, deep space |
| [7. Signals and Fourier](07-Signals-and-Fourier.md) | frequency, Fourier series and transforms, sampling | physical layer, OFDM |
| [8. Modulation math](08-Modulation-Math.md) | complex numbers, constellations, error probability | Wi-Fi, cellular, satellites |
| [9. Feedback and fairness](09-Feedback-and-Fairness.md) | control loops, max-min and proportional fairness | congestion control |
| [10. The math of security](10-The-Math-of-Security.md) | modular arithmetic, groups, discrete logs, elliptic curves | TLS, SSH, VPNs |

Terms are collected in the [Glossary](Glossary.md).
