/* books/math/05: the Shannon-Hartley limit, C = B log₂(1 + S/N). Double the bandwidth and capacity doubles; double the
   signal-to-noise ratio and it grows by only about one bit per second per hertz. */
PLAY("shannon", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 220, st = k.stage(W, H), g = st.g, out = k.out(), B = 20, snr = 25;
  function cap(b, s) { return b * Math.log2(1 + Math.pow(10, s / 10)); }
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var c = cap(B, snr), max = cap(160, 40);
    g.fillStyle = C.ink; g.font = F(26, 700); g.textAlign = "left"; g.fillText(c < 1000 ? c.toFixed(0) + " Mbit/s" : (c / 1000).toFixed(2) + " Gbit/s", 20, 50);
    g.fillStyle = C.bg2; g.fillRect(20, 70, 560, 22); g.fillStyle = C.gold; g.fillRect(20, 70, 560 * c / max, 22);
    g.font = F(21, 500); g.fillStyle = C.ink2;
    g.fillText("× 2 bandwidth: " + cap(B * 2, snr).toFixed(0) + " Mbit/s", 20, 130);
    g.fillText("+ 3 dB signal (twice the power): " + cap(B, snr + 3).toFixed(0) + " Mbit/s", 20, 156);
    g.fillStyle = C.ink3; g.font = F(18, 500); g.fillText("the most this channel can carry without errors", 20, 196);
    out.textContent = B + " MHz at " + snr + " dB: " + (c / B).toFixed(1) + " bit/s per hertz.";
  }
  st.draw = draw;
  k.slider("Bandwidth", 1, 160, 1, B, function (v) { return v + " MHz"; }, function (v) { B = v; draw(); });
  k.slider("Signal to noise", 0, 40, 1, snr, function (v) { return v + " dB"; }, function (v) { snr = v; draw(); });
});
