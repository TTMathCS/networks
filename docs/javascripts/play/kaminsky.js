/* books/security/07: guessing a DNS answer off-path. Each forged answer must match the 16-bit transaction ID, and after
   the 2008 fix also a random source port (about 2^16 more choices). The attack rate is a made-up example: one new
   random name every 0.1 s, each raced with the number of forged answers you choose. */
PLAY("kaminsky", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 210, st = k.stage(W, H), g = st.g, out = k.out(), forged = 100, port = false;
  function span(s) { return s < 60 ? Math.round(s) + " seconds" : s < 3600 ? Math.round(s / 60) + " minutes" : s < 86400 * 2 ? (s / 3600).toFixed(1) + " hours" : s < 3.156e7 * 2 ? Math.round(s / 86400) + " days" : Math.round(s / 3.156e7) + " years"; }
  function draw() {
    var space = port ? 65536 * 65536 : 65536, p = Math.min(1, forged / space), tries = 1 / p, secs = tries * 0.1;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    g.fillStyle = C.ink3; g.font = F(19, 500); g.fillText(port ? "ID and port to guess: about 4.3 billion choices" : "only the 16-bit ID to guess: 65,536 choices", 20, 36);
    g.fillStyle = C.ink; g.font = F(20, 600); g.fillText("chance per race: 1 in " + Math.round(tries).toLocaleString("en"), 20, 82);
    g.fillStyle = port ? C.green : C.red; g.font = F(30, 700); g.fillText("expected time: " + span(secs), 20, 136);
    g.fillStyle = C.ink3; g.font = F(17, 500); g.fillText("one race every 0.1 s, a fresh random name each time", 20, 190);
    out.textContent = port ? "With a random source port too, the same attack takes " + span(secs) + "." : "With a fixed port, a new name each race wins in about " + span(secs) + ".";
  }
  k.slider("Forged answers per race", 10, 1000, 10, forged, function (v) { return v; }, function (v) { forged = +v; draw(); });
  k.buttons([["Fixed port (before 2008)", function () { port = false; draw(); }], ["Random port", function () { port = true; draw(); }]], true);
  st.draw = draw; draw();
});
