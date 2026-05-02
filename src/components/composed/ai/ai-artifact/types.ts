import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface AiArtifactStrings {
	openAria: string;
	copy: string;
	copied: string;
	copyAria: string;
	downloadAria: string;
	expandAria: string;
}

export const defaultAiArtifactStrings: AiArtifactStrings = {
	openAria: 'Open artifact',
	copy: 'Copy',
	copied: 'Copied',
	copyAria: 'Copy artifact',
	downloadAria: 'Download artifact',
	expandAria: 'Expand artifact',
};

export interface AiArtifactAction {
	id: string;
	label: string;
	icon?: LucideIcon;
	onSelect?: () => void;
}

export interface AiArtifactProps {
	/** Title — typically the artifact name (e.g. "App.tsx", "design-spec.md"). */
	title: ReactNode;
	/** Subtitle — typically the kind / language ("React component", "Markdown"). */
	subtitle?: ReactNode;
	/** Icon override for the leading badge. */
	icon?: LucideIcon;
	/** Plain text content used by the default copy action. */
	copyText?: string;
	/** Body content — preview, code, sandbox iframe, etc. */
	children?: ReactNode;
	/** Hide the body and render the artifact as a clickable preview-only chip. */
	collapsed?: boolean;
	/** Click handler for the whole header (e.g. open in side panel). */
	onOpen?: () => void;
	/** Custom actions in the header. */
	actions?: ReadonlyArray<AiArtifactAction>;
	/** Provide a download handler — adds a download button. */
	onDownload?: () => void;
	className?: string;
	strings?: Partial<AiArtifactStrings>;
}
