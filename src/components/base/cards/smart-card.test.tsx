// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SmartCard } from './smart-card';

afterEach(() => {
	cleanup();
});

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

	describe('headerDivider', () => {
		it('adds a `border-b` rule to the header when set', () => {
			const { container } = render(
				<SmartCard title="t" headerDivider>
					<div>x</div>
				</SmartCard>,
			);
			const header = container.querySelector('[data-slot="card-header"]');
			expect(header).toHaveClass('border-b');
		});

		it('omits the rule by default', () => {
			const { container } = render(
				<SmartCard title="t">
					<div>x</div>
				</SmartCard>,
			);
			const header = container.querySelector('[data-slot="card-header"]');
			expect(header).not.toHaveClass('border-b');
		});
	});

	describe('footerSlot + footerDivider', () => {
		it('renders a footer band when footerSlot is supplied', () => {
			render(
				<SmartCard title="t" footerSlot={<button>Open</button>}>
					<div>x</div>
				</SmartCard>,
			);
			expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
		});

		it('omits the footer band when footerSlot is absent', () => {
			const { container } = render(
				<SmartCard title="t">
					<div>x</div>
				</SmartCard>,
			);
			expect(container.querySelectorAll('[data-slot="card-footer"]').length).toBe(0);
		});

		it('adds a `border-t` rule to the footer when footerDivider is set', () => {
			const { container } = render(
				<SmartCard title="t" footerSlot={<button>Open</button>} footerDivider>
					<div>x</div>
				</SmartCard>,
			);
			const footer = container.querySelector('[data-slot="card-footer"]');
			expect(footer).toHaveClass('border-t');
		});
	});

	describe('expandable', () => {
		it('renders the toggle button when expandable is true', () => {
			render(
				<SmartCard title="Plan" expandable>
					<div>Body</div>
				</SmartCard>,
			);
			expect(screen.getByRole('button', { name: 'Expand card' })).toBeInTheDocument();
		});

		it('toggles uncontrolled expanded state on click', () => {
			render(
				<SmartCard title="Plan" expandable defaultExpanded={false}>
					<div>Body</div>
				</SmartCard>,
			);
			const toggle = screen.getByRole('button', { name: 'Expand card' });
			expect(toggle).toHaveAttribute('aria-expanded', 'false');
			fireEvent.click(toggle);
			expect(
				screen.getByRole('button', { name: 'Collapse card' }),
			).toHaveAttribute('aria-expanded', 'true');
		});

		it('respects the controlled expanded prop and emits onExpandedChange', () => {
			const onExpandedChange = vi.fn();
			render(
				<SmartCard title="Plan" expandable expanded={false} onExpandedChange={onExpandedChange}>
					<div>Body</div>
				</SmartCard>,
			);
			fireEvent.click(screen.getByRole('button', { name: 'Expand card' }));
			expect(onExpandedChange).toHaveBeenCalledWith(true);
			// Aria stays false because parent didn't update prop — controlled mode.
			expect(
				screen.getByRole('button', { name: 'Expand card' }),
			).toHaveAttribute('aria-expanded', 'false');
		});

		it('overrides toggle aria-label via the strings prop', () => {
			render(
				<SmartCard
					title="Plan"
					expandable
					strings={{ expandLabel: 'Voir plus', collapseLabel: 'Voir moins' }}
				>
					<div>Body</div>
				</SmartCard>,
			);
			expect(screen.getByRole('button', { name: 'Voir plus' })).toBeInTheDocument();
		});

		it('skips the toggle entirely when expandable is false', () => {
			render(
				<SmartCard title="Plan">
					<div>Body</div>
				</SmartCard>,
			);
			expect(screen.queryByRole('button', { name: /Expand|Collapse/i })).not.toBeInTheDocument();
		});
	});
});
