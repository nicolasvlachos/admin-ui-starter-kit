---
id: ui/avatar
title: "UI · Avatar"
description: "Avatar with fallback, image, sizes, group, badge."
layer: ui
family: "Data display"
sourcePath: src/components/ui/avatar
examples:
  - Sizes
  - WithImageFallback
  - WithBadge
  - Group
imports:
  - @/components/ui/avatar
tags:
  - ui
  - data
  - display
  - avatar
  - fallback
  - image
  - sizes
  - group
---

# UI · Avatar

Avatar with fallback, image, sizes, group, badge.

**Layer:** `ui`  
**Source:** `src/components/ui/avatar`

## Examples

```tsx
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup, AvatarGroupCount, AvatarBadge } from '@/components/ui/avatar';
import { Row } from '../../PreviewLayout';

export function Sizes() {
	return (
		<>
			<Row>
								<Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
								<Avatar><AvatarFallback>MD</AvatarFallback></Avatar>
								<Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
							</Row>
		</>
	);
}

export function WithImageFallback() {
	return (
		<>
			<Row>
								<Avatar><AvatarImage src="https://i.pravatar.cc/64?img=1" /><AvatarFallback>U1</AvatarFallback></Avatar>
								<Avatar><AvatarImage src="https://i.pravatar.cc/64?img=12" /><AvatarFallback>U2</AvatarFallback></Avatar>
								<Avatar><AvatarImage src="/__missing__.png" /><AvatarFallback>JD</AvatarFallback></Avatar>
							</Row>
		</>
	);
}

export function WithBadge() {
	return (
		<>
			<Row>
								<Avatar>
									<AvatarFallback>EM</AvatarFallback>
									<AvatarBadge className="bg-chart-2">{''}</AvatarBadge>
								</Avatar>
								<Avatar size="lg">
									<AvatarFallback>SP</AvatarFallback>
									<AvatarBadge className="bg-warning">{''}</AvatarBadge>
								</Avatar>
							</Row>
		</>
	);
}

export function Group() {
	return (
		<>
			<AvatarGroup>
								<Avatar><AvatarFallback>VP</AvatarFallback></Avatar>
								<Avatar><AvatarFallback>SM</AvatarFallback></Avatar>
								<Avatar><AvatarFallback>KD</AvatarFallback></Avatar>
								<AvatarGroupCount>+3</AvatarGroupCount>
							</AvatarGroup>
		</>
	);
}
```

## Example exports

- `Sizes`
- `WithImageFallback`
- `WithBadge`
- `Group`

