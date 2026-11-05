/* books/security/08: the TLS 1.3 handshake on a time line, after TCP's own round trip. The client's first message already
   carries its key share, so keys exist after one TLS round trip and the request goes with the client's Finished. Choose
   the round-trip time to see when the first request can leave. */
PLAY("tls13", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 330, st = k.stage(W, H), g = st.g, out = k.out(), rtt = 80;
  var M = [[0, "TCP SYN", C.ink3], [1, "SYN-ACK", C.ink3], [0, "ACK + ClientHello (key share)", C.gold], [1, "ServerHello … Finished 🔒", C.gold], [0, "Finished + request 🔒", C.ice]];
  function draw(t) {
    var n = M.length, i = Math.min(n - 1, Math.floor(t * n)), u = Math.min(1, (t * n - i) * 1.3);
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = C.ink3; g.lineWidth = 2; g.beginPath(); g.moveTo(90, 50); g.lineTo(90, 310); g.moveTo(510, 50); g.lineTo(510, 310); g.stroke();
    g.font = F(21, 700); g.fillStyle = C.ink; g.textAlign = "center"; g.fillText("browser", 90, 36); g.fillText("server", 510, 36);
    for (var j = 0; j <= i; j++) {
      var m = M[j], y0 = 60 + j * 50, y1 = y0 + 44, f = j < i ? 1 : u, a = m[0] ? 510 : 90, b = m[0] ? 90 : 510;
      g.strokeStyle = m[2]; g.lineWidth = 3; g.beginPath(); g.moveTo(a, y0); g.lineTo(a + (b - a) * f, y0 + (y1 - y0) * f); g.stroke();
      g.font = F(19, 600); var tw = g.measureText(m[1]).width; g.fillStyle = C.bg; g.fillRect(300 - tw / 2 - 6, y0 + 6, tw + 12, 24); g.fillStyle = m[2]; g.fillText(m[1], 300, y0 + 24);
      g.textAlign = "right"; g.fillStyle = C.ink3; g.font = F(16, 500, "m"); g.fillText((j * rtt / 2) + " ms", 80, y0 + 6); g.textAlign = "center";
    }
    out.textContent = "With a " + rtt + " ms round trip, the request leaves after " + 2 * rtt + " ms: one round trip for TCP, one for TLS 1.3.";
  }
  var film = k.loop(10, draw, { label: "Messages" });
  k.slider("Round trip", 10, 300, 10, rtt, function (v) { return v + " ms"; }, function (v) { rtt = +v; draw(film.t()); });
  st.draw = function () { draw(film.t()); };
});
