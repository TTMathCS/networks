/* books/security/14: SQL injection. The unsafe code glues the input into the query, so a quote in the input ends the
   string and the rest becomes SQL. The parameterised query sends the input separately, so it is only ever a name. The
   three-user table is made up. */
PLAY("sqli", function (fig, k) {
  var C = k.C, F = k.F, W = 600, H = 250, st = k.stage(W, H), g = st.g, out = k.out(), name = "alice", safe = false, U = ["alice", "bob", "carol"];
  function run() {   // a tiny reader for the WHERE part, enough for this example
    if (safe) return { rows: U.filter(function (u) { return u === name; }), q: "SELECT * FROM users WHERE name = ?", d: "with ? = " + JSON.stringify(name) };
    var q = "SELECT * FROM users WHERE name = '" + name + "'", w = "name = '" + name + "'";
    var cut = w.indexOf("--"); if (cut >= 0) w = w.slice(0, cut);
    if ((w.split("'").length - 1) % 2) return { err: true, q: q };
    var parts = w.split(/\s+OR\s+/i), rows = [];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim(), m;
      if ((m = p.match(/^name\s*=\s*'([^']*)'$/i))) { if (U.indexOf(m[1]) >= 0 && rows.indexOf(m[1]) < 0) rows.push(m[1]); }
      else if ((m = p.match(/^'([^']*)'\s*=\s*'([^']*)'$/)) || (m = p.match(/^(\d+)\s*=\s*(\d+)$/))) { if (m[1] === m[2]) rows = U.slice(); }
      else return { err: true, q: q };
    }
    return { rows: rows, q: q };
  }
  function wrap(s, n) { var out = []; while (s.length > n) { out.push(s.slice(0, n)); s = s.slice(n); } out.push(s); return out; }
  function draw() {
    var r = run(); g.fillStyle = C.bg; g.fillRect(0, 0, W, H); g.textAlign = "left";
    g.fillStyle = safe ? C.green : C.gold; g.font = F(18, 600); g.fillText(safe ? "parameterised: the input is sent apart" : "unsafe: the input is glued into the SQL", 20, 30);
    g.font = F(18, 500, "m"); g.fillStyle = C.ink; wrap(r.q + (r.d ? "  " + r.d : ""), 46).slice(0, 4).forEach(function (l, i) { g.fillText(l, 20, 64 + i * 26); });
    g.font = F(21, 700);
    if (r.err) { g.fillStyle = C.red; g.fillText("the database reports a syntax error", 20, 210); out.textContent = "The quote broke the query: an attacker learns the input reaches the SQL."; }
    else { g.fillStyle = r.rows.length > 1 ? C.red : C.ink; g.fillText("rows returned: " + (r.rows.length ? r.rows.join(", ") : "none"), 20, 210); out.textContent = r.rows.length > 1 ? "The input changed the query's meaning: every user comes back." : "The input was treated as a name."; }
  }
  var tx = k.text("Name typed in the form", name, function (v) { name = v; draw(); });
  k.buttons([["Unsafe", function () { safe = false; draw(); }], ["Parameterised", function () { safe = true; draw(); }]], true);
  k.buttons([["Try  ' OR '1'='1", function () { tx.value = "' OR '1'='1"; tx.dispatchEvent(new Event("input")); }]]);
  st.draw = draw; draw();
});
