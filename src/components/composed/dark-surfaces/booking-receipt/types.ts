import type { StringsProp } from '@/lib/strings';

import type { BookingReceiptDarkStrings } from '../dark-surfaces.strings';

export interface BookingReceiptDetail {
    label: string;
    value: string;
}

export interface BookingReceiptDarkProps {
    referenceCode?: string;
    /** Status pill text. Defaults to `strings.statusConfirmed`. */
    status?: string;
    details?: BookingReceiptDetail[];
    amountPaid: string;
    className?: string;
    strings?: StringsProp<BookingReceiptDarkStrings>;
}
