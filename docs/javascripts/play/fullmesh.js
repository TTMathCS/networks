/* books/networks/01: why networks use switches. Joining every pair of n hosts directly takes n(n−1)/2 links; joining each
   host to one switch takes n. Slide the number of hosts. */
PLAY("fullmesh", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 260, st = k.stage(W, H), g = st.g, out = k.out(), n = 6;
  function ring(cx, cy, r, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var L = n * (n - 1) / 2, i, j;
    g.strokeStyle = "rgba(246,196,83,0.55)"; g.lineWidth = 1.5;
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) { var a = ring(150, 135, 80, i), b = ring(150, 135, 80, j); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    g.strokeStyle = C.ice; g.lineWidth = 2;
    for (i = 0; i < n; i++) { var c = ring(450, 135, 80, i); g.beginPath(); g.moveTo(450, 135); g.lineTo(c[0], c[1]); g.stroke(); }
    for (i = 0; i < n; i++) { [150, 450].forEach(function (cx) { var p = ring(cx, 135, 80, i); g.fillStyle = C.mars; g.beginPath(); g.arc(p[0], p[1], 8, 0, 7); g.fill(); }); }
    g.fillStyle = C.ice; g.fillRect(438, 123, 24, 24);
    g.textAlign = "center"; g.font = F(20, 700); g.fillStyle = C.gold; g.fillText("every pair: " + L + " links", 150, 30);
    g.fillStyle = C.ice; g.fillText("one switch: " + n + " links", 450, 30);
    out.textContent = n + " hosts: " + L.toLocaleString("en") + " direct links, or " + n + " cables to a switch." + (n >= 20 ? " For 1,000 hosts it would be 499,500." : "");
  }
  k.slider("Hosts", 2, 30, 1, n, function (v) { return v; }, function (v) { n = +v; draw(); });
  st.draw = draw; draw();
});
