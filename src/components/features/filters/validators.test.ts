import { describe, expect, it } from 'vitest';

import { predicateValidator, zodValidator, type SafeParseSchema } from './validators';

// Minimal Zod-shaped fakes so we don't pull `zod` as a dep.
function makeStringSchema(predicate: (v: string) => boolean, message: string): SafeParseSchema<string> {
	return {
		safeParse(value: unknown) {
			if (typeof value !== 'string') {
				return {
					success: false,
					error: { issues: [{ message: 'Must be a string' }] },
				};
			}
			if (!predicate(value)) {
				return {
					success: false,
					error: { issues: [{ message }] },
				};
			}
			return { success: true };
		},
	};
}

describe('zodValidator', () => {
	const emailSchema = makeStringSchema(
		(v) => /^[\w.]+@[\w.]+\.\w+$/.test(v),
		'Invalid email',
	);

	it('returns true on success', () => {
		const validate = zodValidator(emailSchema);
		expect(validate('user@example.com')).toBe(true);
	});

	it('returns the first issue message on failure', () => {
		const validate = zodValidator(emailSchema);
		expect(validate('not-an-email')).toBe('Invalid email');
	});

	it('skips empty / nullish values so `validation.required` owns "missing"', () => {
		const validate = zodValidator(emailSchema);
		expect(validate('')).toBe(true);
		expect(validate(null)).toBe(true);
		expect(validate(undefined)).toBe(true);
	});

	it('falls back to `error.message` when `issues` is absent', () => {
		const schema: SafeParseSchema = {
			safeParse: () => ({ success: false, error: { message: 'Top-level msg' } }),
		};
		expect(zodValidator(schema)('x')).toBe('Top-level msg');
	});
});

describe('predicateValidator', () => {
	it('returns true when the predicate passes', () => {
		const validate = predicateValidator(
			(v) => /^https?:\/\//.test(String(v)),
			'URL must start with http:// or https://',
		);
		expect(validate('https://example.com')).toBe(true);
	});

	it('returns the configured message when the predicate fails', () => {
		const validate = predicateValidator(
			(v) => /^https?:\/\//.test(String(v)),
			'URL must start with http:// or https://',
		);
		expect(validate('not-a-url')).toBe('URL must start with http:// or https://');
	});
});
