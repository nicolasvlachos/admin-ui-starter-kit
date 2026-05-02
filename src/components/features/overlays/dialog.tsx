import {
	AlertCircle,
	AlertTriangle,
	CheckCircle,
	HelpCircle,
	Info,
	X,
} from 'lucide-react';
import React, { cloneElement, isValidElement, memo, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { useNativeDialog, useOverlayActions } from './hooks';
import type { DialogProps, OverlaySize, OverlayTone } from './overlays.types';

const SIZE_CLASSES: Record<OverlaySize, string> = {
	xs: 'max-w-xs',
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	'2xl': 'max-w-2xl',
	'3xl': 'max-w-3xl',
	'4xl': 'max-w-4xl',
	'5xl': 'max-w-5xl',
	full: 'max-w-[calc(100vw-2rem)]',
};

const TONE_STYLES: Record<OverlayTone, { icon: ReactNode; classes: string }> = {
	default: {
		icon: <HelpCircle className="text-muted-foreground h-5 w-5" />,
		classes: '',
	},
	error: {
		icon: <AlertCircle className="text-destructive h-5 w-5" />,
		classes: 'border-destructive/50',
	},
	warning: {
		icon: <AlertTriangle className="text-warning h-5 w-5" />,
		classes: 'border-warning/50',
	},
	info: {
		icon: <Info className="text-info h-5 w-5" />,
		classes: 'border-info/50',
	},
	success: {
		icon: <CheckCircle className="text-success h-5 w-5" />,
		classes: 'border-success/50',
	},
};

function DialogImpl({
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
	closeOnBackdropClick = true,
	strings: customStrings,
	showCancel = true,
	showConfirm = true,
	onCancel,
	onConfirm,
	onAsyncConfirm,
	closeOnAsyncComplete = true,
	confirmVariant = 'primary',
	confirmStyle = 'solid',
	isLoading = false,
	formId,
	footer,
	emphasis = false,
	tone = 'default',
	showIcon = false,
	alertMessage,
	size = 'lg',
	trigger,
}: DialogProps) {
	const dialogTitleId = useId();
	const dialogDescriptionId = useId();
	const ariaLabelledBy = title ? dialogTitleId : undefined;
	const ariaDescribedBy = description ? dialogDescriptionId : undefined;

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

	const {
		strings,
		finalConfirmVariant,
		confirmButtonOnClick,
		effectiveLoading,
		handleCancel,
	} = useOverlayActions({
		closeDialog,
		onConfirm,
		onAsyncConfirm,
		closeOnAsyncComplete,
		confirmVariant,
		isLoading,
		formId,
		onCancel,
		customStrings,
		emphasis,
		tone,
	});

	const toneStyles = TONE_STYLES[tone];
	const hasContent = Boolean(children || alertMessage);
	const hasFooter = showCancel || showConfirm || footer;

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
								'relative z-10 m-0 p-0',
								'rounded-lg border shadow-lg',
								'bg-background text-foreground',
								'max-h-[90vh] w-full',
								'flex flex-col',
								SIZE_CLASSES[size],
								'animate-in fade-in-0 zoom-in-95 duration-200',
								'[&.closing]:animate-out [&.closing]:fade-out-0 [&.closing]:zoom-out-95 [&.closing]:duration-150',
								'outline-none focus:outline-none focus-visible:outline-none',
								emphasis && toneStyles.classes,
								className,
							)}
							aria-modal="true"
							role="dialog"
							aria-labelledby={ariaLabelledBy}
							aria-describedby={ariaDescribedBy}
						>
							<button
								type="button"
								onClick={closeDialog}
								className={cn(
									'absolute right-3 top-3 z-10 inline-flex size-7 items-center justify-center rounded-md',
									'text-muted-foreground transition-colors',
									'hover:bg-muted hover:text-foreground',
									'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
									'disabled:pointer-events-none',
								)}
								aria-label={strings.close}
							>
								<X className="h-4 w-4" />
							</button>

							{!!(title || description) && (
								<div
									className={cn(
										'flex gap-3 px-6 pb-4 pt-6',
										showIcon && 'items-start',
									)}
								>
									{!!showIcon && (
										<div className="shrink-0 pt-0.5">
											{toneStyles.icon}
										</div>
									)}
									<div className="min-w-0 flex-1">
										{!!title && (
											<Text
												id={dialogTitleId}
												tag="div"
												size="lg"
												weight="semibold"
												className="pr-6"
											>
												{title}
											</Text>
										)}
										{!!description && (
											<Text
												id={dialogDescriptionId}
												tag="p"
												type="secondary"
												className="mt-1"
											>
												{description}
											</Text>
										)}
									</div>
								</div>
							)}

							{!!hasContent && (
								<div
									className={cn(
										'flex-1 overflow-auto px-6',
										title || description ? 'pb-6' : 'py-6',
										contentClassName,
									)}
								>
									{!!alertMessage && (
										<div
											className={cn(
												'mb-4 rounded-md border p-3',
												tone === 'error' &&
													'border-destructive/30 bg-destructive/5',
												tone === 'warning' &&
													'border-warning/40 bg-warning/10',
												tone === 'info' &&
													'border-info/40 bg-info/10',
												tone === 'success' &&
													'border-success/40 bg-success/10',
												tone === 'default' &&
													'border-border bg-muted/40',
											)}
										>
											<Text
												tag="p"
											>
												{alertMessage}
											</Text>
										</div>
									)}
									{children}
								</div>
							)}

							{!!hasFooter && (
								<div className="border-t px-6 py-4">
									{footer ?? (
										<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
											{!!showCancel && (
												<Button
													type="button"
													variant="secondary"
													buttonStyle="outline"
													onClick={handleCancel}
												>
													{strings.cancel}
												</Button>
											)}
											{!!showConfirm && (
												<Button
													type="button"
													variant={finalConfirmVariant}
													buttonStyle={confirmStyle}
													onClick={confirmButtonOnClick}
													loading={effectiveLoading}
													loadingLabels={{
														loading: strings.loading,
													}}
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

export const Dialog = memo(DialogImpl);
Dialog.displayName = 'Dialog';
