/* books/wireless/09: the 2.4 GHz channels. Channel n is centred at 2407 + 5n MHz, but each is 20 MHz wide, so neighbours
   overlap. Tap channels to give three access points their channels; 1, 6 and 11 are the set that do not overlap where
   channels 12 and 13 are not allowed (the USA and Canada). */
PLAY("channels", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 230, pick = [1, 6, 11], turn = 0, st, out, cols = [C.gold, C.ice, C.green];
  function xOf(mhz) { return 30 + (mhz - 2395) / (2490 - 2395) * 540; }
  st = k.stage(W, H, function (x, y) { var best = 1, bd = 1e9; for (var n = 1; n <= 11; n++) { var d = Math.abs(xOf(2407 + 5 * n) - x); if (d < bd) { bd = d; best = n; } } pick[turn] = best; turn = (turn + 1) % 3; draw(); });
  out = k.out(); var g = st.g;
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.fillStyle = C.ink3; g.font = F(16, 600); g.textAlign = "center";
    for (var n = 1; n <= 11; n++) g.fillText(n, xOf(2407 + 5 * n), 214);
    pick.forEach(function (ch, i) {
      var c = 2407 + 5 * ch, x0 = xOf(c - 10), x1 = xOf(c + 10), top = 60 + i * 34;
      g.fillStyle = cols[i]; g.globalAlpha = 0.35; g.beginPath(); g.moveTo(x0, 190); g.lineTo(x0 + 12, top); g.lineTo(x1 - 12, top); g.lineTo(x1, 190); g.closePath(); g.fill(); g.globalAlpha = 1;
      g.strokeStyle = cols[i]; g.lineWidth = 2.5; g.stroke();
      g.fillStyle = cols[i]; g.font = F(18, 700); g.fillText("AP " + (i + 1) + ": ch " + ch, (x0 + x1) / 2, top - 8);
    });
    var clash = []; for (var a = 0; a < 3; a++) for (var b = a + 1; b < 3; b++) if (Math.abs(pick[a] - pick[b]) * 5 < 20) clash.push("AP " + (a + 1) + " and AP " + (b + 1));
    out.textContent = clash.length ? "Overlap: " + clash.join(", ") + " share airtime or interfere. Tap the axis to move AP " + (turn + 1) + "." : "No overlap. Tap the axis to move AP " + (turn + 1) + ".";
  }
  k.buttons([["1 · 6 · 11", function () { pick = [1, 6, 11]; turn = 0; draw(); }], ["1 · 3 · 5", function () { pick = [1, 3, 5]; turn = 0; draw(); }], ["all on 6", function () { pick = [6, 6, 6]; turn = 0; draw(); }]]);
  st.draw = draw; draw();
});
