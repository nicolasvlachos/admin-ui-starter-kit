import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type AiFileTreeNodeKind = 'directory' | 'file';

export type AiFileTreeChangeStatus = 'added' | 'modified' | 'removed' | 'renamed';

export interface AiFileTreeNode {
	id: string;
	name: string;
	kind: AiFileTreeNodeKind;
	/** Children — only meaningful for directories. */
	children?: ReadonlyArray<AiFileTreeNode>;
	/** Custom icon override (file kinds, etc.). */
	icon?: LucideIcon;
	/** Diff status — drives the trailing pill / row tint. */
	status?: AiFileTreeChangeStatus;
	/** Trailing slot — badge, line count, etc. */
	trailing?: ReactNode;
	/** Default-expanded state for directories. */
	defaultExpanded?: boolean;
}

export interface AiFileTreeStrings {
	expandAria: string;
	collapseAria: string;
	statusLabels: Record<AiFileTreeChangeStatus, string>;
}

export const defaultAiFileTreeStrings: AiFileTreeStrings = {
	expandAria: 'Expand directory',
	collapseAria: 'Collapse directory',
	statusLabels: {
		added: 'A',
		modified: 'M',
		removed: 'D',
		renamed: 'R',
	},
};

export interface AiFileTreeProps {
	/** Root nodes — typically one entry but the API accepts multiple. */
	nodes: ReadonlyArray<AiFileTreeNode>;
	/** Selected node id — drives the active row tint. */
	selectedId?: string;
	/** Click handler — fires for files only by default. */
	onSelect?: (node: AiFileTreeNode) => void;
	/** Hide the diff status pills (still tints the row). */
	hideStatusLabels?: boolean;
	/** Indent width per nesting level (px). */
	indent?: number;
	className?: string;
	strings?: Partial<AiFileTreeStrings>;
}
