/* books/wireless/03: two copies of a 2.4 GHz signal, one direct and one reflected at 70% of its strength, reach a laptop
   you slide along a 30 cm desk. Where the paths differ by half a wavelength (about 6 cm) they cancel: a deep fade. The
   room is made up; the wavelength is the real 12.5 cm. */
PLAY("multipath", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 250, st = k.stage(W, H), g = st.g, out = k.out(), pos = 0.4, lam = 0.125, refl = 0.7;
  function amp(p) {   // laptop 4 m from the router; the reflection comes back off a wall 1 m behind the laptop
    var x = 4 + 0.3 * p, d1 = x, d2 = x + 2 * (5 - x), ph = 2 * Math.PI * (d2 - d1) / lam + Math.PI;
    var re = 1 + refl * Math.cos(ph), im = refl * Math.sin(ph); return Math.sqrt(re * re + im * im);
  }
  function db(a) { return 20 * Math.log10(Math.max(a, 1e-3)); }
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var y0 = 70, sc = 8;
    g.strokeStyle = C.line; g.lineWidth = 1; g.beginPath(); g.moveTo(30, y0); g.lineTo(570, y0); g.stroke();
    g.strokeStyle = C.ice; g.lineWidth = 3; g.beginPath();
    for (var i = 0; i <= 540; i++) { var v = db(amp(i / 540)); var y = y0 - sc * v; if (!i) g.moveTo(30 + i, y); else g.lineTo(30 + i, y); }
    g.stroke();
    var a = amp(pos), d = db(a), px = 30 + pos * 540;
    g.fillStyle = C.gold; g.beginPath(); g.arc(px, y0 - sc * d, 8, 0, 7); g.fill();
    g.fillStyle = C.ink3; g.font = F(18, 500); g.textAlign = "left"; g.fillText("signal against the direct path alone", 30, 30);
    g.textAlign = "right"; g.fillText("0 dB", 590, y0 - 6);
    out.textContent = "Here the signal is " + (d >= 0 ? d.toFixed(0) + " dB stronger" : (-d).toFixed(0) + " dB weaker") + " than the direct path alone" + (d < -8 ? ": a fade. Move a few centimetres." : ".");
  }
  k.slider("Laptop position", 0, 100, 1, pos * 100, function (v) { return (v * 0.3).toFixed(0) + " cm"; }, function (v) { pos = v / 100; draw(); });
  st.draw = draw; draw();
});
