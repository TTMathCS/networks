/* books/networks/14: one computer, one address, many programs. Each arriving packet carries a destination port, and
   the operating system hands it to the program listening on that port: 443 for HTTPS, 53 for DNS, 22 for SSH. A packet
   for a port nobody is listening on is refused. */
PLAY("ports", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 290, st = k.stage(W, H), g = st.g, out = k.out();
  var apps = [[443, "web server (HTTPS)", 60], [53, "DNS server", 130], [22, "SSH server", 200]], pk = [443, 53, 443, 8080, 22, 443];
  function draw(t) {
    var n = pk.length, i = Math.min(n - 1, Math.floor(t * n)), u = t * n - i;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.fillStyle = C.bg2; g.fillRect(250, 30, 330, 240); g.strokeStyle = C.line; g.strokeRect(250, 30, 330, 240);
    g.fillStyle = C.ink3; g.font = F(13, 500); g.textAlign = "left"; g.fillText("one computer, 192.0.2.10", 260, 22);
    apps.forEach(function (a) { g.fillStyle = C.mars; g.fillRect(400, a[2] - 18, 170, 36); g.fillStyle = C.bg; g.font = F(13, 700); g.fillText(":" + a[0] + "  " + a[1], 408, a[2] + 5); });
    var p = pk[i], app = apps.filter(function (a) { return a[0] === p; })[0], ty = app ? app[2] : 250;
    var x = u < 0.5 ? 20 + 240 * u * 2 : 260 + (app ? 130 : 60) * (u - 0.5) * 2, y = u < 0.5 ? 150 : 150 + (ty - 150) * (u - 0.5) * 2;
    g.fillStyle = app ? C.gold : C.red; g.fillRect(x - 28, y - 12, 56, 24); g.fillStyle = C.bg; g.font = F(13, 700, "m"); g.textAlign = "center"; g.fillText(":" + p, x, y + 5);
    if (!app && u > 0.75) { g.fillStyle = C.red; g.font = F(13, 600); g.fillText("refused", 320, 250); }
    out.textContent = "Packet " + (i + 1) + " for port " + p + ": " + (app ? "handed to the " + app[1] + "." : "nobody listens on " + p + ", so the computer refuses it.");
  }
  var film = k.loop(12, draw, { label: "Packets" });
  st.draw = function () { draw(film.t()); };
});
