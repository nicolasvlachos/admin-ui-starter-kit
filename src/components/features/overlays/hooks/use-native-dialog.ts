import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type RefObject,
} from 'react';

export interface UseNativeDialogOptions {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    closeOnEscape?: boolean;
    closeOnBackdropClick?: boolean;
    initialFocusRef?: RefObject<HTMLElement>;
}

export interface UseNativeDialogReturn {
    dialogRef: RefObject<HTMLDialogElement | null>;
    isOpen: boolean;
    isClosing: boolean;
    openDialog: () => void;
    closeDialog: () => void;
    toggleDialog: () => void;
    dialogProps: {
        ref: RefObject<HTMLDialogElement | null>;
        open: boolean;
        onKeyDown: (e: React.KeyboardEvent<HTMLDialogElement>) => void;
    };
    handleBackdropClick: () => void;
}

const ANIMATION_TIMEOUT_MS = 350;

let bodyScrollLockCount = 0;

/**
 * Lock body scroll using a CSS-class-based approach.
 *
 * Uses a `data-overlay-scroll-locked` attribute on `<html>` combined with a
 * CSS rule (`html[data-overlay-scroll-locked] body { overflow: hidden }`)
 * instead of directly manipulating `body.style.overflow`.
 *
 * This avoids a conflict with @base-ui's own `SCROLL_LOCKER` singleton (used
 * by Select, Combobox, etc.) which independently saves and restores inline
 * body styles. When both systems saved/restored the same inline property,
 * unlocking in the wrong order left `overflow: hidden` permanently on the body.
 */
function lockBodyScroll(): () => void {
    if (bodyScrollLockCount === 0) {
        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        document.body.style.setProperty(
            '--overlay-scrollbar-width',
            `${scrollbarWidth}px`,
        );
        document.documentElement.setAttribute(
            'data-overlay-scroll-locked',
            '',
        );
    }

    bodyScrollLockCount += 1;
    let released = false;

    return () => {
        if (released) {
            return;
        }

        released = true;
        bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);

        if (bodyScrollLockCount > 0) {
            return;
        }

        document.documentElement.removeAttribute('data-overlay-scroll-locked');
        document.body.style.removeProperty('--overlay-scrollbar-width');
    };
}

export function useNativeDialog({
    open: controlledOpen,
    onOpenChange,
    onClose,
    closeOnEscape = true,
    closeOnBackdropClick = true,
    initialFocusRef,
}: UseNativeDialogOptions = {}): UseNativeDialogReturn {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [internalOpen, setInternalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const unlockScrollRef = useRef<(() => void) | null>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationListenerRef = useRef<(() => void) | null>(null);
    const focusRafRef = useRef<number | null>(null);
    const finishCloseHandledRef = useRef(false);

    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    // Refs track the latest values so closeDialog can bail out from stale
    // closures (e.g. when useOverlayActions.handleConfirm awaits an async
    // operation while the action store already sets isOpen=false or while
    // a prior closeDialog call already set isClosing=true).
    const isOpenRef = useRef(isOpen);
    isOpenRef.current = isOpen;

    const isClosingRef = useRef(isClosing);
    isClosingRef.current = isClosing;

    const setOpen = useCallback(
        (nextOpen: boolean) => {
            if (!isControlled) {
                setInternalOpen(nextOpen);
            }
            onOpenChange?.(nextOpen);

            if (!nextOpen) {
                onClose?.();
            }
        },
        [isControlled, onOpenChange, onClose],
    );

    const cleanupAnimation = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        if (animationListenerRef.current) {
            animationListenerRef.current();
            animationListenerRef.current = null;
        }
    }, []);

    const finishClose = useCallback(() => {
        cleanupAnimation();

        // Mark that finishClose handled this close cycle so the safety-net
        // useEffect doesn't interfere with a redundant cleanup pass.
        finishCloseHandledRef.current = true;

        // CRITICAL: Release the scroll lock BEFORE calling setOpen, which
        // invokes external callbacks (onOpenChange, onClose) that may throw.
        const unlock = unlockScrollRef.current;
        unlockScrollRef.current = null;

        const prevFocus = previousActiveElementRef.current;
        previousActiveElementRef.current = null;

        try {
            unlock?.();
        } catch {
            // Scroll unlock must never propagate.
        }

        // Notify parent first — this triggers onOpenChange(false) which updates
        // the controlled open prop. Do NOT remove the .closing class or clear
        // isClosing before this: removing .closing reverts the dialog to its
        // entry animation CSS for one frame before React unmounts, causing a flash.
        try {
            setOpen(false);
        } catch {
            // If onOpenChange / onClose throws we still need to restore focus.
        }

        // Now safe to clear — React will unmount the portal on the next render,
        // so the .closing class removal is cosmetic (element is about to be removed).
        setIsClosing(false);

        const dialog = dialogRef.current;
        if (dialog) {
            dialog.classList.remove('closing');
        }

        try {
            prevFocus?.focus();
        } catch {
            // focus() on a disconnected node can throw in some browsers.
        }
    }, [cleanupAnimation, setOpen]);

    const openDialog = useCallback(() => {
        // Use refs (always fresh) instead of closure-captured values so that
        // stale references from trigger cloneElement or external callers
        // cannot bypass the guard.
        if (isOpenRef.current || isClosingRef.current) return;

        previousActiveElementRef.current =
            document.activeElement as HTMLElement;
        unlockScrollRef.current = lockBodyScroll();

        setOpen(true);

        focusRafRef.current = requestAnimationFrame(() => {
            focusRafRef.current = null;
            if (initialFocusRef?.current) {
                initialFocusRef.current.focus();
            } else {
                dialogRef.current?.focus();
            }
        });
    }, [setOpen, initialFocusRef]);

    const closeDialog = useCallback(() => {
        const dialog = dialogRef.current;
        // Use isOpenRef and isClosingRef (always fresh) instead of closure-
        // captured values so that stale closures from useOverlayActions
        // (which await async confirm while the action store or a prior
        // closeDialog call already changed state) correctly bail out instead
        // of starting a duplicate close animation.
        if (!dialog || !isOpenRef.current || isClosingRef.current) return;

        setIsClosing(true);
        dialog.classList.add('closing');

        // Force reflow so the browser picks up the new class before we read computed style
        void dialog.offsetHeight;

        const hasAnimation =
            getComputedStyle(dialog).animationName !== 'none';

        if (hasAnimation) {
            const handleAnimationEnd = () => {
                finishClose();
            };

            dialog.addEventListener('animationend', handleAnimationEnd, {
                once: true,
            });

            // Store cleanup function for unmount safety
            animationListenerRef.current = () => {
                dialog.removeEventListener(
                    'animationend',
                    handleAnimationEnd,
                );
            };

            // Timeout fallback in case animationend never fires
            closeTimeoutRef.current = setTimeout(() => {
                finishClose();
            }, ANIMATION_TIMEOUT_MS);
        } else {
            finishClose();
        }
    }, [finishClose]);

    const toggleDialog = useCallback(() => {
        if (isOpen) {
            closeDialog();
        } else {
            openDialog();
        }
    }, [isOpen, openDialog, closeDialog]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDialogElement>) => {
            if (e.key === 'Escape' && closeOnEscape) {
                e.preventDefault();
                e.stopPropagation();
                closeDialog();
            }
        },
        [closeOnEscape, closeDialog],
    );

    const handleBackdropClick = useCallback(() => {
        if (closeOnBackdropClick) {
            closeDialog();
        }
    }, [closeOnBackdropClick, closeDialog]);

    // Sync controlled open state → lock scroll + focus
    useEffect(() => {
        if (isOpen && !isClosing) {
            if (!previousActiveElementRef.current) {
                previousActiveElementRef.current =
                    document.activeElement as HTMLElement;
            }

            if (!unlockScrollRef.current) {
                unlockScrollRef.current = lockBodyScroll();
            }

            // Cancel any pending focus rAF (e.g. from openDialog) before
            // scheduling a new one, preventing duplicate focus calls.
            if (focusRafRef.current !== null) {
                cancelAnimationFrame(focusRafRef.current);
            }
            focusRafRef.current = requestAnimationFrame(() => {
                focusRafRef.current = null;
                if (initialFocusRef?.current) {
                    initialFocusRef.current.focus();
                } else {
                    dialogRef.current?.focus();
                }
            });
        } else if (!isOpen) {
            // If finishClose already handled this close cycle, skip the
            // safety-net to avoid a redundant cleanup pass that would cause
            // a flash (clearing isClosing in a separate render).
            if (finishCloseHandledRef.current) {
                finishCloseHandledRef.current = false;

                return;
            }

            // Safety net for the controlled-close path where closeDialog()
            // is never called directly (e.g. action store sets isOpen=false).
            if (unlockScrollRef.current) {
                unlockScrollRef.current();
                unlockScrollRef.current = null;
            }

            if (isClosing) {
                cleanupAnimation();
                setIsClosing(false);

                const dialog = dialogRef.current;
                if (dialog) {
                    dialog.classList.remove('closing');
                }
            }

            if (previousActiveElementRef.current) {
                try {
                    previousActiveElementRef.current.focus();
                } catch {
                    // focus() on a disconnected node — ignore
                }
                previousActiveElementRef.current = null;
            }
        }

        return () => {
            if (focusRafRef.current !== null) {
                cancelAnimationFrame(focusRafRef.current);
                focusRafRef.current = null;
            }
        };
    }, [isOpen, isClosing, initialFocusRef, cleanupAnimation]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupAnimation();

            if (focusRafRef.current !== null) {
                cancelAnimationFrame(focusRafRef.current);
                focusRafRef.current = null;
            }

            if (unlockScrollRef.current) {
                unlockScrollRef.current();
                unlockScrollRef.current = null;
            }
        };
    }, [cleanupAnimation]);

    return {
        dialogRef,
        isOpen,
        isClosing,
        openDialog,
        closeDialog,
        toggleDialog,
        dialogProps: {
            ref: dialogRef,
            open: isOpen,
            onKeyDown: handleKeyDown,
        },
        handleBackdropClick,
    };
}
