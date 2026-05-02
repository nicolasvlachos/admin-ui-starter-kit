/**
 * MetadataList — flexible label/value list for entity metadata.
 *
 * Two layouts:
 *  - `vertical` (default): grid of label-on-top, value-below cells, ideal for
 *    entity detail screens. Honours `columns` (1–4) and `dense` mode.
 *  - `horizontal`: inline label/separator/value pairs that wrap, suitable for
 *    pill-style summaries (e.g. "Created Jan 4 · By Alice · v3.2").
 *
 * Each item supports an optional icon, tooltip, custom `render`, and
 * per-item `emptyLabel`. Falls back to the shared `EMPTY` when both are
 * missing. Returns `null` when the list is empty so callers can render
 * unconditionally.
 */
import { Info, type LucideIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/base/buttons';
import { Separator } from '@/components/base/display/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/display/tooltip';
import Heading from '@/components/typography/heading';
import Text from '@/components/typography/text';
import { EMPTY } from '@/lib/format';
import { useStrings, type StringsProp } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultMetadataListStrings,
	type MetadataListStrings,
} from './metadata-list.strings';

export type { MetadataListStrings };
export { defaultMetadataListStrings };

export type MetadataListItem = {
	id?: string;
	label: React.ReactNode;
	value?: React.ReactNode | null;
	description?: React.ReactNode | null;
	tooltip?: React.ReactNode;
	icon?: LucideIcon;
	emptyLabel?: React.ReactNode;
	render?: (item: MetadataListItem) => React.ReactNode;
};

export type MetadataListProps = {
	items: MetadataListItem[];
	columns?: 1 | 2 | 3 | 4;
	dense?: boolean;
	emptyLabel?: React.ReactNode;
	title?: React.ReactNode;
	titleSeparator?: boolean;
	className?: string;
	gapClassName?: string;
	labelClassName?: string;
	valueClassName?: string;
	descriptionClassName?: string;
	layout?: 'vertical' | 'horizontal' | 'rows';
	justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
	align?: 'start' | 'center' | 'end' | 'baseline';
	separator?: string;
	itemSeparator?: boolean | string;
	wrap?: boolean;
	/** Per-instance string overrides (deep-merged over `defaultMetadataListStrings`). */
	strings?: StringsProp<MetadataListStrings>;
};

const columnClassMap: Record<NonNullable<MetadataListProps['columns']>, string> = {
	1: 'grid-cols-1',
	2: 'grid-cols-1 sm:grid-cols-2',
	3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
	4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const justifyClassMap: Record<NonNullable<MetadataListProps['justify']>, string> = {
	start: 'justify-start',
	end: 'justify-end',
	center: 'justify-center',
	between: 'justify-between',
	around: 'justify-around',
	evenly: 'justify-evenly',
};

const alignClassMap: Record<NonNullable<MetadataListProps['align']>, string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	baseline: 'items-baseline',
};

const resolveKey = (item: MetadataListItem, index: number): string => {
	if (item.id) {
		return item.id;
	}

	const rawLabel = typeof item.label === 'string' ? item.label : `${index}`;
	return `metadata-${rawLabel}-${index}`;
};

export function MetadataList({
	items,
	columns = 2,
	dense = false,
	emptyLabel = EMPTY,
	title,
	titleSeparator = false,
	className,
	gapClassName,
	labelClassName,
	valueClassName,
	descriptionClassName,
	layout = 'vertical',
	justify = 'start',
	align = 'center',
	separator = ': ',
	itemSeparator = false,
	wrap = true,
	strings: stringsProp,
}: MetadataListProps) {
	const strings = useStrings(defaultMetadataListStrings, stringsProp);
	const list = React.useMemo(() => items.filter(Boolean), [items]);

	React.useEffect(() => {
		if (!import.meta.env.DEV) return;
		if (layout !== 'horizontal') return;

		const itemsWithDescriptions = list.filter((item) => Boolean(item.description));
		if (itemsWithDescriptions.length > 0) {
			console.warn(
				'[MetadataList] Horizontal layout does not support descriptions. Items with descriptions will not display them.',
				itemsWithDescriptions,
			);
		}
	}, [layout, list]);

	if (list.length === 0) {
		return null;
	}

	const gridClass = columnClassMap[columns] ?? columnClassMap[2];
	const gapClass = gapClassName ?? (dense ? 'gap-4' : 'gap-6');
	const labelBase = dense ? 'text-xxs' : 'text-xs';
	const valueBase = 'text-sm';
	const hasTitle = title !== null && title !== undefined;
	const shouldShowSeparator = hasTitle && titleSeparator;

	if (layout === 'horizontal') {
		const justifyClass = justifyClassMap[justify] ?? justifyClassMap.start;
		const alignClass = alignClassMap[align] ?? alignClassMap.center;
		const itemSeparatorText =
			typeof itemSeparator === 'string'
				? itemSeparator
				: itemSeparator
					? ' | '
					: '';
		const horizontalGapClass = dense ? 'gap-2' : 'gap-3';
		const wrapClass = wrap ? 'flex-wrap' : 'flex-nowrap';

		return (
			<div className={cn('metadata-list-container space-y-3', className)}>
				{!!hasTitle && (
					<Heading
						tag="h6"
						className="font-medium text-muted-foreground uppercase tracking-wide"
					>
						{title}
					</Heading>
				)}

				{!!shouldShowSeparator && <Separator className="my-3" />}

				<div className={cn('flex', wrapClass, justifyClass, alignClass, horizontalGapClass)}>
					{list.map((item, index) => {
						const key = resolveKey(item, index);
						const effectiveEmptyLabel = item.emptyLabel ?? emptyLabel;
						const value = item.value ?? effectiveEmptyLabel;
						const Icon = item.icon;
						const hasTooltip = item.tooltip !== null && item.tooltip !== undefined;
						const hasCustomRender = typeof item.render === 'function';
						const showItemSeparator = itemSeparatorText && index < list.length - 1;

						return (
							<React.Fragment key={key}>
								<div className="flex items-center gap-1.5">
									{!!Icon && (
										<Icon
											className={cn(
												'flex-shrink-0',
												dense ? 'h-3 w-3' : 'h-3.5 w-3.5',
												'text-muted-foreground',
											)}
										/>
									)}

									<Text
										size="xs"
										type="secondary"
										className={cn(
											'metadata--field tracking-wide whitespace-nowrap',
											labelBase,
											labelClassName,
										)}
									>
										{item.label}
									</Text>

									{!!hasTooltip && (
										<Tooltip>
											<TooltipTrigger
												render={(triggerProps) => (
													<Button
														{...triggerProps}
														type="button"
														variant="secondary"
														buttonStyle="ghost"
														size="icon-xs"
														className={cn(
															'inline-flex items-center',
															 
															(triggerProps as { className?: string }).className,
														)}
														aria-label={typeof item.label === 'string' ? strings.formatInfoAriaLabel(item.label) : strings.infoFallback}
													>
														<Info className="h-3 w-3 text-muted-foreground cursor-help flex-shrink-0" />
													</Button>
												)}
											/>
											<TooltipContent
												side="top"
												align="start"
												className="max-w-xs"
											>
												<Text type="inverse" size="xs">{item.tooltip}</Text>
											</TooltipContent>
										</Tooltip>
									)}

									<Text
										size="xs"
										type="secondary"
									>
										{separator}
									</Text>

									{hasCustomRender ? (
										item.render?.(item)
									) : (
										<Text
											weight="medium"
											className={cn(valueBase, valueClassName)}
										>
											{value}
										</Text>
									)}
								</div>

								{!!showItemSeparator && (
									<Text
										size="xs"
										type="secondary"
									>
										{itemSeparatorText}
									</Text>
								)}
							</React.Fragment>
						);
					})}
				</div>
			</div>
		);
	}

	if (layout === 'rows') {
		const rowPaddingY = dense ? 'py-1.5' : 'py-2.5';
		return (
			<div className={cn('metadata-list-container', className)}>
				{!!hasTitle && (
					<Heading
						tag="h6"
						className="font-medium text-muted-foreground uppercase tracking-wide mb-2"
					>
						{title}
					</Heading>
				)}
				{!!shouldShowSeparator && <Separator className="mb-2" />}
				<dl className="divide-y divide-border/50">
					{list.map((item, index) => {
						const key = resolveKey(item, index);
						const effectiveEmptyLabel = item.emptyLabel ?? emptyLabel;
						const value = item.value ?? effectiveEmptyLabel;
						const Icon = item.icon;
						const hasTooltip = item.tooltip !== null && item.tooltip !== undefined;
						const hasCustomRender = typeof item.render === 'function';

						return (
							<div
								key={key}
								className={cn('grid items-baseline gap-x-4 gap-y-1 grid-cols-[minmax(120px,1fr)_2fr]', rowPaddingY)}
							>
								<dt className="flex items-center gap-1.5 min-w-0">
									{!!Icon && (
										<Icon className={cn('flex-shrink-0 text-muted-foreground', dense ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
									)}
									<Text type="secondary" className={cn('truncate', labelClassName)}>
										{item.label}
									</Text>
									{!!hasTooltip && (
										<Tooltip>
											<TooltipTrigger
												render={(triggerProps) => (
													<Button
														{...triggerProps}
														type="button"
														variant="secondary"
														buttonStyle="ghost"
														size="icon-xs"
														 
														className={cn('inline-flex items-center', (triggerProps as { className?: string }).className)}
														aria-label={typeof item.label === 'string' ? strings.formatInfoAriaLabel(item.label) : strings.infoFallback}
													>
														<Info className="h-3 w-3 text-muted-foreground cursor-help flex-shrink-0" />
													</Button>
												)}
											/>
											<TooltipContent side="top" align="start" className="max-w-xs">
												<Text type="inverse" size="xs">{item.tooltip}</Text>
											</TooltipContent>
										</Tooltip>
									)}
								</dt>
								<dd className="min-w-0">
									{hasCustomRender ? (
										item.render?.(item)
									) : (
										<Text weight="medium" className={cn('break-words', valueClassName)}>
											{value}
										</Text>
									)}
									{!!item.description && (
										<Text size="xs" type="secondary" className={cn('mt-0.5', descriptionClassName)}>
											{item.description}
										</Text>
									)}
								</dd>
							</div>
						);
					})}
				</dl>
			</div>
		);
	}

	return (
		<div className={cn('metadata-list-container space-y-3', className)}>
			{!!hasTitle && (
				<Heading
					tag="h6"
					className="font-medium text-muted-foreground uppercase tracking-wide"
				>
					{title}
				</Heading>
			)}

			{!!shouldShowSeparator && <Separator className="my-3" />}

			<div className={cn('grid', gridClass, gapClass)}>
				{list.map((item, index) => {
					const key = resolveKey(item, index);
					const effectiveEmptyLabel = item.emptyLabel ?? emptyLabel;
					const value = item.value ?? effectiveEmptyLabel;
					const Icon = item.icon;
					const hasTooltip = item.tooltip !== null && item.tooltip !== undefined;
					const hasCustomRender = typeof item.render === 'function';

					return (
						<div
							key={key}
							className="space-y-1"
						>
							<div className="flex items-center gap-1.5">
								{!!Icon && (
									<Icon
										className={cn(
											'flex-shrink-0',
											dense ? 'h-3 w-3' : 'h-3.5 w-3.5',
											'text-muted-foreground',
										)}
									/>
								)}

								<Text
									size="xs"
									type="secondary"
									className={cn(' tracking-wide', labelBase, labelClassName)}
								>
									{item.label}
								</Text>

								{!!hasTooltip && (
									<Tooltip>
										<TooltipTrigger
											render={(triggerProps) => (
												<Button
													{...triggerProps}
													type="button"
													variant="secondary"
													buttonStyle="ghost"
													size="icon-xs"
													className={cn(
														'inline-flex items-center',
														 
														(triggerProps as { className?: string }).className,
													)}
													aria-label={typeof item.label === 'string' ? strings.formatInfoAriaLabel(item.label) : strings.infoFallback}
												>
													<Info className="h-3 w-3 text-muted-foreground cursor-help flex-shrink-0" />
												</Button>
											)}
										/>
										<TooltipContent
											side="top"
											align="start"
											className="max-w-xs"
										>
											<Text type="inverse" size="xs">{item.tooltip}</Text>
										</TooltipContent>
									</Tooltip>
								)}
							</div>

							{hasCustomRender ? (
								item.render?.(item)
							) : (
								<Text
									weight="medium"
									className={cn(valueBase, valueClassName)}
								>
									{value}
								</Text>
							)}

							{!!item.description && (
								<Text
									size="xs"
									type="secondary"
									className={cn(descriptionClassName)}
								>
									{item.description}
								</Text>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

MetadataList.displayName = 'MetadataList';
