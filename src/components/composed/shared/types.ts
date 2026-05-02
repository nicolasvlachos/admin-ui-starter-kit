import type { ComposedBadgeVariant } from '@/components/base/badge/badge';

/**
 * Re-export the canonical badge variant type from the design system.
 * All final components should use this instead of defining their own.
 */
export type { ComposedBadgeVariant as BadgeVariant };

/**
 * Standard icon prop type — accepts any React component (Lucide icons, custom SVGs, etc.)
 */
export type IconComponent = React.ElementType;
