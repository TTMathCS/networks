/* books/networks/08: type an address with its prefix and see its 32 bits split into network and host, with the
   network address, the broadcast address and how many hosts fit (2^(32−n) − 2; a /31 link has 2, RFC 3021). */
PLAY("subnet", function (fig, k) {
  var C = k.C, F = k.F, W = 640, H = 250, st = k.stage(W, H), g = st.g, out = k.out(), cur = null;
  function parse(s) {
    var m = /^\s*(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\s*\/\s*(\d{1,2})\s*$/.exec(s);
    if (!m) return null;
    var o = [+m[1], +m[2], +m[3], +m[4]], n = +m[5];
    if (n > 32 || o.some(function (v) { return v > 255; })) return null;
    return { ip: ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0, n: n };
  }
  function dot(v) { return [v >>> 24, (v >>> 16) & 255, (v >>> 8) & 255, v & 255].join("."); }
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    if (!cur) { g.fillStyle = C.ink3; g.font = F(16, 500); g.textAlign = "left"; g.fillText("Write it like 10.20.3.130/30", 20, 120); out.textContent = ""; return; }
    var ip = cur.ip, n = cur.n, mask = n === 0 ? 0 : (0xFFFFFFFF << (32 - n)) >>> 0;
    var net = (ip & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0, size = Math.pow(2, 32 - n);
    var cw = 17.5, x0 = 20, gap = 8;
    g.font = F(15, 600, "m"); g.textAlign = "center";
    for (var i = 0; i < 32; i++) {
      var bit = (ip >>> (31 - i)) & 1, x = x0 + i * cw + Math.floor(i / 8) * gap;
      g.fillStyle = i < n ? "rgba(246,196,83,0.25)" : "rgba(156,201,234,0.18)"; g.fillRect(x, 40, cw - 2, 34);
      g.fillStyle = i < n ? C.gold : C.ice; g.fillText(bit, x + (cw - 2) / 2, 63);
    }
    function bx(i) { return x0 + i * cw + Math.floor(i / 8) * gap; }
    var xs = n === 0 ? x0 - 3 : n === 32 ? bx(31) + cw + 1 : (bx(n - 1) + cw - 2 + bx(n)) / 2;
    g.strokeStyle = C.ink; g.lineWidth = 2; g.beginPath(); g.moveTo(xs, 30); g.lineTo(xs, 84); g.stroke();
    g.font = F(14, 500); g.textAlign = "left"; g.fillStyle = C.gold; g.fillText(n + " network bits", 20, 100);
    g.textAlign = "right"; g.fillStyle = C.ice; g.fillText((32 - n) + " host bits", W - 20, 100);
    var hosts = n === 32 ? 1 : n === 31 ? 2 : size - 2;
    var rows = [["Mask", dot(mask)], ["Network", dot(net) + "/" + n], ["Broadcast", n >= 31 ? "none" : dot(bc)],
      ["Hosts", n >= 31 ? dot(net) + (n === 31 ? " and " + dot(bc) : "") : dot(net + 1) + " to " + dot(bc - 1)],
      ["How many", hosts.toLocaleString("en") + " usable of " + size.toLocaleString("en")]];
    g.textAlign = "left";
    rows.forEach(function (r, i) { g.font = F(14, 500); g.fillStyle = C.ink3; g.fillText(r[0], 20, 134 + i * 24); g.font = F(15, 500, "m"); g.fillStyle = C.ink; g.fillText(r[1], 130, 134 + i * 24); });
    out.textContent = dot(ip) + (ip === net && n < 31 ? " is the network address itself." : ip === bc && n < 31 ? " is the broadcast address." : " is a host in " + dot(net) + "/" + n + ".");
  }
  st.draw = draw;
  var box = k.text("Address", "10.20.3.130/30", function (v) { cur = parse(v); draw(); });
  k.buttons([["/23 staff", function () { box.value = "10.20.1.77/23"; cur = parse(box.value); draw(); }],
    ["/25 cameras", function () { box.value = "10.20.3.100/25"; cur = parse(box.value); draw(); }],
    ["/30 link", function () { box.value = "10.20.3.130/30"; cur = parse(box.value); draw(); }],
    ["Home /24", function () { box.value = "192.168.1.42/24"; cur = parse(box.value); draw(); }]]);
});
