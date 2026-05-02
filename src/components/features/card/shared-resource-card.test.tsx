// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SharedResourceCard } from './shared-resource-card';

describe('SharedResourceCard', () => {
	it('renders the normalized icon-title header contract through SmartCard', () => {
		render(
			<SharedResourceCard<{ id: string }, { id: string }>
				icon={<span data-testid="shared-resource-icon">I</span>}
				title="Customer"
				resource={{ id: 'customer-1' }}
				hasResource
				renderResourceContent={() => <div>Selected customer</div>}
			/>,
		);

		expect(screen.getByTestId('shared-resource-icon')).toBeInTheDocument();
		expect(screen.getByText('Customer')).toBeInTheDocument();
		expect(screen.getByText('Selected customer')).toBeInTheDocument();
	});
});
