import { Eye } from 'lucide-react';
import { type ReactNode, useMemo } from 'react';

import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { Dialog } from '@/components/features/overlays';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultSharedResourceCardStrings } from './card.strings';
import { type SharedResourceCardProps } from './card.types';
import { useSharedResourceCard } from './hooks';
import {
    DefaultDialogContent,
    DefaultDialogSummary,
    DefaultEmptyContent,
    DefaultResourceContent,
} from './partials';

export function SharedResourceCard<TResource, TSuggestion>({
    icon,
    title,
    description,
    className,
    contentClassName = 'space-y-3',
    alert,
    alertVariant,
    actions,
    headerAction,
    footerText,
    resource,
    hasResource,
    selector,
    sections,
    sectionsClassName,
    viewLink,
    ResourceContentComponent,
    EmptyContentComponent,
    renderResourceContent,
    renderEmptyContent,
    strings: stringsProp,
}: SharedResourceCardProps<TResource, TSuggestion>) {
    const strings = useStrings(defaultSharedResourceCardStrings, stringsProp);
    const selectorContext = useSharedResourceCard<TResource, TSuggestion>({
        resource,
        hasResource,
        mapInitialSelected:
            selector?.mapInitialSelected ?? (() => null as TSuggestion | null),
        onConfirmSelection:
            selector?.onConfirmSelection ?? (() => undefined),
        isConfirmDisabled: selector?.isConfirmDisabled,
        onDialogOpen: selector?.onDialogOpen,
        onDialogClose: selector?.onDialogClose,
    });

    const canUseSelector = selector !== undefined;
    const resolvedActions = useMemo(() => {
        const baseActions = actions ?? [];
        const selectorActionLabel = selector?.actionLabel?.trim();

        if (!canUseSelector || !selectorActionLabel) {
            return baseActions.length > 0 ? baseActions : undefined;
        }

        return [
            ...baseActions,
            {
                id: 'shared-resource-selector-change',
                label: selectorActionLabel,
                onClick: selectorContext.openSelector,
            },
        ];
    }, [actions, canUseSelector, selector?.actionLabel, selectorContext.openSelector]);

    const resourceContent: ReactNode = useMemo(() => {
        if (renderResourceContent) {
            return renderResourceContent(selectorContext);
        }

        if (ResourceContentComponent) {
            const ContentComponent = ResourceContentComponent;
            return <ContentComponent context={selectorContext} />;
        }

        if (Array.isArray(sections) && sections.length > 0) {
            const visibleSections = sections.filter((section) => {
                return section.when ? section.when(selectorContext) : true;
            });

            if (visibleSections.length > 0) {
                return (
                    <div className={sectionsClassName ?? 'space-y-3'}>
                        {visibleSections.map((section) => {
                            const SectionComponent = section.Component;

                            return (
                                <div key={section.id} className={section.className}>
                                    <SectionComponent context={selectorContext} />
                                </div>
                            );
                        })}
                    </div>
                );
            }
        }

        return <DefaultResourceContent context={selectorContext} strings={strings} />;
    }, [
        ResourceContentComponent,
        renderResourceContent,
        sections,
        sectionsClassName,
        selectorContext,
        strings,
    ]);

    const emptyContent: ReactNode = useMemo(() => {
        if (renderEmptyContent) {
            return renderEmptyContent(selectorContext);
        }

        if (EmptyContentComponent) {
            const ContentComponent = EmptyContentComponent;
            return <ContentComponent context={selectorContext} />;
        }

        if (!canUseSelector) {
            return <Text type="secondary">{strings.noResourceSelected}</Text>;
        }

        return <DefaultEmptyContent context={selectorContext} strings={strings} />;
    }, [
        EmptyContentComponent,
        canUseSelector,
        renderEmptyContent,
        selectorContext,
        strings,
    ]);

    const DialogContentComponent = selector?.DialogContentComponent;
    const DialogSummaryComponent = selector?.DialogSummaryComponent;
    const SelectorComponent = selector?.SelectorComponent;
    const selectorProps = selector?.selectorProps ?? {};
    const dialogContentProps = selector?.dialogContentProps ?? {};
    const cardBody = hasResource ? resourceContent : emptyContent;
    const shouldShowViewLink = Boolean(hasResource && viewLink);
    const shouldRenderDialog = Boolean(
        canUseSelector && selector && SelectorComponent,
    );
    const viewLinkNode =
        shouldShowViewLink && viewLink ? (
            <div className={viewLink.className ?? 'border-t pt-3'}>
                <Button
                    href={viewLink.href}
                    variant="primary"
                    fullWidth
                >
                    <Eye className="h-4 w-4" />
                    {viewLink.label}
                </Button>
            </div>
        ) : null;
    const dialogNode =
        shouldRenderDialog && selector && SelectorComponent ? (
            <Dialog
                open={selectorContext.isSelectorOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        selectorContext.closeSelector();
                    }
                }}
                title={selector.title}
                description={selector.description}
                size={selector.dialogSize ?? '2xl'}
                showCancel={false}
                showConfirm={false}
            >
                {DialogContentComponent ? (
                    <DialogContentComponent
                        SelectorComponent={SelectorComponent}
                        selectorProps={selectorProps}
                        context={selectorContext}
                        {...dialogContentProps}
                    />
                ) : (
                    <DefaultDialogContent
                        SelectorComponent={SelectorComponent}
                        selectorProps={selectorProps}
                        context={selectorContext}
                    />
                )}

                {DialogSummaryComponent ? (
                    <DialogSummaryComponent context={selectorContext} />
                ) : (
                    <DefaultDialogSummary context={selectorContext} strings={strings} />
                )}

                <div className="flex justify-end gap-2 border-t pt-4">
                    <Button
                        variant="secondary"
                        buttonStyle="outline"
                        onClick={selectorContext.closeSelector}
                        disabled={selectorContext.isConfirming}
                        type="button"
                    >
                        {selector.cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            void selectorContext.confirmSelection();
                        }}
                        disabled={
                            !selectorContext.canConfirmSelection ||
                            selectorContext.isConfirming
                        }
                        loading={selectorContext.isConfirming}
                        type="button"
                    >
                        {selector.confirmText}
                    </Button>
                </div>
            </Dialog>
        ) : null;

    return (
        <>
            <SmartCard
                icon={icon}
                title={title}
                description={description}
                className={cn('shared-resource-card--component', '!gap-3', className)}
                contentClassName={contentClassName}
                alert={alert}
                alertVariant={alertVariant}
                actions={resolvedActions}
                headerAction={headerAction}
                footerText={footerText}
            >
                {cardBody}
                {viewLinkNode}
            </SmartCard>
            {dialogNode}
        </>
    );
}

SharedResourceCard.displayName = 'SharedResourceCard';

export default SharedResourceCard;
