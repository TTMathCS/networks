/* books/networks/06: how a switch learns. Frames arrive; the switch writes down which port each source address came in
   on, then sends to that port alone if it knows the destination, or floods all other ports if it does not. Short MAC
   addresses (A to D) stand in for real 48-bit ones. */
PLAY("switchlearn", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 300, st = k.stage(W, H), g = st.g, out = k.out();
  var hosts = [[80, 60, "A", 1], [80, 240, "B", 2], [520, 60, "C", 3], [520, 240, "D", 4]], SW = [300, 150];
  var frames = [["A", "C"], ["C", "A"], ["B", "A"], ["D", "B"], ["A", "D"]];
  function draw(t) {
    var n = frames.length, i = Math.min(n - 1, Math.floor(t * n)), u = t * n - i, table = {};
    for (var j = 0; j < i; j++) table[frames[j][0]] = hosts.filter(function (h) { return h[2] === frames[j][0]; })[0][3];
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    hosts.forEach(function (h) { g.strokeStyle = C.line; g.lineWidth = 3; g.beginPath(); g.moveTo(h[0], h[1]); g.lineTo(SW[0], SW[1]); g.stroke(); });
    g.fillStyle = C.mars; g.fillRect(SW[0] - 40, SW[1] - 22, 80, 44); g.fillStyle = C.bg; g.font = F(14, 700); g.textAlign = "center"; g.fillText("switch", SW[0], SW[1] + 5);
    hosts.forEach(function (h) { g.fillStyle = C.ink2; g.beginPath(); g.arc(h[0], h[1], 18, 0, 7); g.fill(); g.fillStyle = C.bg; g.font = F(16, 700); g.fillText(h[2], h[0], h[1] + 6); g.fillStyle = C.ink3; g.font = F(12, 500); g.fillText("port " + h[3], (h[0] + SW[0]) / 2, (h[1] + SW[1]) / 2 - 8); });
    var f = frames[i], src = hosts.filter(function (h) { return h[2] === f[0]; })[0], known = table[f[1]], dst = hosts.filter(function (h) { return h[2] === f[1]; })[0];
    function dot(a, b, v, col) { g.fillStyle = col; g.beginPath(); g.arc(a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v, 8, 0, 7); g.fill(); }
    if (u < 0.5) dot(src, SW, u * 2, C.gold);
    else hosts.forEach(function (h) { if (h === src) return; if (known && h !== dst) return; dot(SW, h, (u - 0.5) * 2, known ? C.gold : C.rust); });
    g.textAlign = "left"; g.font = F(14, 600); g.fillStyle = C.ink; g.fillText("the switch's table", 230, 212);
    var learned = Object.keys(table); if (u >= 0.5) { table[f[0]] = src[3]; learned = Object.keys(table); }
    learned.sort().forEach(function (m, j) { g.font = F(13, 500, "m"); g.fillStyle = C.ink2; g.fillText(m + " → port " + table[m], 230, 232 + j * 18); });
    out.textContent = "Frame " + (i + 1) + ": " + f[0] + " to " + f[1] + ". " + (known ? "The switch knows " + f[1] + " is on port " + known + ", so it sends it there only." : "The switch has not seen " + f[1] + " yet, so it floods every other port.");
  }
  var film = k.loop(12, draw, { label: "Frames" });
  st.draw = function () { draw(film.t()); };
});
