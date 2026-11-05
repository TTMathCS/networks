/* books/math/02: slotted ALOHA. Stations send in time slots at random; a slot works only if exactly one station sends.
   With an average load of G sends a slot, the share of useful slots is G·e^(−G), best at G = 1: 1/e, about 37%. Press
   Play to run 200 slots (a Poisson number of senders each slot). */
PLAY("aloha", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 260, st = k.stage(W, H), g = st.g, out = k.out(), G = 1, slots, seed = 5;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function poisson(l) { var L = Math.exp(-l), p = 1, n = 0; do { n++; p *= rnd(); } while (p > L); return n - 1; }
  function make() { seed = 5; slots = []; for (var i = 0; i < 200; i++) slots.push(poisson(G)); }
  function draw(t) {
    var n = Math.floor(t * 200), ok = 0, i;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    for (i = 0; i < n; i++) { var s = slots[i], x = 20 + (i % 40) * 14, y = 20 + Math.floor(i / 40) * 26; if (s === 1) ok++; g.fillStyle = s === 0 ? C.bg2 : s === 1 ? C.green : C.red; g.fillRect(x, y, 12, 22); }
    g.font = F(20, 500); g.textAlign = "left"; g.fillStyle = C.green; g.fillText("one sender: works", 20, 166); g.fillStyle = C.red; g.fillText("two or more: clash", 220, 166); g.fillStyle = C.ink3; g.fillText("empty", 410, 166);
    var th = G * Math.exp(-G); g.fillStyle = C.ink; g.font = F(24, 700);
    g.fillText("useful: " + (n ? (ok / n * 100).toFixed(0) : 0) + "% of slots so far", 20, 200); g.font = F(21, 500); g.fillStyle = C.ink2; g.fillText("theory, G·e^(−G): " + (th * 100).toFixed(1) + "%", 20, 226);
    out.textContent = G < 1 ? "Light load: many slots go empty." : G > 1 ? "Heavy load: collisions eat the slots." : "G = 1: the best ALOHA can do.";
  }
  make();
  var film = k.loop(10, draw, { label: "Slots", start0: true });
  st.draw = function () { draw(film.t()); };
  k.slider("Load G", 0.1, 3, 0.1, G, function (v) { return v.toFixed(1); }, function (v) { G = v; make(); draw(film.t()); });
});
