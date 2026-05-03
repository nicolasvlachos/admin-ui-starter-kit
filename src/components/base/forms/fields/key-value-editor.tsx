/**
 * KeyValueEditor — dynamic editor for arbitrary key→value string pairs. Emits
 * a `Record<string, string>` to consumers; rows with empty keys are dropped
 * from the output. Use for metadata, environment vars, or feature flags.
 *
 * Built on the shared `<Repeater>` primitive so it visually matches the
 * `StringRepeater` / `ObjectRepeater` / `LocalizedStringRepeater` family —
 * same row chrome, same remove icon, same add-button styling, optional
 * drag-to-reorder.
 */
import { useState, useRef, useCallback, memo } from 'react';

import { Label } from '@/components/typography';
import { useStrings } from '@/lib/strings';

import { Input } from './input';
import { Repeater } from './repeater';

export type KeyValuePair = { key: string; value: string };

export interface KeyValueEditorStrings {
    keyLabel: string;
    valueLabel: string;
    keyPlaceholder: string;
    valuePlaceholder: string;
    addButton: string;
    removeRowAriaLabel: string;
    emptyState: string;
}

export const defaultKeyValueEditorStrings: KeyValueEditorStrings = {
    keyLabel: 'Key',
    valueLabel: 'Value',
    keyPlaceholder: 'key',
    valuePlaceholder: 'value',
    addButton: 'Add row',
    removeRowAriaLabel: 'Remove row',
    emptyState: 'No rows yet.',
};

export interface KeyValueEditorProps {
    value?: Record<string, string>;
    onChange?: (val: Record<string, string>) => void;
    invalid?: boolean;
    /** Enable drag-to-reorder. Default `false`. */
    sortable?: boolean;
    /** Override default strings (labels, placeholders, button text). */
    strings?: Partial<KeyValueEditorStrings>;
    /** @deprecated Use `strings.keyPlaceholder` instead. */
    keyPlaceholder?: string;
    /** @deprecated Use `strings.valuePlaceholder` instead. */
    valuePlaceholder?: string;
    /** @deprecated Use `strings.keyLabel` instead. */
    keyLabel?: string;
    /** @deprecated Use `strings.valueLabel` instead. */
    valueLabel?: string;
    /** @deprecated Use `strings.addButton` instead. */
    addButtonText?: string;
}

type KeyValueRow = KeyValuePair & { id: string };

const generateId = (): string => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2, 10);
};

interface KeyValueEditorRowProps {
    row: KeyValueRow;
    isFirst: boolean;
    keyPlaceholder: string;
    valuePlaceholder: string;
    keyLabel?: string;
    valueLabel?: string;
    invalid?: boolean;
    onKeyChange: (id: string, value: string) => void;
    onValueChange: (id: string, value: string) => void;
}

const KeyValueEditorRow = memo(function KeyValueEditorRow({
    row,
    isFirst,
    keyPlaceholder,
    valuePlaceholder,
    keyLabel,
    valueLabel,
    invalid,
    onKeyChange,
    onValueChange,
}: KeyValueEditorRowProps) {
    const { id, key: keyValue, value } = row;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-1">
                {!!isFirst && !!keyLabel && <Label className="flex items-center">{keyLabel}</Label>}
                <Input
                    value={keyValue ?? ''}
                    placeholder={keyPlaceholder}
                    onChange={(e) => onKeyChange(id, e.target.value)}
                    invalid={invalid}
                />
            </div>
            <div className="space-y-1">
                {!!isFirst && !!valueLabel && <Label className="flex items-center">{valueLabel}</Label>}
                <Input
                    value={value ?? ''}
                    placeholder={valuePlaceholder}
                    onChange={(e) => onValueChange(id, e.target.value)}
                    invalid={invalid}
                />
            </div>
        </div>
    );
});

export function KeyValueEditor({
    value,
    onChange,
    invalid,
    sortable = false,
    keyPlaceholder,
    valuePlaceholder,
    keyLabel,
    valueLabel,
    addButtonText,
    strings: stringsProp,
}: KeyValueEditorProps) {
    const strings = useStrings(defaultKeyValueEditorStrings, {
        ...(keyPlaceholder !== undefined ? { keyPlaceholder } : {}),
        ...(valuePlaceholder !== undefined ? { valuePlaceholder } : {}),
        ...(keyLabel !== undefined ? { keyLabel } : {}),
        ...(valueLabel !== undefined ? { valueLabel } : {}),
        ...(addButtonText !== undefined ? { addButton: addButtonText } : {}),
        ...stringsProp,
    });
    // Track if we're making internal changes to avoid re-syncing
    const isInternalChange = useRef(false);

    // Initialize rows from value prop
    const [rows, setRows] = useState<KeyValueRow[]>(() => {
        if (value && Object.keys(value).length > 0) {
            return Object.entries(value).map(([k, v]) => ({
                id: generateId(),
                key: k,
                value: String(v ?? ''),
            }));
        }
        return [{ id: generateId(), key: '', value: '' }];
    });

    // Emit changes to parent
    const emit = useCallback(
        (next: KeyValueRow[]) => {
            const obj: Record<string, string> = {};
            next.forEach(({ key, value }) => {
                if (key.trim() !== '') obj[key] = value ?? '';
            });
            isInternalChange.current = true;
            onChange?.(obj);
            queueMicrotask(() => {
                isInternalChange.current = false;
            });
        },
        [onChange]
    );

    const handleKeyChange = useCallback(
        (id: string, newKey: string) => {
            setRows((prev) => {
                const next = prev.map((row) => (row.id === id ? { ...row, key: newKey } : row));
                emit(next);
                return next;
            });
        },
        [emit]
    );

    const handleValueChange = useCallback(
        (id: string, newValue: string) => {
            setRows((prev) => {
                const next = prev.map((row) => (row.id === id ? { ...row, value: newValue } : row));
                emit(next);
                return next;
            });
        },
        [emit]
    );

    const addRow = useCallback(() => {
        setRows((prev) => {
            const next = [...prev, { id: generateId(), key: '', value: '' }];
            emit(next);
            return next;
        });
    }, [emit]);

    const removeRow = useCallback(
        (index: number) => {
            setRows((prev) => {
                const next = prev.filter((_, i) => i !== index);
                const result = next.length ? next : [{ id: generateId(), key: '', value: '' }];
                emit(result);
                return result;
            });
        },
        [emit]
    );

    const moveRow = useCallback(
        (from: number, to: number) => {
            setRows((prev) => {
                const next = [...prev];
                const [moved] = next.splice(from, 1);
                next.splice(to, 0, moved);
                emit(next);
                return next;
            });
        },
        [emit]
    );

    return (
        <Repeater
            items={rows}
            sortable={sortable}
            onAdd={addRow}
            onRemove={removeRow}
            onMove={moveRow}
            strings={{
                emptyState: strings.emptyState,
                addButton: strings.addButton,
                removeAriaLabel: strings.removeRowAriaLabel,
            }}
            renderRow={(row, { index }) => (
                <KeyValueEditorRow
                    row={row}
                    isFirst={index === 0}
                    keyPlaceholder={strings.keyPlaceholder}
                    valuePlaceholder={strings.valuePlaceholder}
                    keyLabel={strings.keyLabel}
                    valueLabel={strings.valueLabel}
                    invalid={invalid}
                    onKeyChange={handleKeyChange}
                    onValueChange={handleValueChange}
                />
            )}
        />
    );
}

KeyValueEditor.displayName = 'KeyValueEditor';
