/* books/networks/05: a parity bit. Each row is a byte plus one even-parity bit, chosen so the row has an even number of
   1s. Tap any bit to flip it, as noise on the line would: one flip is caught, two flips in the same row slip through. */
PLAY("parity", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 250, st, out, word = "MARS", flips = {};
  function rows() { return word.split("").map(function (ch) { var b = ch.charCodeAt(0).toString(2).padStart(8, "0").split("").map(Number), p = b.reduce(function (a, c) { return a ^ c; }, 0); return b.concat([p]); }); }
  function draw() {
    var g = st.g, R = rows(); g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    R.forEach(function (r, i) {
      var bad = 0;
      r.forEach(function (b, j) { var v = flips[i + "," + j] ? 1 - b : b; bad ^= v; var x = 110 + j * 44, y = 40 + i * 48;
        g.fillStyle = flips[i + "," + j] ? C.red : j === 8 ? "rgba(246,196,83,0.3)" : C.bg2; g.fillRect(x, y, 38, 36);
        g.fillStyle = C.ink; g.font = F(18, 700, "m"); g.textAlign = "center"; g.fillText(v, x + 19, y + 25); });
      g.textAlign = "left"; g.font = F(16, 700); g.fillStyle = C.ink2; g.fillText("“" + word[i] + "”", 40, 64 + i * 48);
      g.font = F(14, 600); g.fillStyle = bad ? C.red : C.green; g.fillText(bad ? "error!" : "ok", 520, 64 + i * 48);
    });
    g.fillStyle = C.gold; g.font = F(13, 500); g.textAlign = "center"; g.fillText("parity", 110 + 8 * 44 + 19, 30);
    var n = Object.keys(flips).filter(function (x) { return flips[x]; }).length;
    out.textContent = n ? n + " bit" + (n > 1 ? "s" : "") + " flipped. A row with an odd number of flips is caught; an even number is missed." : "Tap a bit to flip it.";
  }
  st = k.stage(W, H, function (x, y) { var j = Math.floor((x - 110) / 44), i = Math.floor((y - 40) / 48); if (j >= 0 && j < 9 && i >= 0 && i < word.length) { flips[i + "," + j] = !flips[i + "," + j]; draw(); } });
  out = k.out(); st.draw = draw;
  k.buttons([["Clear", function () { flips = {}; draw(); }]]);
});
