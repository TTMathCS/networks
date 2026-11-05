/* books/security/17: a SYN scan of your own machine. A SYN goes to each port; SYN-ACK means open (the scanner answers
   RST and never finishes the handshake), RST means closed, and silence means a firewall dropped it. The machine and its
   ports are made up. */
PLAY("portscan", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 300, st = k.stage(W, H), g = st.g, out = k.out();
  var P = [[22, "open", "SSH"], [25, "closed", "mail"], [80, "open", "web"], [443, "open", "web (TLS)"], [3389, "filtered", "remote desktop"], [8080, "closed", "test web"]];
  function draw(t) {
    var n = P.length, i = Math.min(n - 1, Math.floor(t * n)), u = (t * n - i);
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    g.fillStyle = C.ink3; g.font = F(18, 600); g.fillText("scanner", 20, 26); g.textAlign = "right"; g.fillText("your machine", 580, 26);
    for (var j = 0; j <= i; j++) {
      var p = P[j], y = 50 + j * 36, f = j < i ? 1 : u, col = p[1] === "open" ? C.green : p[1] === "closed" ? C.gold : C.red;
      g.strokeStyle = C.ink3; g.lineWidth = 2; g.beginPath(); g.moveTo(110, y); g.lineTo(110 + 220 * Math.min(1, f * 2), y); g.stroke();
      if (f > 0.5 && p[1] !== "filtered") { g.strokeStyle = col; g.beginPath(); g.moveTo(330, y + 10); g.lineTo(330 - 220 * Math.min(1, (f - 0.5) * 2), y + 10); g.stroke(); }
      g.textAlign = "left"; g.fillStyle = C.ink2; g.font = F(18, 700, "m"); g.fillText(p[0], 20, y + 10);
      if (f >= 1 || j < i) { g.fillStyle = col; g.font = F(18, 700); g.fillText(p[1] + " · " + p[2], 350, y + 10); }
    }
    var p = P[i]; out.textContent = "Port " + p[0] + ": " + (p[1] === "open" ? "SYN-ACK came back, so it is open (" + p[2] + "); the scanner sends RST." : p[1] === "closed" ? "RST came back: closed, nothing listening." : "no answer: filtered, a firewall dropped the probe.");
  }
  var film = k.loop(12, draw, { label: "Ports" });
  st.draw = function () { draw(film.t()); };
});
