import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

export default function CalendarPage() {
	const [date, setDate] = useState<Date | undefined>(new Date());

	return (
		<PreviewPage title="UI · Calendar" description="react-day-picker styled with shadcn primitives.">
			<PreviewSection title="Single">
				<Col>
					<Calendar mode="single" selected={date} onSelect={setDate} />
					<div className="text-xs text-muted-foreground">{date?.toDateString() ?? '—'}</div>
				</Col>
			</PreviewSection>
		</PreviewPage>
	);
}
