/* books/wireless/06: beamforming with N antennas half a wavelength apart. Adjusting each antenna's phase steers the beam;
   the power gain toward the target is N times (10·log10 N dB). The pattern drawn is the array's relative power. */
PLAY("beam", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 300, st = k.stage(W, H), g = st.g, out = k.out(), N = 4, aim = 30;
  function af(th) { var s = 0, c = 0, psi = Math.PI * (Math.sin(th) - Math.sin(aim * Math.PI / 180)); for (var i = 0; i < N; i++) { c += Math.cos(i * psi); s += Math.sin(i * psi); } return (c * c + s * s) / N; }   // power relative to one antenna
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var cx = 300, cy = 270, R = 220 / N;
    g.strokeStyle = C.line; g.lineWidth = 1; for (var r = 1; r <= 3; r++) { g.beginPath(); g.arc(cx, cy, r * 75, Math.PI, 2 * Math.PI); g.stroke(); }
    g.fillStyle = "rgba(246,196,83,0.25)"; g.strokeStyle = C.gold; g.lineWidth = 2.5; g.beginPath();
    for (var a = -90; a <= 90; a += 0.5) { var th = a * Math.PI / 180, p = af(th) * R; var x = cx + p * Math.sin(th), y = cy - p * Math.cos(th); if (a === -90) g.moveTo(x, y); else g.lineTo(x, y); }
    g.closePath(); g.fill(); g.stroke();
    for (var i = 0; i < N; i++) { g.fillStyle = C.ice; g.fillRect(cx - (N - 1) * 9 + i * 18 - 4, cy - 4, 8, 14); }
    var t = aim * Math.PI / 180; g.fillStyle = C.green; g.beginPath(); g.arc(cx + 240 * Math.sin(t), cy - 240 * Math.cos(t), 10, 0, 7); g.fill();
    g.textAlign = "left"; g.fillStyle = C.ink; g.font = F(20, 600); g.fillText(N + " antenna" + (N > 1 ? "s" : "") + ": gain " + (10 * Math.log10(N)).toFixed(1) + " dB", 20, 30);
    g.fillStyle = C.green; g.font = F(18, 500); g.fillText("green: the phone", 20, 56);
    out.textContent = N + " antennas steered " + aim + "° to the " + (aim < 0 ? "left" : "right") + ": " + N + "× the power there, a narrower beam, less spilled elsewhere.";
  }
  k.slider("Antennas", 1, 16, 1, N, function (v) { return v; }, function (v) { N = +v; draw(); });
  k.slider("Phone direction", -60, 60, 1, aim, function (v) { return v + "°"; }, function (v) { aim = +v; draw(); });
  st.draw = draw; draw();
});
