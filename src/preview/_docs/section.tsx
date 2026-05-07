import { useEffect } from 'react';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';
import type { SectionProps } from './types';
import { useToc } from './toc-context';

export function Section({ title, id, description, children }: SectionProps) {
	const { register } = useToc();

	useEffect(() => {
		register({ id, title });
	}, [id, title, register]);

	return (
		<section id={id} className={cn('section--component scroll-mt-24 space-y-4')}>
			<div className="section--header">
				<Heading tag="h2">{title}</Heading>
				{!!description && (
					<Text size="xs" type="secondary" className="mt-1">{description}</Text>
				)}
			</div>
			<div className="section--body space-y-4">{children}</div>
		</section>
	);
}
