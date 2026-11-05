# How to read this site

## Four ways in

| Section | For |
| --- | --- |
| [**Start**](start/index.md) | six five-minute lessons for beginners, with everyday pictures and no technical words |
| [**Topics**](topics/index.md) | one page per job ("set up home Wi-Fi", "when the internet is down"), in four parts from beginner to expert |
| [**Books**](books/index.md) | four complete courses: networks, math, wireless, security |
| [**Labs**](labs/index.md) | fifteen hands-on exercises on your own computer |

## Every page has the same parts

| Part | What it gives you |
| --- | --- |
| **Level** | under the title: Beginner, Intermediate or Expert |
| **In this chapter** box | what you will learn, and which pages you need first |
| **Numbered sections** | the content, in order; diagrams show packets, paths and timing |
| **Check yourself** | questions with the answers folded under them: try first, then open |
| **Sources** | a closed box at the end: the standards (RFCs, IEEE, 3GPP), guidance (NIST, CISA) and papers each fact comes from |

Long pages are split into parts of about five to six minutes; use **Previous** and **Next** at the top and bottom. The
**Aa** button at the top changes the text size, light or dark, and lets you show a whole page at once. Finished
chapters get a tick, kept only in your own browser.

## Commands and code

Commands are for **Linux** unless a page says otherwise; most also work on macOS. Lines starting with `>>>` are typed in
Python or Scapy. Placeholders such as `<server public key>` are for you to fill in. Interface names (`enp0s3`,
`wlan0`) differ between computers: find yours with `ip -br link`.

!!! warning "Only test what you own"
    Scanning, capturing and testing are for your own computers and networks, or ones you have written permission to
    test. Doing them elsewhere is illegal in most countries.

## The math

Formulas are typeset as real math. Most pages need only arithmetic; the [Math foundations](books/math/index.md) book
explains the rest from the start. Units: bit/s for rates (Mbit/s = million bits per second), bytes for sizes, dB and
dBm for radio power ([math book, chapter 5](books/math/05-Information-and-Capacity.md)).

## Who wrote it

The text and diagrams on this site are **AI-created**, checked against the sources named on each page. If you find a
mistake, the source on the page is the authority. Part of [Mars – your new home](https://www.akadian.ca/), alongside
[cs.akadian.ca](https://cs.akadian.ca/), [math.akadian.ca](https://math.akadian.ca/) and
[cryptography.akadian.ca](https://cryptography.akadian.ca/).
