import { Toaster } from '@/components/base/toaster';
import { Copyable } from '@/components/base/copyable';
import { MOCK_CUSTOMERS, MOCK_ORDERS } from '@/preview/_mocks';

export function Default() {
	return (
		<>
			<Toaster />
			<Copyable value="GCT-A4B7-C9E2" />
		</>
	);
}

export function Mono() {
	return (
		<>
			<Toaster />
			<Copyable value="b3a8a5b6-9b0a-4f01-8b46-92aa1d6a1f7d" mono />
		</>
	);
}

export function MonoTruncate() {
	return (
		<>
			<Toaster />
			<div className="max-w-xs">
				<Copyable value="b3a8a5b6-9b0a-4f01-8b46-92aa1d6a1f7d-extra-long-id" mono truncate />
			</div>
		</>
	);
}

export function CustomDisplayValue() {
	return (
		<>
			<Toaster />
			<Copyable
				value="hello@example.com"
				displayValue={<span className="text-primary underline underline-offset-2">hello@example.com</span>}
			/>
		</>
	);
}

export function CustomToastMessage() {
	return (
		<>
			<Toaster />
			<div className="flex flex-col gap-2">
				<Copyable value="42" successMessage="The answer was copied!" />
				<div className="text-xs text-muted-foreground">Click to see the custom toast.</div>
			</div>
		</>
	);
}

export function RealisticOrderRow() {
	const order = MOCK_ORDERS[0];
	const customer = MOCK_CUSTOMERS.find((c) => c.id === order.customerId)!;
	return (
		<>
			<Toaster />
			<div className="flex flex-col gap-3 rounded-md border bg-card p-4 w-full max-w-md">
				<div className="flex items-center justify-between">
					<span className="text-xs uppercase text-muted-foreground">Order number</span>
					<Copyable value={order.number} mono successMessage={`Copied ${order.number}`} />
				</div>
				<div className="flex items-center justify-between">
					<span className="text-xs uppercase text-muted-foreground">Customer email</span>
					<Copyable value={customer.email} />
				</div>
			</div>
		</>
	);
}

export function CustomerListWithCopyableEmails() {
	return (
		<>
			<Toaster />
			<div className="flex flex-col gap-1 w-full max-w-md">
				{MOCK_CUSTOMERS.slice(0, 4).map((c) => (
					<div key={c.id} className="flex items-center justify-between border-b border-border py-1.5 text-sm">
						<span>{c.name}</span>
						<Copyable value={c.email} />
					</div>
				))}
			</div>
		</>
	);
}
