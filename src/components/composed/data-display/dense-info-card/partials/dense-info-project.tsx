import { SmartCard } from '@/components/base/cards/smart-card';
import { Badge } from '@/components/base/badge/badge';
import { Text } from '@/components/typography/text';
import Heading from '@/components/typography/heading';
import { Separator } from '@/components/base/display/separator';
import {
	FolderOpen,
	Calendar,
	BarChart3,
} from 'lucide-react';
import { type DenseInfoProjectCardProps } from '../types';

export function DenseInfoProjectCard({
	title,
	description,
	statusLabel,
	statusVariant,
	metaPairs,
	date,
	priority,
	completedTasks,
	totalTasks,
	actions,
	className,
}: DenseInfoProjectCardProps) {
	const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
	const circumference = 2 * Math.PI * 7;
	const dashOffset = circumference - (percentage / 100) * circumference;

	return (
		<SmartCard
			padding="sm"
			actions={actions}
			className={className}
		>
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<FolderOpen className="h-4 w-4 text-muted-foreground" />
					<Badge variant={statusVariant} dot>
						{statusLabel}
					</Badge>
				</div>

				<Heading tag="h5" className="font-bold border-none pb-0">
					{title}
				</Heading>

				{!!description && (
					<Text type="secondary" className="line-clamp-2">
						{description}
					</Text>
				)}

				{!!metaPairs && metaPairs.length > 0 && (
					<div className="flex flex-wrap items-center gap-1.5">
						{metaPairs.map((pair, idx) => (
							<span key={pair.label} className="flex items-center gap-1">
								{idx > 0 && (
									<Text tag="span" type="discrete" className="mx-0.5">&bull;</Text>
								)}
								{!!pair.icon && (
									<span className="text-muted-foreground">{pair.icon}</span>
								)}
								<Text size="xs" type="secondary">{pair.label}</Text>
							</span>
						))}
					</div>
				)}

				{(!!date || !!priority) && (
					<div className="flex items-center justify-between">
						{!!date && (
							<div className="flex items-center gap-1.5">
								<Calendar className="h-3 w-3 text-muted-foreground" />
								<Text size="xs" type="secondary">{date}</Text>
							</div>
						)}
						{!!priority && (
							<div className="flex items-center gap-1.5">
								<BarChart3 className="h-3 w-3 text-muted-foreground" />
								<Text size="xs" type="secondary">{priority}</Text>
							</div>
						)}
					</div>
				)}

				<Separator />

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0">
							<circle
								cx="10"
								cy="10"
								r="7"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="text-muted/50"
							/>
							<circle
								cx="10"
								cy="10"
								r="7"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeDasharray={circumference}
								strokeDashoffset={dashOffset}
								strokeLinecap="round"
								className="text-primary"
								transform="rotate(-90 10 10)"
							/>
						</svg>
						<Text size="xs" weight="medium">
							{completedTasks}/{totalTasks} Tasks
						</Text>
					</div>
					<div className="h-6 w-6 rounded-full bg-muted" />
				</div>
			</div>
		</SmartCard>
	);
}

DenseInfoProjectCard.displayName = 'DenseInfoProjectCard';
