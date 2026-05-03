/**
 * SmartCard strings — i18n surface for the chrome the consumer doesn't
 * pass directly. Most copy (title, description, action labels, alert
 * body) flows in via props; the strings here cover the implicit
 * affordances (expand toggle).
 */

export interface SmartCardStrings {
	expandLabel: string;
	collapseLabel: string;
}

export const defaultSmartCardStrings: SmartCardStrings = {
	expandLabel: 'Expand card',
	collapseLabel: 'Collapse card',
};
