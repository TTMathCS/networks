/* books/networks/09: NAT at home. Three devices with private addresses share one public address. The router rewrites
   each outgoing packet's source to its public address and a port of its own, writes the pair in its table, and uses
   the table to send replies back to the right device. Addresses from the documentation ranges. */
PLAY("nat", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 300, st = k.stage(W, H), g = st.g, out = k.out();
  var dev = [["192.168.1.10", 51000, 60], ["192.168.1.11", 51000, 150], ["192.168.1.12", 40312, 240]], PUB = "203.0.113.7", ports = [62001, 62002, 62003];
  function draw(t) {
    var n = 3, i = Math.min(n - 1, Math.floor(t * n)), u = t * n - i;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    dev.forEach(function (d) { g.fillStyle = C.ink2; g.fillRect(20, d[2] - 16, 26, 32); g.font = F(12, 500, "m"); g.fillStyle = C.ink3; g.textAlign = "left"; g.fillText(d[0], 52, d[2] + 4); });
    g.fillStyle = C.mars; g.fillRect(270, 110, 70, 80); g.fillStyle = C.bg; g.font = F(13, 700); g.textAlign = "center"; g.fillText("router", 305, 154);
    g.fillStyle = C.ink2; g.font = F(12, 500, "m"); g.fillText(PUB, 305, 206);
    g.fillStyle = C.earth; g.beginPath(); g.arc(540, 150, 28, 0, 7); g.fill(); g.fillStyle = C.ink; g.font = F(13, 600); g.fillText("server", 540, 196);
    var d = dev[i], out1 = u < 0.5, v = out1 ? u * 2 : (u - 0.5) * 2, label;
    if (out1) { var x = v < 0.5 ? 180 * v * 2 + 30 : 310 + (510 - 310) * (v - 0.5) * 2, y = v < 0.5 ? d[2] + (150 - d[2]) * v * 2 : 150; label = v < 0.5 ? "from " + d[0] + ":" + d[1] : "from " + PUB + ":" + ports[i]; dotAt(x, y, label, C.gold); }
    else { var x2 = v < 0.5 ? 510 - 200 * v * 2 : 300 - 270 * (v - 0.5) * 2, y2 = v < 0.5 ? 150 : 150 + (d[2] - 150) * (v - 0.5) * 2; label = v < 0.5 ? "to " + PUB + ":" + ports[i] : "to " + d[0] + ":" + d[1]; dotAt(x2, y2, label, C.green); }
    function dotAt(x3, y3, l, c) { g.fillStyle = c; g.beginPath(); g.arc(x3, y3, 8, 0, 7); g.fill(); g.fillStyle = C.ink; g.font = F(12, 600, "m"); g.textAlign = "center"; g.fillText(l, Math.min(500, Math.max(110, x3)), y3 - 14); }
    g.textAlign = "left"; g.font = F(13, 600); g.fillStyle = C.ink; g.fillText("router's table", 360, 30);
    for (var j = 0; j <= i; j++) { if (j === i && u < 0.25) break; g.font = F(12, 500, "m"); g.fillStyle = C.ink2; g.fillText(":" + ports[j] + " ↔ " + dev[j][0] + ":" + dev[j][1], 360, 50 + j * 16); }
    out.textContent = (out1 ? "Going out: " : "Coming back: ") + "the router swaps " + (out1 ? "the private source for its public address and port " + ports[i] : "port " + ports[i] + " back to " + d[0]) + ".";
  }
  var film = k.loop(12, draw, { label: "Packets" });
  st.draw = function () { draw(film.t()); };
});
