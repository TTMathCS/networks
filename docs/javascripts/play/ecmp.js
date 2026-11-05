/* books/networks/21: ECMP. Each flow is hashed (from its addresses and ports) to one of four spine switches, so a flow
   always takes one path. Hashing spreads flows evenly on average, but two big flows can land on the same spine while
   another idles. The flows and their sizes are made up; Reshuffle gives them new port numbers. */
PLAY("ecmp", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 270, st = k.stage(W, H), g = st.g, out = k.out(), seed = 7, flows;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function make() { flows = []; for (var i = 0; i < 8; i++) flows.push({ size: i < 2 ? 4 : 1, spine: Math.floor(rnd() * 4) }); }
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var load = [0, 0, 0, 0]; flows.forEach(function (f) { load[f.spine] += f.size; });
    for (var s = 0; s < 4; s++) {
      var x = 90 + s * 140; g.fillStyle = C.ice; g.fillRect(x - 40, 30, 80, 30); g.fillStyle = C.bg; g.font = F(17, 700); g.textAlign = "center"; g.fillText("spine " + (s + 1), x, 51);
      var h = load[s] * 16; g.fillStyle = load[s] > 5 ? C.red : C.gold; g.fillRect(x - 30, 236 - h, 60, h);
      g.fillStyle = C.ink; g.font = F(18, 700); g.fillText(load[s] + " Gbit/s", x, 228 - h);
    }
    g.strokeStyle = C.line; g.beginPath(); g.moveTo(20, 236); g.lineTo(580, 236); g.stroke();
    var mx = Math.max.apply(null, load), idle = load.filter(function (v) { return v === 0; }).length;
    out.textContent = "Two 4 Gbit/s flows and six 1 Gbit/s flows (14 in all, 3.5 per spine if perfectly even): the busiest spine carries " + mx + (idle ? ", while " + idle + " carr" + (idle > 1 ? "y" : "ies") + " nothing." : ".");
  }
  k.buttons([["Reshuffle the flows", function () { make(); draw(); }]]);
  make(); st.draw = draw; draw();
});
