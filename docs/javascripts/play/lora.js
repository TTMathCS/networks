/* books/wireless/12: LoRa's spreading factor. Each step from SF7 to SF12 doubles the time per symbol and gains about
   2.5 dB of sensitivity (this page). In open air, 2.5 dB is about a third more distance (free-space loss grows 6 dB per
   doubling of distance); buildings and ground cut real ranges well below that. */
PLAY("lora", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 240, st = k.stage(W, H), g = st.g, out = k.out(), sf = 7;
  function draw() {
    var s = sf - 7, time = Math.pow(2, s), reach = Math.pow(10, 2.5 * s / 20);
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    g.fillStyle = C.ink3; g.font = F(18, 600); g.fillText("time on air for one message", 20, 32);
    g.fillStyle = C.gold; g.fillRect(20, 44, 560 * time / 32, 28);
    g.fillStyle = C.ink; g.font = F(19, 700); g.fillText("× " + time + " of SF7", 20, 98);
    g.fillStyle = C.ink3; g.font = F(18, 600); g.fillText("reach in open air", 20, 140);
    g.fillStyle = C.ice; g.fillRect(20, 152, 560 * reach / 2.06, 28);
    g.fillStyle = C.ink; g.font = F(19, 700); g.fillText("× " + reach.toFixed(2) + " of SF7, +" + (2.5 * s).toFixed(1) + " dB", 20, 206);
    out.textContent = sf === 7 ? "SF7 is the fastest setting: the shortest time on air and the shortest reach." : "SF" + sf + ": each message takes " + time + "× as long as at SF7, so under a 1% duty cycle a device can send " + time + "× fewer messages an hour.";
  }
  k.slider("Spreading factor", 7, 12, 1, sf, function (v) { return "SF" + v; }, function (v) { sf = +v; draw(); });
  st.draw = draw; draw();
});
