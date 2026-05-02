/**
 * BaseButton — foundational button. Wraps shadcn `Button` with a richer
 * variant × style × size matrix (variants: dark / primary / secondary / error /
 * warning / success / light / action; styles: solid / outline / ghost), plus
 * optional left/right `icon` and `fullWidth`.
 */
import type { VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';
import {
    Button as PrimitiveButton,
    type buttonVariants
} from '@/components/ui/button';
import {
    useButtonConfig,
    type ButtonSize as ConfiguredButtonSize,
    type ButtonStyle as ConfiguredButtonStyle,
} from '@/lib/ui-provider';
import { cn } from '@/lib/utils';

export type ButtonVariant =
    | 'dark'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'success'
    | 'light'
    | 'action';
export type ButtonStyle = ConfiguredButtonStyle;
export type ButtonSize = ConfiguredButtonSize;
export type IconPosition = 'left' | 'right';

export interface BaseButtonProps
    extends Omit<
        React.ComponentPropsWithoutRef<typeof PrimitiveButton>,
        'children' | 'variant' | 'size'
    >,
        Omit<VariantProps<typeof buttonVariants>, 'variant' | 'size'> {
    variant?: ButtonVariant;
    buttonStyle?: ButtonStyle;
    size?: ButtonSize;
    fullWidth?: boolean;
    icon?: React.ElementType | LucideIcon;
    iconPosition?: IconPosition;
    children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, Record<ButtonStyle, string>> = {
    dark: {
        solid: 'bg-foreground text-background hover:bg-foreground/90',
        outline: 'border border-foreground/80 text-foreground hover:bg-foreground/8',
        ghost: 'text-foreground hover:bg-foreground/8'
    },
    primary: {
        solid: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-primary/70 text-primary hover:bg-primary/10',
        ghost: 'text-primary hover:bg-primary/10'
    },
    secondary: {
        solid: 'bg-foreground/8 text-foreground hover:bg-foreground/12',
        outline: 'border border-foreground/15 text-foreground hover:bg-foreground/8',
        ghost: 'text-foreground hover:bg-foreground/8'
    },
    light: {
        solid: 'bg-muted text-muted-foreground hover:bg-muted/80',
        outline: 'border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        ghost: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    },
    error: {
        solid: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-destructive/60 text-destructive hover:bg-destructive/10',
        ghost: 'text-destructive hover:bg-destructive/10'
    },
    warning: {
        solid: 'bg-warning text-warning-foreground hover:bg-warning/90',
        outline: 'border border-warning/60 text-warning hover:bg-warning/15',
        ghost: 'text-warning hover:bg-warning/15'
    },
    success: {
        solid: 'bg-success text-success-foreground hover:bg-success/90',
        outline: 'border border-success/60 text-success hover:bg-success/10',
        ghost: 'text-success hover:bg-success/10'
    },
    action: {
        solid: 'bg-info text-info-foreground hover:bg-info/90',
        outline: 'border border-info/60 text-info hover:bg-info/10',
        ghost: 'text-info hover:bg-info/10'
    }
};

const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
    (
        {
            variant = 'primary',
            buttonStyle,
            size: sizeProp,
            fullWidth = false,
            icon: Icon,
            iconPosition = 'left',
            children,
            className,
            disabled,
            ...props
        },
        ref
    ) => {
        const { defaultButtonStyle, defaultSize } = useButtonConfig();
        const resolvedButtonStyle: ButtonStyle =
            buttonStyle ?? defaultButtonStyle ?? 'solid';
        const size: ButtonSize = sizeProp ?? defaultSize ?? 'sm';
        const resolvedVariantStyles =
            variantStyles[variant] ?? variantStyles.secondary;
        const resolvedStyleClass =
            resolvedVariantStyles[resolvedButtonStyle] ??
            resolvedVariantStyles.solid ??
            variantStyles.secondary.solid;

        const iconSize =
            size === 'xs' || size === 'icon-xs'
                ? 12
                : size === 'sm' || size === 'icon-sm'
                    ? 14
                    : size === 'lg' || size === 'icon-lg'
                        ? 20
                        : 16;
        const iconSpacing =
            size === 'xs'
                ? 'gap-1'
                : size === 'sm'
                    ? 'gap-1.5'
                    : size === 'lg'
                        ? 'gap-2.5'
                        : 'gap-2';

        const primitiveVariant =
            resolvedButtonStyle === 'outline'
                ? 'outline'
                : resolvedButtonStyle === 'ghost'
                    ? 'ghost'
                    : 'default';

        return (
            <PrimitiveButton
                ref={ref}
                variant={primitiveVariant}
                size={size}
                className={cn(
                    resolvedStyleClass,
                    'inline-flex items-center justify-center',
                    Icon && iconSpacing,
                    fullWidth && 'w-full',
                    className
                )}
                disabled={disabled}
                {...props}
            >
                {!!Icon && iconPosition === 'left' && (
                    <Icon
                        className="opacity-80"
                        size={iconSize}
                        aria-hidden="true"
                        data-icon="inline-start"
                    />
                )}
                {children}
                {!!Icon && iconPosition === 'right' && (
                    <Icon
                        className="opacity-80"
                        size={iconSize}
                        aria-hidden="true"
                        data-icon="inline-end"
                    />
                )}
            </PrimitiveButton>
        );
    }
);

BaseButton.displayName = 'BaseButton';

export { BaseButton };
