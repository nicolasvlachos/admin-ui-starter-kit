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
import { IconBadge } from '@/components/base/display/icon-badge';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { defaultSmartAccordionStrings } from './accordion.strings';
import type {
	SmartAccordionIconStyle,
	SmartAccordionProps,
	SmartAccordionVariant,
} from './accordion.types';

const ROOT_VARIANT_CLASS: Record<SmartAccordionVariant, string> = {
	card: 'space-y-2 border-0 rounded-none overflow-visible',
	bordered: 'rounded-lg border border-border bg-card overflow-hidden',
	flat: 'border-0 rounded-none bg-transparent overflow-visible',
};

const ITEM_VARIANT_CLASS: Record<SmartAccordionVariant, string> = {
	card: 'border border-border bg-card rounded-md not-last:border-b data-open:bg-card',
	bordered: 'bg-transparent data-open:bg-muted/40',
	flat: 'border-0 bg-transparent data-open:bg-muted/30 rounded-md',
};

const TRIGGER_BASE = 'gap-3 px-3 py-(--row-py) text-left hover:no-underline';

export function SmartAccordion({
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
}: SmartAccordionProps) {
	const strings = useStrings(defaultSmartAccordionStrings, stringsProp);
	return (
		<Accordion
			multiple={multiple}
			defaultValue={defaultValue}
			value={value}
			onValueChange={
				onValueChange
					? (next) => onValueChange(next as string[])
					: undefined
			}
			aria-label={strings.regionAriaLabel}
			className={cn(ROOT_VARIANT_CLASS[variant], className)}
		>
			{items.map((item) => (
				<AccordionItem
					key={item.value}
					value={item.value}
					className={cn(ITEM_VARIANT_CLASS[variant], itemClassName)}
				>
					<AccordionTrigger
						className={cn(TRIGGER_BASE, triggerClassName)}
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
							'pt-0',
							iconStyle === 'medallion' ? 'pl-14 pr-3' : 'pl-3 pr-3',
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
}

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
