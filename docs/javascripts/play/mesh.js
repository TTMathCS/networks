/* start/01-What-Is-a-Network.md: a small network of eight computers. Tap a link to cut it (tap again to mend it):
   a message from A to H finds another way round, as long as one is left. Fewest hops, found by breadth-first search. */
PLAY("mesh", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 300, st, out;
  var P = [[60, 150], [170, 60], [170, 240], [300, 150], [300, 40], [430, 60], [430, 240], [540, 150]], names = "ABCDEFGH";
  var E = [[0, 1], [0, 2], [1, 3], [2, 3], [1, 4], [4, 5], [3, 5], [3, 6], [2, 6], [5, 7], [6, 7], [3, 7]], cut = {};
  function path() {
    var prev = { 0: -1 }, q = [0];
    while (q.length) { var u = q.shift(); if (u === 7) break; E.forEach(function (e, i) { if (cut[i]) return; var v = e[0] === u ? e[1] : e[1] === u ? e[0] : -1; if (v >= 0 && !(v in prev)) { prev[v] = u; q.push(v); } }); }
    if (!(7 in prev)) return null; var p = [7]; while (p[0] !== 0) p.unshift(prev[p[0]]); return p;
  }
  function draw() {
    var g = st.g, p = path(); g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    E.forEach(function (e, i) {
      var on = p && p.some(function (v, j) { return j && ((p[j - 1] === e[0] && v === e[1]) || (p[j - 1] === e[1] && v === e[0])); });
      g.strokeStyle = cut[i] ? C.red : on ? C.gold : C.ink3; g.lineWidth = on ? 5 : 2; g.setLineDash(cut[i] ? [5, 6] : []);
      g.beginPath(); g.moveTo(P[e[0]][0], P[e[0]][1]); g.lineTo(P[e[1]][0], P[e[1]][1]); g.stroke(); g.setLineDash([]);
    });
    P.forEach(function (q, i) { g.fillStyle = i === 0 || i === 7 ? C.gold : C.mars; g.beginPath(); g.arc(q[0], q[1], 18, 0, 7); g.fill(); g.fillStyle = C.bg; g.font = F(15, 700); g.textAlign = "center"; g.fillText(names[i], q[0], q[1] + 5); });
    out.textContent = p ? "A to H: " + p.map(function (i) { return names[i]; }).join(" → ") + ", " + (p.length - 1) + " hops." : "No way left from A to H: the network is cut in two.";
  }
  st = k.stage(W, H, function (x, y) {
    var best = -1, bd = 22;
    E.forEach(function (e, i) { var a = P[e[0]], b = P[e[1]], dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy))), d = Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) { cut[best] = !cut[best]; draw(); }
  });
  out = k.out(); st.draw = draw;
  k.buttons([["Mend all", function () { cut = {}; draw(); }]]);
});
