import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { DatePicker, MonthYearPicker } from '@/components/base/date-pickers';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

export default function DatePickersPage() {
	const [single, setSingle] = useState<Date | undefined>(undefined);
	const [range, setRange] = useState<DateRange | undefined>();
	const [multi, setMulti] = useState<Date[]>([]);
	const [my, setMy] = useState<{ month: number; year: number } | undefined>();

	return (
		<PreviewPage title="Base · Date pickers" description="DatePicker (single / range / multiple) + MonthYearPicker.">
			<PreviewSection title="Single">
				<Col>
					<DatePicker
						mode="single"
						value={single}
						onChange={(o) => setSingle(o.date)}
					/>
					<div className="text-xs text-muted-foreground">value: {single?.toDateString() ?? '—'}</div>
				</Col>
			</PreviewSection>

			<PreviewSection title="Single — with year dropdown">
				<DatePicker mode="single" enableYearDropdown buttonVariant="outline" />
			</PreviewSection>

			<PreviewSection title="Range">
				<Col>
					<DatePicker
						mode="range"
						value={range}
						onChange={(o) => setRange(o.range)}
					/>
					<div className="text-xs text-muted-foreground">
						{range?.from?.toDateString() ?? '—'} → {range?.to?.toDateString() ?? '—'}
					</div>
				</Col>
			</PreviewSection>

			<PreviewSection title="Multiple">
				<Col>
					<DatePicker
						mode="multiple"
						value={multi}
						onChange={(o) => setMulti(o.dates ?? [])}
					/>
					<div className="text-xs text-muted-foreground">{multi.length} selected</div>
				</Col>
			</PreviewSection>

			<PreviewSection title="Month / Year picker">
				<Col>
					<MonthYearPicker
						value={my}
						onChange={(o) => setMy({ month: o.month, year: o.year })}
					/>
					<div className="text-xs text-muted-foreground">
						{my ? `${my.month + 1}/${my.year}` : '—'}
					</div>
				</Col>
			</PreviewSection>
		</PreviewPage>
	);
}
