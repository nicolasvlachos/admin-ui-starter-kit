// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { Boxes } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { FilterProvider } from '../filter-context';
import { FilterType } from '../filters.types';
import { AsyncSelectFacet } from './async-select-facet';

describe('AsyncSelectFacet', () => {
	it('renders the selected label from initial filter options before async cache hydration', () => {
		const filter = {
			key: 'variant_id',
			label: 'Variant',
			type: FilterType.ASYNC_SELECT,
			operator: 'in' as const,
			icon: <Boxes className="size-4" />,
			displayConfig: { display: 'always' as const },
			placeholder: 'Select variant',
			multiple: true,
			closeOnSelect: false,
			options: [
				{
					value: 'variant-1',
					label: 'Sky Dive • Morning',
					icon: <Boxes className="size-4" />,
				},
			],
		};

		render(
			<FilterProvider
				filters={[filter]}
				activeFilters={[
					{
						id: 'variant_id',
						key: 'variant_id',
						value: ['variant-1'],
						operator: 'in',
					},
				]}
				onFilterChange={vi.fn()}
			>
				<AsyncSelectFacet
					filter={filter}
					value={['variant-1']}
					onChange={vi.fn()}
				/>
			</FilterProvider>,
		);

		expect(screen.getByRole('combobox')).toHaveTextContent('Sky Dive • Morning');
	});
});
