export interface MockCustomer {
	id: string;
	name: string;
	email: string;
	avatarSeed: string;
	city: string;
	country: string;
	totalSpentUsd: number;
}

export interface MockOrder {
	id: string;
	number: string;
	customerId: string;
	status: 'pending' | 'paid' | 'shipped' | 'cancelled';
	totalUsd: number;
	itemCount: number;
	createdAt: string;
}

export interface MockVoucher {
	id: string;
	code: string;
	categoryId: 'wellness' | 'food' | 'adventure' | 'tech';
	valueUsd: number;
	expiresAt: string;
}

export interface MockTeamMember {
	id: string;
	name: string;
	email: string;
	role: 'owner' | 'admin' | 'manager' | 'support';
	avatarSeed: string;
}
