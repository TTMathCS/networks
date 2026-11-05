/* books/math/09: Jain's fairness index, J = (Σx)² / (n·Σx²), for four flows sharing a link. Drag the sliders: J is 1
   when all four rates are equal and 1/4 when one flow takes everything. The rates are examples. */
PLAY("jain", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 220, st = k.stage(W, H), g = st.g, out = k.out(), x = [25, 25, 25, 25], cols = [C.gold, C.ice, C.green, C.rust];
  function draw() {
    var s = 0, s2 = 0; x.forEach(function (v) { s += v; s2 += v * v; }); var J = s2 ? s * s / (4 * s2) : 1;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    x.forEach(function (v, i) {
      var bx = 40 + i * 90, h = v * 1.4; g.fillStyle = cols[i]; g.fillRect(bx, 170 - h, 60, h);
      g.fillStyle = C.ink2; g.font = F(18, 600); g.textAlign = "center"; g.fillText("flow " + (i + 1), bx + 30, 198); g.fillText(v, bx + 30, 160 - h);
    });
    g.textAlign = "left"; g.fillStyle = C.ink3; g.font = F(19, 500); g.fillText("Jain's index", 420, 50);
    g.fillStyle = J > 0.9 ? C.green : J > 0.6 ? C.gold : C.red; g.font = F(46, 700, "m"); g.fillText(J.toFixed(2), 420, 104);
    g.fillStyle = C.ink3; g.font = F(18, 500); g.fillText("1 = all equal", 420, 136); g.fillText("0.25 = one takes all", 420, 162);
    out.textContent = "Rates " + x.join(", ") + " Mbit/s: J = " + J.toFixed(2) + ".";
  }
  var sls = x.map(function (v, i) { return k.slider("Flow " + (i + 1), 0, 100, 1, v, function (v) { return v + " Mbit/s"; }, function (v) { x[i] = +v; draw(); }); });
  k.buttons([["Equal", function () { x = [25, 25, 25, 25]; sync(); }], ["One hog", function () { x = [100, 0, 0, 0]; sync(); }], ["Uneven", function () { x = [60, 20, 15, 5]; sync(); }]]);
  function sync() { sls.forEach(function (s, i) { s.value = x[i]; s.dispatchEvent(new Event("input")); }); }
  st.draw = draw; draw();
});
