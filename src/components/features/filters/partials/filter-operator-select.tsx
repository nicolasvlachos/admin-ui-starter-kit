import React, { useState } from 'react';

import { Button } from '@/components/base/buttons';
import { PopoverMenu } from '@/components/base/popover-menu';
import { Text } from '@/components/typography';

import { useFilters } from '../filter-context';
import type { FilterOperator, OperatorOption } from '../filters.types';

interface FilterOperatorSelectProps {
    operator: FilterOperator;
    operators: OperatorOption[];
    onOperatorChange: (operator: FilterOperator) => void;
}

/**
 * FilterOperatorSelect — operator dropdown for an active filter pill.
 *
 * Now delegates the trigger + popover + command-list pattern entirely to
 * `PopoverMenu`. The trigger is rendered in the pill's inline strip, the
 * `header` slot supplies the small "Operator" eyebrow, and item rendering
 * stays compact (xs typography, density-tokenized padding from base/command).
 */
export function FilterOperatorSelect({
    operator,
    operators,
    onOperatorChange,
}: FilterOperatorSelectProps) {
    const [open, setOpen] = useState(false);
    const { strings } = useFilters();

    const currentOperatorLabel =
        operators.find((op) => op.value === operator)?.label || operator;

    const handleTriggerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <PopoverMenu
            open={open}
            onOpenChange={setOpen}
            search={false}
            trigger={
                <Button
                    variant="secondary"
                    buttonStyle="ghost"
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground h-full rounded-none px-3 text-xs"
                    onClick={handleTriggerClick}
                    type="button"
                >
                    {currentOperatorLabel}
                </Button>
            }
            header={
                <Text tag="span" weight="semibold">
                    {strings.operator}
                </Text>
            }
            contentClassName="w-48"
            items={operators.map((op) => ({
                value: op.value,
                label: op.label,
                selected: op.value === operator,
            }))}
            onSelect={(item) => {
                onOperatorChange(item.value as FilterOperator);
                setOpen(false);
            }}
        />
    );
}
