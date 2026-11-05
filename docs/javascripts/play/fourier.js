/* books/math/07: building a square wave from its odd harmonics, (4/π)(sin x + sin 3x/3 + sin 5x/5 + ...). The slider
   adds harmonics; Play adds them one at a time. A channel that passes only the first few delivers the rounded wave. */
PLAY("fourier", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 250, st = k.stage(W, H), g = st.g, out = k.out(), n = 2, sl;
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var y0 = 130, A = 70;
    g.strokeStyle = C.line; g.lineWidth = 1; g.beginPath(); g.moveTo(20, y0); g.lineTo(580, y0); g.stroke();
    g.strokeStyle = "rgba(244,230,212,0.35)"; g.lineWidth = 2; g.beginPath();
    for (var x = 20; x <= 580; x++) { var ph = ((x - 20) / 280) % 1, v = ph < 0.5 ? 1 : -1; if (x === 20) g.moveTo(x, y0 - A * v); else g.lineTo(x, y0 - A * v); }
    g.stroke();
    g.strokeStyle = C.gold; g.lineWidth = 3; g.beginPath();
    for (x = 20; x <= 580; x++) {
      var t = (x - 20) / 280 * 2 * Math.PI, s = 0;
      for (var m = 0; m < n; m++) { var h = 2 * m + 1; s += Math.sin(h * t) / h; }
      s *= 4 / Math.PI; if (x === 20) g.moveTo(x, y0 - A * s); else g.lineTo(x, y0 - A * s);
    }
    g.stroke();
    g.font = F(20, 600); g.textAlign = "left"; g.fillStyle = C.gold; g.fillText(n + " odd harmonic" + (n > 1 ? "s" : "") + " added", 20, 34);
    g.fillStyle = C.ink3; g.font = F(18, 500); g.fillText("grey: the square wave", 20, 236);
    var hs = []; for (m = 0; m < Math.min(n, 4); m++) hs.push(2 * m + 1); out.textContent = "Frequencies " + hs.join(", ") + (n > 4 ? ", …, " + (2 * n - 1) : "") + " × the fundamental: a channel must pass up to " + (2 * n - 1) + "× to deliver this shape.";
  }
  var film = k.loop(8, function (t) { var m = Math.max(1, Math.round(1 + t * 14)); if (m !== n) { n = m; if (sl) { sl.value = n; sl.dispatchEvent(new Event("input")); } } draw(); }, { label: "Harmonics" });
  sl = k.slider("Harmonics", 1, 15, 1, n, function (v) { return v; }, function (v) { n = +v; draw(); });
  st.draw = draw; draw();
});
