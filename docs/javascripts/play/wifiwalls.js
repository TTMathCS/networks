/* topics/Home-Wi-Fi.md: a signal map of a four-room home. Tap to move the router. Signal = 20 dBm sent (a typical
   router, assumed) − the loss at 5 GHz: 46.4 dB at 1 m, then growing with distance cubed (an indoor path loss exponent of 3) − 8 dB for each wall crossed (the page gives 3 to 15).
   Below about −70 dBm, one bar, it is time for a mesh point. A rough model: real homes reflect and absorb far more. */
PLAY("wifiwalls", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 360, st, out, R = [150, 120], WALL = 8, M = 15 / 600;   // metres per drawing unit: the home is 15 m wide
  var walls = [[300, 20, 300, 340], [20, 180, 580, 180]];
  function crosses(ax, ay, bx, by) { var n = 0; walls.forEach(function (w) { var d = (bx - ax) * (w[3] - w[1]) - (by - ay) * (w[2] - w[0]); if (!d) return; var u = ((w[0] - ax) * (w[3] - w[1]) - (w[1] - ay) * (w[2] - w[0])) / d, v = ((w[0] - ax) * (by - ay) - (w[1] - ay) * (bx - ax)) / d; if (u > 0 && u < 1 && v > 0 && v < 1) n++; }); return n; }
  function sig(x, y) { var d = Math.max(0.5, Math.hypot(x - R[0], y - R[1]) * M); return 20 - (46.4 + 30 * Math.log10(d)) - WALL * crosses(R[0], R[1], x, y); }
  function draw() {
    var g = st.g, s = 12;
    for (var x = 20; x < 580; x += s) for (var y = 20; y < 340; y += s) {
      var v = sig(x + s / 2, y + s / 2), f = Math.max(0, Math.min(1, (v + 85) / 45));
      g.fillStyle = v < -70 ? "rgba(217,96,59," + (0.25 + 0.4 * (1 - f)) + ")" : "rgba(159,201,138," + (0.2 + 0.6 * f) + ")"; g.fillRect(x, y, s, s);
    }
    g.fillStyle = C.bg; g.fillRect(0, 0, W, 20); g.fillRect(0, 340, W, 20); g.fillRect(0, 0, 20, H); g.fillRect(580, 0, 20, H);
    g.strokeStyle = C.ink; g.lineWidth = 4; walls.forEach(function (w) { g.beginPath(); g.moveTo(w[0], w[1]); g.lineTo(w[2], w[3]); g.stroke(); }); g.strokeRect(20, 20, 560, 320);
    g.fillStyle = C.gold; g.beginPath(); g.arc(R[0], R[1], 10, 0, 7); g.fill();
    var worst = 0; for (var a = 30; a < 580; a += 20) for (var b = 30; b < 340; b += 20) worst = Math.min(worst, sig(a, b));
    out.textContent = "Weakest spot about " + Math.round(worst) + " dBm" + (worst < -70 ? ": the red area needs a mesh point." : ": every room has a usable signal.");
  }
  st = k.stage(W, H, function (x, y) { R = [Math.max(25, Math.min(575, x)), Math.max(25, Math.min(335, y))]; draw(); });
  out = k.out(); st.draw = draw;
  k.slider("Each wall", 3, 15, 1, WALL, function (v) { return "−" + v + " dB"; }, function (v) { WALL = v; draw(); });
  k.buttons([["Router in a corner", function () { R = [60, 60]; draw(); }], ["Router in the middle", function () { R = [290, 170]; draw(); }]]);
});
