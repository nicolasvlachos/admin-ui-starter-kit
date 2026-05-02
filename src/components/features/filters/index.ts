// Main exports
export { FilterProvider, useFilters } from './filter-context';
export { FilterLayout } from './filter-layout';

// NOTE: this feature is framework-agnostic. The library no longer ships
// `adapters/$framework/` folders. Consumers wire routing / persisted-
// state / debounced URL writes at the call site by composing their own
// provider on top of `FilterProvider` (or by reading state via
// `useFilters()` and dispatching their router/query-cache calls
// themselves).

// Types
export type {
    FilterConfig,
    FilterOption,
    ActiveFilter,
    FilterOperator,
    OperatorOption,
    FilterDependency,
    ValidationConfig,
    DisplayConfig,
    FilterTab,
    FilterTabPreset,
    AsyncSelectConfig,
} from './filters.types';

export { FilterType, FilterOperatorEnum } from './filters.types';

// Strings
export {
    defaultFilterStrings,
    getFilterString,
    interpolateFilterString,
} from './filters.strings';
export type {
    FilterOperatorStrings,
    FilterStrings,
} from './filters.strings';

// Operator options (centralized)
export {
    getTextOperators,
    getSelectOperators,
    getNumberOperators,
    getDateOperators,
    getBooleanOperators,
    getOperatorsForType,
    getDefaultOperatorForType,
} from './operator-options';

// Facets (if needed separately)
export { SearchFacet } from './facets/search-facet';
export { SelectFacet } from './facets/select-facet';
export { AsyncSelectFacet } from './facets/async-select-facet';
export { DateFacet } from './facets/date-facet';
export { RangeFacet } from './facets/range-facet';
export { TagsFacet } from './facets/tags-facet';

// Composition partials — exported so consumers can build a custom strip
// layout against the same FilterProvider state instead of using FilterLayout.
//   <FilterProvider …>
//     <ActiveFilterItem … />
//     <FilterOperatorSelect … />
//     <FiltersButton … />
//   </FilterProvider>
export { ActiveFilterItem } from './partials/active-filter-item';
export { FilterOperatorSelect } from './partials/filter-operator-select';
export { FilterPill } from './partials/filter-pill';
export type { FilterPillProps } from './partials/filter-pill';
export { FilterPopoverContent } from './partials/filter-popover-content';
export { FilterValueDisplay } from './partials/filter-value-display';
export { FiltersButton } from './partials/filters-button';
export { FilterTabs } from './partials/filter-tabs';
export { SearchFiltersList } from './partials/search-filters-list';
export { FilterErrorBoundary } from './partials/filter-error-boundary';

// Headless hooks for consumers building custom layouts against FilterProvider.
export {
    useAsyncOptions,
    useFilterGroups,
    type UseAsyncOptionsResult,
    type UseFilterGroupsOptions,
    type UseFilterGroupsResult,
} from './hooks';
