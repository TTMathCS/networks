/* books/security/04: how long a random password lasts against offline guessing. Entropy is length × log2(alphabet); on
   average an attacker tries half of all possibilities. The two guessing rates are rough examples: ten billion a second
   for a fast hash on one graphics card, ten thousand a second for a slow, memory-hard hash like Argon2id. */
PLAY("guess", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 220, st = k.stage(W, H), g = st.g, out = k.out(), len = 10, A = 62, name = "letters and digits";
  function span(s) {
    var y = s / 3.156e7;
    if (s < 1) return "under a second"; if (s < 120) return "about " + Math.round(s) + " seconds"; if (s < 7200) return "about " + Math.round(s / 60) + " minutes";
    if (s < 172800) return "about " + Math.round(s / 3600) + " hours"; if (y < 2) return "about " + Math.round(s / 86400) + " days";
    if (y > 1.38e10) return "longer than the universe has existed"; if (y >= 1e9) return "about " + (y / 1e9).toFixed(1) + " billion years";
    if (y >= 1e6) return "about " + Math.round(y / 1e6).toLocaleString("en") + " million years"; return "about " + Math.round(y).toLocaleString("en") + " years";
  }
  function draw() {
    var bitsN = len * Math.log2(A), half = Math.pow(2, bitsN - 1);
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    g.fillStyle = C.ink; g.font = F(26, 700); g.fillText(bitsN.toFixed(1) + " bits", 20, 42);
    g.fillStyle = C.ink3; g.font = F(18, 500); g.fillText(len + " characters from " + A + " (" + name + ")", 20, 70);
    [[1e10, "fast hash (10 billion a second)", C.red], [1e4, "slow hash (10 thousand a second)", C.green]].forEach(function (r, i) {
      var y = 118 + i * 54; g.fillStyle = r[2]; g.font = F(18, 600); g.fillText(r[1], 20, y); g.fillStyle = C.ink; g.font = F(21, 700); g.fillText(span(half / r[0]), 20, y + 28);
    });
    out.textContent = "On average: " + span(half / 1e10) + " against a fast hash, " + span(half / 1e4) + " against a slow one.";
  }
  k.slider("Length", 4, 20, 1, len, function (v) { return v + " characters"; }, function (v) { len = +v; draw(); });
  k.buttons([["letters + digits", function () { A = 62; name = "letters and digits"; draw(); }], ["digits", function () { A = 10; name = "digits only"; draw(); }], ["lowercase", function () { A = 26; name = "lowercase"; draw(); }], ["all keys", function () { A = 94; name = "every printable key"; draw(); }]], true);
  st.draw = draw; draw();
});
