import type { ReactNode } from 'react';

export interface AiPackageInfoStrings {
	versionLabel: string;
	licenseLabel: string;
	publishedLabel: string;
	homepageAria: string;
	repositoryAria: string;
	weeklyDownloadsLabel: string;
}

export const defaultAiPackageInfoStrings: AiPackageInfoStrings = {
	versionLabel: 'Version',
	licenseLabel: 'License',
	publishedLabel: 'Published',
	homepageAria: 'Open homepage',
	repositoryAria: 'Open repository',
	weeklyDownloadsLabel: 'Weekly downloads',
};

export interface AiPackageInfoProps {
	/** Package name (npm-style: optional `@scope/`). */
	name: string;
	/** Latest / pinned version. */
	version?: string;
	/** Short description from the package manifest. */
	description?: ReactNode;
	/** SPDX-style license identifier (e.g. "MIT"). */
	license?: string;
	/** ISO date or human label of last publish. */
	publishedAt?: string;
	/** Package homepage URL. */
	homepage?: string;
	/** Repository URL (typically GitHub). */
	repository?: string;
	/** Weekly downloads — formatted by the consumer. */
	weeklyDownloads?: string | number;
	/** Comma-separated tag list rendered as small chips. */
	keywords?: ReadonlyArray<string>;
	/** Click handler for the whole card. */
	onSelect?: () => void;
	className?: string;
	strings?: Partial<AiPackageInfoStrings>;
}
