from PIL import Image
import os
for n in ["net-hero.webp", "net-hero-small.webp"]:
    Image.open(n + ".png").save(os.path.join("../../docs/images", n), "WEBP", quality=82)
    os.remove(n + ".png")
