// Where each page of networks.akadian.ca sits on the shared ladder Beginner, Intermediate, Expert.
// reader.js (the same on cs, math, cryptography and networks) draws the badge; only this file differs per site.
// path: the page's path; ch: its chapter number in its book (0 if not a chapter); n: chapters in that book.
window.akadianLevel = function (path, ch, n) {
  if (/\/start\/./.test(path)) return "Beginner";
  if (/\/topics\/./.test(path)) return "All";
  if (/\/labs\/\d+-/.test(path)) return ch && ch <= 6 ? "Intermediate" : "Expert";
  if (/\/books\/math\/\d+-/.test(path)) return ch && ch <= 3 ? "Intermediate" : "Expert";
  if (/\/books\/[^\/]+\/\d+-/.test(path) && ch && n) {
    if (ch === n) return "Expert";
    if (ch <= Math.ceil(n * 0.25)) return "Intermediate";
    if (ch > n * 0.7) return "Expert";
    return "Intermediate";
  }
  return null;
};
