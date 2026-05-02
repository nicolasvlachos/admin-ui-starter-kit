import { useCallback, useEffect, useState } from 'react';

import {
	UploadTray,
	type UploadItem,
} from '@/components/base/forms/fields';

import { Col, PreviewPage, PreviewSection } from '../../PreviewLayout';

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
	if (bytes < 1024 ** 3) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
	return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

const INITIAL: UploadItem[] = [
	{ id: 'seed-1', name: 'spec.pdf', size: '420 KB', status: 'done', progress: 100 },
	{ id: 'seed-2', name: 'photo-large.png', size: '2.4 MB', status: 'error', progress: 65, error: 'Upload failed. Please try again.' },
];

export default function UploadTrayPage() {
	const [items, setItems] = useState<UploadItem[]>(INITIAL);

	// Simulate upload progress for any 'uploading' items.
	useEffect(() => {
		const id = setInterval(() => {
			setItems((prev) =>
				prev.map((item) => {
					if (item.status !== 'uploading') return item;
					const next = Math.min(100, (item.progress ?? 0) + Math.random() * 18 + 4);
					if (next >= 100) {
						return { ...item, progress: 100, status: 'done' as const };
					}
					return { ...item, progress: next };
				}),
			);
		}, 600);
		return () => clearInterval(id);
	}, []);

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

	const onRetry = useCallback((id: string) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === id
					? { ...item, status: 'uploading' as const, progress: 0, error: undefined }
					: item,
			),
		);
	}, []);

	const onRemove = useCallback((id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	}, []);

	const onClearAll = useCallback(() => setItems([]), []);

	return (
		<PreviewPage
			title="Base · Forms · Upload tray"
			description="Drag-drop area + per-file progress rows + summary toolbar (counters + Clear all). Composes Dropzone + UploadProgressList. Framework-agnostic — the consumer drives the actual transfer; the library surfaces the UX."
		>
			<PreviewSection title="Live tray with simulated upload" span="full">
				<Col className="max-w-2xl">
					<UploadTray
						items={items}
						onAddFiles={onAddFiles}
						onRetry={onRetry}
						onRemove={onRemove}
						onClearAll={items.length > 0 ? onClearAll : undefined}
						dropzone={{
							multiple: true,
							strings: {
								instruction: 'Drag files here or click to browse',
								helper: 'Up to 10 MB each — images, PDFs, archives',
							},
						}}
					/>
				</Col>
			</PreviewSection>

			<PreviewSection title="Empty state — only the dropzone is shown" span="full">
				<Col className="max-w-2xl">
					<UploadTray items={[]} onAddFiles={() => {}} />
				</Col>
			</PreviewSection>

			<PreviewSection title="Localized — French strings everywhere" span="full">
				<Col className="max-w-2xl">
					<UploadTray
						items={items.slice(0, 2)}
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
				</Col>
			</PreviewSection>
		</PreviewPage>
	);
}
