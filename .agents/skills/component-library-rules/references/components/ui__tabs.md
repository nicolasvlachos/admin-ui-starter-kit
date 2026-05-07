---
id: ui/tabs
title: "UI · Tabs"
description: "Tab list with content panels."
layer: ui
family: "Navigation"
examples:
  - Default
imports:
  - @/components/ui/tabs
tags:
  - ui
  - navigation
  - tabs
  - tab
  - list
  - content
---

# UI · Tabs

Tab list with content panels.

**Layer:** `ui`  

## Examples

```tsx
// @ts-nocheck
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Default() {
	return (
		<>
			<Tabs defaultValue="overview">
								<TabsList>
									<TabsTrigger value="overview">Overview</TabsTrigger>
									<TabsTrigger value="activity">Activity</TabsTrigger>
									<TabsTrigger value="settings">Settings</TabsTrigger>
								</TabsList>
								<TabsContent value="overview" className="mt-3 text-sm">Overview panel content.</TabsContent>
								<TabsContent value="activity" className="mt-3 text-sm">Activity panel content.</TabsContent>
								<TabsContent value="settings" className="mt-3 text-sm">Settings panel content.</TabsContent>
							</Tabs>
		</>
	);
}
```

## Example exports

- `Default`

