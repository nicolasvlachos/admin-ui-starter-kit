import * as React from 'react';

type AnyProps = Record<string, unknown>;

type SlotProps = {
	children: React.ReactElement;
} & AnyProps;

/**
 * Minimal Slot implementation (Radix-free) to preserve the `asChild` API.
 *
 * It merges props onto the single child element and composes refs.
 */
export const Slot = React.forwardRef<unknown, SlotProps>(
	({ children, ...props }, forwardedRef) => {
		if (!React.isValidElement(children)) {
			return null;
		}

		const childProps = children.props as AnyProps & {
			ref?: React.Ref<unknown>;
		};
		const childRef = childProps.ref;

		const ref = (node: unknown) => {
			if (typeof forwardedRef === 'function') forwardedRef(node);
			else if (forwardedRef && typeof forwardedRef === 'object') {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(forwardedRef as any).current = node;
			}

			if (typeof childRef === 'function') childRef(node);
			else if (childRef && typeof childRef === 'object') {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(childRef as any).current = node;
			}
		};

		// Base UI injects this control prop into render props; it must never reach DOM/Link elements.
		const { nativeButton: _nativeButton, ...slotProps } = props as AnyProps;
		void _nativeButton;

		// `cloneElement` is strict about `ref` typing when the child element type is unknown.
		// This cast keeps the implementation Radix-free while preserving the `asChild` API.
		return React.cloneElement(children, {
			...slotProps,
			...childProps,
			ref,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);
	},
);

Slot.displayName = 'Slot';
