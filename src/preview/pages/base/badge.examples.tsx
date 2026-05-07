import { Badge } from '@/components/base/badge';

export function Default() {
	return <Badge>New</Badge>;
}

export function Variants() {
	return (
		<div className="flex flex-wrap gap-2">
			<Badge variant="primary">Primary</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="destructive">Destructive</Badge>
			<Badge variant="info">Info</Badge>
			<Badge variant="secondary">Secondary</Badge>
		</div>
	);
}

export function WithDot() {
	return (
		<div className="flex flex-wrap gap-2">
			<Badge variant="success" dot>Live</Badge>
			<Badge variant="warning" dot pending>Pending</Badge>
		</div>
	);
}
