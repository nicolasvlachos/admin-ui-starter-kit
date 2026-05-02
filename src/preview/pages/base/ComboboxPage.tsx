import { useMemo, useState } from 'react';
import { EnhancedCombobox, EnhancedComboboxMultiple } from '@/components/base/combobox';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

type Fruit = { id: string; name: string; group?: string };

const ALL: Fruit[] = [
	{ id: 'apple', name: 'Apple', group: 'Pomes' },
	{ id: 'pear', name: 'Pear', group: 'Pomes' },
	{ id: 'banana', name: 'Banana', group: 'Tropical' },
	{ id: 'mango', name: 'Mango', group: 'Tropical' },
	{ id: 'kiwi', name: 'Kiwi', group: 'Tropical' },
	{ id: 'cherry', name: 'Cherry', group: 'Stone' },
	{ id: 'peach', name: 'Peach', group: 'Stone' },
	{ id: 'plum', name: 'Plum', group: 'Stone' },
];

export default function ComboboxPage() {
	const [search, setSearch] = useState('');
	const [searchM, setSearchM] = useState('');
	const [searchApply, setSearchApply] = useState('');
	const [searchClose, setSearchClose] = useState('');
	const [selected, setSelected] = useState<Fruit | null>(null);
	const [selectedMany, setSelectedMany] = useState<Fruit[]>([]);
	const [selectedApply, setSelectedApply] = useState<Fruit[]>([]);
	const [selectedClose, setSelectedClose] = useState<Fruit[]>([]);

	const filtered = useMemo(() => {
		const q = search.toLowerCase().trim();
		if (!q) return ALL;
		return ALL.filter((f) => f.name.toLowerCase().includes(q));
	}, [search]);

	const filteredM = useMemo(() => {
		const q = searchM.toLowerCase().trim();
		if (!q) return ALL;
		return ALL.filter((f) => f.name.toLowerCase().includes(q));
	}, [searchM]);

	const filteredApply = useMemo(() => {
		const q = searchApply.toLowerCase().trim();
		if (!q) return ALL;
		return ALL.filter((f) => f.name.toLowerCase().includes(q));
	}, [searchApply]);

	const filteredClose = useMemo(() => {
		const q = searchClose.toLowerCase().trim();
		if (!q) return ALL;
		return ALL.filter((f) => f.name.toLowerCase().includes(q));
	}, [searchClose]);

	return (
		<PreviewPage title="Base · Combobox" description="EnhancedCombobox & EnhancedComboboxMultiple — search, group, override strings.">
			<PreviewSection title="Single — basic">
				<Col>
					<EnhancedCombobox
						items={filtered}
						searchValue={search}
						onSearchValueChange={setSearch}
						selectedValue={selected}
						onSelectedValueChange={setSelected}
						getItemLabel={(f) => f.name}
						getItemKey={(f) => f.id}
						minSearchLength={0}
					/>
					<div className="text-xs text-muted-foreground">value: {selected?.name ?? '—'}</div>
				</Col>
			</PreviewSection>

			<PreviewSection title="Multiple — grouped + custom strings">
				<Col>
					<EnhancedComboboxMultiple
						items={filteredM}
						searchValue={searchM}
						onSearchValueChange={setSearchM}
						selectedValues={selectedMany}
						onSelectedValuesChange={setSelectedMany}
						getItemLabel={(f) => f.name}
						getItemKey={(f) => f.id}
						getItemGroup={(f) => f.group ?? 'Other'}
						minSearchLength={0}
						strings={{ placeholder: 'Find a fruit…', noResults: 'Nothing matches' }}
					/>
					<div className="text-xs text-muted-foreground">
						selected: {selectedMany.map((s) => s.name).join(', ') || '—'}
					</div>
				</Col>
			</PreviewSection>

			<PreviewSection title="Multiple — applyButton (commit on Apply, revert on Cancel/close)">
				<Col>
					<EnhancedComboboxMultiple
						items={filteredApply}
						searchValue={searchApply}
						onSearchValueChange={setSearchApply}
						selectedValues={selectedApply}
						onSelectedValuesChange={setSelectedApply}
						getItemLabel={(f) => f.name}
						getItemKey={(f) => f.id}
						minSearchLength={0}
						applyButton
						strings={{ placeholder: 'Pick fruits…' }}
					/>
					<div className="text-xs text-muted-foreground">
						committed: {selectedApply.map((s) => s.name).join(', ') || '—'}
					</div>
				</Col>
			</PreviewSection>

			<PreviewSection title="Multiple — closeOnSelect={true} (closes after each pick)">
				<Col>
					<EnhancedComboboxMultiple
						items={filteredClose}
						searchValue={searchClose}
						onSearchValueChange={setSearchClose}
						selectedValues={selectedClose}
						onSelectedValuesChange={setSelectedClose}
						getItemLabel={(f) => f.name}
						getItemKey={(f) => f.id}
						minSearchLength={0}
						closeOnSelect
						strings={{ placeholder: 'Add a fruit…' }}
					/>
					<div className="text-xs text-muted-foreground">
						selected: {selectedClose.map((s) => s.name).join(', ') || '—'}
					</div>
				</Col>
			</PreviewSection>
		</PreviewPage>
	);
}
