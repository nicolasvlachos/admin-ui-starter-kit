import { Badge } from '@/components/base/badge/badge';
import { Text } from '@/components/typography/text';
import { cn } from '@/lib/utils';
import { type BadgeVariant } from './types';

/* ─── Shared: Complexity / Scale Bar ─────────────────────────────────────── */

export function ScaleBar({
	value,
	max = 5,
	label,
}: {
	value: number;
	max?: number;
	label?: string;
}) {
	return (
		<div className={cn('helpers--component', 'flex items-center gap-1')}>
			{Array.from({ length: max }, (_, i) => (
				<div
					key={i}
					className={cn(
						'h-1.5 w-3 rounded-full',
						i < value ? 'bg-foreground/60' : 'bg-muted',
					)}
				/>
			))}
			{!!label && (
				<Text
					size="xs"
					type="secondary"
					className="ml-1"
				>
					{label}
				</Text>
			)}
		</div>
	);
}

/* ─── Shared: Key-Value Row ──────────────────────────────────────────────── */

export function KVRow({
	label,
	value,
	badge,
	badgeVariant,
}: {
	label: string;
	value?: string;
	badge?: string;
	badgeVariant?: BadgeVariant;
}) {
	return (
		<div className="flex items-center justify-between gap-2">
			<Text
				size="xs"
				className="shrink-0 text-muted-foreground"
			>
				{label}
			</Text>
			{!!badge && (
				<Badge
					variant={badgeVariant ?? 'secondary'}
				>
					{badge}
				</Badge>
			)}
			{!!value && !badge && (
				<Text
					weight="semibold"
					className="text-right tabular-nums"
				>
					{value}
				</Text>
			)}
		</div>
	);
}
