import {
    FilterOperatorEnum,
    type FilterOperator,
    type OperatorOption,
    FilterType,
} from './filters.types';
import type { FilterOperatorStrings } from './filters.strings';

export function getTextOperators(strings: FilterOperatorStrings): OperatorOption[] {
    return [
        { label: strings.contains, value: FilterOperatorEnum.CONTAINS },
        { label: strings.equals, value: FilterOperatorEnum.EQUALS },
        { label: strings.notContains, value: FilterOperatorEnum.NOT },
    ];
}

export function getSelectOperators(strings: FilterOperatorStrings): OperatorOption[] {
    return [
        { label: strings.is, value: FilterOperatorEnum.EQUALS },
        { label: strings.isNot, value: FilterOperatorEnum.NOT },
    ];
}

export function getNumberOperators(strings: FilterOperatorStrings): OperatorOption[] {
    return [
        { label: strings.equals, value: FilterOperatorEnum.EQUALS },
        { label: strings.greaterThan, value: FilterOperatorEnum.GT },
        { label: strings.lessThan, value: FilterOperatorEnum.LT },
    ];
}

export function getDateOperators(strings: FilterOperatorStrings): OperatorOption[] {
    return [
        { label: strings.before, value: FilterOperatorEnum.BEFORE },
        { label: strings.after, value: FilterOperatorEnum.AFTER },
        { label: strings.between, value: FilterOperatorEnum.BETWEEN },
    ];
}

export function getBooleanOperators(strings: FilterOperatorStrings): OperatorOption[] {
    return [{ label: strings.equals, value: FilterOperatorEnum.EQUALS }];
}

export function getOperatorsForType(
    type: FilterType,
    strings: FilterOperatorStrings,
): OperatorOption[] {
    switch (type) {
        case FilterType.SEARCH:
            return getTextOperators(strings);
        case FilterType.TAGS:
            return [
                { label: strings.has, value: FilterOperatorEnum.HAS },
                { label: strings.hasAny, value: FilterOperatorEnum.HAS_ANY },
                { label: strings.hasAll, value: FilterOperatorEnum.HAS_ALL },
            ];
        case FilterType.SELECT:
        case FilterType.ASYNC_SELECT:
            return getSelectOperators(strings);
        case FilterType.RANGE:
            return getNumberOperators(strings);
        case FilterType.DATE:
            return getDateOperators(strings);
        default:
            return getTextOperators(strings);
    }
}

export function getDefaultOperatorForType(
    type: FilterType,
): FilterOperator {
    switch (type) {
        case FilterType.SEARCH:
            return FilterOperatorEnum.CONTAINS;
        case FilterType.TAGS:
            // Tags default to array containment semantics
            return FilterOperatorEnum.HAS;
        case FilterType.SELECT:
        case FilterType.ASYNC_SELECT:
            return FilterOperatorEnum.EQUALS;
        case FilterType.RANGE:
            return FilterOperatorEnum.EQUALS;
        case FilterType.DATE:
            return FilterOperatorEnum.BEFORE;
        default:
            return FilterOperatorEnum.EQUALS;
    }
}
