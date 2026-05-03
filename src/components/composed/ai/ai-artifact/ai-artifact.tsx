/**
 * AiArtifact — generic shell for a model-produced asset (code file, document,
 * design spec, sandbox preview, …). Header carries a leading icon, title /
 * subtitle, and an action toolbar (open, copy, download, custom actions).
 * Body slot accepts the preview itself: `<AiCodeBlock>`, an `<iframe>`, an
 * `<AiPackageInfo>`, etc.
 */
import { useState } from 'react';
import {
	Check,
	Copy,
	Download,
	ExternalLink,
	FileText,
	type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { IconBadge } from '@/components/base/display';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultAiArtifactStrings, type AiArtifactProps } from './types';

export function AiArtifact({
	title,
	subtitle,
	icon,
	copyText,
	children,
	collapsed = false,
	onOpen,
	actions,
	onDownload,
	className,
	strings: stringsProp,
}: AiArtifactProps) {
	const strings = useStrings(defaultAiArtifactStrings, stringsProp);
	const Icon: LucideIcon = icon ?? FileText;
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		if (!copyText) return;
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			void navigator.clipboard.writeText(copyText);
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div
			className={cn('ai-artifact--component', 
				'overflow-hidden rounded-lg border border-border/60 bg-card',
				className,
			)}
		>
			<div className="flex items-center gap-3 border-b border-border/60 bg-muted/20 px-3 py-2">
				<IconBadge icon={Icon} tone="muted" size="sm" shape="square" />
				<div className="min-w-0 flex-1">
					<Text weight="semibold" className="truncate">
						{title}
					</Text>
					{!!subtitle && (
						<Text size="xxs" type="secondary" className="truncate">
							{subtitle}
						</Text>
					)}
				</div>
				<div className="flex items-center gap-1">
					{actions?.map((action) => {
						const ActionIcon = action.icon;
						return (
							<Button
								key={action.id}
								type="button"
								variant="secondary"
								buttonStyle="ghost"
								onClick={action.onSelect}
							>
								{!!ActionIcon && <ActionIcon className="size-3.5" />}
								{action.label}
							</Button>
						);
					})}
					{!!copyText && (
						<Button
							type="button"
							variant="secondary"
							buttonStyle="ghost"
							size="icon-xs"
							aria-label={strings.copyAria}
							onClick={handleCopy}
						>
							{copied ? (
								<Check className="size-3.5 text-success" />
							) : (
								<Copy className="size-3.5" />
							)}
						</Button>
					)}
					{!!onDownload && (
						<Button
							type="button"
							variant="secondary"
							buttonStyle="ghost"
							size="icon-xs"
							aria-label={strings.downloadAria}
							onClick={onDownload}
						>
							<Download className="size-3.5" />
						</Button>
					)}
					{!!onOpen && (
						<Button
							type="button"
							variant="secondary"
							buttonStyle="ghost"
							size="icon-xs"
							aria-label={strings.openAria}
							onClick={onOpen}
						>
							<ExternalLink className="size-3.5" />
						</Button>
					)}
				</div>
			</div>
			{!collapsed && !!children && <div className="bg-card">{children}</div>}
		</div>
	);
}

AiArtifact.displayName = 'AiArtifact';
