"""Writes the nav between '# nav: start' and '# nav: end' in mkdocs.yml from tools/outline.py.
Run from the repo root: python3 tools/nav.py"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from outline import START, BOOKS, TOPICS, EXPLAINERS
L = ["  # nav: start", "  - Home: index.md", "  - Start:", "      - start/index.md", "      - Find your level: level-check.md"]
L += [f"      - start/{f}.md" for f, _ in START]
L += ["  - Topics:", "      - topics/index.md"] + [f"      - \"{t}\": topics/{f}.md" for f, t in TOPICS]
L += ["  - Explainers:", "      - explainers/index.md"] + [f"      - \"{t}\": explainers/{f}.md" for f, t in EXPLAINERS]
L += ["  - Books:", "      - books/index.md"]
for slug in ["networks", "math", "wireless", "security"]:
    title, chs = BOOKS[slug]
    L += [f"      - {title}:", f"          - books/{slug}/index.md"] + [f"          - books/{slug}/{c}.md" for c in chs]
title, chs = BOOKS["labs"]
L += ["  - Labs:", "      - labs/index.md"] + [f"      - labs/{c}.md" for c in chs]
L += ["  - How to read this site: how-to-read.md", "  - What's new: new.md", "  # nav: end"]
def ok(line):
    if ": " in line.strip("- ").split(".md")[0] and line.strip().endswith(".md"):
        f = line.split(": ")[-1].strip()
    elif line.strip().endswith(".md"):
        f = line.strip()[2:]
    else:
        return True
    return os.path.exists(os.path.join("docs", f))
L = [l for l in L if ok(l)]
# drop sections left empty (a heading line followed by a line that is not deeper)
ind = lambda l: len(l) - len(l.lstrip())
L = [l for i, l in enumerate(L) if not (l.rstrip().endswith(":") and "- " in l and (i + 1 == len(L) or ind(L[i + 1]) <= ind(l)))]
y = open("mkdocs.yml").read()
a, b = y.index("  # nav: start"), y.index("  # nav: end") + len("  # nav: end")
open("mkdocs.yml", "w").write(y[:a] + "\n".join(L) + y[b:])
