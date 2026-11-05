/* books/networks/11: longest-prefix match with the forwarding table above. Type a destination: every prefix it
   matches lights up, and the longest one wins. */
PLAY("lpm", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 230, st = k.stage(W, H), g = st.g, out = k.out(), ip = null;
  var T = [["0.0.0.0/0", "198.51.100.1", "eth0 (default)"], ["10.0.0.0/8", "10.255.0.1", "eth1"], ["10.20.0.0/16", "10.255.0.2", "eth1"], ["10.20.3.0/24", "direct", "eth2"]];
  function num(s) { var m = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(s.trim()); if (!m) return null; var o = m.slice(1).map(Number); if (o.some(function (v) { return v > 255; })) return null; return ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0; }
  function match(p) { var a = p[0].split("/"), n = +a[1], mask = n ? (0xFFFFFFFF << (32 - n)) >>> 0 : 0; return ((ip & mask) >>> 0) === ((num(a[0]) & mask) >>> 0); }
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var best = -1; if (ip !== null) T.forEach(function (p, i) { if (match(p)) best = i; });
    g.font = F(13, 600); g.fillStyle = C.ink3; g.textAlign = "left"; g.fillText("prefix", 30, 30); g.fillText("next hop", 230, 30); g.fillText("interface", 400, 30);
    T.forEach(function (p, i) {
      var y = 46 + i * 40, m = ip !== null && match(p);
      g.fillStyle = i === best ? "rgba(246,196,83,0.3)" : m ? "rgba(156,201,234,0.15)" : C.bg2; g.fillRect(20, y, 560, 32);
      g.fillStyle = i === best ? C.gold : m ? C.ice : C.ink3; g.font = F(15, 600, "m"); g.fillText(p[0], 30, y + 22); g.fillText(p[1], 230, y + 22); g.fillText(p[2], 400, y + 22);
    });
    out.textContent = ip === null ? "Type an IPv4 address." : "Matches " + T.filter(function (p) { return match(p); }).length + " entries; the longest, " + T[best][0] + ", sends it out " + T[best][2] + ".";
  }
  st.draw = draw;
  var box = k.text("Destination", "10.20.3.9", function (v) { ip = num(v); draw(); });
  k.buttons([["10.20.3.9", function () { box.value = "10.20.3.9"; ip = num(box.value); draw(); }], ["10.20.9.1", function () { box.value = "10.20.9.1"; ip = num(box.value); draw(); }], ["8.8.8.8", function () { box.value = "8.8.8.8"; ip = num(box.value); draw(); }]]);
});
