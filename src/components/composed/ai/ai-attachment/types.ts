import type { LucideIcon } from 'lucide-react';

export type AiAttachmentKind = 'image' | 'document' | 'audio' | 'video' | 'code' | 'archive' | 'generic';

export interface AiAttachmentStrings {
	removeAria: string;
	openAria: string;
	uploadProgressAria: string;
}

export const defaultAiAttachmentStrings: AiAttachmentStrings = {
	removeAria: 'Remove attachment',
	openAria: 'Open attachment',
	uploadProgressAria: 'Upload progress',
};

export interface AiAttachmentProps {
	/** Filename / display label. */
	name: string;
	/** Optional secondary label — formatted size, file extension, etc. */
	meta?: string;
	/** Pre-categorized kind. Defaults to "generic" — drives the fallback icon. */
	kind?: AiAttachmentKind;
	/** Override the auto-picked kind icon. */
	icon?: LucideIcon;
	/** When set, renders the chip as a thumbnail tile with this image. */
	thumbnailUrl?: string;
	/** Show a small loading bar (in-flight upload). */
	progress?: number; // 0..1
	/** Show as errored — overrides progress. */
	errored?: boolean;
	/** Open / download callback (clicking the chip body). */
	onOpen?: () => void;
	/** Render a remove (×) action. */
	onRemove?: () => void;
	className?: string;
	strings?: Partial<AiAttachmentStrings>;
}
