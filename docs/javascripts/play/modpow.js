/* books/math/10: square-and-multiply, the page's example 3^13 mod n. Write the exponent in binary; at each bit square,
   and multiply by the base when the bit is 1. Press Play to step through; type another exponent to try it. */
PLAY("modpow", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 280, st = k.stage(W, H), g = st.g, out = k.out(), a = 3, e = 13, n = 1000;
  function steps() {
    var bits = e.toString(2), r = [], v = 1, p = 0;
    for (var i = 0; i < bits.length; i++) {
      if (i) { v = v * v % n; p *= 2; r.push(["square", p, v, i]); }
      if (bits[i] === "1") { v = i ? v * a % n : a % n; p += 1; r.push([i ? "× " + a : "start", p, v, i]); }
    }
    return { bits: bits, r: r };
  }
  function draw(t) {
    var s = steps(), shown = Math.max(1, Math.ceil(t * s.r.length)), last = s.r[shown - 1];
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.textAlign = "left"; g.fillStyle = C.ink3; g.font = F(19, 500); g.fillText(e + " in binary:", 20, 34);
    for (var i = 0; i < s.bits.length; i++) { var on = i <= last[3]; g.fillStyle = on ? (s.bits[i] === "1" ? C.gold : C.ice) : C.ink3; g.font = F(30, 700, "m"); g.fillText(s.bits[i], 150 + i * 26, 38); }
    var rows = s.r.slice(Math.max(0, shown - 6), shown);
    rows.forEach(function (row, j) {
      var y = 84 + j * 32, cur = j === rows.length - 1; g.font = F(20, cur ? 700 : 500, "m"); g.fillStyle = cur ? C.gold : C.ink2;
      g.fillText((row[0] + "      ").slice(0, 7), 20, y); g.fillText(a + "^" + row[1], 140, y); g.fillText("≡ " + row[2] + "  (mod " + n + ")", 280, y);
    });
    out.textContent = shown === s.r.length ? a + "^" + e + " mod " + n + " = " + last[2] + " in " + (s.r.length - 1) + " steps, not " + (e - 1) + "." : "Step " + shown + " of " + s.r.length + ".";
  }
  var film = k.loop(9, draw, { label: "Steps" });
  k.text("Exponent", e, function (v) { var m = parseInt(v, 10); if (m >= 1 && m <= 100000 && m !== e) { e = m; film.set(1); } });
  st.draw = function () { draw(film.t()); };
});
