/**
 * UrlDisplay — formats a URL as a copyable, optional external link.
 * Detects insecure (http://) URLs and renders an inline tooltip warning. The
 * link can be truncated by hostname/path heuristic with a tooltip showing the
 * full URL on hover. Strings overridable for i18n.
 */
import { ExternalLink, ShieldAlert } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { Copyable } from '@/components/base/copyable';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/display/tooltip';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { EMPTY } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useTypographyConfig } from '@/lib/ui-provider';

type BaseTextProps = ComponentProps<typeof Text>;

export interface UrlDisplayStrings {
	copySuccess: string;
	httpWarning: string;
}

export const defaultUrlDisplayStrings: UrlDisplayStrings = {
	copySuccess: 'URL copied to clipboard',
	httpWarning: 'This URL uses HTTP which is not secure',
};

export interface UrlDisplayProps extends Omit<BaseTextProps, 'children' | 'content'> {
	url: string | null | undefined;
	copyable?: boolean;
	emptyLabel?: ReactNode;
	clickable?: boolean;
	truncate?: boolean;
	maxLength?: number;
	showExternalIcon?: boolean;
	strings?: Partial<UrlDisplayStrings>;
	/** @deprecated Use `strings.copySuccess` instead. */
	copySuccessMessage?: string;
	/** @deprecated Use `strings.httpWarning` instead. */
	httpWarningMessage?: string;
}

function isHttpUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return parsed.protocol === 'http:';
	} catch {
		return url.toLowerCase().startsWith('http://');
	}
}

function formatUrlForDisplay(url: string, truncate: boolean, maxLength: number): string {
	if (!truncate || url.length <= maxLength) {
		return url;
	}

	try {
		const parsed = new URL(url);
		const domain = parsed.hostname;
		const remaining = maxLength - domain.length - 5;

		if (remaining > 10) {
			const pathStart = parsed.pathname.slice(0, remaining);
			return `${domain}${pathStart}...`;
		}

		return `${url.slice(0, maxLength - 3)}...`;
	} catch {
		return `${url.slice(0, maxLength - 3)}...`;
	}
}

export function UrlDisplay({
	url,
	copyable = true,
	copySuccessMessage,
	emptyLabel = EMPTY,
	clickable = true,
	truncate = false,
	maxLength = 50,
	showExternalIcon = true,
	httpWarningMessage,
	strings: stringsProp,
	size: sizeProp,
	type = 'main',
	tag = 'span',
	className,
	...props
}: UrlDisplayProps) {
	const { defaultTextSize } = useTypographyConfig();
	const size = sizeProp ?? defaultTextSize ?? 'sm';

	const strings = useStrings(defaultUrlDisplayStrings, {
		...(copySuccessMessage ? { copySuccess: copySuccessMessage } : {}),
		...(httpWarningMessage ? { httpWarning: httpWarningMessage } : {}),
		...stringsProp,
	});

	if (!url || url.trim().length === 0) {
		return (
			<Text size={size} type="secondary" tag={tag} className={className} {...props}>
				{emptyLabel}
			</Text>
		);
	}

	const isInsecure = isHttpUrl(url);
	const displayUrl = formatUrlForDisplay(url, truncate, maxLength);
	const shouldShowTitle = truncate && url.length > maxLength;

	const urlContent = (
		<Text size={size} type={type} tag="span" className="inline-flex items-center gap-1.5">
			{!!isInsecure && (
				<Tooltip>
					<TooltipTrigger
						render={(triggerProps) => {
							// Tooltip triggers are `<button>` by default; we render a non-button to avoid nested
							// interactive elements when UrlDisplay is wrapped in an `<a>`.
							const { type, disabled, className: triggerClassName, ...rest } =
								triggerProps as Record<string, unknown> & {
									className?: string;
								};
							void type;
							void disabled;
							return (
								<span
									{...rest}
									tabIndex={0}
									role="img"
									aria-label={strings.httpWarning}
									className={cn(
										'inline-flex items-center text-warning',
										triggerClassName,
									)}
								>
									<ShieldAlert className="size-3.5" aria-hidden="true" />
								</span>
							);
						}}
					/>
					<TooltipContent side="top" className="max-w-xs">
						<Text size="xs">{strings.httpWarning}</Text>
					</TooltipContent>
				</Tooltip>
			)}
			<span
				className={cn(
					'decoration-dotted underline underline-offset-4',
					'transition-colors duration-200',
					isInsecure ? 'decoration-warning' : 'decoration-border',
					clickable ? 'hover:decoration-current' : null,
				)}
				title={(shouldShowTitle && url) || undefined}
			>
				{displayUrl}
			</span>
			{!!clickable && !!showExternalIcon && (
				<ExternalLink className="size-3 text-muted-foreground" />
			)}
		</Text>
	);

	if (copyable) {
		const copyableContent = (
			<Copyable
				value={url}
				displayValue={urlContent}
				successMessage={strings.copySuccess}
				className={cn('-mx-0', className)}
			/>
		);

		if (clickable) {
			return (
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center no-underline"
					onClick={(e) => e.stopPropagation()}
				>
					{copyableContent}
				</a>
			);
		}

		return copyableContent;
	}

	if (clickable) {
		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex items-center no-underline"
			>
				{urlContent}
			</a>
		);
	}

	return urlContent;
}

UrlDisplay.displayName = 'UrlDisplay';
