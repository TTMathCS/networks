/* books/networks/19: head-of-line blocking. Three responses share one connection and one packet of the first is lost.
   Over TCP (HTTP/2) the bytes must arrive in order, so all three wait for the resend; over QUIC (HTTP/3) only the stream
   that lost the packet waits. Timings are scaled: the resend comes one round trip later. */
PLAY("hol", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 260, st = k.stage(W, H), g = st.g, out = k.out(), cols = [C.gold, C.ice, C.green];
  var P = []; for (var i = 0; i < 12; i++) P.push([i % 3, i]);   // packet i belongs to stream i % 3, sent at time i
  var LOST = 3, RESEND = 16;
  function done(quic) {   // time each stream's last byte can be handed to the browser
    var r = [0, 0, 0];
    P.forEach(function (p) { var arr = p[1] === LOST ? RESEND : p[1] + 1, deliver = quic ? (p[0] === P[LOST][0] && p[1] > LOST ? Math.max(arr, RESEND) : arr) : (p[1] > LOST ? Math.max(arr, RESEND) : arr); r[p[0]] = Math.max(r[p[0]], deliver); });
    return r;
  }
  function lane(y, quic, t) {
    var d = done(quic), x0 = 150, sx = 24;
    g.textAlign = "left"; g.fillStyle = C.ink; g.font = F(19, 700); g.fillText(quic ? "QUIC" : "TCP", 20, y + 4); g.fillStyle = C.ink3; g.font = F(16, 500); g.fillText(quic ? "(HTTP/3)" : "(HTTP/2)", 20, y + 26);
    for (var s = 0; s < 3; s++) {
      var yy = y - 20 + s * 22, end = Math.min(d[s], t);
      g.fillStyle = "rgba(244,230,212,0.08)"; g.fillRect(x0, yy, 18 * sx, 16);
      g.fillStyle = cols[s]; g.fillRect(x0, yy, end * sx, 16);
      if (t >= d[s]) { g.fillStyle = C.ink; g.font = F(16, 600); g.fillText("✓ " + d[s], x0 + d[s] * sx + 6, yy + 14); }
    }
  }
  function draw(tt) {
    var t = tt * 18; g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    lane(70, false, t); lane(180, true, t);
    g.fillStyle = C.red; g.font = F(17, 600); g.textAlign = "left"; g.fillText("one packet of the gold response is lost; its resend arrives at " + RESEND, 20, 22);
    var a = done(false), b = done(true);
    out.textContent = "All finished: TCP at " + Math.max.apply(null, a) + ", QUIC at " + Math.max.apply(null, b) + "; but over QUIC the blue and green responses were ready at " + b[1] + " and " + b[2] + " instead of " + a[1] + " and " + a[2] + ".";
  }
  var film = k.loop(9, draw, { label: "Time" });
  st.draw = function () { draw(film.t()); };
});
