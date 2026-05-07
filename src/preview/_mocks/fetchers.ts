import { MOCK_CUSTOMERS } from './customers';
import { MOCK_ORDERS } from './orders';
import { MOCK_VOUCHERS } from './vouchers';
import { MOCK_TEAM } from './team';
import type { MockCustomer, MockOrder, MockTeamMember, MockVoucher } from './types';

export function mockDelay(ms = 280): Promise<void> {
	return new Promise((res) => window.setTimeout(res, ms));
}

export interface MockSearchResult {
	id: string;
	type: 'customer' | 'order' | 'voucher' | 'team';
	title: string;
	subtitle: string;
}

function matchesQuery(haystacks: string[], query: string): boolean {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	return haystacks.some((h) => h.toLowerCase().includes(q));
}

export async function mockSearch(query: string): Promise<MockSearchResult[]> {
	await mockDelay();

	const customers = MOCK_CUSTOMERS
		.filter((c) => matchesQuery([c.name, c.email, c.city, c.country], query))
		.map<MockSearchResult>((c) => ({ id: c.id, type: 'customer', title: c.name, subtitle: `${c.email} — ${c.city}` }));

	const orders = MOCK_ORDERS
		.filter((o) => matchesQuery([o.number, o.status], query))
		.map<MockSearchResult>((o) => ({ id: o.id, type: 'order', title: o.number, subtitle: `${o.status} — $${o.totalUsd.toLocaleString()}` }));

	const vouchers = MOCK_VOUCHERS
		.filter((v) => matchesQuery([v.code, v.categoryId], query))
		.map<MockSearchResult>((v) => ({ id: v.id, type: 'voucher', title: v.code, subtitle: `${v.categoryId} — $${v.valueUsd}` }));

	const team = MOCK_TEAM
		.filter((t) => matchesQuery([t.name, t.email, t.role], query))
		.map<MockSearchResult>((t) => ({ id: t.id, type: 'team', title: t.name, subtitle: `${t.role} — ${t.email}` }));

	return [...customers, ...orders, ...vouchers, ...team];
}

export async function mockListCustomers(): Promise<MockCustomer[]> {
	await mockDelay();
	return MOCK_CUSTOMERS;
}

export async function mockListOrders(): Promise<MockOrder[]> {
	await mockDelay();
	return MOCK_ORDERS;
}

export async function mockListVouchers(): Promise<MockVoucher[]> {
	await mockDelay();
	return MOCK_VOUCHERS;
}

export async function mockListTeam(): Promise<MockTeamMember[]> {
	await mockDelay();
	return MOCK_TEAM;
}
