---
id: ui/input-group
title: "UI · Input group"
description: "Input with leading / trailing add-ons."
layer: ui
family: "Forms"
examples:
  - LeadingIcon
  - TrailingAddon
  - StackedEmailPassword
imports:
  - @/components/ui/input-group
tags:
  - ui
  - forms
  - input
  - group
  - leading
  - trailing
---

# UI · Input group

Input with leading / trailing add-ons.

**Layer:** `ui`  

## Examples

```tsx
// @ts-nocheck
import { Search, Mail, Lock } from 'lucide-react';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group';
import { Col } from '../../PreviewLayout';

export function LeadingIcon() {
	return (
		<>
			<InputGroup>
								<InputGroupAddon><Search className="size-4" /></InputGroupAddon>
								<InputGroupInput placeholder="Search…" />
							</InputGroup>
		</>
	);
}

export function TrailingAddon() {
	return (
		<>
			<InputGroup>
								<InputGroupInput placeholder="username" />
								<InputGroupAddon align="inline-end" className="text-muted-foreground">@example.com</InputGroupAddon>
							</InputGroup>
		</>
	);
}

export function StackedEmailPassword() {
	return (
		<>
			<Col>
								<InputGroup>
									<InputGroupAddon><Mail className="size-4" /></InputGroupAddon>
									<InputGroupInput type="email" placeholder="email@example.com" />
								</InputGroup>
								<InputGroup>
									<InputGroupAddon><Lock className="size-4" /></InputGroupAddon>
									<InputGroupInput type="password" placeholder="••••••••" />
								</InputGroup>
							</Col>
		</>
	);
}
```

## Example exports

- `LeadingIcon`
- `TrailingAddon`
- `StackedEmailPassword`

