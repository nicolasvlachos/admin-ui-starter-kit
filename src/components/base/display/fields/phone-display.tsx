/**
 * PhoneDisplay — formats a phone number as a copyable, optional `tel:` link.
 * Strips visual separators when generating the `tel:` href; falls back to the
 * shared EMPTY placeholder when no value is provided. Strings overridable.
 */
import type { ComponentProps, ReactNode } from 'react';

import { Copyable } from '@/components/base/copyable';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { EMPTY } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useTypographyConfig } from '@/lib/ui-provider';

type BaseTextProps = ComponentProps<typeof Text>;

export interface PhoneDisplayStrings {
	copySuccess: string;
}

export const defaultPhoneDisplayStrings: PhoneDisplayStrings = {
	copySuccess: 'Phone number copied to clipboard',
};

export interface PhoneDisplayProps extends Omit<BaseTextProps, 'children' | 'content'> {
	phone: string | null | undefined;
	copyable?: boolean;
	emptyLabel?: ReactNode;
	clickable?: boolean;
	strings?: Partial<PhoneDisplayStrings>;
	/** @deprecated Use `strings.copySuccess` instead. */
	copySuccessMessage?: string;
}

function formatPhoneForTel(phone: string): string {
	return phone.replace(/[\s().-]/g, '');
}

export function PhoneDisplay({
	phone,
	copyable = true,
	copySuccessMessage,
	emptyLabel = EMPTY,
	clickable = true,
	strings: stringsProp,
	size: sizeProp,
	type = 'main',
	tag = 'span',
	className,
	...props
}: PhoneDisplayProps) {
	const { defaultTextSize } = useTypographyConfig();
	const size = sizeProp ?? defaultTextSize ?? 'sm';

	const strings = useStrings(defaultPhoneDisplayStrings, {
		...(copySuccessMessage ? { copySuccess: copySuccessMessage } : {}),
		...stringsProp,
	});
	if (!phone || phone.trim().length === 0) {
		return (
			<Text size={size} type="secondary" tag={tag} className={className} {...props}>
				{emptyLabel}
			</Text>
		);
	}

	const phoneText = (
		<Text
			size={size}
			type={type}
			tag="span"
			className={cn(
				'font-medium',
				'decoration-dotted decoration-border underline underline-offset-4',
				'transition-colors duration-200',
				clickable ? 'hover:decoration-current' : null,
				className,
			)}
		>
			{phone}
		</Text>
	);

	if (copyable) {
		const copyableContent = (
			<Copyable
				value={phone}
				displayValue={phoneText}
				successMessage={strings.copySuccess}
				className="-mx-0"
			/>
		);

		if (clickable) {
			return (
				<a
					href={`tel:${formatPhoneForTel(phone)}`}
					className="inline-flex items-center no-underline"
					onClick={(e) => e.stopPropagation()}
				>
					{copyableContent}
				</a>
			);
		}

		return copyableContent;
	}

	if (clickable) {
		return (
			<a
				href={`tel:${formatPhoneForTel(phone)}`}
				className="inline-flex items-center no-underline"
			>
				{phoneText}
			</a>
		);
	}

	return phoneText;
}

PhoneDisplay.displayName = 'PhoneDisplay';
