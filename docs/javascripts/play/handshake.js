/* books/networks/16: TCP's three-way handshake and the first bytes of data, on a time line. Each side picks a random
   starting sequence number; each ACK names the next byte expected. The client here starts at 1000 and the server at
   5000 (made-up numbers); the SYN and FIN each use up one number. */
PLAY("handshake", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 330, st = k.stage(W, H), g = st.g, out = k.out();
  var M = [[0, "SYN  seq=1000", "client: let's talk, I start at 1000"], [1, "SYN+ACK  seq=5000 ack=1001", "server: I start at 5000; next I expect 1001"],
    [0, "ACK  seq=1001 ack=5001", "client: next I expect 5001. Connected."], [0, "data 100 bytes  seq=1001", "client sends bytes 1001 to 1100"], [1, "ACK  ack=1101", "server: got them all, next I expect 1101"]];
  function draw(t) {
    var n = M.length, i = Math.min(n - 1, Math.floor(t * n)), u = Math.min(1, (t * n - i) * 1.3);
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = C.ink3; g.lineWidth = 2; g.beginPath(); g.moveTo(110, 40); g.lineTo(110, 310); g.moveTo(490, 40); g.lineTo(490, 310); g.stroke();
    g.font = F(15, 700); g.fillStyle = C.ink; g.textAlign = "center"; g.fillText("client", 110, 28); g.fillText("server", 490, 28);
    for (var j = 0; j <= i; j++) {
      var m = M[j], y0 = 50 + j * 52, y1 = y0 + 40, f = j < i ? 1 : u, a = m[0] ? 490 : 110, b = m[0] ? 110 : 490;
      g.strokeStyle = j < 3 ? C.gold : C.ice; g.lineWidth = 2.5; g.beginPath(); g.moveTo(a, y0); g.lineTo(a + (b - a) * f, y0 + (y1 - y0) * f); g.stroke();
      g.font = F(13, 600, "m"); var tw = g.measureText(m[1]).width; g.fillStyle = C.bg; g.fillRect(300 - tw / 2 - 6, y0 + 8, tw + 12, 20); g.fillStyle = j < 3 ? C.gold : C.ice; g.fillText(m[1], 300, y0 + 23);
    }
    out.textContent = M[i][2] + ".";
  }
  var film = k.loop(10, draw, { label: "Messages" });
  st.draw = function () { draw(film.t()); };
});
