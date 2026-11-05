/* books/networks/07: a broadcast storm. Three switches joined in a triangle for spare capacity; one broadcast enters and
   each switch floods it out of every other port. Ethernet frames have no hop count, so the copies go round forever.
   With Spanning Tree, one port blocks and each switch gets the broadcast once. */
PLAY("storm", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 270, st = k.stage(W, H), g = st.g, out = k.out(), stp = false;
  var S = [[300, 55], [140, 190], [400, 190]], L = [[0, 1], [0, 2], [1, 2]];
  function copies(step) {   // frames in flight on each link direction after a number of steps
    var cur = [[0, 1], [0, 2]], total = 2;   // the host on switch 0 sent a broadcast: switch 0 floods to 1 and 2
    for (var s = 0; s < step; s++) {
      var nx = [];
      cur.forEach(function (c) { var at = c[1]; L.forEach(function (l) { var o = l[0] === at ? l[1] : l[1] === at ? l[0] : -1; if (o < 0 || o === c[0]) return; if (stp && ((at === 1 && o === 2) || (at === 2 && o === 1))) return; nx.push([at, o]); }); });
      cur = nx; total += nx.length;
    }
    return { cur: cur, total: total };
  }
  function draw(t) {
    var step = Math.floor(t * 12), c = copies(step), u = t * 12 - step;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    L.forEach(function (l) { var a = S[l[0]], b = S[l[1]], blk = stp && l[0] === 1 && l[1] === 2; g.strokeStyle = blk ? C.red : C.line; g.lineWidth = 4; g.setLineDash(blk ? [8, 8] : []); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.setLineDash([]); });
    c.cur.forEach(function (f, i) { var a = S[f[0]], b = S[f[1]], off = (i % 3) * 6 - 6; g.fillStyle = C.gold; g.beginPath(); g.arc(a[0] + (b[0] - a[0]) * u + off, a[1] + (b[1] - a[1]) * u + off, 8, 0, 7); g.fill(); });
    S.forEach(function (p, i) { g.fillStyle = C.ice; g.fillRect(p[0] - 22, p[1] - 16, 44, 32); g.fillStyle = C.bg; g.font = F(18, 700); g.textAlign = "center"; g.fillText("S" + (i + 1), p[0], p[1] + 6); });
    if (stp) { g.fillStyle = C.red; g.font = F(18, 600); g.fillText("blocked", 270, 222); }
    g.textAlign = "left"; g.fillStyle = C.ink; g.font = F(20, 700); g.fillText("copies sent so far: " + c.total, 20, 30);
    out.textContent = stp ? "Spanning Tree blocks one port: the broadcast reaches each switch once, then stops." : c.cur.length ? "No hop count, so the copies circle forever: " + c.total + " sent and counting." : "";
  }
  var film = k.loop(10, draw, { label: "Time" });
  k.buttons([["Loop, no STP", function () { stp = false; film.set(0); film.play(); }], ["With Spanning Tree", function () { stp = true; film.set(0); film.play(); }]], true);
  st.draw = function () { draw(film.t()); };
});
