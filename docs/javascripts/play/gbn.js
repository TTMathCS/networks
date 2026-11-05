/* books/networks/15: Go-Back-N with a window of 4. Time runs left to right; packets fall from the sender to the
   receiver, ACKs climb back. Lose one packet and the receiver throws away everything after it until the sender's
   timer runs out and it sends the whole window again. One-way delay 1.5 units, timeout 4. */
PLAY("gbn", function (fig, k) {
  var C = k.C, F = k.F, W = 640, H = 300, st = k.stage(W, H), g = st.g, out = k.out();
  var N = 4, COUNT = 10, DL = 1.5, GAP = 0.5, TO = 4, lose = { p: 2 }, ev;
  function sim() {   // a simple step-by-step run; returns every packet and ACK with its times
    var pk = [], ak = [], base = 0, next = 0, timer = null, last = -9, expect = 0, lostOnce = {}, t = 0, dt = 0.01, sent = 0;
    while (base < COUNT && t < 40) {
      // arrivals at the receiver
      pk.forEach(function (p) {
        if (!p.seen && t >= p.t0 + DL) { p.seen = true; if (p.lost) return;
          if (p.s === expect) { expect++; p.ok = true; } else p.ok = false;
          if (expect > 0) ak.push({ n: expect - 1, t0: t, lost: lose.a === expect - 1 && !lostOnce["a" + (expect - 1)] && (lostOnce["a" + (expect - 1)] = 1) }); }
      });
      // ACKs back at the sender (cumulative)
      ak.forEach(function (a) { if (!a.seen && t >= a.t0 + DL) { a.seen = true; if (a.lost) return;
        if (a.n >= base) { base = a.n + 1; timer = base < next ? t : null; } } });
      if (timer !== null && t - timer >= TO) { next = base; timer = t; last = -9; }   // time out: go back
      if (next < base + N && next < COUNT && t - last >= GAP) {
        var l = lose.p === next && !lostOnce["p" + next]; if (l) lostOnce["p" + next] = 1;
        pk.push({ s: next, t0: t, lost: l }); next++; last = t; sent++; if (timer === null) timer = t;
      }
      t += dt;
    }
    return { pk: pk, ak: ak, end: t, sent: sent };
  }
  function draw(f) {
    var T = ev.end + 0.3, now = f * T, x = function (v) { return 40 + v / T * (W - 60); }, yS = 60, yR = 240;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = C.ink3; g.lineWidth = 2; g.beginPath(); g.moveTo(40, yS); g.lineTo(W - 20, yS); g.moveTo(40, yR); g.lineTo(W - 20, yR); g.stroke();
    g.font = F(15, 600); g.fillStyle = C.ink2; g.textAlign = "left"; g.fillText("sender", 40, yS - 30); g.fillText("receiver", 40, yR + 40);
    function arrow(t0, a, b, col, lost, label, dashed) {
      if (now < t0) return;
      var u = Math.min(1, (now - t0) / DL); if (lost) u = Math.min(u, 0.5);
      var x0 = x(t0), x1 = x(t0 + DL * u), y1 = a + (b - a) * u;
      g.strokeStyle = col; g.lineWidth = 2; g.setLineDash(dashed ? [4, 4] : []); g.beginPath(); g.moveTo(x0, a); g.lineTo(x1, y1); g.stroke(); g.setLineDash([]);
      if (lost && now >= t0 + DL * 0.5) { g.strokeStyle = C.red; g.lineWidth = 3; g.beginPath(); g.moveTo(x1 - 7, y1 - 7); g.lineTo(x1 + 7, y1 + 7); g.moveTo(x1 + 7, y1 - 7); g.lineTo(x1 - 7, y1 + 7); g.stroke(); }
      if (label !== null) { g.fillStyle = col; g.font = F(15, 600); g.textAlign = "center"; g.fillText(label, x0, a < b ? a - 8 : a + 18); }
    }
    ev.pk.forEach(function (p) { arrow(p.t0, yS, yR, p.lost ? C.red : p.ok === false && now >= p.t0 + DL ? C.ink3 : C.gold, p.lost, p.s, false); });
    ev.ak.forEach(function (a) { arrow(a.t0, yR, yS, a.lost ? C.red : C.ice, a.lost, null, true); });
    // what the receiver has
    var got = 0; ev.pk.forEach(function (p) { if (p.ok && now >= p.t0 + DL) got++; });
    g.fillStyle = C.ink; g.font = F(15, 600); g.textAlign = "right"; g.fillText("delivered in order: " + got + " of " + COUNT, W - 20, 24);
    var shown = ev.pk.filter(function (p) { return p.t0 <= now; }).length;
    out.textContent = "Packets sent so far: " + shown + (now >= ev.end ? ". All " + COUNT + " delivered with " + ev.sent + " sends, " + (ev.sent - COUNT) + " of them again." : ".") +
      " Grey arrows arrived out of order and were thrown away.";
  }
  ev = sim();
  var film = k.loop(14, draw, { label: "Time" });
  st.draw = function () { draw(film.t()); };
  function set(o) { lose = o; ev = sim(); draw(film.t()); }
  k.buttons([["Lose packet 2", function () { set({ p: 2 }); }], ["Lose nothing", function () { set({}); }], ["Lose ACK 1", function () { set({ a: 1 }); }]], true);
});
