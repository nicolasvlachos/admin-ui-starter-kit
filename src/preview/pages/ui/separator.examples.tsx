// @ts-nocheck
import { Separator } from '@/components/ui/separator';

export function Horizontal() {
	return (
		<>
			<div>
								<div className="text-sm">Above</div>
								<Separator className="my-3" />
								<div className="text-sm">Below</div>
							</div>
		</>
	);
}

export function Vertical() {
	return (
		<>
			<div className="flex h-10 items-center">
								<span className="text-sm">Item A</span>
								<Separator orientation="vertical" className="mx-3" />
								<span className="text-sm">Item B</span>
								<Separator orientation="vertical" className="mx-3" />
								<span className="text-sm">Item C</span>
							</div>
		</>
	);
}
