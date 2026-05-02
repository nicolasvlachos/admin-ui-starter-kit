import { AlertCircle, AlertTriangle, CheckCircle, HelpCircle, Info } from 'lucide-react';
import React, {
	cloneElement,
	isValidElement,
	memo,
	useId,
	useMemo,
	type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { useNativeDialog, useOverlayActions } from './hooks';
import { defaultAlertDialogStrings } from './overlays.strings';
import type { AlertDialogProps, OverlayTone } from './overlays.types';

const TONE_STYLES: Record<OverlayTone, { icon: ReactNode; iconColor: string }> = {
	default: {
		icon: <HelpCircle className="h-6 w-6" />,
		iconColor: 'text-muted-foreground',
	},
	error: { icon: <AlertCircle className="h-6 w-6" />, iconColor: 'text-destructive' },
	warning: {
		icon: <AlertTriangle className="h-6 w-6" />,
		iconColor: 'text-warning',
	},
	info: {
		icon: <Info className="h-6 w-6" />,
		iconColor: 'text-info',
	},
	success: {
		icon: <CheckCircle className="h-6 w-6" />,
		iconColor: 'text-success',
	},
};

function AlertDialogImpl({
	open,
	onOpenChange,
	onClose,
	children,
	title,
	description,
	className,
	contentClassName,
	initialFocusRef,
	closeOnEscape = true,
	closeOnBackdropClick = false,
	strings: customStrings,
	showCancel = true,
	showConfirm = true,
	onCancel,
	onConfirm,
	onAsyncConfirm,
	closeOnAsyncComplete = true,
	confirmVariant,
	confirmStyle = 'solid',
	isLoading = false,
	formId,
	footer,
	tone = 'default',
	showIcon = true,
	trigger,
	destructive = false,
}: AlertDialogProps) {
	const alertTitleId = useId();
	const alertDescriptionId = useId();
	const ariaLabelledBy = title ? alertTitleId : undefined;
	const ariaDescribedBy = description ? alertDescriptionId : undefined;

	const {
		isOpen,
		isClosing,
		openDialog,
		closeDialog,
		dialogProps,
		handleBackdropClick,
	} = useNativeDialog({
		open,
		onOpenChange,
		onClose,
		closeOnEscape,
		closeOnBackdropClick,
		initialFocusRef,
	});

	const mergedStrings = useStrings(defaultAlertDialogStrings, customStrings);

	const resolvedConfirmVariant = useMemo(() => {
		if (destructive) return 'error' as const;
		if (confirmVariant) return confirmVariant;
		const toneMap: Record<OverlayTone, string> = {
			default: 'primary',
			error: 'error',
			warning: 'warning',
			info: 'primary',
			success: 'success',
		};
		return toneMap[tone] as 'primary' | 'error' | 'warning' | 'success';
	}, [destructive, confirmVariant, tone]);

	const { strings, confirmButtonOnClick, effectiveLoading, handleCancel } =
		useOverlayActions({
			closeDialog,
			onConfirm,
			onAsyncConfirm,
			closeOnAsyncComplete,
			confirmVariant: resolvedConfirmVariant,
			isLoading,
			formId,
			onCancel,
			customStrings: mergedStrings,
		});

	const toneStyles = TONE_STYLES[tone];

	const triggerElement =
		trigger && isValidElement<Record<string, unknown>>(trigger) ? (
			cloneElement(trigger, {
				onClick: (e: React.MouseEvent) => {
					const original = trigger.props.onClick as
						| ((e: React.MouseEvent) => void)
						| undefined;
					original?.(e);
					openDialog();
				},
			})
		) : trigger ? (
			<span
				role="button"
				tabIndex={0}
				onClick={openDialog}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						openDialog();
					}
				}}
				className="cursor-pointer"
			>
				{trigger}
			</span>
		) : null;

	if (!isOpen && !isClosing && !trigger) return null;

	return (
		<>
			{triggerElement}

			{!!(isOpen || isClosing) &&
				createPortal(
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<div
							className={cn(
								'absolute inset-0 bg-foreground/50 backdrop-blur-[1px]',
								'transition-opacity duration-200',
								isClosing
									? 'opacity-0'
									: 'animate-in fade-in-0 duration-200',
							)}
							onClick={handleBackdropClick}
							aria-hidden="true"
						/>

						<dialog
							{...dialogProps}
							className={cn(
								'relative z-10 m-0 w-full max-w-md p-0',
								'max-h-[90vh] flex flex-col',
								'rounded-lg border shadow-lg',
								'bg-background text-foreground',
								'animate-in fade-in-0 zoom-in-95 duration-200',
								'[&.closing]:animate-out [&.closing]:fade-out-0 [&.closing]:zoom-out-95 [&.closing]:duration-150',
								'outline-none focus:outline-none focus-visible:outline-none',
								className,
							)}
							role="alertdialog"
							aria-modal="true"
							aria-labelledby={ariaLabelledBy}
							aria-describedby={ariaDescribedBy}
						>
							<div className="flex-1 overflow-auto p-6">
								{!!showIcon && (
									<div
										className={cn(
											'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full',
											tone === 'error' && 'bg-destructive/10',
											tone === 'warning' && 'bg-warning/15',
											tone === 'info' && 'bg-info/15',
											tone === 'success' && 'bg-success/15',
											tone === 'default' && 'bg-muted',
										)}
									>
										<span className={toneStyles.iconColor}>
											{toneStyles.icon}
										</span>
									</div>
								)}

								{!!title && (
									<Text
										id={alertTitleId}
										tag="div"
										size="lg"
										weight="semibold"
										align="center"
									>
										{title}
									</Text>
								)}

								{!!description && (
									<Text
										id={alertDescriptionId}
										tag="p"
										type="secondary"
										align="center"
										className="mt-2"
									>
										{description}
									</Text>
								)}

								{!!children && (
									<div className={cn('mt-4', contentClassName)}>
										{children}
									</div>
								)}
							</div>

							{!!(showCancel || showConfirm || footer) && (
								<div className="border-t px-6 py-4">
									{footer ?? (
										<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
											{!!showCancel && (
												<Button
													type="button"
													variant="secondary"
													buttonStyle="outline"
													onClick={handleCancel}
													className="w-full sm:w-auto"
												>
													{strings.cancel}
												</Button>
											)}
											{!!showConfirm && (
												<Button
													type="button"
													variant={resolvedConfirmVariant}
													buttonStyle={confirmStyle}
													onClick={confirmButtonOnClick}
													loading={effectiveLoading}
													loadingLabels={{
														loading: strings.loading,
													}}
													className="w-full sm:w-auto"
												>
													{strings.confirm}
												</Button>
											)}
										</div>
									)}
								</div>
							)}
						</dialog>
					</div>,
					document.body,
				)}
		</>
	);
}

export const AlertDialog = memo(AlertDialogImpl);
AlertDialog.displayName = 'AlertDialog';
