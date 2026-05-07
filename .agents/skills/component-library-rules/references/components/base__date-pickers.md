---
id: base/date-pickers
title: "Date pickers"
description: "DatePicker (single / range / multiple) and MonthYearPicker — popover-based, locale-aware, with optional year dropdown and time input."
layer: base
family: "Forms & inputs"
sourcePath: src/components/base/date-pickers
examples:
  - Default
  - ModeSingle
  - ModeRange
  - ModeMultiple
  - WithYearDropdown
  - ButtonStyles
  - MonthYearPickerExample
  - DateRangePickerLegacy
  - WithTimeInput
  - RealisticDateFilter
imports:
  - @/components/base/date-pickers
tags:
  - base
  - forms
  - inputs
  - date-pickers
  - date
  - pickers
  - datepicker
  - single
---

# Date pickers

DatePicker (single / range / multiple) and MonthYearPicker — popover-based, locale-aware, with optional year dropdown and time input.

**Layer:** `base`  
**Source:** `src/components/base/date-pickers`

## Examples

```tsx
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { DatePicker, MonthYearPicker, DateRangePicker } from '@/components/base/date-pickers';

export function Default() {
	const [single, setSingle] = useState<Date | undefined>(undefined);
	return (
		<div className="flex flex-col gap-2">
			<DatePicker mode="single" value={single} onChange={(o) => setSingle(o.date)} />
			<div className="text-xs text-muted-foreground">value: {single?.toDateString() ?? '—'}</div>
		</div>
	);
}

export function ModeSingle() {
	const [single, setSingle] = useState<Date | undefined>(undefined);
	return (
		<div className="flex flex-col gap-2">
			<DatePicker mode="single" value={single} onChange={(o) => setSingle(o.date)} />
			<div className="text-xs text-muted-foreground">value: {single?.toDateString() ?? '—'}</div>
		</div>
	);
}

export function ModeRange() {
	const [range, setRange] = useState<DateRange | undefined>();
	return (
		<div className="flex flex-col gap-2">
			<DatePicker mode="range" value={range} onChange={(o) => setRange(o.range)} />
			<div className="text-xs text-muted-foreground">
				{range?.from?.toDateString() ?? '—'} → {range?.to?.toDateString() ?? '—'}
			</div>
		</div>
	);
}

export function ModeMultiple() {
	const [multi, setMulti] = useState<Date[]>([]);
	return (
		<div className="flex flex-col gap-2">
			<DatePicker mode="multiple" value={multi} onChange={(o) => setMulti(o.dates ?? [])} />
			<div className="text-xs text-muted-foreground">{multi.length} selected</div>
		</div>
	);
}

export function WithYearDropdown() {
	return <DatePicker mode="single" enableYearDropdown />;
}

export function ButtonStyles() {
	return (
		<div className="flex flex-wrap gap-2">
			<DatePicker mode="single" />
			<DatePicker mode="single" disabled />
		</div>
	);
}

export function MonthYearPickerExample() {
	const [my, setMy] = useState<{ month: number; year: number } | undefined>();
	return (
		<div className="flex flex-col gap-2">
			<MonthYearPicker value={my} onChange={(o) => setMy({ month: o.month, year: o.year })} />
			<div className="text-xs text-muted-foreground">{my ? `${my.month + 1}/${my.year}` : '—'}</div>
		</div>
	);
}

export function DateRangePickerLegacy() {
	const [range, setRange] = useState<DateRange | undefined>();
	return (
		<div className="flex flex-col gap-2">
			<DateRangePicker value={range} onChange={(o) => setRange(o.range)} />
			<div className="text-xs text-muted-foreground">
				{range?.from?.toDateString() ?? '—'} → {range?.to?.toDateString() ?? '—'}
			</div>
		</div>
	);
}

export function WithTimeInput() {
	const [val, setVal] = useState<Date | undefined>(undefined);
	return (
		<div className="flex flex-col gap-2">
			<DatePicker
				mode="single"
				value={val}
				onChange={(o) => setVal(o.date)}
				withTime={{ enabled: true, format: '24' }}
			/>
			<div className="text-xs text-muted-foreground">value: {val?.toLocaleString() ?? '—'}</div>
		</div>
	);
}

export function RealisticDateFilter() {
	const [range, setRange] = useState<DateRange | undefined>();
	return (
		<div className="flex w-full max-w-md items-center gap-2 rounded-md border bg-card p-3">
			<span className="text-sm font-medium">Date range</span>
			<DatePicker mode="range" value={range} onChange={(o) => setRange(o.range)} />
		</div>
	);
}
```

## Example exports

- `Default`
- `ModeSingle`
- `ModeRange`
- `ModeMultiple`
- `WithYearDropdown`
- `ButtonStyles`
- `MonthYearPickerExample`
- `DateRangePickerLegacy`
- `WithTimeInput`
- `RealisticDateFilter`

