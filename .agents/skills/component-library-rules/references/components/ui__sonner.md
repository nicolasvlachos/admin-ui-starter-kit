---
id: ui/sonner
title: "UI · Sonner toaster"
description: "Toast notifications."
layer: ui
family: "Feedback"
examples:
  - TriggerToasts
imports:
  - @/components/base/toaster
  - @/components/ui/button
tags:
  - ui
  - feedback
  - sonner
  - toaster
  - toast
  - notifications
---

# UI · Sonner toaster

Toast notifications.

**Layer:** `ui`  

## Examples

```tsx
// @ts-nocheck
import { toast } from 'sonner';
import { Toaster } from '@/components/base/toaster';
import { Button } from '@/components/ui/button';
import { Row } from '../../PreviewLayout';

export function TriggerToasts() {
	return (
		<>
			<Row>
								<Button onClick={() => toast('Default toast')}>Default</Button>
								<Button variant="outline" onClick={() => toast.success('Saved successfully')}>Success</Button>
								<Button variant="outline" onClick={() => toast.warning('Heads up')}>Warning</Button>
								<Button variant="destructive" onClick={() => toast.error('Failed to save')}>Error</Button>
								<Button variant="secondary" onClick={() => toast.info('FYI')}>Info</Button>
								<Button variant="ghost" onClick={() => {
									const id = toast.loading('Working…');
									setTimeout(() => toast.success('Done', { id }), 1500);
								}}>Loading → success</Button>
							</Row>
		</>
	);
}
```

## Example exports

- `TriggerToasts`

