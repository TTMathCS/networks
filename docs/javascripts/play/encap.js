/* books/networks/02: a web request goes down the layers on the laptop, each adding its header, crosses the wire as an
   Ethernet frame, and goes up the layers at the server, each taking its header off. Sizes from the page: TCP 20 bytes,
   IPv4 20 bytes, Ethernet 14 bytes plus a 4-byte trailer; 1,460 bytes of data fill a 1,500-byte packet. */
PLAY("encap", function (fig, k) {
  var C = k.C, F = k.F, W = 640, H = 330, st = k.stage(W, H), g = st.g, out = k.out();
  var layers = ["application", "transport", "network", "link"], ys = [70, 125, 180, 235];
  var parts = [["data 1,460", C.ice, 1460], ["TCP 20", C.green, 20], ["IP 20", C.gold, 20], ["Eth 14", C.rust, 14]];
  function packet(n, cx, y) {   // n headers on, centred at cx
    var ws = [120, 34, 34, 34], i, list = [];
    for (i = n; i >= 1; i--) list.push(i); list.push(0); if (n === 3) list.push(4);
    var w = 0; list.forEach(function (j) { w += j === 4 ? 14 : ws[j]; });
    var x = cx - w / 2;
    list.forEach(function (j) {
      var ww = j === 4 ? 14 : ws[j], col = j === 4 ? C.rust : parts[j][1];
      g.fillStyle = col; g.globalAlpha = j === 0 ? 0.35 : 0.85; g.fillRect(x, y - 15, ww, 30); g.globalAlpha = 1;
      g.strokeStyle = C.bg; g.lineWidth = 1; g.strokeRect(x, y - 15, ww, 30);
      g.fillStyle = j === 0 ? C.ink : C.bg; g.font = F(13, 600); g.textAlign = "center";
      g.fillText(j === 0 ? "data" : j === 4 ? "" : ["", "TCP", "IP", "Eth"][j], x + ww / 2, y + 4);
      x += ww;
    });
  }
  function bytes(n) { return [1460, 1480, 1500, 1518][n]; }
  function draw(t) {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.font = F(15, 500); g.textAlign = "center"; g.fillStyle = C.ink3;
    g.fillText("laptop", 130, 30); g.fillText("server", 510, 30);
    layers.forEach(function (l, i) {
      g.strokeStyle = C.line; g.lineWidth = 1; g.strokeRect(10, ys[i] - 22, 240, 44); g.strokeRect(390, ys[i] - 22, 240, 44);
      g.fillStyle = C.ink3; g.textAlign = "center"; g.fillText(l, 320, ys[i] + 4);
    });
    g.strokeStyle = C.ink3; g.lineWidth = 3; g.beginPath(); g.moveTo(130, 262); g.lineTo(130, 285); g.lineTo(510, 285); g.lineTo(510, 262); g.stroke();
    var n, cx, y, phase;
    if (t < 0.45) { var s = Math.min(3, Math.floor(t / 0.45 * 4)); n = s; cx = 130; y = ys[s]; phase = "down"; }
    else if (t < 0.55) { var u = (t - 0.45) / 0.1; n = 3; cx = 130 + 380 * u; y = ys[3] + 50 * Math.sin(Math.PI * u); phase = "wire"; }
    else { var s2 = Math.min(3, Math.floor((t - 0.55) / 0.45 * 4)); n = 3 - s2; cx = 510; y = ys[3 - s2]; phase = "up"; }
    packet(n, cx, y);
    g.textAlign = "left"; g.font = F(15, 600); g.fillStyle = C.ink;
    var what = ["the request: just data", "a TCP segment", "an IP packet", "an Ethernet frame"][n];
    g.fillText(what + ", " + bytes(n).toLocaleString("en") + " bytes", 20, 318);
    out.textContent = phase === "down" ? "Going down: each layer puts its header in front." :
      phase === "wire" ? "On the wire only the frame exists: the switch and the cable see Ethernet." :
      "Going up: each layer reads its own header, takes it off and passes the rest up.";
  }
  var film = k.loop(10, draw, { label: "Time" });
  st.draw = function () { draw(film.t()); };
});
