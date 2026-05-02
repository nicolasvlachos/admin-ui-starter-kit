/**
 * Default user-facing strings for `<SyncRangeDialogForm>`.
 *
 * Consumers wire backend i18n at the call site:
 *
 *   <SyncRangeDialogForm strings={{ optionsLabel: t('sync.options') }} … />
 */

export interface SyncRangeDialogFormStrings {
	/** Label rendered above the optional sync-options checkbox group. */
	optionsLabel: string;
}

export const defaultSyncRangeDialogFormStrings: SyncRangeDialogFormStrings = {
	optionsLabel: 'Options',
};
