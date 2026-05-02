import type { StringsProp } from '@/lib/strings';

import type { RolePermissionCardStrings } from '../admin.strings';

export interface Permission {
    label: string;
    active: boolean;
}

export interface PermissionSection {
    name: string;
    permissions: Permission[];
}

export interface RolePermissionCardProps {
    roleName: string;
    description?: string;
    memberCount?: number;
    sections: PermissionSection[];
    onEdit?: () => void;
    className?: string;
    strings?: StringsProp<RolePermissionCardStrings>;
}
