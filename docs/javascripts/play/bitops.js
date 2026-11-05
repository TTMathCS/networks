/* books/math/01: bitwise operations on two bytes. Tap any bit to flip it, then choose AND, OR or XOR: each answer bit
   depends only on the two bits above it. AND with a mask keeps the bits where the mask has 1s, which is how a prefix
   picks the network part of an address. */
PLAY("bitops", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 230, st, out, a = 202, b = 240, op = "AND";
  function res() { return op === "AND" ? a & b : op === "OR" ? a | b : a ^ b; }
  function row(v, y, lab, col, tap) {
    var g = st.g; g.fillStyle = C.ink2; g.font = F(20, 600); g.textAlign = "left"; g.fillText(lab, 16, y + 24);
    for (var i = 0; i < 8; i++) { var bit = (v >> (7 - i)) & 1, x = 130 + i * 46; g.fillStyle = bit ? col : C.bg2; g.fillRect(x, y, 40, 36); g.fillStyle = bit ? C.bg : C.ink3; g.font = F(25, 700, "m"); g.textAlign = "center"; g.fillText(bit, x + 20, y + 25); }
    g.fillStyle = C.ink; g.font = F(22, 600, "m"); g.textAlign = "right"; g.fillText(v, 590, y + 24);
  }
  function draw() { var g = st.g; g.fillStyle = C.bg; g.fillRect(0, 0, W, H); row(a, 20, "A", C.gold, 1); row(b, 70, "B", C.ice, 1); g.strokeStyle = C.ink3; g.beginPath(); g.moveTo(130, 120); g.lineTo(500, 120); g.stroke(); row(res(), 134, "A " + op + " B", C.green); out.textContent = op === "AND" ? "1 only where both are 1." : op === "OR" ? "1 where either is 1." : "1 where they differ: XOR twice with the same B gets A back."; }
  st = k.stage(W, H, function (x, y) { var i = Math.floor((x - 130) / 46); if (i < 0 || i > 7) return; if (y > 20 && y < 56) a ^= 1 << (7 - i); else if (y > 70 && y < 106) b ^= 1 << (7 - i); draw(); });
  out = k.out(); st.draw = draw;
  k.buttons([["AND", function () { op = "AND"; draw(); }], ["OR", function () { op = "OR"; draw(); }], ["XOR", function () { op = "XOR"; draw(); }]], true);
});
