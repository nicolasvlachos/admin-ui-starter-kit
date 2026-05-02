import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import {
    CardCheckboxGroup,
    CardRadioGroup,
} from '@/components/base/forms/fields';
import { Label, Text } from '@/components/typography';
import { useFormErrors } from '@/hooks/useFormErrors';
import { useStrings } from '@/lib/strings';

import { defaultSyncRangeDialogFormStrings } from './sync.strings';
import type {
    SyncRangeDialogFormProps,
    SyncRangeDialogFormValues,
} from './sync.types';

export const SyncRangeDialogForm = (props: SyncRangeDialogFormProps) => {
    const {
        formId,
        options,
        syncOptions,
        defaultHours = '24',
        onSubmit,
        errors,
        strings: stringsProp,
    } = props;
    const strings = useStrings(defaultSyncRangeDialogFormStrings, stringsProp);
    const normalizedErrors = Object.fromEntries(
        Object.entries(errors ?? {}).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] : value,
        ]),
    ) as Partial<Record<string, string>>;
    const { getError } = useFormErrors(normalizedErrors);

    const { control, handleSubmit } = useForm<SyncRangeDialogFormValues>({
        defaultValues: {
            hours: defaultHours,
            options: [],
        },
    });

    const submit: SubmitHandler<SyncRangeDialogFormValues> = (data) => {
        onSubmit({
            hours: Number(data.hours),
            financials_only: data.options.includes('financials_only'),
        });
    };

    return (
        <form id={formId} onSubmit={handleSubmit(submit)} className="space-y-4">
            <Controller
                name="hours"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <CardRadioGroup
                        options={options}
                        value={field.value}
                        onChange={field.onChange}
                        name={field.name}
                        columns={2}
                    />
                )}
            />

            {getError('hours') && (
                <Text type="error">
                    {getError('hours')}
                </Text>
            )}

            {!!syncOptions && syncOptions.length > 0 && (
                <div className="space-y-2 border-t pt-2">
                    <Label>{strings.optionsLabel}</Label>
                    <Controller
                        name="options"
                        control={control}
                        render={({ field }) => (
                            <CardCheckboxGroup
                                options={syncOptions}
                                value={field.value}
                                onChange={field.onChange}
                                columns={2}
                            />
                        )}
                    />
                </div>
            )}
        </form>
    );
};

SyncRangeDialogForm.displayName = 'SyncRangeDialogForm';
