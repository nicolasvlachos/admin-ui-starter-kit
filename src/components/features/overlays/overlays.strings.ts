/**
 * Default user-facing strings shared by `<Dialog>`, `<Drawer>`, and
 * `<AlertDialog>` overlays.
 *
 * Consumers wire backend i18n at the call site:
 *
 *   <Dialog strings={{ confirm: t('common.confirm') }} … />
 */

export interface OverlayStrings {
	confirm: string;
	cancel: string;
	close: string;
	loading: string;
}

export const defaultOverlayStrings: OverlayStrings = {
	confirm: 'Confirm',
	cancel: 'Cancel',
	close: 'Close',
	loading: 'Loading...',
};

export const defaultAlertDialogStrings: OverlayStrings = {
	confirm: 'Continue',
	cancel: 'Cancel',
	close: 'Close',
	loading: 'Loading...',
};
