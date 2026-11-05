/* books/networks/20: adaptive streaming. The player keeps a buffer of video and picks the next chunk's quality from the
   speed it has seen. When the network slows, it steps down before the buffer runs dry; when it recovers, it steps back up.
   A simple rule with made-up speeds: choose the best quality under 80% of the speed measured 3 seconds ago, so a sudden drop drains the buffer for a moment. */
PLAY("abr", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 290, st = k.stage(W, H), g = st.g, out = k.out(), Q = [1, 3, 6, 12], hist;
  function bw(s) { return s < 20 ? 15 : s < 40 ? 4 : s < 50 ? 1.5 : 10; }   // Mbit/s over time (s)
  function sim() { var buf = 4, q = 1, h = []; for (var s = 0; s < 60; s += 0.5) { var rate = bw(s), cap = 0.8 * bw(Math.max(0, s - 3)), pick = Q.filter(function (x) { return x <= cap; }); q = pick.length ? pick[pick.length - 1] : Q[0]; buf += rate / q * 0.5 - 0.5; buf = Math.max(0, Math.min(10, buf)); h.push([s, rate, q, buf]); } return h; }
  function draw(t) {
    var n = Math.max(1, Math.floor(t * hist.length)), X = function (s) { return 40 + s / 60 * 540; };
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    function plot(idx, max, y0, hgt, col, lab) {
      g.strokeStyle = C.line; g.strokeRect(40, y0, 540, hgt); g.strokeStyle = col; g.lineWidth = 2.5; g.beginPath();
      for (var i = 0; i < n; i++) { var p = hist[i], y = y0 + hgt - p[idx] / max * hgt; if (i) g.lineTo(X(p[0]), y); else g.moveTo(X(p[0]), y); } g.stroke();
      g.fillStyle = col; g.font = F(13, 600); g.textAlign = "left"; g.fillText(lab, 44, y0 + 14);
    }
    plot(1, 16, 20, 70, C.ice, "network speed (Mbit/s)"); plot(2, 16, 110, 70, C.gold, "video quality chosen (Mbit/s)"); plot(3, 10, 200, 70, C.green, "buffer (seconds of video)");
    var p = hist[n - 1];
    out.textContent = "At " + Math.round(p[0]) + " s: network " + p[1] + " Mbit/s, playing " + p[2] + " Mbit/s, " + p[3].toFixed(1) + " s in the buffer" + (p[3] <= 0.01 ? ": stalled!" : ".");
  }
  hist = sim();
  var film = k.loop(12, draw, { label: "Time" });
  st.draw = function () { draw(film.t()); };
});
