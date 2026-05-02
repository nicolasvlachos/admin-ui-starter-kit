import type { ReactNode, RefObject } from 'react';

import type { OverlayStrings } from './overlays.strings';

export type OverlayTone = 'default' | 'error' | 'warning' | 'info' | 'success';

export type ButtonVariant =
    | 'dark'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'success'
    | 'light';
export type ButtonStyle = 'outline' | 'solid';

export type OverlaySize =
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | 'full';

export type DrawerDirection = 'left' | 'right' | 'top' | 'bottom';

export interface OverlayBaseProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    children?: ReactNode;
    title?: string;
    description?: string;
    className?: string;
    contentClassName?: string;
    initialFocusRef?: RefObject<HTMLElement>;
    closeOnEscape?: boolean;
    closeOnBackdropClick?: boolean;
    strings?: Partial<OverlayStrings>;
}

export interface OverlayActionProps {
    showCancel?: boolean;
    showConfirm?: boolean;
    onCancel?: () => void;
    onConfirm?: () => void;
    onAsyncConfirm?: () => Promise<void>;
    closeOnAsyncComplete?: boolean;
    confirmVariant?: ButtonVariant;
    confirmStyle?: ButtonStyle;
    isLoading?: boolean;
    formId?: string;
    footer?: ReactNode;
}

export interface OverlayEmphasisProps {
    emphasis?: boolean;
    tone?: OverlayTone;
    showIcon?: boolean;
    alertMessage?: string;
}

export interface DialogProps
    extends OverlayBaseProps, OverlayActionProps, OverlayEmphasisProps {
    size?: OverlaySize;
    trigger?: ReactNode;
}

export interface DrawerProps
    extends OverlayBaseProps, OverlayActionProps, OverlayEmphasisProps {
    direction?: DrawerDirection;
    width?: OverlaySize;
    showFooter?: boolean;
    trigger?: ReactNode;
}

export interface AlertDialogProps extends OverlayBaseProps, OverlayActionProps {
    tone?: OverlayTone;
    showIcon?: boolean;
    trigger?: ReactNode;
    destructive?: boolean;
}
