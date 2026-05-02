/**
 * Default partial implementations for `<SharedResourceCard>`.
 *
 * Consumers can override any of these by passing
 * `ResourceContentComponent` / `EmptyContentComponent` /
 * `selector.DialogContentComponent` / `selector.DialogSummaryComponent`
 * to `<SharedResourceCard>`. Strings flow through the `strings` prop
 * deep-merged over `defaultSharedResourceCardStrings`.
 */
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';

import { defaultSharedResourceCardStrings, type SharedResourceCardStrings } from '../card.strings';
import type {
	SharedResourceCardContentProps,
	SharedResourceCardDialogContentProps,
	SharedResourceCardDialogSummaryProps,
} from '../card.types';

type DefaultStrings = Partial<SharedResourceCardStrings>;

const resolve = (override: DefaultStrings | undefined): SharedResourceCardStrings => ({
	...defaultSharedResourceCardStrings,
	...(override ?? {}),
});

export function DefaultDialogSummary<TResource, TSuggestion>({
	context,
	strings,
}: SharedResourceCardDialogSummaryProps<TResource, TSuggestion> & { strings?: DefaultStrings }) {
	const s = resolve(strings);
	const selected = context.selectedSuggestion;

	if (selected === null) {
		return null;
	}

	const label =
		typeof selected === 'object' &&
		selected !== null &&
		'label' in selected &&
		typeof selected.label === 'string'
			? selected.label
			: '';

	return (
		<div className="bg-muted rounded-md p-3 text-sm">
			<div className="font-medium">{s.currentlySelected}</div>
			<div className="text-muted-foreground mt-1">{label}</div>
		</div>
	);
}
DefaultDialogSummary.displayName = 'DefaultDialogSummary';

export function DefaultResourceContent<TResource, TSuggestion>({
	context: _context,
	strings,
}: SharedResourceCardContentProps<TResource, TSuggestion> & { strings?: DefaultStrings }) {
	const s = resolve(strings);
	return <Text type="secondary">{s.noResourceContent}</Text>;
}
DefaultResourceContent.displayName = 'DefaultResourceContent';

export function DefaultEmptyContent<TResource, TSuggestion>({
	context,
	strings,
}: SharedResourceCardContentProps<TResource, TSuggestion> & { strings?: DefaultStrings }) {
	const s = resolve(strings);
	return (
		<div className="flex flex-col items-center justify-center py-8 text-center">
			<Text type="secondary" className="mb-4">
				{s.noResourceSelected}
			</Text>
			<Button
				variant="secondary"
				buttonStyle="outline"
				onClick={context.openSelector}
				type="button"
			>
				{s.changeAction}
			</Button>
		</div>
	);
}
DefaultEmptyContent.displayName = 'DefaultEmptyContent';

export function DefaultDialogContent<TResource, TSuggestion>({
	SelectorComponent,
	selectorProps,
	context,
}: SharedResourceCardDialogContentProps<TResource, TSuggestion>) {
	return (
		<div className="py-2">
			<SelectorComponent
				onSelect={context.setSelectedSuggestion}
				selected={context.selectedSuggestion}
				setSelected={context.setSelectedSuggestion}
				inModal
				lockOnSelect={false}
				context="dialog"
				{...selectorProps}
			/>
		</div>
	);
}
DefaultDialogContent.displayName = 'DefaultDialogContent';
