/* books/wireless/04: link adaptation with Wi-Fi 6's MCS table (one stream, 20 MHz, 0.8 µs guard interval, from this
   page). The access point picks the fastest MCS whose S/N need, taken at the top of its range here, the link meets;
   wider channels and more streams multiply the rate. */
PLAY("mcs", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 250, st = k.stage(W, H), g = st.g, out = k.out(), snr = 26, wide = 4.2, wname = "80 MHz", ns = 2;
  var T = [[0, "BPSK 1/2", 8.6, 5], [1, "QPSK 1/2", 17.2, 8], [3, "16-QAM 1/2", 34.4, 15], [5, "64-QAM 2/3", 68.8, 22], [7, "64-QAM 5/6", 86.0, 25], [9, "256-QAM 5/6", 114.7, 31], [11, "1024-QAM 5/6", 143.4, 35]];
  function draw() {
    var pick = -1; T.forEach(function (r, i) { if (snr >= r[3]) pick = i; });
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    T.forEach(function (r, i) {
      var y = 22 + i * 26, on = i === pick, ok = snr >= r[3];
      g.fillStyle = on ? C.gold : ok ? C.ink2 : "rgba(244,230,212,0.3)"; g.font = F(17, on ? 700 : 500, "m");
      g.fillText("MCS " + r[0], 20, y + 14); g.fillText(r[1], 110, y + 14); g.fillText("needs " + r[3] + " dB", 290, y + 14);
      if (on) { g.fillRect(14, y, 4, 20); }
    });
    var rate = pick < 0 ? 0 : T[pick][2] * wide * ns;
    out.textContent = pick < 0 ? "At " + snr + " dB no MCS works: the link drops." : "At " + snr + " dB: MCS " + T[pick][0] + ", " + T[pick][2] + " Mbit/s per stream in 20 MHz; × " + wide + " for " + wname + " × " + ns + " stream" + (ns > 1 ? "s" : "") + " ≈ " + Math.round(rate).toLocaleString("en") + " Mbit/s link rate.";
    g.textAlign = "right"; g.fillStyle = C.ink; g.font = F(30, 700); g.fillText(Math.round(rate).toLocaleString("en"), 580, 60); g.fillStyle = C.ink3; g.font = F(17, 500); g.fillText("Mbit/s link rate", 580, 84);
  }
  k.slider("Signal to noise", 0, 40, 1, snr, function (v) { return v + " dB"; }, function (v) { snr = +v; draw(); });
  k.buttons([["80 MHz", function () { wide = 4.2; wname = "80 MHz"; draw(); }], ["20 MHz", function () { wide = 1; wname = "20 MHz"; draw(); }], ["160 MHz", function () { wide = 8.3; wname = "160 MHz"; draw(); }]], true);
  k.buttons([["2 streams", function () { ns = 2; draw(); }], ["1 stream", function () { ns = 1; draw(); }], ["4 streams", function () { ns = 4; draw(); }]], true);
  st.draw = draw; draw();
});
