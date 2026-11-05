/* books/wireless/05: OFDM subcarriers. Each subcarrier's spectrum is a sinc shape; spaced exactly 1/Tu apart, each peak
   falls on the zeros of all the others, so they overlap without getting in each other's way. Tap a subcarrier, or
   squeeze the spacing to see them start to interfere. */
PLAY("ofdm", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 250, sel = 3, sp = 1, st, out, N = 7, cols = [C.gold, C.ice, C.green, C.rust, C.mars, C.earth, "#d8b4f0"];
  st = k.stage(W, H, function (x) { sel = Math.max(0, Math.min(N - 1, Math.round((x - 300) / (55 * sp) + 3))); draw(); });
  out = k.out(); var g = st.g;
  function sinc(u) { return Math.abs(u) < 1e-6 ? 1 : Math.sin(Math.PI * u) / (Math.PI * u); }
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var y0 = 190, A = 140, step = 55;
    g.strokeStyle = C.line; g.lineWidth = 1; g.beginPath(); g.moveTo(10, y0); g.lineTo(590, y0); g.stroke();
    for (var n = 0; n < N; n++) {
      var c = 300 + (n - 3) * step * sp; g.strokeStyle = cols[n]; g.lineWidth = n === sel ? 3.5 : 1.6; g.globalAlpha = n === sel ? 1 : 0.6; g.beginPath();
      for (var x = 10; x <= 590; x++) { var y = y0 - A * sinc((x - c) / step); if (x === 10) g.moveTo(x, y); else g.lineTo(x, y); }
      g.stroke(); g.globalAlpha = 1;
    }
    var cs = 300 + (sel - 3) * step * sp, leak = 0;
    for (n = 0; n < N; n++) if (n !== sel) leak += Math.abs(sinc((cs - (300 + (n - 3) * step * sp)) / step));
    g.strokeStyle = C.ink; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(cs, 30); g.lineTo(cs, y0); g.stroke(); g.setLineDash([]);
    g.fillStyle = C.ink; g.font = F(20, 600); g.textAlign = "left"; g.fillText(leak < 0.01 ? "at this peak, all the others are zero" : "others leak in: " + (leak * 100).toFixed(0) + "% of the peak", 20, 26);
    out.textContent = sp === 1 ? "Spaced exactly 1/Tu apart: the subcarriers overlap but stay orthogonal." : "Spacing " + sp.toFixed(2) + "× 1/Tu: the peaks no longer sit on the others' zeros.";
  }
  k.slider("Spacing (× 1/Tu)", 0.6, 1.4, 0.05, sp, function (v) { return (+v).toFixed(2); }, function (v) { sp = +v; draw(); });
  st.draw = draw; draw();
});
