/* start/02-Packets.md: a message cut into six numbered packets. They take different roads through the network, arrive
   out of order and are put back in order by number; one is lost on the way, so the receiver asks for it again. */
PLAY("packets", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 300, st = k.stage(W, H), g = st.g, out = k.out(), MSG = "HELLO MARS FROM EARTH!", N = 6;
  var routes = [[[40, 150], [200, 60], [400, 60], [560, 150]], [[40, 150], [300, 150], [560, 150]], [[40, 150], [200, 240], [400, 240], [560, 150]]];
  var plan = [[0, 0, 0.00], [1, 1, 0.05], [2, 2, 0.10], [3, 1, 0.15], [4, 0, 0.20], [5, 2, 0.25], [2, 1, 0.62]];   // packet, road, start; packet 2's first try is lost
  function at(r, u) { var pts = routes[r], segs = pts.length - 1, s = Math.min(segs - 1, Math.floor(u * segs)), f = u * segs - s; return [pts[s][0] + (pts[s + 1][0] - pts[s][0]) * f, pts[s][1] + (pts[s + 1][1] - pts[s][1]) * f]; }
  function piece(i) { var n = Math.ceil(MSG.length / N); return MSG.substr(i * n, n); }
  function draw(t) {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    routes.forEach(function (r) { g.strokeStyle = C.line; g.lineWidth = 3; g.beginPath(); r.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke(); r.slice(1, -1).forEach(function (p) { g.fillStyle = C.ink3; g.beginPath(); g.arc(p[0], p[1], 7, 0, 7); g.fill(); }); });
    var got = {};
    plan.forEach(function (p, j) {
      var u = (t - p[2]) / [0.3, 0.22, 0.34][p[1]]; if (u < 0) return;
      var lost = j === 2; if (lost && u > 0.5) { var q = at(p[1], 0.5); g.strokeStyle = C.red; g.lineWidth = 3; g.beginPath(); g.moveTo(q[0] - 8, q[1] - 8); g.lineTo(q[0] + 8, q[1] + 8); g.moveTo(q[0] + 8, q[1] - 8); g.lineTo(q[0] - 8, q[1] + 8); g.stroke(); return; }
      if (u >= 1) { got[p[0]] = true; return; }
      var q2 = at(p[1], u); g.fillStyle = j === 6 ? C.green : C.gold; g.fillRect(q2[0] - 13, q2[1] - 11, 26, 22); g.fillStyle = C.bg; g.font = F(14, 700); g.textAlign = "center"; g.fillText(p[0] + 1, q2[0], q2[1] + 5);
    });
    g.fillStyle = C.ink; g.font = F(14, 600); g.textAlign = "left"; g.fillText("sender", 16, 190); g.textAlign = "right"; g.fillText("receiver", 590, 190);
    var line = ""; for (var i = 0; i < N; i++) line += got[i] ? piece(i) : piece(i).replace(/./g, "_");
    g.textAlign = "left"; g.font = F(18, 600, "m"); g.fillStyle = C.ink; g.fillText(line, 20, 284);
    var n = Object.keys(got).length;
    out.textContent = t > 0.5 && !got[2] ? "Packet 3 was lost. The receiver notices the gap and asks for it again." : n === N ? "All six arrived, out of order, and were put back in order by their numbers." : n + " of " + N + " packets in.";
  }
  var film = k.loop(12, draw, { label: "Time" });
  st.draw = function () { draw(film.t()); };
});
