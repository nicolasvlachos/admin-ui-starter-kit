<!--
Thanks for the PR. A few quick checks before you submit so review goes
smoothly. Delete sections that don't apply.
-->

## Summary

<!-- 1–3 sentences: what changed and why. -->

## Type of change

- [ ] Bug fix
- [ ] New component / feature
- [ ] Refactor (no user-facing change)
- [ ] Documentation
- [ ] Build / tooling
- [ ] Breaking change (describe in "Migration notes" below)

## Checklist

- [ ] `npm run verify` passes locally
- [ ] `npm run build:lib` produces a clean `dist/`
- [ ] Touched components follow the rules in
      [`SKILL.md`](.claude/skills/component-library-rules/SKILL.md)
- [ ] User-facing strings flow through `useStrings()` (no hardcoded English)
- [ ] No new direct imports from `@/components/ui/*` outside `base/` wrappers
- [ ] No new framework-specific imports
      (`@inertiajs/*`, `next/*`, `react-router*`, `@tanstack/react-query`)
- [ ] If a new prop has a sensible library-wide default, it resolves
      through `<UIProvider>`: `props.X ?? useFooConfig().X ?? fallback`

## Screenshots / GIFs

<!-- For visual changes. Light + dark, narrow + wide if responsive. -->

## Migration notes

<!-- For breaking changes only. -->

## Related issues

<!-- Closes #N, references #M -->
