/* books/wireless/01: wavelength λ = c/f. Slide the frequency from 100 kHz to 100 GHz (a log scale): the drawn wave
   shrinks, with the band names and examples from the table on this page. */
PLAY("wavelength", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 230, st = k.stage(W, H), g = st.g, out = k.out(), lf = 9.38;   // log10 of 2.4 GHz
  var B = [[3e4, "LF", "time signals"], [3e6, "HF", "shortwave"], [3e7, "VHF", "FM radio"], [3e8, "UHF", "2.4 GHz Wi-Fi, GPS"], [3e9, "SHF", "5 GHz Wi-Fi, X band"], [3e10, "EHF", "5G mmWave"]];
  function nice(m) { return m >= 1000 ? +(m / 1000).toPrecision(3) + " km" : m >= 1 ? +m.toPrecision(3) + " m" : m >= 0.01 ? +(m * 100).toPrecision(3) + " cm" : +(m * 1000).toPrecision(3) + " mm"; }
  function fq(f) { return f >= 1e9 ? +(f / 1e9).toPrecision(3) + " GHz" : f >= 1e6 ? +(f / 1e6).toPrecision(3) + " MHz" : +(f / 1e3).toPrecision(3) + " kHz"; }
  function draw() {
    var f = Math.pow(10, lf), lam = 3e8 / f, band = B[0];
    B.forEach(function (b) { if (f >= b[0]) band = b; });
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var cyc = Math.max(0.5, Math.min(60, 1 + (lf - 5) * 6));   // more cycles on screen as the wave gets shorter
    g.strokeStyle = C.gold; g.lineWidth = 3; g.beginPath();
    for (var x = 20; x <= 580; x++) { var y = 120 - 50 * Math.sin((x - 20) / 560 * cyc * 2 * Math.PI); if (x === 20) g.moveTo(x, y); else g.lineTo(x, y); }
    g.stroke();
    g.textAlign = "left"; g.fillStyle = C.ink; g.font = F(26, 700); g.fillText(fq(f) + "  →  λ = " + nice(lam), 20, 40);
    g.fillStyle = C.ice; g.font = F(20, 600); g.fillText(band[1] + ": " + band[2], 20, 210);
    out.textContent = "At " + fq(f) + " one wave is " + nice(lam) + " long (3×10⁸ m/s ÷ " + fq(f) + ").";
  }
  k.slider("Frequency", 5, 11, 0.02, lf, function (v) { return fq(Math.pow(10, v)); }, function (v) { lf = +v; draw(); });
  st.draw = draw; draw();
});
