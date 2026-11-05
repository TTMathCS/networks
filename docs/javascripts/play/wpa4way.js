/* books/wireless/10: WPA2's 4-way handshake. Neither side ever sends the PMK (made from the Wi-Fi password); each mixes
   it with two random numbers and both MAC addresses into the same session key, and the MICs prove they got the same
   answer. */
PLAY("wpa4way", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 320, st = k.stage(W, H), g = st.g, out = k.out();
  var M = [[1, "1. ANonce", "The access point sends a random number, the ANonce."],
    [0, "2. SNonce + MIC", "The client picks its own SNonce, works out the PTK from PMK, both nonces and both MAC addresses, and proves it with a MIC."],
    [1, "3. group key + MIC", "The AP works out the same PTK, checks the MIC, and sends the group key, encrypted, with its own MIC."],
    [0, "4. done", "The client confirms. Both install the keys; the PMK never crossed the air."]];
  function draw(t) {
    var n = M.length, i = Math.min(n - 1, Math.floor(t * n)), u = Math.min(1, (t * n - i) * 1.3);
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = C.ink3; g.lineWidth = 2; g.beginPath(); g.moveTo(110, 50); g.lineTo(110, 300); g.moveTo(490, 50); g.lineTo(490, 300); g.stroke();
    g.font = F(21, 700); g.fillStyle = C.ink; g.textAlign = "center"; g.fillText("client", 110, 36); g.fillText("access point", 490, 36);
    for (var j = 0; j <= i; j++) {
      var m = M[j], y0 = 66 + j * 58, y1 = y0 + 42, f = j < i ? 1 : u, a = m[0] ? 490 : 110, b = m[0] ? 110 : 490;
      g.strokeStyle = j % 2 ? C.ice : C.gold; g.lineWidth = 3; g.beginPath(); g.moveTo(a, y0); g.lineTo(a + (b - a) * f, y0 + (y1 - y0) * f); g.stroke();
      g.font = F(20, 600); var tw = g.measureText(m[1]).width; g.fillStyle = C.bg; g.fillRect(300 - tw / 2 - 6, y0 + 4, tw + 12, 26); g.fillStyle = j % 2 ? C.ice : C.gold; g.fillText(m[1], 300, y0 + 24);
    }
    g.fillStyle = C.green; g.font = F(17, 600); g.textAlign = "left"; if (i >= 1 && u > 0.9 || i > 1) g.fillText("PTK", 30, 66 + 58 + 50); if (i >= 2 && u > 0.9 || i > 2) { g.textAlign = "right"; g.fillText("PTK", 570, 66 + 116 + 10); }
    out.textContent = M[i][2];
  }
  var film = k.loop(12, draw, { label: "Messages" });
  st.draw = function () { draw(film.t()); };
});
