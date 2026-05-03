/**
 * Badge — composed badge with semantic variants (primary / secondary / success / info /
 * warning / error / destructive / main), three sizes (xs / sm / md), optional dot indicator
 * (with pulse + pending states), inline mode, and an `important` flag that swaps in a warning icon.
 */
import { TriangleAlert } from 'lucide-react';
import * as React from "react"

import { Badge as BaseBadge } from "@/components/ui/badge"
import { useBadgeConfig, type BadgeSize } from '@/lib/ui-provider';
import { cn } from '@/lib/utils';

export type ComposedBadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "error"
  | "destructive"
  | "main"
  | "warning"

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content'> {
  variant?: ComposedBadgeVariant
  size?: BadgeSize
  inline?: boolean;
  dot?: boolean;
  pulse?: boolean;
  pending?: boolean;
  important?: boolean;
}

type BadgeVariantStyle = { color: string; background: string; border: string; dot: string };

const sizeClassMap: Record<NonNullable<BadgeProps['size']>, string> = {
	xs: 'px-1.5 py-0.5 text-xxs',
	sm: 'px-2 py-1 text-xs',
	md: 'px-2.5 py-1.5 text-sm',
};

const variantClassMap: Record<ComposedBadgeVariant, BadgeVariantStyle> = {
  primary: {
    color: 'text-primary-foreground',
    background: 'bg-primary',
    border: 'border-primary-foreground/40',
    dot: 'bg-primary-foreground'
  },
  secondary: {
    color: 'text-muted-foreground',
    background: 'bg-foreground/8',
    border: 'border-foreground/15',
    dot: 'bg-muted-foreground'
  },
  success: {
    color: 'text-success',
    background: 'bg-success/15',
    border: 'border-success/50',
    dot: 'bg-success'
  },
  info: {
    color: 'text-info',
    background: 'bg-info/15',
    border: 'border-info/50',
    dot: 'bg-info'
  },
  warning: {
    color: 'text-warning-foreground',
    background: 'bg-warning/40',
    border: 'border-warning/60',
    dot: 'bg-warning'
  },
  error: {
    color: 'text-destructive',
    background: 'bg-destructive/12',
    border: 'border-destructive/50',
    dot: 'bg-destructive'
  },
  destructive: {
    color: 'text-destructive',
    background: 'bg-destructive/12',
    border: 'border-destructive/50',
    dot: 'bg-destructive'
  },
  main: {
    color: 'text-main-foreground',
    background: 'bg-main',
    border: 'border-main-foreground/40',
    dot: 'bg-main-foreground'
  },
}

/**
 * Composed Badge using base-ui primitives
 * - Semantic variants using CSS variables: success | info | warning | error.
 * - Primary/secondary with proper theming.
 * - Optional `dot` prop for dot indicator style (colored dot + text, no background).
 */
export function Badge({
  variant = "primary",
  className,
  size,
  inline = false,
  dot = false,
  pending = false,
  pulse = false,
  important = false,
  children,
  ...props
}: BadgeProps) {
  const { defaultSize } = useBadgeConfig();
  const resolvedSize: BadgeSize = size ?? defaultSize ?? 'xs';
  const defaultClassNames = cn(sizeClassMap[resolvedSize], "font-semibold gap-1.5")
  const inlineClassNames = inline
    ? 'inline-flex h-auto min-h-0 w-auto shrink-0 align-middle rounded-full px-1.5 py-0 text-xxs leading-4 font-medium'
    : null;

  const theme = variantClassMap[variant] ?? variantClassMap.primary;

  return (
    <BaseBadge
      variant="secondary"
      className={cn('badge--component', 
        theme.color,
        theme.background,
        defaultClassNames,
        inlineClassNames,
        className,
      )}
      {...props}
    >
      {!!dot && <Dot filled={!pending} pulse={pulse} variant={theme} />}
      {(!!important && !dot) && <TriangleAlert className={cn(theme.color, 'w-6 h-6')} />}
      <span className="inline-flex items-center gap-1 whitespace-nowrap [&>svg]:inline-block [&>svg]:shrink-0">
        {children}
      </span>
    </BaseBadge>
  )
}

function Dot({ filled = false, variant, pulse = false }: { filled?: boolean; variant: BadgeVariantStyle, pulse?: boolean }) {
  return (
    <span
      className={cn("size-2 rounded-full shrink-0 border-[2px]", variant.border,
        {
          'animate-pulse': pulse
        },
        [
          filled ? variant.dot : 'bg-transparent'
        ]
      )}
    />
  )
}

export default Badge

Badge.displayName = 'Badge';
