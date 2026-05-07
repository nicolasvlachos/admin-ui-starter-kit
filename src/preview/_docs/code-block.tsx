import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
	code: string;
	language?: 'tsx' | 'ts' | 'mdx' | 'bash' | 'json';
	className?: string;
}

export function CodeBlock({ code, language = 'tsx', className }: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const onCopy = useCallback(() => {
		void navigator.clipboard.writeText(code).then(() => {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		});
	}, [code]);

	return (
		<div className={cn('code-block--component group relative overflow-hidden rounded-md border border-border bg-muted/40', className)}>
			<div className="code-block--toolbar flex items-center justify-between border-b border-border bg-card/40 px-3 py-1.5">
				<span className="text-xxs font-medium uppercase tracking-wider text-muted-foreground">{language}</span>
				<Button
					buttonStyle="ghost"
					size="xs"
					onClick={onCopy}
					aria-label={copied ? 'Copied' : 'Copy code'}
				>
					{copied ? <Check className="size-3" /> : <Copy className="size-3" />}
				</Button>
			</div>
			<pre className="code-block--pre overflow-x-auto px-4 py-3 text-xs leading-5">
				<code>{code}</code>
			</pre>
		</div>
	);
}
