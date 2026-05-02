# Import paths — canonical paths and migration

Open this when auditing imports, finding stale path patterns, or codemodding to a new structure.

## Canonical paths (use these)

```
@/components/typography/...   # Text, Heading, Label, TextLink (top-level peer)
@/components/ui/...           # shadcn primitives (only base wrappers reach in)
@/components/base/...         # base wrappers
@/components/layout/...       # page shells (header, sidebar, page)
@/components/composed/...     # domain-level surfaces
@/components/features/...     # provider/callback features

@/lib/ui-provider             # the single library provider + slice hooks
@/lib/strings                 # useStrings, StringsProp
@/lib/utils                   # cn() etc.
@/lib/sanitize-html           # sanitizer used by Text(asHTML)
```

## Forbidden paths (these aliases are gone)

| ❌ Old | ✅ New |
| --- | --- |
| `@/components/ui/base/...` | `@/components/base/...` |
| `@/components/ui/typography...` | `@/components/typography...` |
| `@/components/ui/primitives/shadcn/...` | `@/components/ui/...` |
| `@/components/typography/*` re-exporting from `base/typography/*` | typography IS the source — no shim |
| `@/components/icons/*` | inline `lucide-react` imports at consumers |
| `@/components/common/brand/*` | consumer-app concern, lives in `src/preview/_brand/` for the showcase |

These removed aliases will fail at build time — there's no fallback.

## Codemod patterns

For mass renames, use a Python regex pass via Bash. The proven sequence (run in this order — typography paths first, broad `ui/base` last):

```bash
python3 <<'PY'
import os, re
ROOT = 'src'
EXTS = ('.ts', '.tsx')
RULES = [
    # typography variants → @/components/typography
    (re.compile(r"(['\"])@/components/ui/base/typography(/[^'\"]*)?\1"),
     lambda m: f"{m.group(1)}@/components/typography{m.group(2) or ''}{m.group(1)}"),
    (re.compile(r"(['\"])@/components/ui/typography(/[^'\"]*)?\1"),
     lambda m: f"{m.group(1)}@/components/typography{m.group(2) or ''}{m.group(1)}"),
    (re.compile(r"(['\"])@/components/base/typography(/[^'\"]*)?\1"),
     lambda m: f"{m.group(1)}@/components/typography{m.group(2) or ''}{m.group(1)}"),
    # ui/base/* → base/*
    (re.compile(r"(['\"])@/components/ui/base(/[^'\"]*)?\1"),
     lambda m: f"{m.group(1)}@/components/base{m.group(2) or ''}{m.group(1)}"),
    # ui/primitives/shadcn/* → ui/*
    (re.compile(r"(['\"])@/components/ui/primitives/shadcn(/[^'\"]*)?\1"),
     lambda m: f"{m.group(1)}@/components/ui{m.group(2) or ''}{m.group(1)}"),
]
for d, _, fs in os.walk(ROOT):
    for f in fs:
        if not f.endswith(EXTS): continue
        p = os.path.join(d, f)
        with open(p) as fh: s = fh.read()
        new = s
        for pat, repl in RULES:
            new = pat.sub(repl, new)
        if new != s:
            with open(p, 'w') as fh: fh.write(new)
PY
```

## Sanity checks after a codemod

```bash
# 1. No stale paths remain:
grep -rn "@/components/ui/base\|@/components/ui/typography\|@/components/ui/primitives" src

# 2. Bare ui/* imports outside base wrappers (should be tiny — only the wrappers themselves):
grep -rn "from '@/components/ui/" src/components | grep -v "ui/base\|ui/primitives" | grep -v "src/components/base/"

# 3. Type-check:
npx tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0
```

## Tsconfig + Vite alias

The only alias is `@` → `./src`:

```json
// tsconfig.app.json
"paths": {
    "@/*": ["./src/*"]
}
```

```ts
// vite.config.ts
resolve: {
    alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
}
```

If you see any other `@/components/...` alias being added, push back — they always rot. One path per destination.

## Detecting the bare `ui/` violations

A direct `from '@/components/ui/<primitive>'` import outside a base wrapper means a feature/composed file is short-circuiting the layer model. Find them with:

```bash
grep -rn "from '@/components/ui/" src/components/composed src/components/features src/components/layout
```

The legitimate exceptions are:
- `layout/sidebar/*` reaching into `ui/sidebar` and `ui/sheet` (no base wrapper exists yet)
- `layout/header/partials/header-breadcrumbs.tsx` reaching into `ui/sidebar` for `SidebarTrigger`

Anything else is a violation — wrap or import through an existing base wrapper.
