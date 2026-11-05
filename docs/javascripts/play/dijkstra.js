/* books/networks/12: router u runs Dijkstra's algorithm on the page's example network. Each step makes the closest
   router not yet final final, and updates its neighbours. Cut a link to see the answer change. */
PLAY("dijkstra", function (fig, k) {
  var C = k.C, F = k.F, W = 640, H = 330, st = k.stage(W, H), g = st.g, out = k.out();
  var P = { u: [60, 170], v: [220, 70], x: [220, 270], w: [420, 70], y: [420, 270], z: [580, 170] };
  var all = [["u", "v", 2], ["u", "x", 1], ["u", "w", 5], ["v", "x", 2], ["v", "w", 3], ["x", "w", 3], ["x", "y", 1], ["w", "y", 1], ["w", "z", 5], ["y", "z", 2]];
  var cut = null, names = ["u", "v", "w", "x", "y", "z"], steps;
  function run() {   // every state of the algorithm, one per step
    var E = all.filter(function (e) { return !cut || e[0] + e[1] !== cut; }), D = {}, prev = {}, done = [], res = [];
    names.forEach(function (n) { D[n] = Infinity; }); D.u = 0;
    while (done.length < names.length) {
      var best = null;
      names.forEach(function (n) { if (done.indexOf(n) < 0 && D[n] < Infinity && (!best || D[n] < D[best])) best = n; });
      if (!best) break;
      done.push(best);
      E.forEach(function (e) {
        var o = e[0] === best ? e[1] : e[1] === best ? e[0] : null;
        if (o && done.indexOf(o) < 0 && D[best] + e[2] < D[o]) { D[o] = D[best] + e[2]; prev[o] = best; }
      });
      res.push({ done: done.slice(), D: JSON.parse(JSON.stringify(D, function (k2, v) { return v === Infinity ? null : v; })), prev: Object.assign({}, prev), E: E, last: best });
    }
    return res;
  }
  function draw(t) {
    var s = steps[Math.min(steps.length - 1, Math.floor(t * steps.length * 0.999))];
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.lineCap = "round";
    s.E.forEach(function (e) {
      var a = P[e[0]], b = P[e[1]], tree = s.prev[e[1]] === e[0] || s.prev[e[0]] === e[1];
      var fin = tree && s.done.indexOf(s.prev[e[1]] === e[0] ? e[1] : e[0]) >= 0;
      g.strokeStyle = fin ? C.gold : C.line; g.lineWidth = fin ? 5 : 2;
      g.beginPath();
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
      g.stroke();
      g.fillStyle = C.bg; g.beginPath(); g.arc(mx, my, 12, 0, 7); g.fill();
      g.fillStyle = C.ink2; g.font = F(14, 600); g.textAlign = "center"; g.fillText(e[2], mx, my + 5);
    });
    names.forEach(function (n) {
      var p = P[n], f = s.done.indexOf(n) >= 0;
      g.fillStyle = n === s.last ? C.gold : f ? C.rust : C.bg2; g.strokeStyle = f ? C.rust : C.ink3; g.lineWidth = 2;
      g.beginPath(); g.arc(p[0], p[1], 22, 0, 7); g.fill(); g.stroke();
      g.fillStyle = f ? C.bg : C.ink; g.font = F(18, 700); g.textAlign = "center"; g.fillText(n, p[0], p[1] + 6);
      var d = s.D[n]; g.font = F(14, 600); g.fillStyle = f ? C.gold : C.ink3;
      g.fillText(d === null ? "∞" : d, p[0], p[1] + (p[1] < 170 ? -32 : 46));
    });
    var path = [], z = "z"; while (z && s.done.indexOf("z") >= 0) { path.unshift(z); z = s.prev[z]; }
    out.textContent = "Step " + (s.done.length - 1) + ": final " + s.done.join(" ") + "." +
      (path.length ? " u reaches z at cost " + s.D.z + " via " + path.join(" → ") + ", so its next hop for z is " + path[1] + "." : "");
  }
  steps = run();
  var film = k.loop(9, draw, { label: "Step" });
  st.draw = function () { draw(film.t()); };
  function set(c) { cut = c; steps = run(); draw(film.t()); }
  k.buttons([["All links up", function () { set(null); }], ["x–y fails", function () { set("xy"); }], ["y–z fails", function () { set("yz"); }]], true);
});
