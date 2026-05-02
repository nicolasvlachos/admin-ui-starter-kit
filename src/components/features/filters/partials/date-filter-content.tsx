import { format, parse, isValid } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { DateFacet } from '../facets/date-facet';
import { Text } from '@/components/typography';
import { useFilters } from '../filter-context';
import type { FilterConfig } from '../filters.types';

interface DateFilterContentProps {
    filter: FilterConfig;
    value: string[];
    onFilterChange: (value: string[]) => void;
    onBackToFilterList: () => void;
    isFromMainFilterButton?: boolean;
}

export function DateFilterContent({
    filter,
    value,
    onFilterChange,
    onBackToFilterList,
    isFromMainFilterButton = false,
}: DateFilterContentProps) {
    const { strings } = useFilters();

    const parseInputDate = (input?: string) => {
        if (!input) {
            return undefined;
        }

        if (filter.dateFormat?.param) {
            const parsed = parse(input, filter.dateFormat.param, new Date());
            return isValid(parsed) ? parsed : undefined;
        }

        const parsed = new Date(input);
        return isValid(parsed) ? parsed : undefined;
    };

    const startDate = parseInputDate(value[0]);
    const endDate = parseInputDate(value[1]);

    // Default date format for filter params - matches backend expectations
    const defaultDateFormat = 'yyyy-MM-dd';

    const formatOutputDate = (date?: Date) => {
        if (!date || !isValid(date)) {
            return undefined;
        }

        return format(date, filter.dateFormat?.param ?? defaultDateFormat);
    };

    const handleDateChange = ({ start, end }: { start?: Date; end?: Date }) => {
        const next: string[] = [];
        const formattedStart = formatOutputDate(start);
        const formattedEnd = formatOutputDate(end);

        if (formattedStart) {
            next.push(formattedStart);
        }

        if (formattedEnd) {
            next.push(formattedEnd);
        }

        onFilterChange(next);
    };

    const showBackButton = Boolean(isFromMainFilterButton);

    const facetValue = { start: startDate, end: endDate };

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5">
                {!!showBackButton && (
                    <Button
                        type="button"
                        variant="secondary"
                        buttonStyle="ghost"
                        size="icon-xs"
                        onClick={onBackToFilterList}
                        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={strings.backToFilters}
                    >
                        <ArrowLeft className="size-3.5" />
                    </Button>
                )}
                <Text tag="span" weight="semibold" className="truncate">
                    {filter.label}
                </Text>
            </div>

            <div className="p-2">
                <DateFacet
                    filter={filter}
                    value={facetValue}
                    onChange={handleDateChange}
                />
            </div>
        </div>
    );
}
