// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SmartCard } from './smart-card';

describe('SmartCard', () => {
	it('renders a standardized leading icon while preserving the default title contract', () => {
		const { container } = render(
			<SmartCard
				icon={<span data-testid="card-icon">I</span>}
				title="Owner"
			>
				<div>Body</div>
			</SmartCard>,
		);

		expect(screen.getByTestId('card-icon')).toBeInTheDocument();
		expect(screen.getByText('Owner')).toBeInTheDocument();
		expect(container.querySelector('[data-slot="card-title"]')).toHaveTextContent(
			'Owner',
		);
	});
});
