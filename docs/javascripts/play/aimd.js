/* books/networks/17: two TCP flows share one link that carries 100 segments per round trip. Each round trip both
   add one segment (additive increase); when together they overflow the link, both lose a packet and halve
   (multiplicative decrease). Left: the two windows over time. Right: the same as a point (flow 1, flow 2), which
   zig-zags toward the fair line where both are equal (Chiu and Jain, 1989). This toy assumes both see every loss. */
PLAY("aimd", function (fig, k) {
  var C = k.C, F = k.F, W = 640, H = 320, st = k.stage(W, H), g = st.g, out = k.out();
  var CAP = 100, RTTS = 300, a0 = 80, b0 = 5, mode = "aimd", hist;
  function sim() {
    var a = a0, b = b0, h = [[a, b]];
    for (var i = 0; i < RTTS; i++) {
      if (a + b > CAP) { if (mode !== "aiad") { a /= 2; b /= 2; } else { a -= 20; b -= 20; a = Math.max(1, a); b = Math.max(1, b); } }
      else { if (mode === "mimd") { a *= 1.1; b *= 1.1; } else { a += 1; b += 1; } }
      h.push([a, b]);
    }
    return h;
  }
  function draw(t) {
    var n = Math.max(1, Math.round(t * RTTS)), i;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    // time plot
    var X0 = 40, Y0 = 270, PW = 330, PH = 220, sx = PW / RTTS, sy = PH / CAP;
    g.strokeStyle = C.ink3; g.lineWidth = 1; g.beginPath(); g.moveTo(X0, Y0 - PH); g.lineTo(X0, Y0); g.lineTo(X0 + PW, Y0); g.stroke();
    [[0, C.gold], [1, C.ice]].forEach(function (s) {
      g.strokeStyle = s[1]; g.lineWidth = 2; g.beginPath();
      for (i = 0; i <= n; i++) { var v = hist[i][s[0]]; if (i) g.lineTo(X0 + i * sx, Y0 - v * sy); else g.moveTo(X0, Y0 - v * sy); }
      g.stroke();
    });
    g.font = F(14, 500); g.fillStyle = C.ink3; g.textAlign = "left"; g.fillText("window (segments)", X0, Y0 - PH - 10);
    g.fillText("round trips →", X0 + PW - 90, Y0 + 20);
    g.fillStyle = C.gold; g.fillText("flow 1", X0 + 10, Y0 + 40); g.fillStyle = C.ice; g.fillText("flow 2", X0 + 70, Y0 + 40);
    // phase plot
    var Q0 = 400, QS = 210 / CAP, QY = 270;
    g.strokeStyle = C.ink3; g.beginPath(); g.moveTo(Q0, QY - 210); g.lineTo(Q0, QY); g.lineTo(Q0 + 210, QY); g.stroke();
    g.strokeStyle = C.line; g.setLineDash([5, 5]); g.beginPath(); g.moveTo(Q0, QY); g.lineTo(Q0 + 210, QY - 210); g.stroke();
    g.setLineDash([]); g.strokeStyle = C.red; g.beginPath(); g.moveTo(Q0, QY - 210); g.lineTo(Q0 + 210, QY); g.stroke();
    g.fillStyle = C.ink3; g.fillText("fair: equal", Q0 + 130, QY - 190); g.fillStyle = C.red; g.fillText("link full", Q0 + 150, QY - 75);
    g.fillStyle = C.gold; g.fillText("flow 1 →", Q0 + 10, QY + 20); g.save(); g.translate(Q0 - 10, QY - 120); g.rotate(-Math.PI / 2); g.fillStyle = C.ice; g.fillText("flow 2 →", 0, 0); g.restore();
    g.strokeStyle = C.rust; g.lineWidth = 1.5; g.beginPath();
    for (i = 0; i <= n; i++) { var p = hist[i]; var px = Q0 + Math.min(p[0], 105) * QS, py = QY - Math.min(p[1], 105) * QS; if (i) g.lineTo(px, py); else g.moveTo(px, py); }
    g.stroke();
    var e = hist[n]; g.fillStyle = C.ink; g.beginPath(); g.arc(Q0 + Math.min(e[0], 105) * QS, QY - Math.min(e[1], 105) * QS, 5, 0, 7); g.fill();
    g.fillStyle = C.ink; g.font = F(15, 600); g.textAlign = "left"; g.fillText("Round trip " + n, 20, 24);
    out.textContent = "Flow 1 " + e[0].toFixed(0) + ", flow 2 " + e[1].toFixed(0) + " segments: " +
      (Math.abs(e[0] - e[1]) < 3 ? "an equal share." : "flow 1 has " + (e[0] / Math.max(1, e[1])).toFixed(1) + "× flow 2's share.");
  }
  hist = sim();
  var film = k.loop(12, draw, { label: "Time" });
  st.draw = function () { draw(film.t()); };
  function set(m) { mode = m; hist = sim(); draw(film.t()); }
  k.buttons([["Add 1, halve (AIMD)", function () { set("aimd"); }], ["Add 1, take 20 off", function () { set("aiad"); }], ["Grow 10%, halve", function () { set("mimd"); }]], true);
});
