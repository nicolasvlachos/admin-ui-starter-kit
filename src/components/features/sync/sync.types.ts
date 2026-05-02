import type {
	CardCheckboxOption,
	CardRadioOption,
} from '@/components/base/forms/fields';
import type { StringsProp } from '@/lib/strings';

import type { SyncRangeDialogFormStrings } from './sync.strings';

export type SyncRangeDialogFormValues = {
	hours: '6' | '12' | '24' | '48';
	options: string[];
};

export type SyncRangeDialogFormSubmit = {
	hours: number;
	financials_only: boolean;
};

export interface SyncRangeDialogFormProps {
	formId: string;
	options: CardRadioOption[];
	syncOptions?: CardCheckboxOption[];
	defaultHours?: SyncRangeDialogFormValues['hours'];
	onSubmit: (data: SyncRangeDialogFormSubmit) => void;
	errors?: Record<string, string | string[] | undefined>;
	/** Per-instance string overrides (deep-merged over `defaultSyncRangeDialogFormStrings`). */
	strings?: StringsProp<SyncRangeDialogFormStrings>;
}
