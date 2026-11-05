/* books/security/03: the avalanche effect in SHA-256. Type anything: the page hashes it, and also the same text with one
   bit of its last letter flipped. About half of the 256 output bits change, so the hash gives nothing away about how
   close two inputs are. Hashed in your browser; nothing is sent. */
PLAY("avalanche", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 250, st = k.stage(W, H), g = st.g, out = k.out(), A = null, B = null, txt = "";
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }
  function bits(h) { var s = ""; for (var i = 0; i < h.length; i++) s += ("000" + parseInt(h[i], 16).toString(2)).slice(-4); return s; }
  function hash(s) { return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then(hex); }
  function draw() {
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    if (!A) { out.textContent = "This browser cannot hash here (it needs a secure page)."; return; }
    var a = bits(A), b = bits(B), diff = 0;
    for (var i = 0; i < 256; i++) { var x = 20 + (i % 32) * 17.5, y = 70 + Math.floor(i / 32) * 17.5, d = a[i] !== b[i]; if (d) diff++; g.fillStyle = d ? C.gold : "rgba(244,230,212,0.13)"; g.fillRect(x, y, 14, 14); }
    g.textAlign = "left"; g.fillStyle = C.ink; g.font = F(17, 500, "m"); g.fillText(A.slice(0, 32) + "…", 20, 26);
    g.fillStyle = C.ink3; g.fillText(B.slice(0, 32) + "…", 20, 52);
    g.fillStyle = C.gold; g.font = F(20, 700); g.fillText(diff + " of 256 bits changed", 20, 236);
    out.textContent = "Flipping one bit of the input changed " + diff + " output bits (" + Math.round(diff / 2.56) + "%).";
  }
  k.text("Text to hash", "Hello, Mars", function (v) {
    txt = v || " "; var last = txt.charCodeAt(txt.length - 1), other = txt.slice(0, -1) + String.fromCharCode(last ^ 1);
    if (!(window.crypto && crypto.subtle)) { draw(); return; }
    Promise.all([hash(txt), hash(other)]).then(function (r) { if (v === undefined || (v || " ") === txt) { A = r[0]; B = r[1]; draw(); } });
  });
  st.draw = draw; draw();
});
