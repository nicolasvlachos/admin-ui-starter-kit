/**
 * EmailDisplay — formats an email address as a copyable, optional `mailto:`
 * link. Falls back to the shared EMPTY placeholder when no value is provided.
 * Strings are overridable for i18n via the `strings` prop.
 */
import type { ComponentProps, ReactNode } from 'react';

import { Copyable } from '@/components/base/copyable';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { EMPTY } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useTypographyConfig } from '@/lib/ui-provider';

type BaseTextProps = ComponentProps<typeof Text>;

export interface EmailDisplayStrings {
	copySuccess: string;
}

export const defaultEmailDisplayStrings: EmailDisplayStrings = {
	copySuccess: 'Email copied to clipboard',
};

export interface EmailDisplayProps extends Omit<BaseTextProps, 'children' | 'content'> {
	email: string | null | undefined;
	copyable?: boolean;
	emptyLabel?: ReactNode;
	clickable?: boolean;
	strings?: Partial<EmailDisplayStrings>;
	/** @deprecated Use `strings.copySuccess` instead. */
	copySuccessMessage?: string;
}

export function EmailDisplay({
	email,
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
}: EmailDisplayProps) {
	const { defaultTextSize } = useTypographyConfig();
	const size = sizeProp ?? defaultTextSize ?? 'sm';

	const strings = useStrings(defaultEmailDisplayStrings, {
		...(copySuccessMessage ? { copySuccess: copySuccessMessage } : {}),
		...stringsProp,
	});
	if (!email || email.trim().length === 0) {
		return (
			<Text size={size} type="secondary" tag={tag} className={cn('email-display--component', className)} {...props}>
				{emptyLabel}
			</Text>
		);
	}

	const emailText = (
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
			{email}
		</Text>
	);

	if (copyable) {
		const copyableContent = (
			<Copyable
				value={email}
				displayValue={emailText}
				successMessage={strings.copySuccess}
				className="-mx-0"
			/>
		);

		if (clickable) {
			return (
				<a
					href={`mailto:${email}`}
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
			<a href={`mailto:${email}`} className="inline-flex items-center no-underline">
				{emailText}
			</a>
		);
	}

	return emailText;
}

EmailDisplay.displayName = 'EmailDisplay';
