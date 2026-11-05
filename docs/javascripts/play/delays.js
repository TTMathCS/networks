/* books/networks/03: a packet leaves a router and crosses one link. Transmission (L/R) is the time to push every bit
   onto the wire; propagation (d/s) is the time one bit takes to travel it, at 2×10⁸ m/s in fibre or copper.
   Change the packet, the link's speed and its length, and watch which one wins. */
PLAY("delays", function (fig, k) {
  var C = k.C, F = k.F, W = 640, H = 270, st = k.stage(W, H), g = st.g, out = k.out();
  var L = 1500, R = 10, D = 1000;   // bytes, Mbit/s, km
  function fmt(s) { return s < 1e-3 ? (s * 1e6).toPrecision(3) + " µs" : s < 1 ? (s * 1e3).toPrecision(3) + " ms" : s.toPrecision(3) + " s"; }
  function draw(t) {
    var tr = L * 8 / (R * 1e6), pr = D * 1e3 / 2e8, T = tr + pr, tau = t * T;
    var x0 = 70, x1 = 570, wl = x1 - x0;
    var front = Math.min(1, tau / pr), rear = Math.max(0, (tau - tr) / pr);   // as a share of the wire
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.font = F(17, 600); g.fillStyle = C.ink; g.textAlign = "left";
    g.fillText("t = " + fmt(tau), 20, 32);
    // the two routers and the wire
    g.fillStyle = C.bg2; g.strokeStyle = C.ink3; g.lineWidth = 2;
    [[20, "A"], [x1, "B"]].forEach(function (r) { g.fillRect(r[0], 90, 50, 70); g.strokeRect(r[0], 90, 50, 70); });
    g.fillStyle = C.ink; g.font = F(16, 600); g.textAlign = "center"; g.fillText("A", 45, 131); g.fillText("B", x1 + 25, 131);
    g.strokeStyle = C.line; g.lineWidth = 6; g.beginPath(); g.moveTo(x0, 125); g.lineTo(x1, 125); g.stroke();
    // bits still waiting inside A
    var sent = Math.min(1, tau / tr);
    g.fillStyle = C.gold; g.fillRect(26, 166, 38 * (1 - sent), 10);
    g.font = F(15, 500); g.fillStyle = C.ink3; g.fillText("left in A", 45, 194);
    // the bits on the wire: from the last bit sent to the first
    if (front > rear) { g.fillStyle = C.gold; g.fillRect(x0 + rear * wl, 117, Math.max(2, (front - rear) * wl), 16); }
    var got = Math.max(0, Math.min(1, (tau - pr) / tr));
    g.fillStyle = C.green; g.fillRect(x1 + 6, 166, 38 * got, 10); g.fillStyle = C.ink3; g.fillText("arrived", x1 + 25, 194);
    // the two times as bars
    g.textAlign = "left"; g.font = F(15, 500);
    var bx = 20, bw = W - 40, sc = bw / T;
    g.fillStyle = C.rust; g.fillRect(bx, 222, tr * sc, 12); g.fillStyle = C.ice; g.fillRect(bx + tr * sc, 222, pr * sc, 12);
    g.strokeStyle = C.ink; g.lineWidth = 2; g.beginPath(); g.moveTo(bx + tau * sc, 214); g.lineTo(bx + tau * sc, 242); g.stroke();
    g.fillStyle = C.rust; g.fillText("transmission " + fmt(tr), 20, 262);
    g.fillStyle = C.ice; g.textAlign = "right"; g.fillText("propagation " + fmt(pr), W - 20, 262);
    out.textContent = (tr > pr ? "Transmission is " + (tr / pr).toPrecision(2) + "× longer: the link's speed matters most here."
      : "Propagation is " + (pr / tr).toPrecision(2) + "× longer: the distance matters most here.") + " Total for this link: " + fmt(T) + ".";
  }
  var film = k.loop(6, draw, { label: "Time" });
  st.draw = function () { draw(film.t()); };
  var rates = [1, 10, 100, 1000, 10000];
  k.slider("Packet", 64, 9000, 1, L, function (v) { return v.toLocaleString("en") + " bytes"; }, function (v) { L = v; draw(film.t()); });
  k.slider("Link", 0, 4, 1, 1, function (v) { var r = rates[v]; return r >= 1000 ? r / 1000 + " Gbit/s" : r + " Mbit/s"; }, function (v) { R = rates[v]; draw(film.t()); });
  k.slider("Length", 0, 4, 0.01, 3, function (v) { var d = Math.pow(10, v); return d < 10 ? d.toFixed(1) + " km" : Math.round(d).toLocaleString("en") + " km"; }, function (v) { D = Math.pow(10, v); draw(film.t()); });
});
