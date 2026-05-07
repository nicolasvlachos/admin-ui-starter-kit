---
id: base/typography
title: "Typography"
description: "Heading, Text, Label, and TextLink — the four typography primitives every higher layer composes from."
layer: base
family: "Foundations"
sourcePath: src/components/typography
examples:
  - HeadingTags
  - HeadingWithSubHeading
  - TextSizes
  - TextTypes
  - TextWeights
  - TextLineHeights
  - TextAlignment
  - TextContentAndHTML
  - TextTags
  - LabelExample
  - TextLinkVariants
  - TextLinkSizes
  - HighLightExample
  - UnderlineExample
  - DangerousHTMLExample
  - RealisticArticle
imports:
  - @/components/typography/heading
  - @/components/typography/label
  - @/components/typography/text
  - @/components/typography/text-link
  - @/components/typography/typography
tags:
  - base
  - foundations
  - typography
  - heading
  - text
  - label
  - textlink
---

# Typography

Heading, Text, Label, and TextLink — the four typography primitives every higher layer composes from.

**Layer:** `base`  
**Source:** `src/components/typography`

## Examples

```tsx
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import Label from '@/components/typography/label';
import TextLink from '@/components/typography/text-link';
import { HighLight, Underline, DangerousHTML } from '@/components/typography/typography';

const SIZES = ['xxs', 'xs', 'sm', 'base', 'lg', 'xl'] as const;
const TYPES = ['main', 'inverse', 'secondary', 'discrete', 'error', 'success', 'primary'] as const;
const WEIGHTS = ['regular', 'medium', 'semibold', 'bold'] as const;
const LINE_HEIGHTS = ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'] as const;

export function HeadingTags() {
	return (
		<div className="flex flex-col gap-3 w-full">
			{(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((tag) => (
				<Heading key={tag} tag={tag}>{tag.toUpperCase()} — The quick brown fox</Heading>
			))}
		</div>
	);
}

export function HeadingWithSubHeading() {
	return (
		<div className="flex flex-col gap-6 w-full">
			<Heading tag="h2" subHeading="A short supporting line beneath the heading.">
				Section title
			</Heading>
			<Heading tag="h3" subHeading="Centered subheading." align="center">
				Centered
			</Heading>
			<Heading tag="h3" subHeading="Right-aligned subheading." align="right">
				Right
			</Heading>
		</div>
	);
}

export function TextSizes() {
	return (
		<div className="flex flex-col gap-2 w-full">
			{SIZES.map((size) => (
				<Text key={size} size={size}>
					{size}: The quick brown fox jumps over the lazy dog.
				</Text>
			))}
		</div>
	);
}

export function TextTypes() {
	return (
		<div className="flex flex-col gap-2 w-full">
			{TYPES.filter((t) => t !== 'inverse').map((type) => (
				<Text key={type} type={type}>
					type=&quot;{type}&quot; — sample text
				</Text>
			))}
			<div className="rounded-md bg-foreground p-3">
				<Text type="inverse">type=&quot;inverse&quot; — on dark background</Text>
			</div>
		</div>
	);
}

export function TextWeights() {
	return (
		<div className="flex flex-col gap-2 w-full">
			{WEIGHTS.map((w) => (
				<Text key={w} weight={w}>weight={w} — sample text</Text>
			))}
		</div>
	);
}

export function TextLineHeights() {
	return (
		<div className="flex flex-col gap-3 w-full">
			{LINE_HEIGHTS.map((lh) => (
				<div key={lh} className="rounded border border-dashed border-border p-2">
					<Text lineHeight={lh}>
						lineHeight=&quot;{lh}&quot; — Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
					</Text>
				</div>
			))}
		</div>
	);
}

export function TextAlignment() {
	return (
		<div className="flex flex-col gap-2 w-full">
			<Text align="left">Left aligned text</Text>
			<Text align="center">Center aligned text</Text>
			<Text align="right">Right aligned text</Text>
		</div>
	);
}

export function TextContentAndHTML() {
	return (
		<div className="flex flex-col gap-2 w-full">
			<Text content="Rendered via the content prop" />
			<Text asHTML content="<strong>Sanitised</strong> HTML — &lt;script&gt;alert(1)&lt;/script&gt; is stripped." />
		</div>
	);
}

export function TextTags() {
	return (
		<div className="flex flex-col gap-2 w-full">
			<Text tag="p">tag=&quot;p&quot; (default)</Text>
			<Text tag="div">tag=&quot;div&quot;</Text>
			<Text tag="span">tag=&quot;span&quot; — flows inline</Text>
		</div>
	);
}

export function LabelExample() {
	return (
		<div className="flex flex-col gap-3 w-full max-w-sm">
			<div className="space-y-1">
				<Label>Email address</Label>
				<input className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm" placeholder="you@example.com" />
			</div>
			<div className="space-y-1">
				<Label className="text-primary">Custom-coloured label</Label>
				<input className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm" />
			</div>
		</div>
	);
}

export function TextLinkVariants() {
	return (
		<div className="flex flex-col gap-2 w-full">
			<TextLink href="#">Default link</TextLink>
			<TextLink href="#" underline={false}>Without underline</TextLink>
			<TextLink href="#" type="primary" weight="semibold">Primary semibold</TextLink>
			<TextLink href="#" type="error">Destructive link</TextLink>
			<TextLink href="#" type="success">Success link</TextLink>
		</div>
	);
}

export function TextLinkSizes() {
	return (
		<div className="flex flex-wrap items-baseline gap-4 w-full">
			<TextLink href="#" size="xs">xs</TextLink>
			<TextLink href="#" size="sm">sm</TextLink>
			<TextLink href="#" size="base">base</TextLink>
			<TextLink href="#" size="lg">lg</TextLink>
			<TextLink href="#" size="xl">xl</TextLink>
		</div>
	);
}

export function HighLightExample() {
	return (
		<div className="flex flex-col gap-2">
			<Text>Default <HighLight content="primary" /> highlighted text</Text>
			<Text>Variant <HighLight content="success" variant="success" /> highlight</Text>
			<Text>Variant <HighLight content="warning" variant="warning" /> highlight</Text>
			<Text>Variant <HighLight content="error" variant="error" /> highlight</Text>
		</div>
	);
}

export function UnderlineExample() {
	return (
		<div className="flex flex-col gap-2">
			<Text><Underline content="primary underline" /></Text>
			<Text><Underline content="success underline" variant="success" /></Text>
			<Text><Underline content="warning underline" variant="warning" /></Text>
			<Text><Underline content="error underline" variant="error" /></Text>
		</div>
	);
}

export function DangerousHTMLExample() {
	return (
		<div className="w-full max-w-md">
			<DangerousHTML>{'<strong>Sanitised</strong> HTML — &lt;script&gt;alert(1)&lt;/script&gt; tags are stripped before render.'}</DangerousHTML>
		</div>
	);
}

export function RealisticArticle() {
	return (
		<article className="w-full max-w-2xl space-y-4">
			<Heading tag="h1" subHeading="Published 3 May 2026 by Sarah Smitha">
				Designing for clarity at scale
			</Heading>
			<Text size="base" lineHeight="relaxed">
				When the product surface grows past a single screen, every label, every
				caption, and every empty state has to pull double duty. Hierarchy stops
				being a nice-to-have — it becomes the whole point.
			</Text>
			<Heading tag="h2">The three rules</Heading>
			<Text lineHeight="relaxed">
				One typeface. One scale. One weight per role.
				<TextLink href="#" type="primary" className="ml-1">Read the full essay</TextLink>.
			</Text>
		</article>
	);
}
```

## Example exports

- `HeadingTags`
- `HeadingWithSubHeading`
- `TextSizes`
- `TextTypes`
- `TextWeights`
- `TextLineHeights`
- `TextAlignment`
- `TextContentAndHTML`
- `TextTags`
- `LabelExample`
- `TextLinkVariants`
- `TextLinkSizes`
- `HighLightExample`
- `UnderlineExample`
- `DangerousHTMLExample`
- `RealisticArticle`

