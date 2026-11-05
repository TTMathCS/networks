/* books/wireless/11: UWB ranging. The phone times a pulse to the car and back: distance = c × round trip ÷ 2, and light
   covers about 30 cm in a nanosecond. A relay attacker can make a far phone sound near, but every relay adds time, so
   the measured distance only grows. The unlock distance of 2 m and the relay's 100 ns are made-up examples. */
PLAY("uwb", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 220, st = k.stage(W, H), g = st.g, out = k.out(), d = 1.5, relay = false;
  function draw() {
    var rt = 2 * d / 0.299792 + (relay ? 100 : 0), meas = rt * 0.299792 / 2, open = meas <= 2;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    var px = 30 + Math.min(1, d / 50) * 420;
    g.fillStyle = C.ice; g.fillRect(px - 10, 90, 20, 36); g.fillStyle = open ? C.green : C.ink3; g.fillRect(500, 80, 80, 50);
    g.fillStyle = C.bg; g.font = F(18, 700); g.textAlign = "center"; g.fillText("car", 540, 112);
    g.fillStyle = C.ink2; g.font = F(17, 600); g.fillText("phone", px, 150);
    if (relay) { g.fillStyle = C.red; g.fillRect(380, 96, 40, 24); g.fillStyle = C.red; g.fillText("relay", 400, 150); }
    g.textAlign = "left"; g.fillStyle = C.ink; g.font = F(20, 700); g.fillText("round trip " + rt.toFixed(1) + " ns → " + meas.toFixed(2) + " m", 20, 34);
    g.fillStyle = open ? C.green : C.red; g.font = F(20, 700); g.fillText(open ? "unlocks (2 m or less)" : "stays locked", 20, 200);
    out.textContent = relay ? "The relay adds 100 ns, so the car measures " + meas.toFixed(1) + " m even with the phone " + d + " m away: it cannot be fooled into thinking the phone is closer." : "Phone " + d + " m away: the pulse's round trip takes " + rt.toFixed(1) + " ns.";
  }
  k.slider("Real distance", 0.5, 50, 0.5, d, function (v) { return v + " m"; }, function (v) { d = +v; draw(); });
  k.buttons([["Honest", function () { relay = false; draw(); }], ["Relay attack", function () { relay = true; draw(); }]], true);
  st.draw = draw; draw();
});
