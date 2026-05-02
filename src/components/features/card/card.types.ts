import type { OverlaySize } from '@/components/features/overlays';
import type { ComponentType, ReactNode } from 'react';
import type { SmartCardAction } from '@/components/base/cards';
import type { StringsProp } from '@/lib/strings';

import type { SharedResourceCardStrings } from './card.strings';

export type SharedResourceSelectorComponentProps<TSuggestion> = {
    onSelect: (resource: TSuggestion) => void;
    selected: TSuggestion | null;
    setSelected: (resource: TSuggestion | null) => void;
    inModal: boolean;
    lockOnSelect?: boolean;
    context?: 'dialog' | 'drawer';
};

export type SharedResourceCardContext<TResource, TSuggestion> = {
    resource: TResource | null;
    hasResource: boolean;
    isSelectorOpen: boolean;
    isConfirming: boolean;
    selectedSuggestion: TSuggestion | null;
    setSelectedSuggestion: (resource: TSuggestion | null) => void;
    openSelector: () => void;
    closeSelector: () => void;
    confirmSelection: () => Promise<void>;
    canConfirmSelection: boolean;
};

export type SharedResourceCardContentProps<TResource, TSuggestion> = {
    context: SharedResourceCardContext<TResource, TSuggestion>;
};

export type SharedResourceCardSectionProps<TResource, TSuggestion> = {
    context: SharedResourceCardContext<TResource, TSuggestion>;
};

export type SharedResourceCardSection<TResource, TSuggestion> = {
    id: string;
    when?: (context: SharedResourceCardContext<TResource, TSuggestion>) => boolean;
    className?: string;
    Component: ComponentType<SharedResourceCardSectionProps<TResource, TSuggestion>>;
};

export type SharedResourceCardDialogContentProps<TResource, TSuggestion> = {
    SelectorComponent: ComponentType<
        SharedResourceSelectorComponentProps<TSuggestion>
    >;
    selectorProps?: Record<string, unknown>;
    context: SharedResourceCardContext<TResource, TSuggestion>;
};

export type SharedResourceCardDialogSummaryProps<TResource, TSuggestion> = {
    context: SharedResourceCardContext<TResource, TSuggestion>;
};

export type SharedResourceCardSelectorConfig<TResource, TSuggestion> = {
    title: string;
    description?: string;
    confirmText: string;
    cancelText: string;
    actionLabel?: string;
    mapInitialSelected: (resource: TResource | null) => TSuggestion | null;
    onConfirmSelection: (selection: TSuggestion) => void | Promise<void>;
    SelectorComponent: ComponentType<
        SharedResourceSelectorComponentProps<TSuggestion>
    >;
    selectorProps?: Record<string, unknown>;
    DialogContentComponent?: ComponentType<
        SharedResourceCardDialogContentProps<TResource, TSuggestion> &
            Record<string, unknown>
    >;
    dialogContentProps?: Record<string, unknown>;
    DialogSummaryComponent?: ComponentType<
        SharedResourceCardDialogSummaryProps<TResource, TSuggestion>
    >;
    isConfirmDisabled?: (selection: TSuggestion | null) => boolean;
    onDialogOpen?: (selection: TSuggestion | null) => void;
    onDialogClose?: () => void;
    dialogSize?: OverlaySize;
};

export type SharedResourceCardProps<TResource, TSuggestion> = {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    className?: string;
    contentClassName?: string;
    alert?: ReactNode | string;
    alertVariant?: 'default' | 'destructive' | 'warning';
    actions?: SmartCardAction[];
    headerAction?: ReactNode;
    footerText?: ReactNode;
    resource: TResource | null;
    hasResource: boolean;
    selector?: SharedResourceCardSelectorConfig<TResource, TSuggestion>;
    sections?: SharedResourceCardSection<TResource, TSuggestion>[];
    sectionsClassName?: string;
    viewLink?: {
        href: string;
        label: ReactNode;
        className?: string;
    };
    ResourceContentComponent?: ComponentType<
        SharedResourceCardContentProps<TResource, TSuggestion>
    >;
    EmptyContentComponent?: ComponentType<
        SharedResourceCardContentProps<TResource, TSuggestion>
    >;
    renderResourceContent?: (
        context: SharedResourceCardContext<TResource, TSuggestion>,
    ) => ReactNode;
    renderEmptyContent?: (
        context: SharedResourceCardContext<TResource, TSuggestion>,
    ) => ReactNode;
    strings?: StringsProp<SharedResourceCardStrings>;
};
