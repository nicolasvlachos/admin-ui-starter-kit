/**
 * RolePermissionCard — admin surface for a role with description, member
 * count badge, grouped permission states (success dot vs muted), and an
 * optional Edit button.
 *
 * Strings overridable via `strings` prop. `strings.formatMemberCount` is a
 * function so consumers can localise pluralisation rules.
 */
import { Badge } from '@/components/base/badge/badge';
import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards/smart-card';
import { Text } from '@/components/typography/text';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';

import { defaultRolePermissionCardStrings } from '../admin.strings';
import type { RolePermissionCardProps } from './types';

export function RolePermissionCard({
    roleName,
    description,
    memberCount,
    sections,
    onEdit,
    className,
    strings: stringsProp,
}: RolePermissionCardProps) {
    const strings = useStrings(defaultRolePermissionCardStrings, stringsProp);
    return (
        <SmartCard
            title={roleName}
            description={description}
            headerEnd={memberCount !== undefined && <Badge variant="info">{strings.formatMemberCount(memberCount)}</Badge>}
            className={className}
        >
            <div className="mt-5 space-y-4">
                {sections.map((section) => (
                    <div key={section.name}>
                        <Text size="xs" weight="medium" className="uppercase tracking-wider text-muted-foreground">
                            {section.name}
                        </Text>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {section.permissions.map((perm) => (
                                <div key={perm.label} className="flex items-center gap-1.5">
                                    <span className={cn('size-2.5 rounded-full', perm.active ? 'bg-success' : 'bg-muted')} />
                                    <Text size="xs" className={perm.active ? 'text-foreground' : 'text-muted-foreground'}>
                                        {perm.label}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {!!onEdit && (
                <Button variant="light" className="mt-5 rounded-full" onClick={onEdit}>
                    <Pencil className="mr-1.5 size-3.5" />
                    {strings.editRole}
                </Button>
              )}
        </SmartCard>
    );
}

RolePermissionCard.displayName = 'RolePermissionCard';
