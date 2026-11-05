/* books/math/04: a minimum spanning tree by Kruskal's method. Take the links from cheapest up, and keep each one unless
   it would close a loop. The kept links join every node at the lowest total cost. */
PLAY("kruskal", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 280, st = k.stage(W, H), g = st.g, out = k.out();
  var P = [[60, 140], [180, 50], [180, 230], [320, 140], [450, 50], [450, 230], [550, 140]];
  var E = [[0, 1, 4], [0, 2, 3], [1, 2, 5], [1, 3, 6], [2, 3, 2], [3, 4, 7], [3, 5, 4], [4, 5, 3], [4, 6, 2], [5, 6, 6], [1, 4, 9]].sort(function (a, b) { return a[2] - b[2]; });
  function draw(t) {
    var n = Math.min(E.length, Math.floor(t * (E.length + 0.999))), parent = P.map(function (_, i) { return i; }), keep = [], cost = 0;
    function find(x) { while (parent[x] !== x) x = parent[x]; return x; }
    for (var i = 0; i < n; i++) { var e = E[i], a = find(e[0]), b = find(e[1]); if (a !== b) { parent[a] = b; keep[i] = true; cost += e[2]; } else keep[i] = false; }
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    E.forEach(function (e, i) {
      var a = P[e[0]], b = P[e[1]]; g.strokeStyle = i >= n ? C.line : keep[i] ? C.gold : "rgba(217,96,59,0.5)"; g.lineWidth = i < n && keep[i] ? 5 : 2; g.setLineDash(i < n && !keep[i] ? [5, 5] : []);
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.setLineDash([]);
      g.fillStyle = C.bg; g.beginPath(); g.arc((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 11, 0, 7); g.fill(); g.fillStyle = C.ink2; g.font = F(18, 700); g.textAlign = "center"; g.fillText(e[2], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 5);
    });
    P.forEach(function (p) { g.fillStyle = C.mars; g.beginPath(); g.arc(p[0], p[1], 13, 0, 7); g.fill(); });
    var last = n ? E[n - 1] : null;
    out.textContent = last ? "Link of cost " + last[2] + ": " + (keep[n - 1] ? "kept." : "skipped, it would close a loop.") + " Total so far " + cost + "." : "Links will be taken from cheapest up.";
  }
  var film = k.loop(11, draw, { label: "Links" });
  st.draw = function () { draw(film.t()); };
});
