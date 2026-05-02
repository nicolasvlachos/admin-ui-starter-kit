/**
 * strings — typed defaults + override helper for component-level i18n.
 *
 * Pattern (component-side):
 *   export interface FooStrings { title: string; cta: string; }
 *   export const defaultFooStrings: FooStrings = { title: 'Foo', cta: 'Go' };
 *
 *   export function Foo({ strings: stringsProp }: { strings?: Partial<FooStrings> }) {
 *     const strings = useStrings(defaultFooStrings, stringsProp);
 *     return <button>{strings.cta}</button>;
 *   }
 *
 * The override merges shallowly with defaults — any key the consumer omits
 * falls back to the default. Nested objects merge one level deep so namespaced
 * strings (`{ status: { active: 'Active' } }`) can be overridden one key at a
 * time. Arrays and primitives are replaced wholesale.
 *
 * `useStrings` is memoised on the override identity; it is safe to pass an
 * inline literal — the cost of re-running merge is trivial — but a stable
 * reference avoids unnecessary downstream re-renders when the resolved object
 * is passed through context.
 */
import { useMemo } from 'react';

export type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends ReadonlyArray<unknown>
		? T[K]
		: T[K] extends object
			? DeepPartial<T[K]>
			: T[K];
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (value === null || typeof value !== 'object') return false;
	if (Array.isArray(value)) return false;
	const proto = Object.getPrototypeOf(value) as object | null;
	return proto === Object.prototype || proto === null;
}

export function mergeStrings<T extends object>(
	defaults: T,
	override?: DeepPartial<T>,
): T {
	if (!override) return defaults;
	const out: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
	for (const key of Object.keys(override) as Array<keyof T>) {
		const incoming = (override as Record<string, unknown>)[key as string];
		if (incoming === undefined) continue;
		const base = (defaults as Record<string, unknown>)[key as string];
		if (isPlainObject(base) && isPlainObject(incoming)) {
			out[key as string] = mergeStrings(
				base as Record<string, unknown>,
				incoming as DeepPartial<Record<string, unknown>>,
			);
		} else {
			out[key as string] = incoming;
		}
	}
	return out as T;
}

export function useStrings<T extends object>(
	defaults: T,
	override?: DeepPartial<T>,
): T {
	return useMemo(() => mergeStrings(defaults, override), [defaults, override]);
}

/**
 * Helper to derive a `strings` prop type from a defaults shape.
 *   type FooProps = { strings?: StringsProp<typeof defaultFooStrings> };
 */
export type StringsProp<T extends object> = DeepPartial<T>;
