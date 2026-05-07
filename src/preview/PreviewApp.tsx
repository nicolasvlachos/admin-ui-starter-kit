import { Suspense, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { REGISTRY, getStructure, type PreviewEntry } from './registry';

function readHashId(): string {
	const id = window.location.hash.replace(/^#\/?/, '');
	return id || REGISTRY[0]?.id || '';
}

function statusDot(status: PreviewEntry['status']) {
	const cls =
		status === 'broken'
			? 'bg-destructive'
			: status === 'wip'
				? 'bg-warning'
				: 'bg-success';
	return <span className={`size-1.5 shrink-0 rounded-full ${cls}`} />;
}

export default function PreviewApp() {
	const [activeId, setActiveId] = useState<string>(readHashId);
	const [filter, setFilter] = useState('');

	useEffect(() => {
		const onHash = () => setActiveId(readHashId());
		window.addEventListener('hashchange', onHash);
		return () => window.removeEventListener('hashchange', onHash);
	}, []);

	const active = useMemo(
		() => REGISTRY.find((e) => e.id === activeId) ?? REGISTRY[0],
		[activeId],
	);

	const Active = active?.component;
	const structure = useMemo(getStructure, []);
	const activeSection = active?.section ?? structure[0]?.section;
	const sectionGroup = structure.find((s) => s.section === activeSection);

	const sectionFirst: Record<string, string | undefined> = {};
	for (const s of structure) {
		sectionFirst[s.section] = s.families[0]?.entries[0]?.id;
	}

	const filteredFamilies = useMemo(() => {
		if (!sectionGroup) return [];
		const q = filter.trim().toLowerCase();
		if (!q) return sectionGroup.families;
		return sectionGroup.families
			.map((f) => ({
				family: f.family,
				entries: f.entries.filter(
					(e) =>
						e.label.toLowerCase().includes(q) ||
						f.family.toLowerCase().includes(q),
				),
			}))
			.filter((f) => f.entries.length > 0);
	}, [sectionGroup, filter]);

	const totalInSection = sectionGroup?.families.reduce((acc, f) => acc + f.entries.length, 0) ?? 0;

	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Header — section tabs */}
			<header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
				<div className="mx-auto flex max-w-[110rem] flex-col items-stretch gap-3 px-4 py-3 md:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
					<div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
						<span className="text-foreground font-semibold">Components</span>
						{active && (
							<>
								<span>/</span>
								<span>{active.section}</span>
								<span>/</span>
								<span>{active.family}</span>
								<span>/</span>
								<span className="text-foreground font-medium truncate">{active.label}</span>
							</>
						)}
					</div>

					<nav className="-mx-1 flex max-w-full items-center gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:px-0 lg:pb-0" aria-label="Sections">
						{structure.map(({ section, families }) => {
							const isActive = section === activeSection;
							const target = sectionFirst[section] ?? '';
							const count = families.reduce((acc, f) => acc + f.entries.length, 0);
							return (
								<a
									key={section}
									href={`#/${target}`}
									className={
										'group inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ' +
										(isActive
											? 'bg-foreground text-background'
											: 'text-muted-foreground hover:bg-muted hover:text-foreground')
									}
								>
									<span>{section}</span>
									<span
										className={
											'rounded-full px-1.5 text-xxs font-medium tabular-nums ' +
											(isActive ? 'bg-background/15 text-background/80' : 'bg-muted text-muted-foreground')
										}
									>
										{count}
									</span>
								</a>
							);
						})}
					</nav>

					<div className="hidden shrink-0 items-center gap-3 text-xs text-muted-foreground xl:flex">
						<div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-success" /> ready</div>
						<div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-warning" /> wip</div>
						<div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-destructive" /> broken</div>
					</div>
				</div>
			</header>

			{/* Body — sidebar + content */}
			<div className="mx-auto flex max-w-[110rem] gap-8 px-4 py-5 md:px-6 md:py-6">
				<aside className="sticky top-[68px] hidden h-[calc(100vh-68px-1.5rem)] w-64 shrink-0 flex-col md:flex">
					<div className="mb-3 flex items-center justify-between gap-2">
						<div>
							<div className="text-xs font-semibold uppercase tracking-wider text-foreground">
								{activeSection}
							</div>
							<div className="text-xxs text-muted-foreground">
								{totalInSection} component{totalInSection === 1 ? '' : 's'}
							</div>
						</div>
					</div>

					<div className="relative mb-3">
						<Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
						<input
							type="text"
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							placeholder="Filter…"
							className="h-8 w-full rounded-md border border-border bg-card pl-7 pr-2 text-xs outline-none ring-0 placeholder:text-muted-foreground/70 focus:border-foreground/30"
						/>
					</div>

					<nav className="-mx-1 flex-1 overflow-y-auto pr-1">
						{filteredFamilies.length === 0 && (
							<div className="px-2 py-4 text-xs text-muted-foreground">No matches.</div>
						)}
						{filteredFamilies.map(({ family, entries }) => (
							<details key={family} className="mb-2 group" open>
								<summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-1 text-xxs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
									<span>{family}</span>
									<span className="rounded-full bg-muted px-1.5 text-xxs tabular-nums">{entries.length}</span>
								</summary>
								<ul className="mt-1 space-y-0.5">
									{entries.map((entry) => {
										const isActive = entry.id === active?.id;
										return (
											<li key={entry.id}>
												<a
													href={`#/${entry.id}`}
													className={
														'group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ' +
														(isActive
															? 'bg-muted font-medium text-foreground'
															: 'text-muted-foreground hover:bg-muted/60 hover:text-foreground')
													}
												>
													{statusDot(entry.status)}
													<span className="truncate">{entry.label}</span>
												</a>
											</li>
										);
									})}
								</ul>
							</details>
						))}
					</nav>
				</aside>

				<main className="min-w-0 flex-1 pb-16">
					<Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
						{Active ? <Active /> : <div className="text-sm text-muted-foreground">No page selected.</div>}
					</Suspense>
				</main>
			</div>
		</div>
	);
}
