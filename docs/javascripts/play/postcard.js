/* start/05-Staying-Safe.md: a message passes through four routers on its way. Without encryption each one can read it,
   like a postcard; with HTTPS (the padlock) they see only scrambled bytes, and only the website can read it. The
   scrambled text here is made up for the picture. */
PLAY("postcard", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 260, st = k.stage(W, H), g = st.g, out = k.out(), lock = false;
  var MSG = "password: rover42", SCR = "8f 3a c1 0d 9e 77 b2 4c";
  function draw(t) {
    var xs = [40, 150, 260, 370, 480, 570], pos = t * (xs.length - 1), i = Math.min(xs.length - 2, Math.floor(pos)), x = xs[i] + (xs[i + 1] - xs[i]) * (pos - i);
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = C.line; g.lineWidth = 3; g.beginPath(); g.moveTo(40, 120); g.lineTo(570, 120); g.stroke();
    xs.forEach(function (px, j) { g.fillStyle = j === 0 || j === 5 ? C.gold : C.ink3; g.beginPath(); g.arc(px, 120, j === 0 || j === 5 ? 12 : 9, 0, 7); g.fill(); });
    g.font = F(13, 500); g.fillStyle = C.ink2; g.textAlign = "center"; g.fillText("you", 40, 150); g.fillText("website", 570, 150);
    for (var j = 1; j < 5; j++) if (pos >= j) { g.fillStyle = lock ? C.green : C.red; g.font = F(12, 600); g.fillText(lock ? "can't read" : "reads it", xs[j], 100); }
    g.fillStyle = lock ? C.green : C.red; g.fillRect(x - 16, 108, 32, 24);
    g.font = F(17, 600, "m"); g.textAlign = "left"; g.fillStyle = C.ink;
    g.fillText("what the routers see: " + (lock ? SCR : MSG), 20, 210);
    g.font = F(15, 600); g.fillStyle = lock ? C.green : C.red; g.fillText(lock ? "🔒 HTTPS" : "no padlock", 20, 36);
    out.textContent = lock ? "Locked: only the website has the key to read it." : "A postcard: anyone handling it on the way can read it.";
  }
  var film = k.loop(7, draw, { label: "Time" });
  st.draw = function () { draw(film.t()); };
  k.buttons([["No padlock", function () { lock = false; film.set(0); }], ["With HTTPS", function () { lock = true; film.set(0); }]], true);
});
