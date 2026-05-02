import { useState } from 'react';

import { ApiKeyList, type ApiKeyListItem } from '@/components/composed/admin';

import { Col, PreviewPage, PreviewSection } from '../../PreviewLayout';

const initial: ApiKeyListItem[] = [
	{ id: '1', name: 'Production', value: 'AUDO230454*242SDIFPPL' },
	{ id: '2', name: 'Development', value: 'DUILO30454*242SDIFUIP' },
	{ id: '3', name: 'Staging', value: 'IPPODAS230454*242SDI' },
];

export default function ApiKeyListPage() {
	const [keys, setKeys] = useState(initial);
	const [maskedKeys] = useState<ApiKeyListItem[]>([
		{ id: 'live', name: 'Live', value: 'sk_live_3xy4cm9bnrUseEkJ4zDh2A4D', displayValue: 'sk_live_·············2A4D' },
		{ id: 'test', name: 'Test', value: 'sk_test_5j2lpQzKvFnH8PcQ7B3M', displayValue: 'sk_test_·············7B3M' },
	]);

	return (
		<PreviewPage
			title="Composed · Admin · API key list"
			description="Collapsible section with per-row dropdown menu (Copy / Delete) and an optional Add action in the header. Generic enough for any 'named secret list' — service tokens, webhook URLs, deployment hooks. Composes base/cards + base/display/collapsible + base/navigation/ActionMenu + base/copyable."
		>
			<PreviewSection title="Default — visible secrets, callbacks for Add / Delete" span="full">
				<Col className="max-w-sm">
					<ApiKeyList
						items={keys}
						onAdd={() => {
							const id = String(keys.length + 1);
							setKeys((k) => [...k, { id, name: `Key ${id}`, value: `KEY_${id}_${Math.random().toString(36).slice(2, 10).toUpperCase()}` }]);
						}}
						onDelete={(id) => setKeys((k) => k.filter((i) => i.id !== id))}
					/>
				</Col>
			</PreviewSection>

			<PreviewSection title="Masked secrets (Stripe-style)" span="full">
				<Col className="max-w-sm">
					<ApiKeyList items={maskedKeys} title="Stripe API keys" />
				</Col>
			</PreviewSection>

			<PreviewSection title="Empty state" span="full">
				<Col className="max-w-sm">
					<ApiKeyList items={[]} onAdd={() => {}} />
				</Col>
			</PreviewSection>

			<PreviewSection title="Localized strings" span="full">
				<Col className="max-w-sm">
					<ApiKeyList
						items={initial}
						strings={{
							title: 'Clés API',
							addAria: 'Ajouter une clé',
							rowMenuAria: 'Actions de la clé',
							copyMenuItem: 'Copier la clé',
							copiedMenuItem: 'Copié',
							deleteMenuItem: 'Supprimer',
						}}
						onAdd={() => {}}
					/>
				</Col>
			</PreviewSection>
		</PreviewPage>
	);
}
