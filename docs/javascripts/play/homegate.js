/* topics/Firewalls: a home router's firewall. A connection your laptop starts is remembered, so its replies come back
   in; a stranger trying to start a connection to your devices is stopped, unless a port forward opens a door for one
   service. The addresses are examples. */
PLAY("homegate", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 230, st = k.stage(W, H), g = st.g, out = k.out(), sc = 0;
  var T = [["You open a website", "out", true, "Your laptop started it, so the router remembers the connection and lets the replies back in."],
    ["A stranger knocks", "in", false, "Nobody inside asked for this, and the rule list ends with “stop everything else”: blocked."],
    ["Stranger, with a port forward", "in", true, "A port forward (or UPnP) opened a door for one service: it gets through. Remove forwards you do not need."]];
  function draw(t) {
    var s = T[sc]; g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.fillStyle = C.ice; g.fillRect(40, 90, 110, 50); g.fillStyle = C.gold; g.fillRect(250, 70, 100, 90); g.fillStyle = C.ink3; g.fillRect(450, 90, 110, 50);
    g.fillStyle = C.bg; g.font = F(18, 700); g.textAlign = "center"; g.fillText("laptop", 95, 121); g.fillText("router", 300, 121); g.fillText("internet", 505, 121);
    g.fillStyle = C.ink3; g.font = F(17, 600); g.fillText("inside", 95, 60); g.fillText("outside", 505, 60);
    var x, y = 115;
    if (s[1] === "out") { x = t < 0.5 ? 95 + (505 - 95) * t * 2 : 505 - (505 - 95) * (t - 0.5) * 2; }
    else { x = s[2] ? 505 - (505 - 95) * t : (t < 0.5 ? 505 - (505 - 300) * t * 2 : 300); }
    g.fillStyle = s[2] ? C.green : C.red; g.beginPath(); g.arc(x, y + 50, 10, 0, 7); g.fill();
    if (!s[2] && t >= 0.5) { g.fillStyle = C.red; g.font = F(22, 700); g.fillText("✕ blocked", 300, 200); }
    out.textContent = s[3];
  }
  var film = k.loop(5, draw, { label: "Time" });
  k.buttons(T.map(function (s, i) { return [s[0], function () { sc = i; film.set(0); film.play(); }]; }), true);
  st.draw = function () { draw(film.t()); };
});
