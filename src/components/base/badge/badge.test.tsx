// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './badge';

describe('Badge', () => {
	it('uses xs sizing by default', () => {
		render(<Badge>Default badge</Badge>);

		const badge = screen.getByText('Default badge').closest('[data-slot="badge"]');

		expect(badge).toHaveClass('px-1.5', 'py-0.5', 'text-xxs');
		expect(badge).not.toHaveClass('text-xs');
	});

	it('still supports explicit size overrides', () => {
		render(<Badge size="sm">Small badge</Badge>);

		const badge = screen.getByText('Small badge').closest('[data-slot="badge"]');

		expect(badge).toHaveClass('px-2', 'py-1', 'text-xs');
	});
});
