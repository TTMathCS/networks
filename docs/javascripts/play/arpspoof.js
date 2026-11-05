/* books/security/05: ARP spoofing. The attacker keeps telling the victim "the router's address is at my MAC", and the
   newest reply wins, so the victim's frames for the internet go to the attacker, who passes them on. The addresses are
   examples from a home network. */
PLAY("arpspoof", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 290, st = k.stage(W, H), g = st.g, out = k.out(), dai = false;
  var V = [90, 210], R = [510, 210], A = [300, 70];
  function box(p, t, c) { g.fillStyle = c; g.fillRect(p[0] - 60, p[1] - 22, 120, 44); g.fillStyle = C.bg; g.font = F(18, 700); g.textAlign = "center"; g.fillText(t, p[0], p[1] + 6); }
  function dot(a, b, u, c) { g.fillStyle = c; g.beginPath(); g.arc(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, 9, 0, 7); g.fill(); }
  function draw(t) {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var poisoned = !dai && t > 0.3;
    box(V, "victim", C.ice); box(R, "router", C.green); box(A, "attacker", C.red);
    g.textAlign = "left"; g.font = F(17, 600, "m"); g.fillStyle = poisoned ? C.red : C.ink2;
    g.fillText("victim's table: .1 → " + (poisoned ? "aa:aa (attacker)" : "rr:rr (router)"), 20, 276);
    if (t < 0.3) { var u = t / 0.3; dot(A, V, u, C.red); g.fillStyle = C.red; g.font = F(17, 600); g.textAlign = "center"; g.fillText("“.1 is at aa:aa”", 160, 120); if (dai && u > 0.5) { g.fillStyle = C.green; g.fillText("dropped by the switch", 300, 150); } }
    else {
      var v = ((t - 0.3) / 0.7 * 3) % 1;
      if (poisoned) { if (v < 0.5) dot(V, A, v * 2, C.ice); else dot(A, R, (v - 0.5) * 2, C.ice); }
      else dot(V, R, v, C.ice);
    }
    out.textContent = dai ? "Dynamic ARP Inspection drops the fake reply: the victim's frames go straight to the router." : poisoned ? "The fake reply won: every frame for the internet now passes through the attacker." : "The attacker sends an ARP reply nobody asked for.";
  }
  var film = k.loop(9, draw, { label: "Time" });
  k.buttons([["No protection", function () { dai = false; film.set(0); film.play(); }], ["Switch checks ARP", function () { dai = true; film.set(0); film.play(); }]], true);
  st.draw = function () { draw(film.t()); };
});
