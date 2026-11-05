/* books/security/11: a stateless packet filter reads its rules top to bottom and the first match decides. The three rules
   are the example on this page (203.0.113.x is an address range set aside for examples). Pick a packet to send. */
PLAY("firstmatch", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 250, st = k.stage(W, H), g = st.g, out = k.out(), pk = 0;
  var R = [["permit tcp to .10 port 443", function (p) { return p[1] === 10 && p[2] === 443; }, true], ["permit tcp to .20 port 25", function (p) { return p[1] === 20 && p[2] === 25; }, true], ["deny everything else", function () { return true; }, false]];
  var P = [["web visit to .10:443", 10, 443], ["mail to .20:25", 20, 25], ["SSH to .10:22", 10, 22], ["web visit to .20:443", 20, 443]];
  function draw() {
    var p = P[pk], hit = 0; while (!R[hit][1](p)) hit++;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    g.fillStyle = C.ink; g.font = F(20, 600); g.fillText("packet: " + p[0], 20, 34);
    R.forEach(function (r, i) {
      var y = 64 + i * 52, on = i === hit, past = i < hit;
      g.fillStyle = on ? (r[2] ? "rgba(159,201,138,0.25)" : "rgba(217,96,59,0.3)") : "rgba(244,230,212,0.06)"; g.fillRect(20, y, 560, 42);
      g.fillStyle = on ? (r[2] ? C.green : C.red) : past ? C.ink3 : C.ink2; g.font = F(19, on ? 700 : 500, "m"); g.fillText((i + 1) + ". " + r[0], 34, y + 28);
      if (past) { g.textAlign = "right"; g.font = F(17, 500); g.fillText("no match", 570, y + 28); g.textAlign = "left"; }
      if (on) { g.textAlign = "right"; g.font = F(18, 700); g.fillText(r[2] ? "let in" : "dropped", 570, y + 28); g.textAlign = "left"; }
    });
    out.textContent = "Rule " + (hit + 1) + " is the first that matches, so the packet is " + (R[hit][2] ? "let in." : "dropped.");
  }
  k.buttons(P.map(function (p, i) { return [p[0], function () { pk = i; draw(); }]; }), true);
  st.draw = draw; draw();
});
