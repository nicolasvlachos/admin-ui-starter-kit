/**
 * Validator helpers for `FilterConfig.validation.custom`.
 *
 * Our `ValidationConfig` accepts `custom: (value) => boolean | string`
 * already (`true` = valid, `false` = generic invalid, `string` = custom
 * error message). These helpers adapt common third-party validators
 * — Zod, Valibot, plain async-safe predicates — to that shape so
 * consumers don't reinvent the bridge.
 *
 * The library does NOT depend on Zod or any specific validation lib.
 * The helpers are written against minimal duck-typed shapes that any
 * library implementing `safeParse` can satisfy.
 */
import type { ValidationConfig } from './filters.types';

/**
 * Minimal Zod-compatible interface — a schema with a `safeParse` method
 * that returns `{ success: boolean, error?: { message?: string,
 * issues?: { message: string }[] } }`. Both Zod 3 and Zod 4 satisfy
 * this; Valibot's `safeParse` differs slightly but a thin wrapper
 * works.
 */
export interface SafeParseSchema<TInput = unknown> {
	safeParse(value: TInput): {
		success: boolean;
		error?: {
			message?: string;
			issues?: { message: string }[];
		};
	};
}

/**
 * Adapter: turn a Zod-like schema into a `ValidationConfig['custom']`.
 *
 *     import { z } from 'zod';
 *     import { zodValidator } from '@/components/features/filters';
 *
 *     const emailSchema = z.string().email();
 *     const config: FilterConfig = {
 *         …,
 *         validation: { custom: zodValidator(emailSchema) },
 *     };
 *
 * On parse failure the first issue's `message` is returned (so
 * Zod's `.refine(...).message('Custom')` flows through). On success
 * returns `true`. The empty-string case is bypassed — let
 * `validation.required` handle "must not be empty" so error messages
 * stay coherent.
 */
export function zodValidator<TInput = unknown>(
	schema: SafeParseSchema<TInput>,
): NonNullable<ValidationConfig['custom']> {
	return (value: unknown): boolean | string => {
		// Skip empty strings — `validation.required` is the right channel
		// for "missing value" messaging.
		if (value === undefined || value === null) return true;
		if (typeof value === 'string' && value.length === 0) return true;
		const result = schema.safeParse(value as TInput);
		if (result.success) return true;
		const message =
			result.error?.issues?.[0]?.message ??
			result.error?.message ??
			false;
		return message as string | false;
	};
}

/**
 * Adapter: pair a predicate with a static error message. Useful when
 * the consumer doesn't want to pull a validation library at all.
 *
 *     validation: {
 *         custom: predicateValidator(
 *             (v) => /^https?:\/\//.test(String(v)),
 *             'URL must start with http:// or https://',
 *         ),
 *     }
 */
export function predicateValidator(
	predicate: (value: unknown) => boolean,
	message: string,
): NonNullable<ValidationConfig['custom']> {
	return (value: unknown) => (predicate(value) ? true : message);
}
