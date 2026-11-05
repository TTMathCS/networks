"""Draws docs/images/net-hero.svg: the real Earth-Mars relay network (5 Nov 2026).
Rovers on the Martian surface talk over UHF (about 400 MHz) to orbiters, which relay to NASA's Deep Space Network
dishes on Earth over X band (about 8.4 GHz). One-way light time is about 3 to 22 minutes."""
import math, random
random.seed(7)
W, H = 1600, 900
o = []
a = o.append
a(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
a('<defs><radialGradient id="sky" cx="60%" cy="40%" r="85%"><stop offset="0" stop-color="#2a1610"/><stop offset="0.6" stop-color="#140b08"/><stop offset="1" stop-color="#06070b"/></radialGradient>'
  '<radialGradient id="mars" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#e48a52"/><stop offset="0.7" stop-color="#a5482a"/><stop offset="1" stop-color="#4a1d10"/></radialGradient>'
  '<radialGradient id="earth" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#7fb8e8"/><stop offset="0.7" stop-color="#2b5f99"/><stop offset="1" stop-color="#0c1d36"/></radialGradient>'
  '<marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#eea66f"/></marker></defs>')
a(f'<rect width="{W}" height="{H}" fill="url(#sky)"/>')
for _ in range(220):
    x, y, r = random.uniform(0, W), random.uniform(0, H), random.choice([0.6, 0.8, 1.1, 1.5])
    a(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="#f4e6d4" fill-opacity="{random.uniform(0.25,0.8):.2f}"/>')
# Earth (small, far left-top) and Mars (big, right-bottom)
ex, ey, er = 470, 250, 70
mx, my, mr = 1250, 700, 210
a(f'<circle cx="{ex}" cy="{ey}" r="{er}" fill="url(#earth)"/>')
a(f'<circle cx="{mx}" cy="{my}" r="{mr}" fill="url(#mars)"/>')
a(f'<ellipse cx="{mx}" cy="{my}" rx="{mr+120}" ry="{mr+120}" fill="none" stroke="#f4e6d4" stroke-opacity="0.16" stroke-dasharray="4 8"/>')
sats = [(1000, 520, "MRO"), (1120, 395, "MAVEN"), (1330, 370, "TGO"), (1490, 470, "Odyssey")]
for x, y, name in sats:
    a(f'<g transform="translate({x},{y})"><rect x="-6" y="-5" width="12" height="10" fill="#f4e6d4"/><rect x="-24" y="-2" width="16" height="4" fill="#6fb7ee"/><rect x="8" y="-2" width="16" height="4" fill="#6fb7ee"/></g>')
    a(f'<text x="{x}" y="{y-16}" fill="#f4e6d4" fill-opacity="0.85" font-size="17" text-anchor="middle" font-family="sans-serif">{name}</text>')
rov = [(1170, 560, "Curiosity · Gale"), (1330, 545, "Perseverance · Jezero")]
for x, y, n in rov:
    a(f'<circle cx="{x}" cy="{y}" r="6" fill="#ffd28a"/><text x="{x}" y="{y+28 if n.startswith('C') else y+52}" fill="#fff4e6" font-size="16" text-anchor="middle" font-family="sans-serif">{n}</text>')
for (x, y, _), (sx, sy, _) in [(rov[0], sats[0]), (rov[1], sats[2])]:
    a(f'<line x1="{x}" y1="{y}" x2="{sx}" y2="{sy}" stroke="#7ccf7f" stroke-width="2.5" stroke-dasharray="6 5"/>')
a('<text x="1390" y="300" fill="#7ccf7f" font-size="18" text-anchor="middle" font-family="sans-serif">UHF relay · about 400 MHz</text>')
for ang in (-150, -40, 70):
    t = math.radians(ang)
    a(f'<circle cx="{ex + er*math.cos(t):.0f}" cy="{ey + er*math.sin(t):.0f}" r="5" fill="#ffd28a"/>')
a(f'<text x="{ex}" y="{ey+er+30}" fill="#f4e6d4" font-size="17" text-anchor="middle" font-family="sans-serif">Deep Space Network: Goldstone · Madrid · Canberra</text>')
a(f'<path d="M985,505 Q 800,260 {ex+er+10},{ey+14}" fill="none" stroke="#eea66f" stroke-width="3.5" marker-end="url(#ar)"/>')
a(f'<path d="M{ex+er+8},{ey-14} Q 950,110 1318,358" fill="none" stroke="#c792ea" stroke-width="2.5" stroke-dasharray="10 6" marker-end="url(#ar)"/>')
a('<text x="560" y="400" fill="#eea66f" font-size="19" font-family="sans-serif">data down · X band 8.4 GHz</text>')
a('<text x="560" y="428" fill="#eea66f" fill-opacity="0.8" font-size="17" font-family="sans-serif">3 to 22 light-minutes each way</text>')
a('<text x="860" y="140" fill="#c792ea" font-size="17" font-family="sans-serif">commands up · 7.2 GHz</text>')
# formulas
f = 'font-family="serif" font-style="italic" fill="#f4e6d4" fill-opacity="0.55" font-size="26"'
a(f'<text x="1180" y="230" {f}>C = B log₂(1 + S/N)</text>')
a(f'<text x="120" y="560" {f}>Pᵣ = Pₜ Gₜ Gᵣ (λ / 4πd)²</text>')
a(f'<text x="160" y="640" {f}>RTT ≥ 2d / c</text>')
a('</svg>')
open('../../docs/images/net-hero.svg', 'w').write('\n'.join(o))
