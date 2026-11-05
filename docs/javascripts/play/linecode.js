/* books/networks/04: line coding. Type some bits and see them as NRZ (high for 1, low for 0) and Manchester (a
   transition in the middle of every bit, low-to-high for 1, as on 10 Mbit/s Ethernet). The dotted lines are the bit
   clock; long runs in NRZ give the receiver no edges to keep time by. */
PLAY("linecode", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 260, st = k.stage(W, H), g = st.g, out = k.out(), bits = "1100000001011";
  function wave(y0, fn, col, label) {
    var n = bits.length, bw = 520 / n, x0 = 60; g.strokeStyle = col; g.lineWidth = 3; g.beginPath();
    var pts = []; for (var i = 0; i < n; i++) fn(+bits[i], i).forEach(function (p) { pts.push([x0 + (i + p[0]) * bw, y0 - p[1] * 40]); });
    pts.forEach(function (p, j) { if (!j) g.moveTo(p[0], p[1]); else { g.lineTo(p[0], pts[j - 1][1]); g.lineTo(p[0], p[1]); } }); g.lineTo(x0 + n * bw, pts[pts.length - 1][1]); g.stroke();
    g.fillStyle = C.ink2; g.font = F(14, 600); g.textAlign = "left"; g.fillText(label, 10, y0 - 50);
  }
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var n = bits.length, bw = 520 / n;
    g.strokeStyle = C.line; g.setLineDash([2, 4]); for (var i = 0; i <= n; i++) { g.beginPath(); g.moveTo(60 + i * bw, 30); g.lineTo(60 + i * bw, 240); g.stroke(); } g.setLineDash([]);
    g.font = F(15, 700); g.textAlign = "center"; g.fillStyle = C.ink; for (i = 0; i < n; i++) g.fillText(bits[i], 60 + (i + 0.5) * bw, 26);
    wave(120, function (b) { return [[0, b]]; }, C.gold, "NRZ");
    wave(230, function (b) { return [[0, b ? 0 : 1], [0.5, b ? 1 : 0]]; }, C.ice, "Manchester");
    var run = 0, best = 0; for (i = 0; i < n; i++) { run = i && bits[i] === bits[i - 1] ? run + 1 : 1; best = Math.max(best, run); }
    out.textContent = "Longest run of the same bit: " + best + ". NRZ has no edge for " + best + " bit times; Manchester has one in every bit, at twice the signalling rate.";
  }
  st.draw = draw;
  k.text("Bits", bits, function (v) { var b = v.replace(/[^01]/g, "").slice(0, 24); bits = b || "0"; draw(); });
});
