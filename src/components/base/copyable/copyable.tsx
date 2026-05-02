import { Check, Copy } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { toast } from 'sonner';

import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

interface CopyableProps {
	/** The value to copy to clipboard */
	value: string;
	/** Optional display content (if different from value). Can be a string or ReactNode */
	displayValue?: ReactNode;
	/** Use monospace font (only applies when displayValue is not a ReactNode) */
	mono?: boolean;
	/** Truncate with ellipsis (only applies when displayValue is not a ReactNode) */
	truncate?: boolean;
	/** Additional className for the container */
	className?: string;
	/**ClassName for the display content wrapper */
	contentClassName?: string;
	/** Success message shown in toast */
	successMessage?: string;
}

export function Copyable({
	value,
	displayValue,
	mono = false,
	truncate = false,
	className,
	contentClassName,
	successMessage = 'Copied to clipboard',
}: CopyableProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			toast.success(successMessage);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error('Failed to copy');
		}
	};

	// Check if displayValue is a ReactNode (not a string)
	const isReactNode = displayValue !== undefined && typeof displayValue !== 'string';

	return (
		<span
			role="button"
			tabIndex={0}
			onClick={handleCopy}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					void handleCopy();
				}
			}}
			className={cn(
				'group inline-flex cursor-pointer items-center gap-1.5 rounded px-1 -mx-1 transition-colors hover:bg-muted',
				className,
			)}
		>
			{isReactNode ? (
				displayValue
			) : (
				<Text
					tag="span"
					className={cn(
						mono && 'font-mono',
						truncate && 'max-w-[300px] truncate',
						contentClassName,
					)}
				>
					{displayValue ?? value}
				</Text>
			)}
			<span className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
				{copied ? (
					<Check className="size-3.5 text-success" />
				) : (
					<Copy className="size-3.5" />
				)}
			</span>
		</span>
	);
}

export type { CopyableProps };

Copyable.displayName = 'Copyable';
