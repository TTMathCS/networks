# Glossary

*The terms of [Math foundations](index.md), with the chapter where each is explained.*

| Term | Meaning | Ch. |
| --- | --- | --- |
| Aliasing | a frequency above half the sampling rate appearing as a lower one | 7 |
| AIMD | additive increase, multiplicative decrease | 9 |
| Big-endian | most significant byte first: network byte order | 1 |
| Binomial law | number of successes in N independent trials | 2 |
| Birthday bound | collisions become likely after about √M random values | 2, 10 |
| Bit | a binary digit; also the unit of information | 1, 5 |
| Capacity | the highest rate at which reliable communication is possible | 5 |
| Constellation | the set of complex points a modulation uses | 8 |
| CRC | error detection by polynomial division over GF(2) | 6 |
| Cut | a split of nodes into two sides; its capacity bounds any flow | 4 |
| Cyclic prefix | a copy of an OFDM symbol's end placed in front, absorbing echoes | 8 |
| Decibel | 10 log₁₀ of a power ratio; dBm is relative to 1 mW | 7 |
| DFT, FFT | discrete Fourier transform; its fast O(N log N) algorithm | 7 |
| Diffie-Hellman | agreeing a secret over a public channel using g^ab | 10 |
| Discrete logarithm | finding x from g^x; believed hard | 10 |
| Eb/N0 | energy per bit over noise density | 5, 8 |
| Entropy | average information per symbol, −Σ p log₂ p | 5 |
| Erlang | unit of offered traffic (λ/μ); Erlang B gives blocking | 3 |
| Euler's formula | e^{jθ} = cos θ + j sin θ | 8 |
| Exponential law | memoryless waiting time between Poisson arrivals | 2 |
| Fourier series, transform | writing a signal as a sum of sinusoids | 7 |
| GF(2), GF(2⁸) | finite fields of 2 and 256 elements | 6 |
| Geometric law | number of tries until the first success; mean 1/s | 2 |
| Gray code | labelling neighbours with patterns differing in one bit | 8 |
| Group | a set with an associative operation, identity and inverses | 10 |
| Hamming distance | number of differing positions | 6 |
| I and Q | in-phase and quadrature components of a carrier | 8 |
| Jain's index | (Σx)² / (n Σx²): 1 is perfectly fair | 9 |
| LDPC | codes with sparse parity checks, decoded by belief propagation | 6 |
| Little's law | L = λW, for any stable system | 3 |
| M/M/1 | single-server queue, Poisson arrivals, exponential service | 3 |
| Mask | bits used with AND to select part of a value | 1 |
| Max-flow min-cut | the largest flow equals the smallest cut | 4 |
| Max-min fairness | no flow can grow without shrinking a smaller one | 9 |
| Menger's theorem | disjoint paths equal the minimum separating cut | 4 |
| Modular inverse | x with ax ≡ 1 (mod n) | 10 |
| Mutual information | how much observing Y tells about X | 5 |
| Nyquist rate | sampling above twice the highest frequency | 7 |
| OFDM | many orthogonal subcarriers built with an inverse FFT | 8 |
| One's complement sum | addition with end-around carry, used by the Internet checksum | 1 |
| Poisson process | random arrivals at a constant average rate | 2 |
| Polar codes | capacity-achieving codes by channel polarisation | 6 |
| Proportional fairness | rates maximising the sum of logarithms | 9 |
| QAM | modulation on a grid of amplitudes in I and Q | 8 |
| Q function | the tail probability of a standard normal variable | 8 |
| Reed-Solomon | symbol-level codes from polynomial evaluation | 6 |
| RSA | public-key system based on factoring | 10 |
| Shannon-Hartley | C = B log₂(1 + S/N) | 5 |
| Spanning tree | a tree touching every node of a graph | 4 |
| Syndrome | parity-check result that identifies an error | 6 |
| Turbo codes | iteratively decoded parallel convolutional codes | 6 |
| Utility | a function valuing a flow's rate; NUM maximises the sum | 9 |
| XOR | exclusive or; addition in GF(2) | 1 |
