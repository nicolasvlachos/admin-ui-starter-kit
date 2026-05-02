// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { OnboardingChecklist } from './checklist';
import type { OnboardingChecklistStep } from './checklist.types';

afterEach(() => {
	cleanup();
});

const stepsAllPending: OnboardingChecklistStep[] = [
	{ id: 'a', status: 'pending', title: 'Step A', content: 'Body A' },
	{ id: 'b', status: 'pending', title: 'Step B', content: 'Body B' },
];

const stepsMixed: OnboardingChecklistStep[] = [
	{ id: 'done', status: 'completed', title: 'Add products', content: 'Done body' },
	{ id: 'now', status: 'in-progress', title: 'Get the POS app', content: 'Now body' },
	{ id: 'later', status: 'pending', title: 'Set price & stock', content: 'Later body' },
];

describe('OnboardingChecklist', () => {
	it('renders every step title', () => {
		render(<OnboardingChecklist steps={stepsAllPending} />);
		expect(screen.getByText('Step A')).toBeInTheDocument();
		expect(screen.getByText('Step B')).toBeInTheDocument();
	});

	it('opens the first non-completed step by default', () => {
		render(<OnboardingChecklist steps={stepsMixed} />);
		expect(screen.getByText('Now body')).toBeInTheDocument();
		expect(screen.queryByText('Done body')).not.toBeInTheDocument();
	});

	it('honors `defaultExpanded` when provided', () => {
		render(<OnboardingChecklist steps={stepsMixed} defaultExpanded={['later']} />);
		expect(screen.getByText('Later body')).toBeInTheDocument();
	});

	it('fires onValueChange when a step is toggled', () => {
		const onValueChange = vi.fn();
		render(
			<OnboardingChecklist
				steps={stepsAllPending}
				value={[]}
				onValueChange={onValueChange}
			/>,
		);
		fireEvent.click(screen.getByText('Step A'));
		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange.mock.calls[0][0]).toEqual(['a']);
	});

	it('fires onStepOpen on the transition from closed to open', () => {
		const onStepOpen = vi.fn();
		render(
			<OnboardingChecklist
				steps={stepsAllPending}
				defaultExpanded={[]}
				onStepOpen={onStepOpen}
			/>,
		);
		expect(onStepOpen).not.toHaveBeenCalled();
		fireEvent.click(screen.getByText('Step A'));
		expect(onStepOpen).toHaveBeenCalledWith('a');
	});

	it('renders the right ARIA label for each status indicator', () => {
		render(<OnboardingChecklist steps={stepsMixed} defaultExpanded={[]} />);
		expect(screen.getByLabelText('Completed')).toBeInTheDocument();
		expect(screen.getByLabelText('In progress')).toBeInTheDocument();
		expect(screen.getByLabelText('Pending')).toBeInTheDocument();
	});

	it('overrides status ARIA labels via the strings prop', () => {
		render(
			<OnboardingChecklist
				steps={stepsMixed}
				defaultExpanded={[]}
				strings={{
					statusCompletedAria: 'Terminé',
					statusInProgressAria: 'En cours',
					statusPendingAria: 'En attente',
				}}
			/>,
		);
		expect(screen.getByLabelText('Terminé')).toBeInTheDocument();
		expect(screen.getByLabelText('En cours')).toBeInTheDocument();
		expect(screen.getByLabelText('En attente')).toBeInTheDocument();
	});

	it('renders the badge node when supplied', () => {
		const stepsWithBadge: OnboardingChecklistStep[] = [
			{
				id: 'a',
				status: 'completed',
				title: 'Add products',
				badge: <span data-testid="ready-badge">Ready</span>,
			},
		];
		render(<OnboardingChecklist steps={stepsWithBadge} />);
		expect(screen.getByTestId('ready-badge')).toBeInTheDocument();
	});
});
