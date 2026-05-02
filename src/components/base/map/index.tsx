/**
 * base/map — package-owned Mapbox/Leaflet wrapper + Google Places autocomplete.
 *
 * These are NOT shadcn primitives. They live in `base/` directly (not `ui/`)
 * because they are large, opinionated, package-owned implementations rather
 * than small composable shadcn-generated primitives. They are framework-
 * agnostic (no router/i18n/data-fetching imports) and consumer-driven via
 * props.
 */
export * from './map';
export * from './place-autocomplete';
