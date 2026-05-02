// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Hoisted — the dynamic `import('sonner')` inside the row's copy handler
// resolves to this stub instead of pulling the real toast portal.
vi.mock('sonner', () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

import { ApiKeyList } from './api-key-list';
import type { ApiKeyListItem } from './api-key-list.types';

afterEach(() => {
	cleanup();
});

beforeEach(() => {
	// jsdom doesn't ship a navigator.clipboard; stub it so handlers run.
	Object.assign(navigator, {
		clipboard: {
			writeText: vi.fn().mockResolvedValue(undefined),
		},
	});
});

const items: ApiKeyListItem[] = [
	{ id: 'p', name: 'Production', value: 'AUDO230454*242SDIFPPL' },
	{ id: 'd', name: 'Development', value: 'DUILO30454*242SDIFUIP' },
];

describe('ApiKeyList', () => {
	it('renders the title and every key row', () => {
		render(<ApiKeyList items={items} />);
		expect(screen.getByText('API keys')).toBeInTheDocument();
		expect(screen.getByText('Production')).toBeInTheDocument();
		expect(screen.getByText('Development')).toBeInTheDocument();
	});

	it('shows the empty message when items is []', () => {
		render(<ApiKeyList items={[]} />);
		expect(screen.getByText('No keys yet.')).toBeInTheDocument();
	});

	it('hides the add button when onAdd is omitted', () => {
		render(<ApiKeyList items={items} />);
		expect(screen.queryByLabelText('Add API key')).not.toBeInTheDocument();
	});

	it('renders the add button and fires onAdd when supplied', () => {
		const onAdd = vi.fn();
		render(<ApiKeyList items={items} onAdd={onAdd} />);
		fireEvent.click(screen.getByLabelText('Add API key'));
		expect(onAdd).toHaveBeenCalledTimes(1);
	});

	it('uses displayValue when provided (masked render)', () => {
		render(
			<ApiKeyList
				items={[
					{ id: 'm', name: 'Masked', value: 'real-secret', displayValue: '·····2A4D' },
				]}
			/>,
		);
		expect(screen.getByText('·····2A4D')).toBeInTheDocument();
		expect(screen.queryByText('real-secret')).not.toBeInTheDocument();
	});

	it('overrides every label via the strings prop', () => {
		render(
			<ApiKeyList
				items={[]}
				strings={{
					title: 'Clés API',
					emptyMessage: 'Aucune clé.',
					addAria: 'Ajouter une clé',
				}}
				onAdd={() => {}}
			/>,
		);
		expect(screen.getByText('Clés API')).toBeInTheDocument();
		expect(screen.getByText('Aucune clé.')).toBeInTheDocument();
		expect(screen.getByLabelText('Ajouter une clé')).toBeInTheDocument();
	});

	it('honors the controlled `open` prop and emits onOpenChange', () => {
		const onOpenChange = vi.fn();
		render(<ApiKeyList items={items} open={false} onOpenChange={onOpenChange} />);
		// content hidden when controlled-closed
		expect(screen.queryByText('Production')).not.toBeInTheDocument();
		fireEvent.click(screen.getByText('API keys'));
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});
});
