import { Component, useEffect, useRef, useState, type ReactNode, type ErrorInfo } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/typography/text';
import { CodeBlock } from './code-block';
import { extractExample } from './extract-example';

type Tab = 'preview' | 'code';

export interface ExampleProps {
	name: string;
	source: string;
	description?: string;
	defaultTab?: Tab;
	children: ReactNode;
}

class ExampleErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
	state: { error: Error | null } = { error: null };

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		if (import.meta.env?.DEV) {
			console.error('[Example] render failed:', error, info);
		}
	}

	render() {
		if (this.state.error) {
			return (
				<div className="example--error w-full rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
					This example failed to render: {this.state.error.message}
				</div>
			);
		}
		return this.props.children;
	}
}

export function Example({ name, source, description, defaultTab = 'preview', children }: ExampleProps) {
	const [tab, setTab] = useState<Tab>(defaultTab);
	const code = extractExample(source, name);

	return (
		<div className={cn('example--component overflow-hidden rounded-lg border border-border bg-card')}>
			<div className="example--header flex items-center justify-between border-b border-border px-4 py-2.5">
				<div className="min-w-0">
					<Text weight="semibold">{name}</Text>
					{!!description && (
						<Text size="xs" type="secondary" className="mt-0.5 truncate">{description}</Text>
					)}
				</div>
				<div className="example--tabs flex items-center gap-1 rounded-md bg-muted/60 p-0.5 text-xs">
					<TabButton active={tab === 'preview'} onClick={() => setTab('preview')}>Preview</TabButton>
					<TabButton active={tab === 'code'} onClick={() => setTab('code')}>Code</TabButton>
				</div>
			</div>
			{tab === 'preview' ? (
				<ExamplePreview>
					<ExampleErrorBoundary>{children}</ExampleErrorBoundary>
				</ExamplePreview>
			) : (
				<div className="example--code">
					<CodeBlock code={code} language="tsx" className="rounded-none border-0" />
				</div>
			)}
		</div>
	);
}

/**
 * Wraps the live render so we can detect when an example produces no visible
 * DOM (component returned null, slots collapsed, etc.) and fall back to a
 * "No available blocks" empty state instead of leaving an empty box.
 */
function ExamplePreview({ children }: { children: ReactNode }) {
	const slotRef = useRef<HTMLDivElement | null>(null);
	const [isEmpty, setIsEmpty] = useState(false);

	useEffect(() => {
		const slot = slotRef.current;
		if (!slot) return;

		const measure = () => {
			// Empty when the slot has no element children AND no visible text.
			const hasChildren = slot.children.length > 0;
			const hasText = !!slot.textContent && slot.textContent.trim().length > 0;
			setIsEmpty(!hasChildren && !hasText);
		};

		measure();
		const observer = new MutationObserver(measure);
		observer.observe(slot, { childList: true, subtree: true, characterData: true });
		return () => observer.disconnect();
	}, [children]);

	return (
		<div className="example--preview relative flex min-h-[140px] items-center justify-center px-6 py-8">
			<div ref={slotRef} className="example--preview-slot contents">
				{children}
			</div>
			{isEmpty && (
				<div className="example--empty pointer-events-none">
					<Text size="xs" type="secondary">No blocks available for this section.</Text>
				</div>
			)}
		</div>
	);
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'rounded-sm px-2.5 py-1 transition-colors',
				active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
			)}
		>
			{children}
		</button>
	);
}
