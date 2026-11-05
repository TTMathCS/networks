/* books/security/12: the base-rate fallacy. Of a million events, a few are attacks; an alarm that catches most attacks and
   misfires on a small share of normal events still raises mostly false alarms when attacks are rare. Starts at the
   page's example: 99% caught, 1% false alarms, 1 attack in 10,000 events. */
PLAY("baserate", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 230, st = k.stage(W, H), g = st.g, out = k.out(), det = 99, fa = 1, rate = 4;
  function draw() {
    var N = 1e6, att = N / Math.pow(10, rate), tp = att * det / 100, fp = (N - att) * fa / 100, real = tp / (tp + fp);
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    g.fillStyle = C.ink3; g.font = F(18, 500); g.fillText("alarms in a million events", 20, 30);
    var tot = tp + fp, wR = tot ? 560 * tp / tot : 0;
    g.fillStyle = C.green; g.fillRect(20, 46, Math.max(wR, tp ? 2 : 0), 40); g.fillStyle = C.red; g.fillRect(20 + wR, 46, 560 - wR, 40);
    g.font = F(19, 600); g.fillStyle = C.green; g.fillText("real: " + Math.round(tp).toLocaleString("en"), 20, 116);
    g.fillStyle = C.red; g.textAlign = "right"; g.fillText("false: " + Math.round(fp).toLocaleString("en"), 580, 116);
    g.textAlign = "left"; g.fillStyle = C.ink; g.font = F(28, 700); g.fillText((real * 100).toFixed(real < 0.1 ? 2 : 0) + "% of alarms are real attacks", 20, 172);
    out.textContent = "1 attack in " + Math.pow(10, rate).toLocaleString("en") + " events, " + det + "% caught, " + fa + "% false alarms: " + (real * 100).toFixed(real < 0.1 ? 2 : 0) + "% of alarms are real.";
  }
  k.slider("Attacks caught", 50, 100, 1, det, function (v) { return v + "%"; }, function (v) { det = +v; draw(); });
  k.slider("False alarms on normal events", 0.01, 5, 0.01, fa, function (v) { return (+v).toFixed(2) + "%"; }, function (v) { fa = +v; draw(); });
  k.slider("How rare attacks are", 1, 6, 1, rate, function (v) { return "1 in " + Math.pow(10, v).toLocaleString("en"); }, function (v) { rate = +v; draw(); });
  st.draw = draw; draw();
});
