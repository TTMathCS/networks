/* start/06-Talking-to-Mars.md (also on akadian.ca communication.html): Earth and Mars on their real orbits from January 2026 to mid-2030. The line between them is the
   radio path; the numbers are its length and the time light takes along it. Near conjunction, when Mars is within
   about 2.2° of the Sun as seen from Earth, mission teams stop sending commands (11 to 25 November 2023 was 2.2° to 2.0°). */
PLAY("delay", function (fig, k) {
  var C = k.C, F = k.F, AU = 149.598, LIGHT = 299792.458;   // million km; km per second
  var A = Date.UTC(2026, 0, 1), B = Date.UTC(2030, 6, 1), W = 600, H = 520, S = 120, cx = 300, cy = 308;
  var st = k.stage(W, H), g = st.g, out = k.out(), pulse = 0;
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function path(name) {   // the whole orbit, drawn once from a year of dates
    g.beginPath();
    for (var i = 0; i <= 120; i++) { var p = k.orbit(name, A + i * (name === "mars" ? 687 : 366) / 120 * 864e5); g[i ? "lineTo" : "moveTo"](cx + p.x * S, cy - p.y * S); }
    g.stroke();
  }
  function draw(t, moving) {
    var day = A + t * (B - A), e = k.orbit("earth", day), m = k.orbit("mars", day);
    var dx = m.x - e.x, dy = m.y - e.y, d = Math.hypot(dx, dy), km = d * AU, min = km * 1e6 / LIGHT / 60;
    var el = Math.acos(Math.max(-1, Math.min(1, (-e.x * dx - e.y * dy) / (Math.hypot(e.x, e.y) * d)))) * 180 / Math.PI;
    var blocked = el < 2.2;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    g.lineWidth = 1.5; g.strokeStyle = "rgba(156,201,234,0.35)"; path("earth");
    g.strokeStyle = "rgba(238,166,111,0.35)"; path("mars");
    var ex = cx + e.x * S, ey = cy - e.y * S, mx = cx + m.x * S, my = cy - m.y * S;
    // the radio path, and a pulse running along it
    g.setLineDash([5, 6]); g.strokeStyle = blocked ? "rgba(217,96,59,0.8)" : "rgba(244,230,212,0.55)"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ex, ey); g.lineTo(mx, my); g.stroke(); g.setLineDash([]);
    if (!blocked) {
      pulse = moving ? (pulse + 0.012 * 9 / min) % 1 : 0.5;
      g.fillStyle = C.gold; g.beginPath(); g.arc(ex + (mx - ex) * pulse, ey + (my - ey) * pulse, 5, 0, 7); g.fill();
    }
    var sun = g.createRadialGradient(cx, cy, 2, cx, cy, blocked ? 34 : 22);
    sun.addColorStop(0, "#fff6d8"); sun.addColorStop(0.4, C.gold); sun.addColorStop(1, "rgba(246,196,83,0)");
    g.fillStyle = sun; g.beginPath(); g.arc(cx, cy, blocked ? 34 : 22, 0, 7); g.fill();
    g.fillStyle = C.earth; g.beginPath(); g.arc(ex, ey, 9, 0, 7); g.fill();
    g.fillStyle = C.mars; g.beginPath(); g.arc(mx, my, 7, 0, 7); g.fill();
    g.font = F(22, 600); g.fillStyle = C.ice; g.fillText("Earth", ex + 13, ey + 6);
    g.fillStyle = C.rust; g.fillText("Mars", mx + 11, my + 6);
    var dt = new Date(day);
    g.fillStyle = C.ink; g.font = F(30, 600, "d"); g.fillText(MON[dt.getUTCMonth()] + " " + dt.getUTCFullYear(), 22, 44);
    g.textAlign = "right"; g.font = F(30, 600, "d"); g.fillStyle = blocked ? C.red : C.gold;
    g.fillText(blocked ? "Behind the Sun" : min.toFixed(1) + " min", W - 22, 44);
    g.font = F(20, 500); g.fillStyle = C.ink2;
    g.fillText(blocked ? "no commands for two weeks" : "one way, at light speed", W - 22, 72);
    g.textAlign = "left"; g.fillText(Math.round(km) + " million km apart", 22, 72);
    out.textContent = MON[dt.getUTCMonth()] + " " + dt.getUTCFullYear() + ": Mars is " + Math.round(km) + " million km away, so a message takes " +
      min.toFixed(1) + " minutes each way and an answer comes back after " + Math.round(2 * min) + " minutes at the earliest." +
      (blocked ? " Mars is behind the Sun: teams stop sending commands." : "");
  }
  st.draw = function () { draw(film.t(), false); };
  var film = k.loop(36, draw, { start0: true, label: "Date" });
});
