// @ts-nocheck
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Col } from '../../PreviewLayout';

export function Single() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	return (
		<>
			<Col>
								<Calendar mode="single" selected={date} onSelect={setDate} />
								<div className="text-xs text-muted-foreground">{date?.toDateString() ?? '—'}</div>
							</Col>
		</>
	);
}
