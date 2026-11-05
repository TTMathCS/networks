/* books/networks/18: a resolver's cache. Visitors ask for one name at random times (made up, about one a minute); the
   first question goes to the authoritative server and the answer is kept for its TTL, so later ones are answered from
   the cache. At 20 minutes the record changes: visitors keep getting the old address until the cached copy expires. */
PLAY("ttlcache", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 230, st = k.stage(W, H), g = st.g, out = k.out(), ttl = 300, Q = [], seed = 11;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  for (var t = 0; t < 3600;) { t += -Math.log(1 - rnd()) * 60; Q.push(t); }
  function draw() {
    var x0 = 20, sx = 560 / 3600, until = -1, up = 0, stale = 0, cachedNew = false;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = C.red; g.setLineDash([5, 5]); g.beginPath(); g.moveTo(x0 + 1200 * sx, 40); g.lineTo(x0 + 1200 * sx, 170); g.stroke(); g.setLineDash([]);
    Q.forEach(function (q) {
      var miss = q >= until; if (miss) { until = q + ttl; up++; cachedNew = q >= 1200; }
      var old = !cachedNew && q >= 1200; if (old) stale++;
      g.fillStyle = miss ? C.gold : old ? C.red : C.ice; g.fillRect(x0 + q * sx - 2, miss ? 60 : 110, 4, 40);
      if (miss) { g.fillStyle = "rgba(246,196,83,0.15)"; g.fillRect(x0 + q * sx, 104, Math.min(ttl, 3600 - q) * sx, 4); }
    });
    g.textAlign = "left"; g.font = F(18, 600); g.fillStyle = C.gold; g.fillText("asked upstream: " + up, 20, 30); g.fillStyle = C.red; g.fillText("old address after the change: " + stale, 280, 30);
    g.fillStyle = C.ice; g.fillText("answered from the cache", 20, 196);
    g.fillStyle = C.ink3; g.font = F(16, 500); g.fillText("0", 20, 220); g.textAlign = "center"; g.fillText("record changes (20 min)", x0 + 1200 * sx, 220);
    out.textContent = "TTL " + (ttl >= 3600 ? ttl / 3600 + " h" : ttl / 60 + " min") + ": " + up + " of " + Q.length + " questions went upstream; " + stale + (stale === 1 ? " visitor" : " visitors") + " got the old address after the change.";
  }
  k.buttons([["5 min", function () { ttl = 300; draw(); }], ["1 min", function () { ttl = 60; draw(); }], ["30 min", function () { ttl = 1800; draw(); }], ["1 day", function () { ttl = 86400; draw(); }]], true);
  st.draw = draw; draw();
});
