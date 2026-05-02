// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { EmptyState } from './empty-state';

afterEach(() => {
	cleanup();
});

describe('EmptyState', () => {
	it('falls back to default strings when title/description are absent', () => {
		render(<EmptyState />);
		expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
		expect(
			screen.getByText('Once data lands, it will show up in this view.'),
		).toBeInTheDocument();
		expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Empty state');
	});

	it('overrides every piece of copy via the strings prop (deep-merge)', () => {
		render(
			<EmptyState
				strings={{
					title: 'Aucun produit',
					description: 'Ajoutez votre premier produit.',
					ariaLabel: 'État vide',
				}}
			/>,
		);
		expect(screen.getByText('Aucun produit')).toBeInTheDocument();
		expect(screen.getByText('Ajoutez votre premier produit.')).toBeInTheDocument();
		expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'État vide');
	});

	it('hides the description when description={false}', () => {
		render(<EmptyState title="All caught up" description={false} />);
		expect(screen.getByText('All caught up')).toBeInTheDocument();
		expect(
			screen.queryByText('Once data lands, it will show up in this view.'),
		).not.toBeInTheDocument();
	});

	it('renders actions and footer slots', () => {
		render(
			<EmptyState
				title="No products"
				actions={<button type="button">Add product</button>}
				footer={<span>Need help?</span>}
			/>,
		);
		expect(screen.getByRole('button', { name: 'Add product' })).toBeInTheDocument();
		expect(screen.getByText('Need help?')).toBeInTheDocument();
	});

	it('uses renderMedia when provided and forwards the variant in context', () => {
		const renderMedia = ({ mediaVariant }: { mediaVariant: string }) => (
			<div data-testid="custom-media">variant:{mediaVariant}</div>
		);
		render(
			<EmptyState mediaVariant="illustration" renderMedia={renderMedia} title="x" />,
		);
		expect(screen.getByTestId('custom-media')).toHaveTextContent('variant:illustration');
	});

	it('toggles the dashed-border class via the border prop', () => {
		const { rerender } = render(<EmptyState title="x" />);
		expect(screen.getByRole('status')).toHaveClass('border-0');
		rerender(<EmptyState title="x" border />);
		expect(screen.getByRole('status')).toHaveClass('border', 'border-dashed');
	});
});
