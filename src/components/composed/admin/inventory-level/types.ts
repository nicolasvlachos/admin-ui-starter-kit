import type { StringsProp } from '@/lib/strings';

import type { InventoryLevelCardStrings } from '../admin.strings';

export interface InventoryLevelCardProps {
    productName: string;
    variant?: string;
    stock: number;
    reorderLevel: number;
    maxStock: number;
    lastRestocked?: string;
    className?: string;
    strings?: StringsProp<InventoryLevelCardStrings>;
}
