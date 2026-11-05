/* books/networks/10: writing IPv6 addresses short, by the rules in RFC 5952: drop leading zeros in each group, replace
   the longest run of two or more all-zero groups with "::" (the first, if two runs tie), and use lower case. */
PLAY("v6short", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 200, st = k.stage(W, H), g = st.g, out = k.out(), groups = null;
  function parse(s) {
    s = s.trim().toLowerCase(); if (!/^[0-9a-f:]+$/.test(s)) return null;
    var parts = s.split("::"); if (parts.length > 2) return null;
    var a = parts[0] ? parts[0].split(":") : [], b = parts.length > 1 && parts[1] ? parts[1].split(":") : [];
    var fill = parts.length > 1 ? 8 - a.length - b.length : 0; if (fill < 0 || (parts.length === 1 && a.length !== 8)) return null;
    var all = a.concat(new Array(fill).fill("0")).concat(b);
    if (all.length !== 8 || all.some(function (x) { return !/^[0-9a-f]{1,4}$/.test(x); })) return null;
    return all.map(function (x) { return parseInt(x, 16); });
  }
  function short(gs) {
    var best = -1, len = 1, i = 0;
    while (i < 8) { if (gs[i] === 0) { var j = i; while (j < 8 && gs[j] === 0) j++; if (j - i > len) { len = j - i; best = i; } i = j; } else i++; }
    var h = gs.map(function (x) { return x.toString(16); });
    if (best < 0) return h.join(":");
    return h.slice(0, best).join(":") + "::" + h.slice(best + len).join(":");
  }
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    if (!groups) { g.fillStyle = C.ink3; g.font = F(15, 500); g.textAlign = "left"; g.fillText("Write 8 groups of up to 4 hex digits, or use ::", 20, 100); out.textContent = ""; return; }
    groups.forEach(function (x, i) { var bx = 20 + i * 70; g.fillStyle = x ? C.bg2 : "rgba(156,201,234,0.18)"; g.fillRect(bx, 40, 64, 40); g.fillStyle = x ? C.ink : C.ice; g.font = F(16, 600, "m"); g.textAlign = "center"; g.fillText(x.toString(16).padStart(4, "0"), bx + 32, 66); });
    g.fillStyle = C.ink3; g.font = F(13, 500); g.textAlign = "left"; g.fillText("in full", 20, 30);
    g.fillText("shortest form", 20, 124); g.fillStyle = C.gold; g.font = F(22, 700, "m"); g.fillText(short(groups), 20, 156);
    out.textContent = "Blue groups are all zero; the longest run of them becomes ::.";
  }
  st.draw = draw;
  var box = k.text("Address", "2001:0db8:0000:0000:0000:ff00:0042:8329", function (v) { groups = parse(v); draw(); });
  k.buttons([["Loopback", function () { box.value = "0:0:0:0:0:0:0:1"; groups = parse(box.value); draw(); }], ["Two zero runs", function () { box.value = "2001:db8:0:0:1:0:0:1"; groups = parse(box.value); draw(); }]]);
});
