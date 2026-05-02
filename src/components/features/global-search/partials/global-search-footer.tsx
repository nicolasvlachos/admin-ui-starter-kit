/**
 * GlobalSearchFooter — keyboard-hint strip below the result list.
 * Override entirely via `slots.footer`.
 */
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

const KBD_CLASS =
    'rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-xs leading-none text-muted-foreground';

export interface GlobalSearchFooterProps {
    navigateLabel: string;
    openLabel: string;
    closeLabel: string;
    /** Trailing right-aligned content (e.g. "3 results"). */
    trailing?: React.ReactNode;
    className?: string;
}

export function GlobalSearchFooter({
    navigateLabel,
    openLabel,
    closeLabel,
    trailing,
    className,
}: GlobalSearchFooterProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-between border-t border-border/60 px-4 py-2',
                className,
            )}
        >
            <span className="flex items-center gap-2">
                <kbd className={KBD_CLASS}>↑↓</kbd>
                <Text tag="span" size="xxs" type="secondary">
                    {navigateLabel}
                </Text>
                <kbd className={KBD_CLASS}>↵</kbd>
                <Text tag="span" size="xxs" type="secondary">
                    {openLabel}
                </Text>
                <kbd className={KBD_CLASS}>esc</kbd>
                <Text tag="span" size="xxs" type="secondary">
                    {closeLabel}
                </Text>
            </span>
            {trailing}
        </div>
    );
}
