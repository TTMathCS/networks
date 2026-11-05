/* books/wireless/02: free-space path loss, FSPL(dB) = 20 log10(d in km) + 20 log10(f in MHz) + 32.44. Slide the
   distance from across a room to Mars at its farthest and see how the loss grows: 6 dB every time the distance
   doubles. Distances: Moon 384,400 km; Mars 54.6 to 401 million km (NASA). */
PLAY("fspl", function (fig, k) {
  var C = k.C, F = k.F, W = 640, H = 330, st = k.stage(W, H), g = st.g, out = k.out();
  var fMHz = 2400, lg = 1;   // log10 of km
  var marks = [[0.01, "room"], [0.1, "house"], [36000, "GEO satellite"], [384400, "Moon"], [54.6e6, "Mars closest"], [401e6, "Mars farthest"]];
  function loss(dkm) { return 20 * Math.log10(dkm) + 20 * Math.log10(fMHz) + 32.44; }
  var L0 = -2.3, L1 = 8.8, X0 = 50, X1 = 600, Y0 = 230, Y1 = 50, D0 = 40, D1 = 320;
  function X(l) { return X0 + (l - L0) / (L1 - L0) * (X1 - X0); }
  function Y(db) { return Y0 - (db - D0) / (D1 - D0) * (Y0 - Y1); }
  function sup(n) { return String(n).replace(/\d/g, function (c) { return "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]; }); }
  function nice(d) { return d < 1 ? Math.round(d * 1000) + " m" : d < 1e6 ? Math.round(d).toLocaleString("en") + " km" : (d / 1e6).toPrecision(3) + " million km"; }
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = C.ink3; g.lineWidth = 1; g.beginPath(); g.moveTo(X0, Y1); g.lineTo(X0, Y0); g.lineTo(X1, Y0); g.stroke();
    g.font = F(14, 500); g.fillStyle = C.ink3; g.textAlign = "right";
    for (var db = 50; db <= 300; db += 50) { g.fillText(db, X0 - 6, Y(db) + 4); g.strokeStyle = C.line; g.beginPath(); g.moveTo(X0, Y(db)); g.lineTo(X1, Y(db)); g.stroke(); }
    g.textAlign = "left"; g.fillText("loss (dB)", X0 + 4, Y1 - 10);
    g.strokeStyle = C.gold; g.lineWidth = 3; g.beginPath(); g.moveTo(X(L0), Y(loss(Math.pow(10, L0)))); g.lineTo(X(L1), Y(loss(Math.pow(10, L1)))); g.stroke();
    marks.forEach(function (m, i) {
      var x = X(Math.log10(m[0])), y = Y0 + 20 + (i % 2) * 20;
      g.strokeStyle = C.line; g.beginPath(); g.moveTo(x, Y0); g.lineTo(x, y - 14); g.stroke();
      g.fillStyle = C.ink2; g.font = F(14, 500); g.textAlign = i === marks.length - 1 ? "right" : i === 0 ? "left" : "center"; g.fillText(m[1], i === 0 ? x - 6 : x, y);
    });
    var d = Math.pow(10, lg), L = loss(d), x = X(lg), y = Y(L);
    g.fillStyle = C.rust; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill();
    g.fillStyle = C.ink; g.font = F(16, 600); g.textAlign = x > 420 ? "right" : "left";
    g.fillText(L.toFixed(0) + " dB", x + (x > 420 ? -14 : 14), y + 24);
    var ratio = L / 10;
    out.textContent = "At " + nice(d) + " and " + (fMHz >= 1000 ? fMHz / 1000 + " GHz" : fMHz + " MHz") + ", the loss is " + L.toFixed(0) +
      " dB: only about one part in 10" + sup(ratio.toFixed(0)) + " of what an ideal small antenna sends reaches one like it. Big dishes win much of it back.";
  }
  st.draw = draw;
  k.slider("Distance", L0, L1, 0.01, lg, function (v) { return nice(Math.pow(10, v)); }, function (v) { lg = v; draw(); });
  k.buttons([["Wi-Fi 2.4 GHz", function () { fMHz = 2400; draw(); }], ["Wi-Fi 5 GHz", function () { fMHz = 5000; draw(); }], ["X band 8.4 GHz", function () { fMHz = 8400; draw(); }]], true);
});
