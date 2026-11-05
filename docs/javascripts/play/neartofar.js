/* topics/Internet-Is-Down: the near-to-far checks from this page. Pick what is really broken, then run the five steps:
   the first that fails shows where the problem is. */
PLAY("neartofar", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 280, st = k.stage(W, H), g = st.g, out = k.out(), fault = 2;
  var S = ["1. connected, with an address?", "2. ping the router", "3. ping 1.1.1.1", "4. nslookup a name", "5. other sites work?"];
  var where = ["your device's Wi-Fi", "Wi-Fi or cable to the router", "the router's link to your provider", "DNS: try another resolver", "that one site: wait"];
  function draw(t) {
    var n = Math.min(5, Math.floor(t * 6)); g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    for (var i = 0; i < 5; i++) {
      var y = 20 + i * 48, done = i < n, ok = i < fault, stop = i === fault;
      g.fillStyle = done && stop ? "rgba(217,96,59,0.25)" : "rgba(244,230,212,0.06)"; g.fillRect(20, y, 560, 40);
      g.fillStyle = !done || i > fault ? C.ink3 : ok ? C.green : C.red; g.font = F(19, 600); g.fillText(S[i], 32, y + 27);
      if (done && i <= fault) { g.textAlign = "right"; g.font = F(19, 700); g.fillText(ok ? "✓" : "✕ stop here", 570, y + 27); g.textAlign = "left"; }
    }
    out.textContent = n > fault ? "Step " + (fault + 1) + " fails: the problem is " + where[fault] + "." : "Checking from near to far…";
  }
  var film = k.loop(6, draw, { label: "Steps" });
  k.buttons(["Wi-Fi off", "Bad cable", "Provider down", "DNS broken", "One site down"].map(function (b, i) { return [b, function () { fault = i; film.set(0); film.play(); }]; }), true);
  st.draw = function () { draw(film.t()); };
});
