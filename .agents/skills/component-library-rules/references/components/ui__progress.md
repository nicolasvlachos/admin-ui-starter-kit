---
id: ui/progress
title: "UI · Progress"
description: "Linear progress bar at varying values."
layer: ui
family: "Data display"
examples:
  - Values
imports:
  - @/components/ui/progress
tags:
  - ui
  - data
  - display
  - progress
  - linear
  - bar
  - varying
---

# UI · Progress

Linear progress bar at varying values.

**Layer:** `ui`  

## Examples

```tsx
// @ts-nocheck
import { Progress } from '@/components/ui/progress';
import { Col } from '../../PreviewLayout';

export function Values() {
	return (
		<>
			<Col>
								{[0, 25, 50, 75, 100].map((v) => (
									<div key={v} className="space-y-1">
										<div className="text-xs text-muted-foreground">{v}%</div>
										<Progress value={v} />
									</div>
								))}
							</Col>
		</>
	);
}
```

## Example exports

- `Values`

