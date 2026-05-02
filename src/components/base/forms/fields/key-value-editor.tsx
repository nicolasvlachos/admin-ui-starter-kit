/**
 * KeyValueEditor — dynamic editor for arbitrary key→value string pairs. Emits
 * a `Record<string, string>` to consumers; rows with empty keys are dropped
 * from the output. Use for metadata, environment vars, or feature flags.
 * Strings overridable for i18n.
 */
import { useState, useRef, useCallback, memo } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { Label } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { Input } from './input';

export type KeyValuePair = { key: string; value: string };

export interface KeyValueEditorStrings {
	keyLabel: string;
	valueLabel: string;
	keyPlaceholder: string;
	valuePlaceholder: string;
	addButton: string;
	removeRowAriaLabel: string;
}

export const defaultKeyValueEditorStrings: KeyValueEditorStrings = {
	keyLabel: 'Key',
	valueLabel: 'Value',
	keyPlaceholder: 'key',
	valuePlaceholder: 'value',
	addButton: 'Add row',
	removeRowAriaLabel: 'Remove row',
};

export interface KeyValueEditorProps {
    value?: Record<string, string>;
    onChange?: (val: Record<string, string>) => void;
    invalid?: boolean;
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
    removeAriaLabel: string;
    invalid?: boolean;
    onKeyChange: (id: string, value: string) => void;
    onValueChange: (id: string, value: string) => void;
    onRemove: (id: string) => void;
}

const KeyValueEditorRow = memo(function KeyValueEditorRow({
    row,
    isFirst,
    keyPlaceholder,
    valuePlaceholder,
    keyLabel,
    valueLabel,
    removeAriaLabel,
    invalid,
    onKeyChange,
    onValueChange,
    onRemove,
}: KeyValueEditorRowProps) {
    const { id, key: keyValue, value } = row;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
            <div className="space-y-1">
                {!!isFirst && !!keyLabel && <Label>{keyLabel}</Label>}
                <Input
                    value={keyValue ?? ''}
                    placeholder={keyPlaceholder}
                    onChange={(e) => onKeyChange(id, e.target.value)}
                    invalid={invalid}
                />
            </div>
            <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                    {!!isFirst && !!valueLabel && <Label>{valueLabel}</Label>}
                    <Input
                        value={value ?? ''}
                        placeholder={valuePlaceholder}
                        onChange={(e) => onValueChange(id, e.target.value)}
                        invalid={invalid}
                    />
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    buttonStyle="solid"
                    aria-label={removeAriaLabel}
                    icon={Minus}
                    onClick={() => onRemove(id)}
                    className={isFirst && (keyLabel || valueLabel) ? 'mt-6' : ''}
                >{''}</Button>
            </div>
        </div>
    );
});

export function KeyValueEditor({
    value,
    onChange,
    invalid,
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
            // Reset flag after microtask to allow React to process the update
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
        (id: string) => {
            setRows((prev) => {
                const next = prev.filter((row) => row.id !== id);
                const result = next.length ? next : [{ id: generateId(), key: '', value: '' }];
                emit(result);
                return result;
            });
        },
        [emit]
    );

    return (
        <div className="space-y-3">
            {rows.map((row, index) => (
                <KeyValueEditorRow
                    key={row.id}
                    row={row}
                    isFirst={index === 0}
                    keyPlaceholder={strings.keyPlaceholder}
                    valuePlaceholder={strings.valuePlaceholder}
                    keyLabel={strings.keyLabel}
                    valueLabel={strings.valueLabel}
                    removeAriaLabel={strings.removeRowAriaLabel}
                    invalid={invalid}
                    onKeyChange={handleKeyChange}
                    onValueChange={handleValueChange}
                    onRemove={removeRow}
                />
            ))}
            <div>
                <Button type="button" icon={Plus} onClick={addRow}>
                    {strings.addButton}
                </Button>
            </div>
        </div>
    );
}

KeyValueEditor.displayName = 'KeyValueEditor';
