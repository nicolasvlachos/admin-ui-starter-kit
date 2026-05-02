import { type ReactNode } from 'react';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';

export function PreviewSection({
	title,
	description,
	children,
	span = 'auto',
}: {
	title: string;
	description?: string;
	children: ReactNode;
	span?: 'auto' | 'full';
}) {
	return (
		<section className={span === 'full' ? 'col-span-full space-y-3' : 'space-y-3'}>
			<div>
				<Heading tag="h4">{title}</Heading>
				{!!description && (
					<Text size="xs" type="secondary" className="mt-0.5">{description}</Text>
				)}
			</div>
			<div className="rounded-lg border border-border bg-card p-5 shadow-xs">
				{children}
			</div>
		</section>
	);
}

export function PreviewPage({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<div className="space-y-8">
			<header className="border-b border-border pb-4">
				<Heading tag="h1">{title}</Heading>
				{!!description && (
					<Text type="secondary" className="mt-1">{description}</Text>
				)}
			</header>
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{children}
			</div>
		</div>
	);
}

export function Row({ children, className = '' }: { children: ReactNode; className?: string }) {
	return <div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>;
}

export function Col({ children, className = '' }: { children: ReactNode; className?: string }) {
	return <div className={`flex flex-col gap-3 ${className}`}>{children}</div>;
}
