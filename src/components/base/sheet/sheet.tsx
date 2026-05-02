/**
 * base/sheet — thin pass-through wrapper around the shadcn `Sheet` primitive.
 *
 * Why it exists: rule 1/2 forbid importing `@/components/ui/*` outside the
 * matching base wrapper. Layout shells (and any feature that wants a slide-in
 * panel) compose this re-export so the next shadcn upgrade can't silently
 * change the API at every call site, and so the library has one place to
 * apply design-system defaults if/when they're needed.
 *
 * Compound parts (`SheetTrigger`, `SheetContent`, …) are re-exported
 * untouched — the shadcn compound-component pattern keeps working.
 */
export {
	Sheet,
	SheetTrigger,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
} from '@/components/ui/sheet';
