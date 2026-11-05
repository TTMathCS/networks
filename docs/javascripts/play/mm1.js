/* books/math/03: the M/M/1 queue. Packets arrive at random at rate λ and are served at random at rate μ. The average
   time in the system is 1/(μ − λ): it blows up as the load ρ = λ/μ nears 1. Press Play to watch a simulated queue at the
   load you choose (μ = 1 packet per time unit). */
PLAY("mm1", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 270, st = k.stage(W, H), g = st.g, out = k.out(), rho = 0.8, trace, seed = 9;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function sim() { seed = 9; var t = 0, q = 0, next = -Math.log(rnd()) / rho, done = Infinity, tr = []; while (t < 200) { var e = Math.min(next, done); t = e; if (e === next) { q++; next = t - Math.log(rnd()) / rho; if (q === 1) done = t - Math.log(rnd()); } else { q--; done = q ? t - Math.log(rnd()) : Infinity; } tr.push([t, q]); } return tr; }
  function draw(tt) {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var X0 = 40, X1 = 330, Y0 = 230, Y1 = 30, x = function (r) { return X0 + r * (X1 - X0); }, y = function (d) { return Y0 - Math.min(d, 20) / 20 * (Y0 - Y1); };
    g.strokeStyle = C.ink3; g.beginPath(); g.moveTo(X0, Y1); g.lineTo(X0, Y0); g.lineTo(X1, Y0); g.stroke();
    g.strokeStyle = C.gold; g.lineWidth = 2.5; g.beginPath(); for (var r = 0; r < 0.96; r += 0.01) { if (r) g.lineTo(x(r), y(1 / (1 - r))); else g.moveTo(x(0), y(1)); } g.stroke();
    g.fillStyle = C.ink; g.beginPath(); g.arc(x(rho), y(1 / (1 - rho)), 6, 0, 7); g.fill();
    g.font = F(18, 500); g.fillStyle = C.ink3; g.textAlign = "center"; g.fillText("load ρ →", 185, 252); g.textAlign = "left"; g.fillText("time in system", X0 + 4, Y1 - 8);
    var T = tt * 200, q = 0; for (var i = 0; i < trace.length && trace[i][0] <= T; i++) q = trace[i][1];
    g.fillStyle = C.ink; g.font = F(21, 600); g.fillText("queue now: " + q, 370, 50);
    for (var j = 0; j < Math.min(q, 24); j++) { g.fillStyle = j ? C.ice : C.gold; g.fillRect(370 + (j % 8) * 26, 70 + Math.floor(j / 8) * 30, 22, 24); }
    out.textContent = "ρ = " + rho.toFixed(2) + ": average time in the system " + (1 / (1 - rho)).toFixed(1) + " service times.";
  }
  trace = sim();
  var film = k.loop(15, draw, { label: "Time", start0: true });
  st.draw = function () { draw(film.t()); };
  k.slider("Load ρ", 0.1, 0.95, 0.05, rho, function (v) { return v.toFixed(2); }, function (v) { rho = v; trace = sim(); draw(film.t()); });
});
