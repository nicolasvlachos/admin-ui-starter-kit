// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SmartAccordion } from './smart-accordion';

afterEach(() => {
	cleanup();
});

const baseItems = [
	{ value: 'a', title: 'Item A', content: 'Body A' },
	{ value: 'b', title: 'Item B', content: 'Body B' },
];

describe('SmartAccordion', () => {
	it('renders every item title', () => {
		render(<SmartAccordion items={baseItems} />);
		expect(screen.getByText('Item A')).toBeInTheDocument();
		expect(screen.getByText('Item B')).toBeInTheDocument();
	});

	it('starts with `defaultValue` items expanded (uncontrolled)', () => {
		render(<SmartAccordion items={baseItems} defaultValue={['a']} />);
		expect(screen.getByText('Body A')).toBeInTheDocument();
	});

	it('fires `onValueChange` with the new array of expanded ids', () => {
		const onValueChange = vi.fn();
		render(
			<SmartAccordion
				items={baseItems}
				value={[]}
				onValueChange={onValueChange}
			/>,
		);
		fireEvent.click(screen.getByText('Item A'));
		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange.mock.calls[0][0]).toEqual(['a']);
	});

	it('renders a leading medallion when `iconStyle="medallion"`', () => {
		render(
			<SmartAccordion
				items={[
					{
						...baseItems[0],
						icon: <span data-testid="my-icon">i</span>,
					},
				]}
			/>,
		);
		const icon = screen.getByTestId('my-icon');
		expect(icon).toBeInTheDocument();
		expect(icon.parentElement).toHaveClass('rounded-full', 'bg-muted');
	});

	it('respects iconStyle="none" by hiding the icon entirely', () => {
		render(
			<SmartAccordion
				iconStyle="none"
				items={[{ ...baseItems[0], icon: <span data-testid="ic">i</span> }]}
			/>,
		);
		expect(screen.queryByTestId('ic')).not.toBeInTheDocument();
	});

	it('renders an item badge when supplied', () => {
		render(
			<SmartAccordion
				items={[{ ...baseItems[0], badge: <span data-testid="b">New</span> }]}
			/>,
		);
		expect(screen.getByTestId('b')).toBeInTheDocument();
	});

	it('exposes `regionAriaLabel` from strings on the root', () => {
		render(
			<SmartAccordion
				items={baseItems}
				strings={{ regionAriaLabel: 'Settings sections' }}
			/>,
		);
		const root = document.querySelector('[data-slot="accordion"]');
		expect(root).toHaveAttribute('aria-label', 'Settings sections');
	});
});
