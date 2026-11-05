/* books/networks/13: how a BGP router chooses among routes to one prefix: highest LOCAL_PREF first, then the shortest
   AS_PATH, then lower IGP cost to the next hop. The three routes and their numbers are made up (AS 64500 and up are
   numbers set aside for examples). Tap a route to raise its LOCAL_PREF. */
PLAY("bgppick", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 250, st, out;
  var R = [["via a paid transit", [64501, 64510, 64520], 100, 10], ["via a free peer", [64502, 64503, 64511, 64520], 100, 5], ["via a backup link", [64504, 64520], 100, 30]];
  st = k.stage(W, H, function (x, y) { var i = Math.floor((y - 54) / 50); if (i < 0 || i > 2) return; R[i][2] = R[i][2] === 100 ? 200 : 100; draw(); });
  out = k.out(); var g = st.g;
  function best() {
    var c = [0, 1, 2], why;
    var lp = Math.max.apply(null, c.map(function (i) { return R[i][2]; })); var c2 = c.filter(function (i) { return R[i][2] === lp; });
    if (c2.length === 1) return [c2[0], "highest LOCAL_PREF (" + lp + ")"];
    var ln = Math.min.apply(null, c2.map(function (i) { return R[i][1].length; })); var c3 = c2.filter(function (i) { return R[i][1].length === ln; });
    if (c3.length === 1) return [c3[0], "LOCAL_PREF is tied, so the shortest AS_PATH (" + ln + " networks)"];
    var ig = Math.min.apply(null, c3.map(function (i) { return R[i][3]; })); return [c3.filter(function (i) { return R[i][3] === ig; })[0], "LOCAL_PREF and AS_PATH are tied, so the lowest IGP cost"];
  }
  function draw() {
    var b = best(); g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    g.fillStyle = C.ink3; g.font = F(18, 600); g.fillText("route", 20, 40); g.fillText("LOCAL_PREF", 300, 40); g.fillText("AS_PATH", 440, 40);
    R.forEach(function (r, i) {
      var y = 54 + i * 50, on = i === b[0]; g.fillStyle = on ? "rgba(159,201,138,0.22)" : "rgba(244,230,212,0.06)"; g.fillRect(14, y, 572, 44);
      g.fillStyle = on ? C.green : C.ink2; g.font = F(19, on ? 700 : 500); g.fillText(r[0], 22, y + 29);
      g.fillStyle = r[2] > 100 ? C.gold : C.ink2; g.font = F(19, 700, "m"); g.fillText(r[2], 320, y + 29);
      g.fillStyle = C.ink2; g.fillText(r[1].length + " ASes", 450, y + 29);
    });
    out.textContent = "Chosen: " + R[b[0]][0] + ". Why: " + b[1] + ".";
  }
  st.draw = draw; draw();
});
