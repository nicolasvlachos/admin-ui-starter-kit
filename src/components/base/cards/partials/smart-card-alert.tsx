/**
 * Inline alert banner rendered between the header and the card body.
 * Pulls itself up under the header (`alertOffsetWithHeader`) when one
 * exists so the visual gap between header bottom and alert top stays
 * tight; otherwise pushes itself down (`alertOffsetStandalone`) so it
 * doesn't kiss the card top edge.
 */
import type { ReactNode } from 'react';

import { Alert, AlertDescription } from '@/components/base/display/alert';
import { cn } from '@/lib/utils';

import { CARD_BEM, PADDING } from '../smart-card.tokens';
import type { CardAlertVariant, CardPadding } from '../smart-card.types';

interface AlertSlotProps {
	alert: ReactNode | string;
	alertVariant: CardAlertVariant;
	hasHeader: boolean;
	padding: CardPadding;
}

export function SmartCardAlert({
	alert,
	alertVariant,
	hasHeader,
	padding,
}: AlertSlotProps) {
	const tokens = PADDING[padding];

	return (
		<div
			className={cn(
				CARD_BEM.alert,
				tokens.alertX,
				hasHeader ? tokens.alertOffsetWithHeader : tokens.alertOffsetStandalone,
			)}
		>
			<Alert variant={alertVariant}>
				<AlertDescription>{alert}</AlertDescription>
			</Alert>
		</div>
	);
}
