/* books/security/06: a prefix hijack. Routers send each packet by the most specific matching prefix, so a /24 announced
   inside someone's /22 wins everywhere it is believed. RPKI lets routers drop announcements whose origin is not
   authorised. The prefixes (198.51.100.0 is a range set aside for examples) and networks are made up. */
PLAY("hijack", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 250, st = k.stage(W, H), g = st.g, out = k.out(), mode = 0;
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    var rows = [["198.51.100.0/22", "the owner", C.green, true]];
    if (mode >= 1) rows.push(["198.51.101.0/24", "the hijacker", C.red, mode === 1]);
    g.fillStyle = C.ink3; g.font = F(18, 600); g.fillText("a router's table", 20, 30);
    rows.forEach(function (r, i) {
      var y = 46 + i * 50; g.fillStyle = r[3] ? "rgba(244,230,212,0.08)" : "rgba(217,96,59,0.12)"; g.fillRect(20, y, 560, 40);
      g.fillStyle = r[3] ? r[2] : C.ink3; g.font = F(19, 700, "m"); g.fillText(r[0], 32, y + 27); g.font = F(18, 600); g.fillText(r[3] ? "from " + r[1] : "dropped: RPKI says invalid", 290, y + 27);
    });
    var hij = mode === 1;
    g.fillStyle = C.ink; g.font = F(19, 600); g.fillText("packet for 198.51.101.7 goes to:", 20, 180);
    g.fillStyle = hij ? C.red : C.green; g.font = F(26, 700); g.fillText(hij ? "the hijacker (/24 is more specific)" : "the owner", 20, 216);
    out.textContent = mode === 0 ? "Only the owner's /22 is announced." : hij ? "The /24 covers fewer addresses, so it is more specific and wins: a quarter of the owner's range is pulled away." : "With RPKI, the /24 from an unauthorised network is rejected and traffic stays with the owner.";
  }
  k.buttons([["Normal", function () { mode = 0; draw(); }], ["Hijacker announces a /24", function () { mode = 1; draw(); }], ["With RPKI", function () { mode = 2; draw(); }]], true);
  st.draw = draw; draw();
});
