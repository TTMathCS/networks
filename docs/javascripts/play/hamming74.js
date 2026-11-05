/* books/math/06: Hamming(7,4). The example data 1011 becomes 0110011 (positions 1-7). Tap any bit to flip it: the three
   checks are worked out again, and the ones that fail add up to the position of the flipped bit. */
PLAY("hamming74", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 250, sent = [0, 1, 1, 0, 0, 1, 1], r = sent.slice(), st, out;
  st = k.stage(W, H, function (x, y) { var i = Math.floor((x - 40) / 76); if (i < 0 || i > 6 || y < 40 || y > 120) return; r[i] ^= 1; draw(); });
  out = k.out();
  var groups = [[1, [1, 3, 5, 7]], [2, [2, 3, 6, 7]], [4, [4, 5, 6, 7]]];
  function draw() {
    g = st.g; g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.textAlign = "center";
    for (var i = 0; i < 7; i++) {
      var x = 40 + i * 76, par = (i === 0 || i === 1 || i === 3), bad = r[i] !== sent[i];
      g.fillStyle = bad ? C.red : par ? "#3b2a20" : "#2e2a1c"; g.fillRect(x + 4, 50, 66, 60);
      g.strokeStyle = par ? C.ice : C.gold; g.lineWidth = 2; g.strokeRect(x + 4, 50, 66, 60);
      g.fillStyle = C.ink; g.font = F(34, 700, "m"); g.fillText(r[i], x + 37, 93);
      g.fillStyle = par ? C.ice : C.gold; g.font = F(18, 600); g.fillText((par ? "p" : "d") + " · " + (i + 1), x + 37, 36);
    }
    var syn = 0;
    groups.forEach(function (gr, j) {
      var s = 0; gr[1].forEach(function (p) { s ^= r[p - 1]; }); if (s) syn += gr[0];
      var y = 152 + j * 30; g.textAlign = "left"; g.font = F(19, 500); g.fillStyle = s ? C.red : C.green;
      g.fillText("check " + gr[0] + " (bits " + gr[1].join(", ") + "): " + (s ? "odd ✗" : "even ✓"), 40, y);
    });
    out.textContent = syn ? "The failing checks add up to " + syn + ": bit " + syn + " is wrong. Flip it back." : "All three checks pass: no single bit is wrong.";
    var flips = r.reduce(function (a, v, i) { return a + (v !== sent[i]); }, 0);
    if (flips > 1) out.textContent += " (With " + flips + " bits flipped, Hamming(7,4) is fooled: it can fix only one.)";
  }
  var g; st.draw = draw; draw();
});
