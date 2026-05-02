import type { StringsProp } from '@/lib/strings';

import type { DarkInfoPanelStrings } from '../dark-surfaces.strings';

export interface PanelLineItem {
    label: string;
    value: string;
    highlight?: boolean;
}

export interface DarkInfoPanelProps {
    /** Header title. Defaults to `strings.defaultTitle`. */
    title?: string;
    items: PanelLineItem[];
    totalLabel?: string;
    totalValue?: string;
    defaultOpen?: boolean;
    className?: string;
    strings?: StringsProp<DarkInfoPanelStrings>;
}
