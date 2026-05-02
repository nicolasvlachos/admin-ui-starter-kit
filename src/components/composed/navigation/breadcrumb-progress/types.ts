export interface BreadcrumbProgressStep {
	id: string;
	label: string;
	hint?: string;
}

export interface BreadcrumbProgressStrings {
	stepLabel: string;
	ofLabel: string;
}

export const defaultBreadcrumbProgressStrings: BreadcrumbProgressStrings = {
	stepLabel: 'Step',
	ofLabel: 'of',
};

export interface BreadcrumbProgressProps {
	steps: BreadcrumbProgressStep[];
	currentIndex: number;
	onStepClick?: (id: string, index: number) => void;
	className?: string;
	strings?: Partial<BreadcrumbProgressStrings>;
}
