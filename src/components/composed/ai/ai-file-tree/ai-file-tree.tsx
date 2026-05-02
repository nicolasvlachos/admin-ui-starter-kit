/**
 * AiFileTree — compact file/directory tree used to surface a model's proposed
 * file changes (a new repo scaffold, a multi-file edit set, an artifact
 * bundle). Accepts a recursive `nodes` array; rows are click-selectable
 * (files), directories toggle expanded. Diff status (added / modified /
 * removed / renamed) drives both a trailing pill and a subtle row tint.
 */
import { useState, type ReactNode } from 'react';
import {
	ChevronDown,
	ChevronRight,
	File,
	FileCode,
	FileText,
	Folder,
	FolderOpen,
	type LucideIcon,
} from 'lucide-react';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiFileTreeStrings,
	type AiFileTreeChangeStatus,
	type AiFileTreeNode,
	type AiFileTreeProps,
} from './types';

const STATUS_TINT: Record<AiFileTreeChangeStatus, { row: string; pill: string }> = {
	added: { row: 'before:bg-success', pill: 'bg-success/15 text-success' },
	modified: { row: 'before:bg-warning', pill: 'bg-warning/20 text-warning' },
	removed: { row: 'before:bg-destructive', pill: 'bg-destructive/15 text-destructive' },
	renamed: { row: 'before:bg-info', pill: 'bg-info/15 text-info' },
};

function pickFileIcon(name: string): LucideIcon {
	const ext = name.split('.').pop()?.toLowerCase() ?? '';
	if (['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json', 'css', 'scss', 'html', 'sh', 'py', 'rs', 'go'].includes(ext)) {
		return FileCode;
	}
	if (['md', 'mdx', 'txt'].includes(ext)) {
		return FileText;
	}
	return File;
}

export function AiFileTree({
	nodes,
	selectedId,
	onSelect,
	hideStatusLabels = false,
	indent = 14,
	className,
	strings: stringsProp,
}: AiFileTreeProps) {
	const strings = useStrings(defaultAiFileTreeStrings, stringsProp);
	return (
		<div
			className={cn(
				'overflow-hidden rounded-lg border border-border/60 bg-card font-mono text-xs',
				className,
			)}
		>
			<ul>
				{nodes.map((node) => (
					<TreeRow
						key={node.id}
						node={node}
						depth={0}
						selectedId={selectedId}
						onSelect={onSelect}
						hideStatusLabels={hideStatusLabels}
						indent={indent}
						strings={strings}
					/>
				))}
			</ul>
		</div>
	);
}

AiFileTree.displayName = 'AiFileTree';

function TreeRow({
	node,
	depth,
	selectedId,
	onSelect,
	hideStatusLabels,
	indent,
	strings,
}: {
	node: AiFileTreeNode;
	depth: number;
	selectedId?: string;
	onSelect?: (n: AiFileTreeNode) => void;
	hideStatusLabels: boolean;
	indent: number;
	strings: ReturnType<typeof useStrings<typeof defaultAiFileTreeStrings>>;
}) {
	const [open, setOpen] = useState(node.defaultExpanded ?? depth < 1);
	const isDir = node.kind === 'directory';
	const isSelected = selectedId === node.id;
	const status = node.status;
	const tint = status ? STATUS_TINT[status] : undefined;

	const Icon: LucideIcon =
		node.icon ??
		(isDir ? (open ? FolderOpen : Folder) : pickFileIcon(node.name));

	const handleClick = () => {
		if (isDir) setOpen((v) => !v);
		else onSelect?.(node);
	};

	const Trailing: ReactNode = (
		<>
			{!!status && !hideStatusLabels && (
				<span
					className={cn(
						'inline-flex size-4 shrink-0 items-center justify-center rounded',
						'text-[0.625rem] font-bold leading-none uppercase',
						tint?.pill,
					)}
				>
					{strings.statusLabels[status]}
				</span>
			)}
			{!!node.trailing && (
				<Text tag="span" size="xxs" type="secondary" className="tabular-nums">
					{node.trailing}
				</Text>
			)}
		</>
	);

	return (
		<li>
			<button
				type="button"
				onClick={handleClick}
				aria-expanded={isDir ? open : undefined}
				aria-label={
					isDir ? (open ? strings.collapseAria : strings.expandAria) : undefined
				}
				className={cn(
					'group relative flex w-full items-center gap-1.5 px-2 py-1 text-left',
					'hover:bg-muted/40',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40',
					isSelected && 'bg-primary/10',
					!!status &&
						'before:absolute before:left-0 before:top-0 before:h-full before:w-0.5',
					tint?.row,
					status === 'removed' && 'text-muted-foreground/80',
				)}
				style={{ paddingLeft: 8 + depth * indent }}
			>
				{isDir ? (
					open ? (
						<ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
					) : (
						<ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
					)
				) : (
					<span aria-hidden className="size-3.5 shrink-0" />
				)}
				<Icon
					className={cn(
						'size-3.5 shrink-0',
						isDir ? 'text-muted-foreground' : 'text-muted-foreground/80',
					)}
				/>
				<span
					className={cn(
						'flex-1 truncate',
						status === 'removed' && 'line-through',
					)}
				>
					{node.name}
				</span>
				<span className="ml-auto flex items-center gap-1.5">{Trailing}</span>
			</button>
			{isDir && open && !!node.children?.length && (
				<ul>
					{node.children.map((child) => (
						<TreeRow
							key={child.id}
							node={child}
							depth={depth + 1}
							selectedId={selectedId}
							onSelect={onSelect}
							hideStatusLabels={hideStatusLabels}
							indent={indent}
							strings={strings}
						/>
					))}
				</ul>
			)}
		</li>
	);
}
