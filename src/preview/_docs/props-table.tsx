import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';
import propsData from './props.generated.json';

interface PropDoc {
	name: string;
	required: boolean;
	description: string;
	defaultValue: string | null;
	type: string;
}

interface ComponentDoc {
	displayName: string;
	description: string;
	filePath: string;
	props: Record<string, PropDoc>;
}

const PROPS_BY_NAME = propsData as Record<string, ComponentDoc>;

export interface PropsTableProps {
	component: string;
	className?: string;
}

export function PropsTable({ component, className }: PropsTableProps) {
	const doc = PROPS_BY_NAME[component];

	if (!doc) {
		return (
			<div className={cn('props-table--component rounded-md border border-warning/30 bg-warning/5 p-3', className)}>
				<Text size="xs" type="secondary">
					No props metadata for <code className="font-mono">{component}</code>. Run{' '}
					<code className="font-mono">npm run docs:generate-props</code>.
				</Text>
			</div>
		);
	}

	const propEntries = Object.values(doc.props).sort((a, b) => {
		if (a.required && !b.required) return -1;
		if (!a.required && b.required) return 1;
		return a.name.localeCompare(b.name);
	});

	if (propEntries.length === 0) {
		return (
			<Text size="xs" type="secondary" className={cn('props-table--component', className)}>
				This component has no documented props.
			</Text>
		);
	}

	return (
		<div className={cn('props-table--component overflow-x-auto rounded-md border border-border', className)}>
			<table className="w-full border-collapse text-xs">
				<thead className="props-table--head bg-muted/40 text-left">
					<tr>
						<th className="px-3 py-2 font-semibold">Prop</th>
						<th className="px-3 py-2 font-semibold">Type</th>
						<th className="px-3 py-2 font-semibold">Default</th>
						<th className="px-3 py-2 font-semibold">Description</th>
					</tr>
				</thead>
				<tbody className="props-table--body">
					{propEntries.map((p) => (
						<tr key={p.name} className="border-t border-border align-top">
							<td className="px-3 py-2 font-mono">
								{p.name}
								{p.required && <span className="ml-0.5 text-destructive">*</span>}
							</td>
							<td className="px-3 py-2 font-mono text-muted-foreground">{p.type}</td>
							<td className="px-3 py-2 font-mono text-muted-foreground">{p.defaultValue ?? '—'}</td>
							<td className="px-3 py-2 text-muted-foreground">{p.description || '—'}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
