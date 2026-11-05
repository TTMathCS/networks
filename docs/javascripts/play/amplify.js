/* books/security/13: reflection and amplification. The attacker sends small spoofed requests; public servers send larger
   replies to the victim. The factors are the ones in the table on this page (Rossow, 2014; memcached, 2018). */
PLAY("amplify", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 220, st = k.stage(W, H), g = st.g, out = k.out(), baf = 54, nm = "DNS (ANY)", gb = 1;
  function fmt(x) { return x >= 1000 ? (x / 1000).toLocaleString("en", { maximumFractionDigits: 1 }) + " Tbit/s" : x.toLocaleString("en", { maximumFractionDigits: 1 }) + " Gbit/s"; }
  function draw() {
    var hit = gb * baf, sc = 560 / Math.log10(hit * 10 + 1);
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    g.fillStyle = C.ink3; g.font = F(18, 600); g.fillText("attacker sends", 20, 34); g.fillStyle = C.ice; g.fillRect(20, 44, Math.max(4, Math.log10(gb * 10 + 1) * sc), 30);
    g.fillStyle = C.ink; g.font = F(19, 700); g.fillText(fmt(gb), 20, 100);
    g.fillStyle = C.ink3; g.font = F(18, 600); g.fillText("victim receives (× " + baf.toLocaleString("en") + ", " + nm + ")", 20, 134); g.fillStyle = C.red; g.fillRect(20, 144, Math.log10(hit * 10 + 1) * sc, 30);
    g.fillStyle = C.ink; g.font = F(19, 700); g.fillText(fmt(hit), 20, 200);
    g.fillStyle = C.ink3; g.font = F(16, 500); g.textAlign = "right"; g.fillText("bars on a log scale", 580, 34);
    out.textContent = fmt(gb) + " of spoofed requests through " + nm + " become " + fmt(hit) + " at the victim.";
  }
  k.buttons([["DNS ×54", function () { baf = 54; nm = "DNS (ANY)"; draw(); }], ["NTP ×557", function () { baf = 557; nm = "NTP monlist"; draw(); }], ["memcached ×51,000", function () { baf = 51000; nm = "memcached"; draw(); }]], true);
  k.slider("Attacker's sending", 0.1, 10, 0.1, gb, function (v) { return (+v).toFixed(1) + " Gbit/s"; }, function (v) { gb = +v; draw(); });
  st.draw = draw; draw();
});
