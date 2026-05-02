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
import type { DrawerDirection, DrawerProps, OverlaySize, OverlayTone } from './overlays.types';

const WIDTH_CLASSES: Record<OverlaySize, string> = {
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

const DIRECTION_STYLES: Record<
	DrawerDirection,
	{ position: string; size: string; animation: string; rounded: string }
> = {
	right: {
		position: 'fixed top-0 right-0 bottom-0',
		size: 'h-full',
		animation:
			'animate-in slide-in-from-right duration-300 [&.closing]:animate-out [&.closing]:slide-out-to-right [&.closing]:duration-200',
		rounded: 'rounded-l-xl',
	},
	left: {
		position: 'fixed top-0 left-0 bottom-0',
		size: 'h-full',
		animation:
			'animate-in slide-in-from-left duration-300 [&.closing]:animate-out [&.closing]:slide-out-to-left [&.closing]:duration-200',
		rounded: 'rounded-r-xl',
	},
	top: {
		position: 'fixed top-0 left-0 right-0',
		size: 'w-full',
		animation:
			'animate-in slide-in-from-top duration-300 [&.closing]:animate-out [&.closing]:slide-out-to-top [&.closing]:duration-200',
		rounded: 'rounded-b-xl',
	},
	bottom: {
		position: 'fixed bottom-0 left-0 right-0',
		size: 'w-full',
		animation:
			'animate-in slide-in-from-bottom duration-300 [&.closing]:animate-out [&.closing]:slide-out-to-bottom [&.closing]:duration-200',
		rounded: 'rounded-t-xl',
	},
};

const TONE_ICONS: Record<OverlayTone, ReactNode> = {
	default: <HelpCircle className="text-muted-foreground h-5 w-5" />,
	error: <AlertCircle className="text-destructive h-5 w-5" />,
	warning: <AlertTriangle className="text-warning h-5 w-5" />,
	info: <Info className="text-info h-5 w-5" />,
	success: <CheckCircle className="text-success h-5 w-5" />,
};

function DrawerImpl({
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
	direction = 'right',
	width = 'lg',
	showFooter = true,
	trigger,
}: DrawerProps) {
	const drawerTitleId = useId();
	const drawerDescriptionId = useId();
	const ariaLabelledBy = title ? drawerTitleId : undefined;
	const ariaDescribedBy = description ? drawerDescriptionId : undefined;

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

	const directionStyles = DIRECTION_STYLES[direction];
	const isHorizontal = direction === 'left' || direction === 'right';
	const hasContent = Boolean(children || alertMessage);
	const hasFooter = showFooter && (showCancel || showConfirm || footer);

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
					<div className="fixed inset-0 z-50">
						<div
							className={cn(
								'absolute inset-0 bg-foreground/50 backdrop-blur-[1px]',
								'transition-opacity duration-300',
								isClosing
									? 'opacity-0'
									: 'animate-in fade-in-0 duration-300',
							)}
							onClick={handleBackdropClick}
							aria-hidden="true"
						/>

						<dialog
							{...dialogProps}
							className={cn(
								'inset-auto m-0 p-0',
								directionStyles.position,
								directionStyles.size,
								'border shadow-xl',
								'bg-background text-foreground',
								directionStyles.rounded,
								isHorizontal && 'w-full',
								isHorizontal && WIDTH_CLASSES[width],
								!isHorizontal && 'max-h-[85vh]',
								directionStyles.animation,
								'outline-none focus-visible:outline-none',
								'flex flex-col',
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
									'absolute right-4 top-4 z-10 inline-flex size-7 items-center justify-center rounded-md',
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
								<div className="flex items-start gap-3 px-6 pb-4 pt-6">
									{!!showIcon && (
										<div className="shrink-0 pt-0.5">
											{TONE_ICONS[tone]}
										</div>
									)}
									<div className="min-w-0 flex-1 pr-6">
										{!!title && (
											<Text
												id={drawerTitleId}
												tag="div"
												size="lg"
												weight="semibold"
											>
												{title}
											</Text>
										)}
										{!!description && (
											<Text
												id={drawerDescriptionId}
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

export const Drawer = memo(DrawerImpl);
Drawer.displayName = 'Drawer';
