import type { StringsProp } from '@/lib/strings';
import type { OutstandingBalanceCardStrings } from '../dark-surfaces.strings';

export interface OutstandingBalanceCardProps {
    amount: string;
    amountColor?: string;
    dueDate: string;
    customer: string;
    onSendReminder?: () => void;
    onRecordPayment?: () => void;
    className?: string;
    strings?: StringsProp<OutstandingBalanceCardStrings>;
}
