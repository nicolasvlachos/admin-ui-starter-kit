# Publishing

The release workflow for **admin-ui-starter-kit**. Read end-to-end before
the first publish.

## Pre-flight checklist

```bash
# Clean state
git status                       # working tree clean
git pull --rebase                # main up to date

# Quality gates
npm run verify                   # arch + exports + types + lint + tests
npm run build:lib                # produces dist/
```

All four must succeed locally before publish — if you ship a broken
build, the registry won't take it back.

## Decide the version

Follow [SemVer](https://semver.org/):

| Change kind | Bump |
| --- | --- |
| New feature, no breaking | `minor` (e.g. `0.1.0` → `0.2.0`) |
| Bug fix, no breaking | `patch` (e.g. `0.1.0` → `0.1.1`) |
| Breaking change | `major` (e.g. `0.1.0` → `1.0.0`) — but until `1.0.0` is shipped, breaking changes go in `minor` per SemVer's pre-1.0 rule |

Bump in `package.json`:

```bash
npm version 0.2.0 --no-git-tag-version   # don't tag yet
```

## Update the changelog

Move all `[Unreleased]` entries into a new `[<version>] — <date>` section
in [CHANGELOG.md](CHANGELOG.md). Add a new empty `[Unreleased]` block on
top.

## Dry-run

```bash
npm publish --dry-run
```

Read the file list. **Confirm:**
- `dist/` is included with both `.js` and `.cjs` for every entrypoint.
- `dist/style.css` is included.
- `README.md`, `LICENSE`, `CHANGELOG.md` are included.
- `src/` is included (good for source-maps go-to-definition in IDEs).
- `node_modules/`, `coverage/`, `.git/`, `dist-ssr/`, the preview app
  source are NOT included.
- Tarball size is reasonable (target <2 MB compressed for v0.x).

## Publish

```bash
npm login                        # if not already
npm publish --access public      # public scope
```

The `prepublishOnly` hook re-runs `npm run build:lib` before the upload,
so even if you forgot, the tarball will contain a fresh `dist/`.

## Tag and push

```bash
git add package.json CHANGELOG.md
git commit -m "release: v0.2.0"
git tag -a v0.2.0 -m "v0.2.0"
git push origin main --tags
```

## Create a GitHub Release

1. Go to <https://github.com/nicolasvlachos/admin-ui-starter-kit/releases/new>.
2. Pick the `v0.2.0` tag.
3. Title: `v0.2.0`.
4. Paste the corresponding `[<version>]` block from `CHANGELOG.md`.
5. Attach the tarball from `npm pack` (optional but appreciated for
   offline / archival use).

## Rollback

If you publish a broken version:

```bash
# Within 72 hours of publish, you can deprecate (NOT delete — npm policy)
npm deprecate admin-ui-starter-kit@<bad-version> "Use <good-version> instead"

# Then publish a fix
npm version <next-patch> --no-git-tag-version
npm publish
```

You cannot delete or overwrite a published version. Always dry-run first.

## Common issues

| Symptom | Fix |
| --- | --- |
| `npm publish` says "private package" | Remove `"private": true` from `package.json` |
| `npm publish` says "name not available" | Someone took the name; pick a new one |
| Consumers report "module not found" for `admin-ui-starter-kit/foo` | Add `./foo` to the `exports` map AND `vite.lib.config.ts` entries; rebuild and republish |
| Published bundle has stale code | Confirm `prepublishOnly` ran; check `dist/` mtime; bump patch and republish |
| `peer dep warning: <pkg> not installed` for an optional peer | Verify the entry is in `peerDependenciesMeta.optional` block; consumer can ignore |

## Maintainer-only: skill publish

Independent of npm publishes, the rules skill can be copied into the
maintainer's `~/.claude/skills/` and `~/.agents/skills/` directories so
local Claude Code / agent sessions across projects pick it up:

```bash
npm run publish:skill
```

This is local-only — it does not affect the published npm package.
