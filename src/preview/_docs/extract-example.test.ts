import { describe, expect, it } from 'vitest';
import { extractExample } from './extract-example';

const SOURCE = `import { Badge } from '@/components/base/badge';

export function Default() {
	return <Badge>New</Badge>;
}

export function Variants() {
	return (
		<div className="flex flex-wrap gap-2">
			<Badge variant="primary">Primary</Badge>
		</div>
	);
}
`;

describe('extractExample', () => {
	it('returns just the named function body', () => {
		expect(extractExample(SOURCE, 'Default')).toBe(
			`export function Default() {\n\treturn <Badge>New</Badge>;\n}`,
		);
	});

	it('returns multi-line bodies including their closing brace', () => {
		const result = extractExample(SOURCE, 'Variants');
		expect(result.startsWith('export function Variants()')).toBe(true);
		expect(result.endsWith('}')).toBe(true);
		expect(result).toContain('<Badge variant="primary">Primary</Badge>');
	});

	it('returns the full source when name is not found', () => {
		expect(extractExample(SOURCE, 'Missing')).toBe(SOURCE);
	});
});
