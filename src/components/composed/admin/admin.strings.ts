/**
 * Default user-facing strings for the `composed/admin` family.
 *
 * Consumers wire backend i18n at the call site:
 *
 *   <InventoryLevelCard strings={{ statusInStock: t('inv.in_stock') }} … />
 */

export interface InventoryLevelCardStrings {
	/** Status pill label when stock > reorderLevel. */
	statusInStock: string;
	/** Status pill label when stock <= reorderLevel and > critical. */
	statusLowStock: string;
	/** Status pill label when stock is at or below the critical threshold. */
	statusCritical: string;
	/** Inline label preceding the variant value (e.g. "Variant: Large"). */
	variantLabel: string;
	/** Caption below the stock total (e.g. "units available"). */
	unitsAvailable: string;
	/** Inline label preceding the reorder level (e.g. "Reorder at:"). */
	reorderAtLabel: string;
	/** Inline label preceding the last-restocked date (e.g. "Last restocked:"). */
	lastRestockedLabel: string;
}

export const defaultInventoryLevelCardStrings: InventoryLevelCardStrings = {
	statusInStock: 'In Stock',
	statusLowStock: 'Low Stock',
	statusCritical: 'Critical',
	variantLabel: 'Variant',
	unitsAvailable: 'units available',
	reorderAtLabel: 'Reorder at',
	lastRestockedLabel: 'Last restocked',
};

export interface RolePermissionCardStrings {
	/** Edit-role button label. */
	editRole: string;
	/** Format string for the member-count badge. Receives the count. */
	formatMemberCount: (count: number) => string;
}

export const defaultRolePermissionCardStrings: RolePermissionCardStrings = {
	editRole: 'Edit Role',
	formatMemberCount: (count) => `${count} members`,
};
