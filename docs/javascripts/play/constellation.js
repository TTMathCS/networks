/* books/math/08: a constellation with noise. Received points are the sent point plus Gaussian noise; the receiver picks
   the nearest point. Choose QPSK, 16-QAM or 64-QAM and the S/N: dense constellations need more S/N for the same
   error rate (about 6 dB for each 4× more points). The noise is simulated. */
PLAY("constellation", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 320, st = k.stage(W, H), g = st.g, out = k.out(), M = 16, snr = 20, seed = 3;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function gauss() { return Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd()); }
  function draw() {
    seed = 3; var side = Math.sqrt(M), cx = 300, cy = 160, R = 130, lv = [];
    for (var i = 0; i < side; i++) lv.push(-1 + (2 * i + 1) / side);
    var es = 0; lv.forEach(function (a) { lv.forEach(function (b) { es += a * a + b * b; }); }); es /= M;   // average power
    var sig = Math.sqrt(es / (2 * Math.pow(10, snr / 10)));
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = C.line; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - R - 20, cy); g.lineTo(cx + R + 20, cy); g.moveTo(cx, cy - R - 20); g.lineTo(cx, cy + R + 20); g.stroke();
    var bad = 0, N = 1200;
    for (var n = 0; n < N; n++) {
      var a = Math.floor(rnd() * side), b = Math.floor(rnd() * side), x = lv[a] + sig * gauss(), y = lv[b] + sig * gauss();
      var da = Math.min(side - 1, Math.max(0, Math.floor((x + 1) / 2 * side))), db = Math.min(side - 1, Math.max(0, Math.floor((y + 1) / 2 * side)));
      var wrong = da !== a || db !== b; if (wrong) bad++;
      g.fillStyle = wrong ? C.red : "rgba(156,201,234,0.55)"; g.fillRect(cx + x * R - 1.5, cy - y * R - 1.5, 3, 3);
    }
    lv.forEach(function (a) { lv.forEach(function (b) { g.fillStyle = C.gold; g.beginPath(); g.arc(cx + a * R, cy - b * R, M > 16 ? 4 : 6, 0, 7); g.fill(); }); });
    g.textAlign = "left"; g.font = F(20, 600); g.fillStyle = C.ink; g.fillText(M === 4 ? "QPSK" : M + "-QAM", 20, 34);
    g.font = F(18, 500); g.fillStyle = C.ink3; g.fillText(Math.log2(M) + " bits a symbol", 20, 60);
    g.fillStyle = C.red; g.fillText("red: read wrong", 20, 300);
    out.textContent = "At " + snr + " dB, " + (bad ? (bad / N * 100).toFixed(bad < 12 ? 1 : 0) + "% of " + N + " symbols" : "none of " + N + " symbols") + " land nearer a wrong point.";
  }
  k.buttons([["16-QAM", function () { M = 16; draw(); }], ["QPSK", function () { M = 4; draw(); }], ["64-QAM", function () { M = 64; draw(); }]], true);
  k.slider("Signal to noise", 0, 35, 1, snr, function (v) { return v + " dB"; }, function (v) { snr = +v; draw(); });
  st.draw = draw; draw();
});
