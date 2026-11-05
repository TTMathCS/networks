/* start/03-Addresses-and-Names.md: how a name is looked up, read right to left. Your computer asks a resolver; the
   resolver asks a root server where .ca is kept, then the .ca servers where akadian.ca is kept, then akadian.ca's own
   server for www. Next time the answer comes straight from the resolver's memory (its cache). Server names simplified. */
PLAY("dnswalk", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 310, st = k.stage(W, H), g = st.g, out = k.out(), cached = false;
  var N = [[60, 150, "your computer"], [230, 150, "resolver"], [440, 40, "root ( . )"], [490, 130, ".ca servers"], [440, 215, "akadian.ca server"]];
  var steps = [[0, 1, "www.akadian.ca?"], [1, 2, "www.akadian.ca?"], [2, 1, "ask the .ca servers"], [1, 3, "www.akadian.ca?"], [3, 1, "ask akadian.ca's server"], [1, 4, "www.akadian.ca?"], [4, 1, "it is at this address"], [1, 0, "here is the address"]];
  function draw(t) {
    var list = cached ? [steps[0], steps[7]] : steps, n = list.length, i = Math.min(n - 1, Math.floor(t * n)), u = t * n - i;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    N.forEach(function (p, j) { g.fillStyle = j === 1 && cached ? C.green : C.mars; g.beginPath(); g.arc(p[0], p[1], 16, 0, 7); g.fill(); g.fillStyle = C.ink2; g.font = F(13, 600); g.textAlign = "center"; g.fillText(p[2], p[0], p[1] + 34); });
    for (var j = 0; j <= i; j++) {
      var s = list[j], a = N[s[0]], b = N[s[1]], f = j < i ? 1 : Math.min(1, u * 1.4);
      g.strokeStyle = j === i ? C.gold : C.line; g.lineWidth = 2; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); g.stroke();
    }
    var cur = list[i]; g.fillStyle = C.ink; g.font = F(16, 600); g.textAlign = "left"; g.fillText((i + 1) + ". " + N[cur[0]][2] + " → " + N[cur[1]][2] + ": “" + cur[2] + "”", 20, 296);
    out.textContent = cached ? "Second time: the resolver remembers, so it answers at once." : n + " messages the first time. Press “Ask again” to see the cache.";
  }
  var film = k.loop(10, draw, { label: "Step" });
  st.draw = function () { draw(film.t()); };
  k.buttons([["First time", function () { cached = false; film.set(0); }], ["Ask again", function () { cached = true; film.set(0); }]], true);
});
