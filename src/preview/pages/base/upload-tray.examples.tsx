import { useCallback, useState } from 'react';
import {
	UploadTray,
	type UploadItem,
} from '@/components/base/forms/fields';

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
	if (bytes < 1024 ** 3) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
	return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

const INITIAL: UploadItem[] = [
	{ id: 'seed-1', name: 'spec.pdf', size: '420 KB', status: 'done', progress: 100 },
	{ id: 'seed-2', name: 'photo-large.png', size: '2.4 MB', status: 'error', progress: 65, error: 'Upload failed. Please try again.' },
	{ id: 'seed-3', name: 'archive.zip', size: '8.1 MB', status: 'uploading', progress: 42 },
];

export function Default() {
	const [items, setItems] = useState<UploadItem[]>([]);
	const onAddFiles = useCallback((files: File[]) => {
		const next: UploadItem[] = files.map((f) => ({
			id: `${Date.now()}-${f.name}`,
			name: f.name,
			size: formatBytes(f.size),
			progress: 0,
			status: 'uploading' as const,
		}));
		setItems((prev) => [...prev, ...next]);
	}, []);
	return (
		<div className="w-full max-w-2xl">
			<UploadTray items={items} onAddFiles={onAddFiles} />
		</div>
	);
}

export function EmptyDropzoneOnly() {
	return (
		<div className="w-full max-w-2xl">
			<UploadTray items={[]} onAddFiles={() => {}} />
		</div>
	);
}

export function MixedItemStates() {
	const [items, setItems] = useState<UploadItem[]>(INITIAL);
	return (
		<div className="w-full max-w-2xl">
			<UploadTray
				items={items}
				onAddFiles={() => {}}
				onRetry={(id) =>
					setItems((prev) =>
						prev.map((it) => (it.id === id ? { ...it, status: 'uploading', progress: 0, error: undefined } : it)),
					)
				}
				onRemove={(id) => setItems((prev) => prev.filter((it) => it.id !== id))}
				onClearAll={() => setItems([])}
			/>
		</div>
	);
}

export function LiveSimulatedUpload() {
	const [items, setItems] = useState<UploadItem[]>([]);
	const onAddFiles = useCallback((files: File[]) => {
		const next: UploadItem[] = files.map((f) => ({
			id: `${Date.now()}-${f.name}`,
			name: f.name,
			size: formatBytes(f.size),
			progress: 0,
			status: 'uploading' as const,
		}));
		setItems((prev) => [...prev, ...next]);
	}, []);
	return (
		<div className="w-full max-w-2xl">
			<UploadTray
				items={items}
				onAddFiles={onAddFiles}
				onRemove={(id) => setItems((prev) => prev.filter((it) => it.id !== id))}
				onClearAll={items.length > 0 ? () => setItems([]) : undefined}
				dropzone={{
					multiple: true,
					strings: {
						instruction: 'Drag files here or click to browse',
						helper: 'Up to 10 MB each — images, PDFs, archives',
					},
				}}
			/>
		</div>
	);
}

export function LocalisedFrench() {
	return (
		<div className="w-full max-w-2xl">
			<UploadTray
				items={INITIAL.slice(0, 2)}
				onAddFiles={() => {}}
				onRetry={() => {}}
				onRemove={() => {}}
				onClearAll={() => {}}
				strings={{
					heading: 'Téléversements',
					completedLabel: 'Terminés',
					failedLabel: 'Échoués',
					uploadingLabel: 'En cours',
					queuedLabel: 'En attente',
					clearAll: 'Tout effacer',
				}}
				listStrings={{
					queued: 'En attente',
					uploading: 'En cours',
					done: 'Terminé',
					error: 'Échoué',
					cancelled: 'Annulé',
					cancel: 'Annuler',
					retry: 'Réessayer',
					remove: 'Supprimer',
				}}
				dropzone={{
					strings: {
						instruction: 'Glissez vos fichiers ou cliquez',
						helper: 'PDF, images, archives — 10 Mo maximum',
						dragOver: 'Relâchez pour téléverser',
					},
				}}
			/>
		</div>
	);
}
