// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Badge } from './badge';
import { Button } from './buttons';
import { Input, Select, Textarea } from './forms';
import { Label, Text } from '@/components/typography';
import { applyUIConfig, resetUIConfig } from '@/lib/ui-provider/store';

describe('base component size defaults', () => {
	afterEach(() => {
		resetUIConfig();
	});

	it('uses UIProvider typography, badge, and button size defaults', () => {
		applyUIConfig({
			typography: { defaultTextSize: 'xs' },
			badge: { defaultSize: 'sm' },
			button: { defaultSize: 'xs' },
		});

		render(
			<>
				<Text>Configured text</Text>
				<Badge>Configured badge</Badge>
				<Button>Configured button</Button>
			</>,
		);

		expect(screen.getByText('Configured text')).toHaveClass('text-xs');
		expect(screen.getByText('Configured text')).not.toHaveClass('text-sm');

		const badge = screen
			.getByText('Configured badge')
			.closest('[data-slot="badge"]');
		expect(badge).toHaveClass('px-2', 'py-1', 'text-xs');

		expect(screen.getByRole('button', { name: 'Configured button' })).toHaveClass(
			'h-6',
			'text-xs',
		);
	});

	it('keeps explicit size props above configured defaults', () => {
		applyUIConfig({
			typography: { defaultTextSize: 'xs' },
			badge: { defaultSize: 'sm' },
			button: { defaultSize: 'xs' },
		});

		render(
			<>
				<Text size="lg">Explicit text</Text>
				<Badge size="md">Explicit badge</Badge>
				<Button size="lg">Explicit button</Button>
			</>,
		);

		expect(screen.getByText('Explicit text')).toHaveClass('text-lg');

		const badge = screen
			.getByText('Explicit badge')
			.closest('[data-slot="badge"]');
		expect(badge).toHaveClass('px-2.5', 'py-1.5', 'text-sm');

		expect(screen.getByRole('button', { name: 'Explicit button' })).toHaveClass(
			'h-10',
		);
	});

	it('uses UIProvider form control and label size defaults', () => {
		applyUIConfig({
			forms: {
				defaultControlSize: 'base',
				defaultLabelSize: 'xs',
			},
		});

		render(
			<>
				<Label htmlFor="configured-input">Configured label</Label>
				<Input id="configured-input" aria-label="Configured input" />
				<Textarea aria-label="Configured textarea" />
				<Select
					options={[{ value: 'paid', label: 'Paid' }]}
					placeholder="Configured select"
				/>
			</>,
		);

		expect(screen.getByText('Configured label')).toHaveClass('text-xs');
		expect(screen.getByLabelText('Configured input')).toHaveClass(
			'!h-9',
			'text-base',
			'md:text-sm',
		);
		expect(screen.getByLabelText('Configured textarea')).toHaveClass(
			'min-h-[60px]',
			'text-base',
			'md:text-sm',
		);
		const configuredSelectTrigger = screen
			.getByText('Configured select')
			.closest('button') as HTMLElement;
		expect(configuredSelectTrigger).toHaveClass(
			'!h-9',
			'text-base',
			'md:text-sm',
		);
	});

	it('keeps explicit form sizes above configured defaults', () => {
		applyUIConfig({
			forms: {
				defaultControlSize: 'base',
				defaultLabelSize: 'xs',
			},
		});

		render(
			<>
				<Label size="base">Explicit label</Label>
				<Input size="sm" aria-label="Explicit input" />
				<Textarea size="lg" aria-label="Explicit textarea" />
				<Select
					size="lg"
					options={[{ value: 'paid', label: 'Paid' }]}
					placeholder="Explicit select"
				/>
			</>,
		);

		expect(screen.getByText('Explicit label')).toHaveClass('text-base');
		expect(screen.getByLabelText('Explicit input')).toHaveClass('!h-8', 'text-sm');
		expect(screen.getByLabelText('Explicit textarea')).toHaveClass(
			'min-h-20',
			'text-base',
		);
		const explicitSelectTrigger = screen
			.getByText('Explicit select')
			.closest('button') as HTMLElement;
		expect(explicitSelectTrigger).toHaveClass(
			'!h-10',
			'text-base',
		);
	});
});
