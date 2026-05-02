/**
 * LanguageSwitcher — locale picker with two layouts: `buttons` (chunky
 * primary buttons) and `inline` (small text links separated by dots, prefixed
 * with a globe icon). Defaults to `buttons`.
 *
 * The library never navigates on its own. The consumer wires routing /
 * locale switching by passing `onSelect` (e.g. a Tanstack Router
 * `navigate(...)` or Inertia `router.visit(...)`). When `onSelect` is
 * absent the click is a no-op.
 */
import { Globe } from 'lucide-react';
import { Fragment, useCallback } from 'react';

import { Button } from '@/components/base/buttons';
import { cn } from '@/lib/utils';
import type { LocaleOption } from '@/types/locale.types';

interface LanguageSwitcherProps {
	locales: LocaleOption[];
	onRenderLabel?: (options: LocaleOption) => string;
	variant?: 'buttons' | 'inline';
	onSelect?: (value: string) => void;
}

export function LanguageSwitcher({
	locales,
	onRenderLabel,
	variant = 'buttons',
	onSelect,
}: LanguageSwitcherProps) {
	const handleSelect = useCallback((value: string, isActive: boolean) => {
		if (isActive) {
			return;
		}

		onSelect?.(value);
	}, [onSelect]);

	if (locales.length === 0) {
		return null;
	}

	if (variant === 'inline') {
		return (
			<div className="flex items-center justify-center gap-2.5">
				<Globe className="size-4 text-muted-foreground/70" aria-hidden="true" />
				<div className="flex items-center justify-center gap-2.5">
					{locales.map((locale, index) => {
						const label = onRenderLabel
							? onRenderLabel(locale)
							: locale.nativeLabel;

						return (
							<Fragment key={locale.value}>
								<button
									type="button"
									onClick={() =>
										handleSelect(locale.value, locale.active)
									}
									className={cn(
										'text-xs transition-colors',
										locale.active
											? 'text-primary font-medium'
											: 'text-muted-foreground hover:text-foreground',
									)}
								>
									{label}
								</button>
								{index < locales.length - 1 && (
									<span
										aria-hidden="true"
										className="size-1 rounded-full bg-border"
									/>
								)}
							</Fragment>
						);
					})}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-wrap items-center justify-center gap-2">
			{locales.map((locale) => {
				const label = onRenderLabel ? onRenderLabel(locale) : locale.nativeLabel;

				return (
					<Button
						key={locale.value}
						type="button"
						variant="secondary"
						buttonStyle={locale.active ? 'solid' : 'ghost'}
						onClick={() => handleSelect(locale.value, locale.active)}
						className={cn(
							'min-w-[4.5rem] justify-center transition-colors',
							locale.active ? 'font-semibold text-primary' : 'text-muted-foreground',
						)}
					>
						{label}
					</Button>
				);
			})}
		</div>
	);
}

LanguageSwitcher.displayName = 'LanguageSwitcher';
