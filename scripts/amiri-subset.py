# Réduit Amiri (Regular + Bold) aux caractères réellement utilisés par locales/ar.json (+ ASCII),
# pour alléger les pages arabes. À relancer après une modification des textes arabes :
#   python -I scripts/amiri-subset.py <dossier contenant Amiri-Regular.ttf et Amiri-Bold.ttf>
# Source des polices : https://github.com/google/fonts/tree/main/ofl/amiri (licence OFL).
import json, pathlib, sys
from fontTools import subset

root = pathlib.Path(__file__).resolve().parent.parent
src = pathlib.Path(sys.argv[1])
text = json.dumps(json.load(open(root / "locales/ar.json", encoding="utf-8")), ensure_ascii=False)
chars = set(text) | {chr(c) for c in range(0x20, 0x7F)} | set("«»…–—’ ‎‏؟،؛٪")
for weight, name in (("400", "Regular"), ("700", "Bold")):
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    font = subset.load_font(str(src / f"Amiri-{name}.ttf"), opts)
    s = subset.Subsetter(opts)
    s.populate(text="".join(sorted(chars)))
    s.subset(font)
    out = root / f"app/fonts/amiri-{weight}.woff2"
    subset.save_font(font, str(out), opts)
    print(out.name, out.stat().st_size // 1024, "Ko")
