/* start/04-Wires-and-Radio.md: a race over 1,000 km. Radio through the air travels at nearly 300,000 km a second; light
   in glass at about 200,000 km a second, two-thirds as fast (electrical signals in copper are about as quick). Slowed a
   million times so it can be seen: 3.3 ms against 5 ms. */
PLAY("lightspeed", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 220, st = k.stage(W, H), g = st.g, out = k.out(), D = 1000;
  function draw(t) {
    var ms = t * 6, x0 = 40, x1 = 560;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    [["radio, air", 300000, C.ice, 70], ["light, glass fibre", 200000, C.gold, 150]].forEach(function (r) {
      var done = D / r[1] * 1000, f = Math.min(1, ms / done);
      g.strokeStyle = C.line; g.lineWidth = 4; g.beginPath(); g.moveTo(x0, r[3]); g.lineTo(x1, r[3]); g.stroke();
      g.fillStyle = r[2]; g.beginPath(); g.arc(x0 + (x1 - x0) * f, r[3], 9, 0, 7); g.fill();
      g.font = F(15, 600); g.textAlign = "left"; g.fillStyle = C.ink; g.fillText(r[0], x0, r[3] - 18);
      g.textAlign = "right"; g.fillStyle = f >= 1 ? r[2] : C.ink3; g.fillText(f >= 1 ? "there in " + done.toFixed(1) + " ms" : "", x1, r[3] - 18);
    });
    g.fillStyle = C.ink3; g.font = F(13, 500); g.textAlign = "left"; g.fillText("0 km", x0, 200); g.textAlign = "right"; g.fillText("1,000 km", x1, 200);
    out.textContent = (ms).toFixed(1) + " ms after the start.";
  }
  var film = k.loop(6, draw, { label: "Time" });
  st.draw = function () { draw(film.t()); };
});
