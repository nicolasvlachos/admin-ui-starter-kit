import type { MockVoucher } from './types';

export const MOCK_VOUCHERS: MockVoucher[] = [
	{ id: 'v-1', code: 'WELL-1240', categoryId: 'wellness', valueUsd: 100, expiresAt: '2026-12-31' },
	{ id: 'v-2', code: 'FOOD-8821', categoryId: 'food', valueUsd: 75, expiresAt: '2026-09-30' },
	{ id: 'v-3', code: 'ADVN-0099', categoryId: 'adventure', valueUsd: 250, expiresAt: '2027-03-15' },
	{ id: 'v-4', code: 'TECH-4410', categoryId: 'tech', valueUsd: 500, expiresAt: '2026-08-01' },
];
