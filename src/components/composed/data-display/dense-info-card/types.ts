import { type ReactNode } from 'react';
import { type SmartCardAction } from '@/components/base/cards/smart-card';
import type { ComposedBadgeVariant } from '@/components/base/badge/badge';

export type BadgeVariant = ComposedBadgeVariant;

/* ─── Variant A — DenseInfoDashboard ─────────────────────────────────────── */

export interface DashboardStatusBadge {
	label: string;
	variant: BadgeVariant;
}

export interface DashboardKeyValueRow {
	label: string;
	value?: string;
	badge?: string;
	badgeVariant?: BadgeVariant;
}

export interface DenseInfoDashboardProps {
	title: string;
	description?: string;
	statusBadges: DashboardStatusBadge[];
	rows: DashboardKeyValueRow[];
	secondaryRows?: DashboardKeyValueRow[];
	scale?: { label: string; value: number; max?: number };
	footerBadges?: DashboardStatusBadge[];
	footerText?: ReactNode;
	actions?: SmartCardAction[];
	className?: string;
}

/* ─── Variant B — DenseInfoClassification ────────────────────────────────── */

export interface ClassificationStat {
	label: string;
	value: string;
	trendBadge?: string;
	trendVariant?: BadgeVariant;
}

export interface ClassificationRow {
	label: string;
	value: string;
	dotColor: string;
	badge?: string;
	badgeVariant?: BadgeVariant;
}

export interface DenseInfoClassificationProps {
	title: string;
	description?: string;
	stats: ClassificationStat[];
	items: ClassificationRow[];
	totalLabel?: string;
	totalValue?: string;
	footerBadges?: DashboardStatusBadge[];
	footerText?: ReactNode;
	actions?: SmartCardAction[];
	className?: string;
}

/* ─── Variant C — DenseInfoFinancial ─────────────────────────────────────── */

export interface FinancialHeaderBadge {
	label: string;
	variant: BadgeVariant;
}

export interface FinancialLineItem {
	label: string;
	amount: string;
	badge?: string;
	badgeVariant?: BadgeVariant;
}

export interface DenseInfoFinancialProps {
	title: string;
	description?: string;
	headerBadges: FinancialHeaderBadge[];
	lineItems: FinancialLineItem[];
	totalLabel?: string;
	totalAmount?: string;
	footerBadges?: FinancialHeaderBadge[];
	footerText?: ReactNode;
	actions?: SmartCardAction[];
	className?: string;
}

/* ─── Variant D — DenseInfoProjectCard ───────────────────────────────────── */

export interface ProjectMetaPair {
	icon?: ReactNode;
	label: string;
}

export interface DenseInfoProjectCardProps {
	title: string;
	description?: string;
	statusLabel: string;
	statusVariant: BadgeVariant;
	metaPairs?: ProjectMetaPair[];
	date?: string;
	priority?: string;
	completedTasks: number;
	totalTasks: number;
	actions?: SmartCardAction[];
	className?: string;
}

/* ─── Variant F — DenseInfoScoreCard ─────────────────────────────────────── */

export interface ScoreKeyValueRow {
	label: string;
	value: string;
}

export interface DenseInfoScoreCardProps {
	title: string;
	description?: string;
	statusBadges: DashboardStatusBadge[];
	score: number;
	scoreLevel: 'good' | 'medium' | 'low';
	scoreFilled: number;
	scoreTotal?: number;
	rows: ScoreKeyValueRow[];
	footerBadges?: DashboardStatusBadge[];
	actions?: SmartCardAction[];
	className?: string;
}
