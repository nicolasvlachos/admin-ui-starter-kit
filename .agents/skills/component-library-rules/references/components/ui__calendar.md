---
id: ui/calendar
title: "UI · Calendar"
description: "react-day-picker styled with shadcn primitives."
layer: ui
family: "Forms"
sourcePath: src/components/ui/calendar
examples:
  - Single
imports:
  - @/components/ui/calendar
tags:
  - ui
  - forms
  - calendar
  - react
  - day
  - picker
  - styled
---

# UI · Calendar

react-day-picker styled with shadcn primitives.

**Layer:** `ui`  
**Source:** `src/components/ui/calendar`

## Examples

```tsx
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
```

## Example exports

- `Single`

