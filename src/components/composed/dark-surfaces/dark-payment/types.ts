import type { StringsProp } from '@/lib/strings';

import type { DarkPaymentConfirmationStrings } from '../dark-surfaces.strings';

export interface PaymentDetail {
    label: string;
    value: string;
}

export interface DarkPaymentConfirmationProps {
    amount: string;
    details?: PaymentDetail[];
    helpText?: string;
    onHelp?: () => void;
    className?: string;
    strings?: StringsProp<DarkPaymentConfirmationStrings>;
}
