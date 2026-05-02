/**
 * GradientCard — vivid gradient surface with a clear single-axis layout.
 *
 * Structure (all sections optional, all left-aligned):
 *
 *   ┌──────────────────────────────────────────┐
 *   │ Title                       [icon] [×]   │  ← header: title|subtitle / icon / badge
 *   │ Subtitle                                 │
 *   │                                          │
 *   │ 24                                       │  ← hero value (large, eyebrow above)
 *   │ orders awaiting fulfillment    URGENT    │
 *   │                                          │
 *   │ ⚠  3 orders older than 48h          3   │  ← inline alert (subordinate to value)
 *   │                                          │
 *   │ ──────────────────────────────────────── │
 *   │ [Review Orders]                  footer  │  ← action / footer
 *   └──────────────────────────────────────────┘
 *
 * Earlier centered-hero mode pushed every element to the centerline which made
 * the alert dominate over the value and produced a fragmented vertical rhythm.
 * The new layout keeps everything on the leading edge so the eye walks
 * top-down: identity → value → context → action.
 *
 * For the compact "metric tile" use-case (single value + change), see
 * `GradientCardCompact` below.
 */
import { type ReactNode } from 'react';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography/text';
import Heading from '@/components/typography/heading';
import { cn } from '@/lib/utils';
import {
	type GradientPreset,
	type PatternType,
	type GradientCardProps,
	type GradientCardCompactProps,
} from './types';

// ──────────────────────────────────────────────────────────────────────────
// Gradient + pattern presets
// ──────────────────────────────────────────────────────────────────────────

const GRADIENT_MAP: Record<GradientPreset, string> = {
	coral: 'bg-gradient-to-br from-[#e8453c] to-[#f4845f]',
	ocean: 'bg-gradient-to-br from-chart-4 to-[#7c6cf0]',
	forest: 'bg-gradient-to-br from-chart-1 to-[#2d9a5f]',
	twilight: 'bg-gradient-to-br from-[#1e1b4b] to-chart-4',
	ember: 'bg-gradient-to-br from-chart-3 to-chart-2',
};

function PatternCircles() {
	return (
		<>
			<div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/[0.06]" aria-hidden="true" />
			<div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/[0.05]" aria-hidden="true" />
		</>
	);
}

function PatternDiagonal() {
	return (
		<svg
			className="absolute inset-0 h-full w-full opacity-[0.04]"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<defs>
				<pattern
					id="diag-stripes"
					width="8"
					height="8"
					patternUnits="userSpaceOnUse"
					patternTransform="rotate(45)"
				>
					<rect width="2" height="8" fill="white" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#diag-stripes)" />
		</svg>
	);
}

const PATTERN_MAP: Record<PatternType, (() => ReactNode) | null> = {
	none: null,
	circles: () => <PatternCircles />,
	diagonal: () => <PatternDiagonal />,
};

// ──────────────────────────────────────────────────────────────────────────
// GradientCard
// ──────────────────────────────────────────────────────────────────────────

export function GradientCard({
	gradient = 'coral',
	pattern = 'none',
	title,
	subtitle,
	value,
	valueLabel,
	badge,
	icon: Icon,
	alertText,
	alertCount,
	action,
	footer,
	children,
	className,
}: GradientCardProps) {
	const PatternRenderer = PATTERN_MAP[pattern];
	const hasHeader = !!(title || subtitle || Icon);

	return (
		<div
			className={cn(
				'relative overflow-hidden rounded-2xl',
				GRADIENT_MAP[gradient],
				className,
			)}
		>
			{!!PatternRenderer && PatternRenderer()}

			<div className="relative flex flex-col gap-5 p-6">
				{/* Header — title + subtitle on the leading edge, icon as a
				    rounded square on the trailing edge so it acts as a brand
				    mark rather than competing for the centerline. */}
				{!!hasHeader && (
					<div className="flex items-start justify-between gap-4">
						<div className="min-w-0 flex-1">
							{!!title && (
								<Text
									weight="semibold"
									className="text-white tracking-tight leading-snug"
								>
									{title}
								</Text>
							)}
							{!!subtitle && (
								<Text size="xs" className="mt-0.5 text-white/70 leading-snug">
									{subtitle}
								</Text>
							)}
						</div>
						{!!Icon && (
							<span
								aria-hidden="true"
								className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/15 backdrop-blur-sm"
							>
								<Icon className="size-5" />
							</span>
						)}
					</div>
				)}

				{/* Hero value block — eyebrow above the figure, optional badge
				    on the trailing edge of the label row. The figure is the
				    visual anchor of the card. */}
				{!!value && (
					<div className="flex flex-col gap-1">
						<Heading
							tag="h3"
							align="left"
							className="text-4xl font-bold tabular-nums tracking-tight text-white border-none pb-0 leading-none"
						>
							{value}
						</Heading>
						{(valueLabel || badge) && (
							<div className="flex flex-wrap items-center justify-between gap-2">
								{!!valueLabel && (
									<Text size="xs" className="text-white/75 leading-snug">
										{valueLabel}
									</Text>
								)}
								{!!badge && (
									<span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xxs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
										{badge}
									</span>
								)}
							</div>
						)}
					</div>
				)}

				{/* Inline alert — subordinate to the value, sits below it. */}
				{!!alertText && (
					<div className="flex items-center gap-3 rounded-xl bg-white/10 px-3.5 py-2.5 ring-1 ring-white/10 backdrop-blur-sm">
						<Text className="min-w-0 flex-1 text-white/90 leading-snug">
							{alertText}
						</Text>
						{!!alertCount && (
							<span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1.5 text-xs font-bold tabular-nums text-white">
								{alertCount}
							</span>
						)}
					</div>
				)}

				{!!children && <div>{children}</div>}

				{(!!action || !!footer) && (
					<div className="flex items-center justify-between gap-3 pt-1">
							{action ? (
							<Button
								variant="dark"
								onClick={action.onClick}
								className="rounded-xl px-4"
							>
								{action.label}
							</Button>
						) : (
							<span />
						)}
						{!!footer && (
							<Text size="xs" className="text-white/70">{footer}</Text>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

GradientCard.displayName = 'GradientCard';

// ──────────────────────────────────────────────────────────────────────────
// GradientCardCompact — single-metric tile
// ──────────────────────────────────────────────────────────────────────────

export function GradientCardCompact({
	gradient = 'coral',
	pattern = 'none',
	title,
	value,
	change,
	subtitle,
	className,
}: GradientCardCompactProps) {
	const PatternRenderer = PATTERN_MAP[pattern];

	return (
		<div
			className={cn(
				'relative overflow-hidden rounded-2xl',
				GRADIENT_MAP[gradient],
				className,
			)}
		>
			{!!PatternRenderer && PatternRenderer()}

			<div className="relative flex flex-col gap-1 p-5">
				{!!title && (
					<Text size="xs" weight="medium" className="text-white/80 uppercase tracking-wider">
						{title}
					</Text>
				)}
				<div className="flex items-baseline gap-2">
					{!!value && (
						<Heading
							tag="h4"
							align="left"
							className="text-2xl font-bold tabular-nums tracking-tight text-white border-none pb-0 leading-none"
						>
							{value}
						</Heading>
					)}
					{!!change && (
						<span className="inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-white backdrop-blur-sm">
							{change}
						</span>
					)}
				</div>
				{!!subtitle && (
					<Text size="xs" className="text-white/65 leading-snug">
						{subtitle}
					</Text>
				)}
			</div>
		</div>
	);
}

GradientCardCompact.displayName = 'GradientCardCompact';
