/* books/wireless/07: three Wi-Fi stations share the air with CSMA/CA. Each picks a random backoff of 0 to CW slots and
   counts down only while the air is idle; the first to reach zero sends, the others freeze. Two that reach zero together
   collide, double their window and try again. The backoff numbers are random; the timings are scaled. */
PLAY("csma", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 260, st = k.stage(W, H), g = st.g, out = k.out(), ev, seed = 4, cols = [C.gold, C.ice, C.green];
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function sim() {   // returns rows of [station, start slot, length, kind]
    seed = 4; var cw = [15, 15, 15], bo = [0, 0, 0].map(function () { return Math.floor(rnd() * 16); }), t = 0, rows = [], log = [], left = [2, 2, 2];
    while (t < 110) {
      var m = 99; for (var s = 0; s < 3; s++) if (left[s]) m = Math.min(m, bo[s]);
      if (m === 99) break;
      for (s = 0; s < 3; s++) if (left[s]) { if (m) rows.push([s, t, m, "wait"]); bo[s] -= m; }
      t += m; var go = []; for (s = 0; s < 3; s++) if (left[s] && bo[s] === 0) go.push(s);
      go.forEach(function (s) { rows.push([s, t, 12, go.length > 1 ? "clash" : "send"]); });
      log.push([t, go.length > 1 ? "Stations " + go.map(function (s) { return s + 1; }).join(" and ") + " collide: no ACK, window doubles." : "Station " + (go[0] + 1) + " sends; the others freeze their count."]);
      t += 14;
      go.forEach(function (s) { if (go.length > 1) cw[s] = Math.min(1023, cw[s] * 2 + 1); else { left[s]--; cw[s] = 15; } bo[s] = Math.floor(rnd() * (Math.min(cw[s], 40) + 1)); });
    }
    return { rows: rows, log: log, end: t };
  }
  ev = sim();
  function draw(tt) {
    var now = tt * ev.end, sx = 540 / ev.end; g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    for (var s = 0; s < 3; s++) { g.fillStyle = cols[s]; g.font = F(18, 600); g.textAlign = "left"; g.fillText("station " + (s + 1), 10, 50 + s * 64); g.strokeStyle = C.line; g.beginPath(); g.moveTo(30, 72 + s * 64); g.lineTo(580, 72 + s * 64); g.stroke(); }
    ev.rows.forEach(function (r) {
      if (r[1] > now) return; var w = Math.min(r[2], now - r[1]) * sx, x = 30 + r[1] * sx, y = 56 + r[0] * 64;
      g.fillStyle = r[3] === "wait" ? "rgba(244,230,212,0.12)" : r[3] === "clash" ? C.red : cols[r[0]]; g.fillRect(x, y, w, 16);
    });
    var msg = "Each station counts down a random backoff."; ev.log.forEach(function (l) { if (l[0] <= now) msg = l[1]; });
    out.textContent = msg;
    g.fillStyle = C.ink3; g.font = F(18, 500); g.textAlign = "left"; g.fillText("grey: counting down · colour: sending · red: collision", 10, 22);
  }
  var film = k.loop(12, draw, { label: "Time" });
  st.draw = function () { draw(film.t()); };
});
