/* topics: who can see what. One widget for three topic pages, picked by the figure's data-mode: "https" (plain http
   against https), "vpn" (with and without a VPN) and "dns" (plain DNS against encrypted DNS). Each row is someone on the
   path; a filled square means they can see that item. Based on the explanations on those pages. */
PLAY("whosees", function (fig, k) {
  var C = k.C, F = k.F, mode = fig.getAttribute("data-mode") || "https", on = false;
  var S = {
    https: { items: ["site name", "page address", "page contents"], who: ["café Wi-Fi", "internet provider", "the website"], b: ["http://", "https://"],
      see: [[[1, 1, 1], [1, 1, 1], [1, 1, 1]], [[1, 0, 0], [1, 0, 0], [1, 1, 1]]],
      say: ["Plain http: everyone on the way can read and change everything.", "https: those in between see only which site (and how much data), not the pages or what you type."] },
    vpn: { items: ["which sites", "page contents", "your home address"], who: ["internet provider", "VPN company", "the website"], b: ["No VPN", "VPN on"],
      see: [[[1, 0, 0], [0, 0, 0], [0, 1, 1]], [[0, 0, 1], [1, 0, 1], [0, 1, 0]]],
      say: ["Without a VPN your provider sees which sites you visit (https still hides the contents).", "With a VPN your provider sees only a tunnel; the VPN company now sees which sites. Trust moved, it did not vanish."] },
    dns: { items: ["names you look up", "can change the answer"], who: ["café Wi-Fi", "internet provider", "your chosen resolver"], b: ["Plain DNS", "Encrypted DNS"],
      see: [[[1, 1], [1, 1], [1, 1]], [[0, 0], [0, 0], [1, 1]]],
      say: ["Plain DNS travels as readable text: anyone on the way sees the names and could answer falsely.", "Encrypted DNS (DoH or DoT): only the resolver you chose sees your questions."] }
  }[mode];
  var W = 600, H = 94 + S.who.length * 56, st = k.stage(W, H), g = st.g, out = k.out();
  function draw() {
    var m = on ? 1 : 0, cw = 300 / S.items.length;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.font = F(17, 600); g.fillStyle = C.ink3; g.textAlign = "center";
    S.items.forEach(function (it, j) { var x = 290 + cw * j + cw / 2, words = it.split(" "), half = Math.ceil(words.length / 2); g.fillText(words.slice(0, half).join(" "), x, 26); g.fillText(words.slice(half).join(" "), x, 46); });
    S.who.forEach(function (w, i) {
      var y = 62 + i * 56; g.textAlign = "left"; g.fillStyle = C.ink; g.font = F(20, 600); g.fillText(w, 20, y + 30);
      S.items.forEach(function (it, j) { var x = 290 + cw * j + cw / 2, s = S.see[m][i][j]; g.fillStyle = s ? C.red : "rgba(159,201,138,0.22)"; g.fillRect(x - 18, y + 10, 36, 30); g.fillStyle = s ? C.ink : C.green; g.font = F(20, 700); g.textAlign = "center"; g.fillText(s ? "✓" : "–", x, y + 32); });
    });
    out.textContent = S.say[m];
  }
  k.buttons([[S.b[0], function () { on = false; draw(); }], [S.b[1], function () { on = true; draw(); }]], true);
  st.draw = draw; draw();
});
