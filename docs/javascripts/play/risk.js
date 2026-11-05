/* books/security/01: risk = likelihood × impact, with this page's example (a 10% yearly chance of a breach costing
   2 million dollars) as the starting point. The yearly expected loss tells you how much a fix is worth. */
PLAY("risk", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 220, st = k.stage(W, H), g = st.g, out = k.out(), p = 10, cost = 2, fix = 50, cut = 80;
  function money(m) { return m >= 1e6 ? "$" + (m / 1e6).toFixed(2).replace(/\.?0+$/, "") + " million" : "$" + Math.round(m).toLocaleString("en"); }
  function draw() {
    var loss = p / 100 * cost * 1e6, saved = loss * cut / 100, worth = saved > fix * 1000;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    g.fillStyle = C.ink3; g.font = F(18, 600); g.fillText("expected loss a year", 20, 32);
    g.fillStyle = C.gold; g.font = F(34, 700); g.fillText(money(loss), 20, 72);
    g.fillStyle = C.ink3; g.font = F(18, 600); g.fillText("a " + money(fix * 1000) + " fix that cuts the chance by " + cut + "% saves", 20, 120);
    g.fillStyle = worth ? C.green : C.red; g.font = F(28, 700); g.fillText(money(saved) + " a year: " + (worth ? "worth it" : "not worth it"), 20, 158);
    out.textContent = p + "% × " + money(cost * 1e6) + " = " + money(loss) + " a year.";
  }
  k.slider("Chance per year", 1, 100, 1, p, function (v) { return v + "%"; }, function (v) { p = +v; draw(); });
  k.slider("Cost of a breach", 0.1, 10, 0.1, cost, function (v) { return "$" + (+v).toFixed(1) + " million"; }, function (v) { cost = +v; draw(); });
  st.draw = draw; draw();
});
