/* books/wireless/14: satellite height and delay. A signal goes up and down at the speed of light (about 300,000 km/s), so
   one ground-satellite-ground hop takes at least 2h/c; a request and its reply make two hops. The ground and satellite
   are drawn straight overhead, the shortest case; real paths are longer. */
PLAY("orbits", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 250, st = k.stage(W, H), g = st.g, out = k.out(), h = 550;
  function draw() {
    var hop = 2 * h / 299792 * 1000, rt = 2 * hop;   // ms
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    var lh = Math.log10(h), y = 200 - (lh - 2) / (Math.log10(40000) - 2) * 160;
    g.fillStyle = C.earth; g.fillRect(0, 200, W, 50);
    [[550, "LEO"], [8000, "MEO"], [35786, "GEO"]].forEach(function (o) { var yy = 200 - (Math.log10(o[0]) - 2) / (Math.log10(40000) - 2) * 160; g.strokeStyle = C.line; g.setLineDash([4, 6]); g.beginPath(); g.moveTo(330, yy); g.lineTo(590, yy); g.stroke(); g.setLineDash([]); g.fillStyle = C.ink3; g.font = F(17, 600); g.textAlign = "right"; g.fillText(o[1], 590, yy - 6); });
    g.strokeStyle = C.gold; g.lineWidth = 2.5; g.beginPath(); g.moveTo(380, 200); g.lineTo(440, y); g.lineTo(500, 200); g.stroke();
    g.fillStyle = C.ink; g.fillRect(432, y - 8, 16, 16);
    g.textAlign = "left"; g.font = F(24, 700); g.fillStyle = C.ink; g.fillText(h.toLocaleString("en") + " km up", 20, 40);
    g.font = F(20, 500); g.fillStyle = C.gold; g.fillText("one hop: " + hop.toFixed(hop < 10 ? 1 : 0) + " ms", 20, 80);
    g.fillStyle = C.ice; g.fillText("request + reply: " + rt.toFixed(rt < 10 ? 1 : 0) + " ms", 20, 112);
    g.fillStyle = C.ink3; g.font = F(17, 500); g.fillText("height on a log scale", 20, 190);
    out.textContent = "At " + h.toLocaleString("en") + " km the light-speed floor for a request and reply is " + rt.toFixed(rt < 10 ? 1 : 0) + " ms, before any processing or routing.";
  }
  var sl = k.slider("Height", 2.3, 4.6, 0.001, Math.log10(h), function (v) { return Math.round(Math.pow(10, v)).toLocaleString("en") + " km"; }, function (v) { h = Math.round(Math.pow(10, v)); draw(); });
  k.buttons([["LEO 550 km", function () { set(550); }], ["MEO 8,000 km", function () { set(8000); }], ["GEO 35,786 km", function () { set(35786); }]]);
  function set(v) { sl.value = Math.log10(v); sl.dispatchEvent(new Event("input")); h = v; draw(); }
  st.draw = draw; draw();
});
