/**
 * Strings for `<ApiKeyList>`. English defaults; deep-merge-overridable.
 */
export interface ApiKeyListStrings {
	title: string;
	addAria: string;
	rowMenuAria: string;
	copyMenuItem: string;
	copiedMenuItem: string;
	deleteMenuItem: string;
	copyToastSuccess: string;
	copyToastError: string;
	emptyMessage: string;
}

export const defaultApiKeyListStrings: ApiKeyListStrings = {
	title: 'API keys',
	addAria: 'Add API key',
	rowMenuAria: 'Key actions',
	copyMenuItem: 'Copy key',
	copiedMenuItem: 'Copied',
	deleteMenuItem: 'Delete',
	copyToastSuccess: 'Copied to clipboard',
	copyToastError: 'Failed to copy',
	emptyMessage: 'No keys yet.',
};
