/* books/wireless/13: frequency reuse. The area is split into cells; with a reuse factor N, the band is cut into N parts
   and neighbouring cells use different parts. Higher N means less interference but a smaller share of the band in each
   cell; modern networks use N = 1 and manage interference by scheduling and beamforming. */
PLAY("cells", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 280, st = k.stage(W, H), g = st.g, out = k.out(), N = 3;
  var cols = [C.gold, C.ice, C.green, C.rust, "#d8b4f0", C.earth, C.red];
  function colour(q, r) {   // the classic reuse patterns on axial hex coordinates
    if (N === 1) return 0; if (N === 3) return ((q - r) % 3 + 3) % 3; return ((q + 3 * r) % 7 + 7) % 7;
  }
  function hex(cx, cy, s) { g.beginPath(); for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; g.lineTo(cx + s * Math.cos(a), cy + s * Math.sin(a)); } g.closePath(); }
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H); var s = 30;
    for (var r = -5; r <= 5; r++) for (var q = -8; q <= 8; q++) {
      var x = 300 + s * Math.sqrt(3) * (q + r / 2), y = 140 + s * 1.5 * r; if (x < -s || x > W + s || y < -s || y > H + s) continue;
      var c = colour(q, r); hex(x, y, s - 1.5); g.fillStyle = cols[c]; g.globalAlpha = 0.55; g.fill(); g.globalAlpha = 1; g.strokeStyle = C.bg; g.lineWidth = 2; g.stroke();
    }
    hex(300, 140, s - 1.5); g.strokeStyle = C.ink; g.lineWidth = 3; g.stroke();
    out.textContent = "Reuse factor " + N + ": each cell gets 1/" + N + " of the band" + (N === 1 ? ", and every neighbour uses the same frequencies." : "; the nearest cell on the same frequencies is " + (N === 3 ? "3" : "4.6").replace(".", ".") + " cell radii away.");
  }
  k.buttons([["N = 3", function () { N = 3; draw(); }], ["N = 1", function () { N = 1; draw(); }], ["N = 7", function () { N = 7; draw(); }]], true);
  st.draw = draw; draw();
});
