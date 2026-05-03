/**
 * SmartAccordion — the canonical "icon + title + optional badge + body"
 * accordion pattern, with three visual variants for the surface chrome
 * (`card` | `bordered` | `flat`) and three icon framings (`medallion` |
 * `inline` | `none`).
 *
 * Composes the wrapped `base/accordion` parts (rule 2 — composed-style
 * convenience built from re-exports, not the raw shadcn primitive).
 *
 * For richer rows (multi-line metadata, custom layouts), drop down to
 * the compound API:
 *
 *     import { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
 *       from '@/components/base/accordion';
 */
import { forwardRef } from 'react';

import { IconBadge } from '@/components/base/display/icon-badge';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import {
	ACCORDION_CONTENT_PADDING,
	ACCORDION_ITEM_VARIANT_CLASS,
	ACCORDION_ROOT_VARIANT_CLASS,
	ACCORDION_TRIGGER_BASE,
} from './accordion-variants';
import { defaultSmartAccordionStrings } from './accordion.strings';
import type {
	SmartAccordionIconStyle,
	SmartAccordionProps,
} from './accordion.types';

export const SmartAccordion = forwardRef<HTMLDivElement, SmartAccordionProps>(function SmartAccordion({
	items,
	multiple = false,
	defaultValue,
	value,
	onValueChange,
	variant = 'card',
	iconStyle = 'medallion',
	className,
	itemClassName,
	triggerClassName,
	contentClassName,
	strings: stringsProp,
}, ref) {
	const strings = useStrings(defaultSmartAccordionStrings, stringsProp);
	return (
		<Accordion
			ref={ref}
			multiple={multiple}
			defaultValue={defaultValue}
			value={value}
			onValueChange={
				onValueChange
					? (next) => onValueChange(next as string[])
					: undefined
			}
			aria-label={strings.regionAriaLabel}
			className={cn(ACCORDION_ROOT_VARIANT_CLASS[variant], className)}
		>
			{items.map((item) => (
				<AccordionItem
					key={item.value}
					value={item.value}
					className={cn(ACCORDION_ITEM_VARIANT_CLASS[variant], itemClassName)}
				>
					<AccordionTrigger
						className={cn(ACCORDION_TRIGGER_BASE, triggerClassName)}
						disabled={item.disabled}
					>
						<div className="flex min-w-0 flex-1 items-center gap-3">
							<SmartAccordionIcon iconStyle={iconStyle} icon={item.icon} />
							<Text tag="span" weight="semibold">
								{item.title}
							</Text>
							{!!item.badge && (
								<span className="ml-1 inline-flex shrink-0">{item.badge}</span>
							)}
						</div>
					</AccordionTrigger>
					<AccordionContent
						className={cn(
							iconStyle === 'medallion'
								? ACCORDION_CONTENT_PADDING.withMedallion
								: ACCORDION_CONTENT_PADDING.withoutMedallion,
							contentClassName,
						)}
					>
						<Text type="secondary" className="leading-relaxed">
							{item.content}
						</Text>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
});

SmartAccordion.displayName = 'SmartAccordion';

function SmartAccordionIcon({
	iconStyle,
	icon,
}: {
	iconStyle: SmartAccordionIconStyle;
	icon?: React.ReactNode;
}) {
	if (iconStyle === 'none' || !icon) return null;
	if (iconStyle === 'inline') {
		return <span className="inline-flex shrink-0 text-muted-foreground">{icon}</span>;
	}
	return (
		<IconBadge size="sm" tone="muted" shape="circle" aria-hidden="true">
			{icon}
		</IconBadge>
	);
}
