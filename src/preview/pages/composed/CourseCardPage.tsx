import { CourseCard } from '@/components/composed/cards/course-card';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

const SAMPLE_PARTICIPANTS = [
	{ name: 'Vasilis Smith' },
	{ name: 'Sara Martinova' },
	{ name: 'Kostas Williams' },
];

export default function CourseCardPage() {
	return (
		<PreviewPage title="Composed · Course card" description="Group experience with participants & progress.">
			<PreviewSection title="Default — with everything">
				<CourseCard
					title="Wine Tasting Masterclass"
					description="A curated journey through Thracian Valley wines with a certified sommelier."
					badges={[
						{ label: 'Group Experience', variant: 'success' },
						{ label: 'Premium', variant: 'warning' },
					]}
					participants={SAMPLE_PARTICIPANTS}
					extraParticipants={3}
					progressPercent={60}
					actionLabel="View Experience Details"
					onAction={() => {}}
				/>
			</PreviewSection>

			<PreviewSection title="Gradient — violet → fuchsia → pink (default)">
				<CourseCard
					variant="gradient"
					title="Sunset Photography Workshop"
					description="Three-hour shoot with golden-hour mentorship in central New York."
					badges={[{ label: 'Workshop', variant: 'info' }]}
					participants={SAMPLE_PARTICIPANTS}
					extraParticipants={5}
					progressPercent={40}
					actionLabel="Reserve a Seat"
					onAction={() => {}}
				/>
			</PreviewSection>

			<PreviewSection title="Gradient — custom (cyan → emerald)">
				<CourseCard
					variant="gradient"
					gradient="bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500"
					title="Coastal Hike & Lunch"
					description="Scenic Black Sea coast walk followed by a tasting menu at a local kitchen."
					participants={SAMPLE_PARTICIPANTS}
					extraParticipants={1}
					progressPercent={75}
					actionLabel="Join the Hike"
					onAction={() => {}}
				/>
			</PreviewSection>

			<PreviewSection title="Gradient — custom (amber → rose)">
				<CourseCard
					variant="gradient"
					gradient="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500"
					title="Pottery Studio Day"
					description="From wedging to glazing — take home two finished pieces."
					participants={SAMPLE_PARTICIPANTS.slice(0, 2)}
					actionLabel="Book a Spot"
					onAction={() => {}}
				/>
			</PreviewSection>

			<PreviewSection title="Minimal" span="full">
				<div className="space-y-2">
					<CourseCard
						variant="minimal"
						title="Wine Tasting Masterclass"
						description="Thracian Valley · 2 hrs"
						participants={SAMPLE_PARTICIPANTS}
						extraParticipants={3}
						progressPercent={60}
						actionLabel="View"
						onAction={() => {}}
					/>
					<CourseCard
						variant="minimal"
						title="Sunset Photography Workshop"
						description="New York · 3 hrs · golden hour"
						participants={SAMPLE_PARTICIPANTS}
						progressPercent={20}
						actionLabel="Reserve"
						onAction={() => {}}
					/>
					<CourseCard
						variant="minimal"
						title="Coastal Hike & Lunch"
						description="Black Sea coast · full day"
					/>
				</div>
			</PreviewSection>
		</PreviewPage>
	);
}
