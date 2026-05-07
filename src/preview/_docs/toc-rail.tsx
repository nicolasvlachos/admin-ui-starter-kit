import { Text } from '@/components/typography/text';
import { useToc } from './toc-context';

export function TocRail() {
	const { entries } = useToc();
	if (entries.length === 0) return null;

	return (
		<aside className="toc-rail--component sticky top-[88px] hidden h-[calc(100vh-88px-2rem)] w-56 shrink-0 overflow-y-auto pl-6 lg:block">
			<Text size="xxs" type="secondary" className="font-semibold uppercase tracking-wider">
				On this page
			</Text>
			<ul className="toc-rail--list mt-3 space-y-1.5 border-l border-border">
				{entries.map((entry) => (
					<li key={entry.id} className="toc-rail--item">
						<a
							href={`#${entry.id}`}
							className="block -ml-px border-l border-transparent pl-3 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
						>
							{entry.title}
						</a>
					</li>
				))}
			</ul>
		</aside>
	);
}
