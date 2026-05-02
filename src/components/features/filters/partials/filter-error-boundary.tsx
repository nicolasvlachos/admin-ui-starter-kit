import { X } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode, useMemo } from 'react';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useFilters } from '../filter-context';
import { interpolateFilterString } from '../filters.strings';

interface Props {
    children: ReactNode;
    filterKey?: string;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

interface FilterErrorBoundaryLabels {
    title: string;
    reset: string;
    getDescription: (filterKey?: string) => string;
    unknownError: string;
}

class FilterErrorBoundaryBase extends Component<
    Props & { labels: FilterErrorBoundaryLabels },
    State
> {
    public state: State = {
        hasError: false,
        error: null,
    };

    /**
     * Update state when an error occurs
     */
    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    /**
     * Log the error to the console and to an error tracking service if available
     */
    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (import.meta.env?.DEV) {
	        console.error('Filter error:', error, errorInfo);
        }

        // Report to error monitoring service if available
        // This is where you would integrate with services like Sentry
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(
                new CustomEvent('filter-error', {
                    detail: {
                        filterKey: this.props.filterKey,
                        error,
                        errorInfo,
                    },
                }),
            );
        }
    }

    /**
     * Reset the error state
     */
    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            const { fallback, filterKey, labels } = this.props;
            if (fallback) {
                return fallback;
            }

            return (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                    <div className="mb-1 flex items-center justify-between">
                        <Text tag="span" weight="semibold">
                            {labels.title}
                        </Text>
                        <Button
                            type="button"
                            variant="error"
                            buttonStyle="ghost"
                            size="icon-xs"
                            onClick={this.handleReset}
                            className="size-6 rounded-full p-0"
                            aria-label={labels.reset}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <Text size="xs">{labels.getDescription(filterKey)}</Text>
                    <Text size="xs" type="error" className="mt-1 font-mono">
                        {this.state.error?.message || labels.unknownError}
                    </Text>
                </div>
            );
        }

        return this.props.children;
    }
}

export function FilterErrorBoundary(props: Props) {
    const { strings } = useFilters();

    const labels = useMemo<FilterErrorBoundaryLabels>(
        () => ({
            title: strings.error.title,
            reset: strings.clear,
            getDescription: (filterKey?: string) =>
                filterKey
                    ? interpolateFilterString(strings.error.descriptionWithKey, {
                          filterKey,
                      })
                    : strings.error.generic,
            unknownError: strings.error.unknown,
        }),
        [strings],
    );

    return <FilterErrorBoundaryBase {...props} labels={labels} />;
}
