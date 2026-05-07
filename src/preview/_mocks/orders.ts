import type { MockOrder } from './types';

export const MOCK_ORDERS: MockOrder[] = [
	{ id: 'o-1', number: 'ORD-2026-0412', customerId: 'c-1', status: 'pending', totalUsd: 2_450, itemCount: 3, createdAt: '2026-04-12T09:14:00Z' },
	{ id: 'o-2', number: 'ORD-2026-0418', customerId: 'c-4', status: 'paid', totalUsd: 8_900, itemCount: 12, createdAt: '2026-04-18T14:02:00Z' },
	{ id: 'o-3', number: 'ORD-2026-0421', customerId: 'c-2', status: 'shipped', totalUsd: 320, itemCount: 1, createdAt: '2026-04-21T11:48:00Z' },
	{ id: 'o-4', number: 'ORD-2026-0425', customerId: 'c-8', status: 'paid', totalUsd: 5_640, itemCount: 7, createdAt: '2026-04-25T16:30:00Z' },
	{ id: 'o-5', number: 'ORD-2026-0429', customerId: 'c-3', status: 'cancelled', totalUsd: 980, itemCount: 2, createdAt: '2026-04-29T10:11:00Z' },
	{ id: 'o-6', number: 'ORD-2026-0501', customerId: 'c-6', status: 'pending', totalUsd: 1_280, itemCount: 4, createdAt: '2026-05-01T08:22:00Z' },
];
