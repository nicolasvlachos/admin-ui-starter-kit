// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { UploadTray } from './upload-tray';
import type { UploadItem } from './upload-progress-list';

afterEach(() => {
	cleanup();
});

const items: UploadItem[] = [
	{ id: 'a', name: 'photo.png', size: '2.4 MB', status: 'done', progress: 100 },
	{ id: 'b', name: 'doc.pdf', size: '180 KB', status: 'uploading', progress: 42 },
	{ id: 'c', name: 'big.zip', size: '120 MB', status: 'error', progress: 30, error: 'Network failed' },
	{ id: 'd', name: 'movie.mp4', size: '900 MB', status: 'queued' },
];

describe('UploadTray', () => {
	it('renders the dropzone', () => {
		render(<UploadTray items={[]} onAddFiles={() => {}} />);
		expect(screen.getByText(/drag files here/i)).toBeInTheDocument();
	});

	it('hides the toolbar / progress list when items is empty', () => {
		render(<UploadTray items={[]} onAddFiles={() => {}} />);
		expect(screen.queryByText('Upload progress')).not.toBeInTheDocument();
	});

	it('renders status counters that match the items array', () => {
		render(<UploadTray items={items} onAddFiles={() => {}} />);
		expect(screen.getByText('Completed: 1')).toBeInTheDocument();
		expect(screen.getByText('Uploading: 1')).toBeInTheDocument();
		expect(screen.getByText('Failed: 1')).toBeInTheDocument();
		expect(screen.getByText('Queued: 1')).toBeInTheDocument();
	});

	it('hides the Clear all button when onClearAll is omitted', () => {
		render(<UploadTray items={items} onAddFiles={() => {}} />);
		expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument();
	});

	it('shows Clear all and fires the callback when supplied', () => {
		const onClearAll = vi.fn();
		render(
			<UploadTray items={items} onAddFiles={() => {}} onClearAll={onClearAll} />,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
		expect(onClearAll).toHaveBeenCalledTimes(1);
	});

	it('overrides every toolbar label via the strings prop', () => {
		render(
			<UploadTray
				items={items}
				onAddFiles={() => {}}
				strings={{
					heading: 'Téléversement',
					completedLabel: 'Terminés',
					failedLabel: 'Échoués',
					uploadingLabel: 'En cours',
					queuedLabel: 'En attente',
					clearAll: 'Tout effacer',
				}}
				onClearAll={() => {}}
			/>,
		);
		expect(screen.getByText('Téléversement')).toBeInTheDocument();
		expect(screen.getByText(/Terminés:/)).toBeInTheDocument();
		expect(screen.getByText(/Échoués:/)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Tout effacer' })).toBeInTheDocument();
	});

	it('forwards the dropzone strings prop', () => {
		render(
			<UploadTray
				items={[]}
				onAddFiles={() => {}}
				dropzone={{ strings: { instruction: 'Glissez ou cliquez', helper: 'PDF jusqu’à 10 Mo' } }}
			/>,
		);
		expect(screen.getByText('Glissez ou cliquez')).toBeInTheDocument();
		expect(screen.getByText('PDF jusqu’à 10 Mo')).toBeInTheDocument();
	});

	it('only emits onAddFiles when files are supplied', () => {
		const onAddFiles = vi.fn();
		render(<UploadTray items={[]} onAddFiles={onAddFiles} />);
		// onAddFiles should not have been called on mount
		expect(onAddFiles).not.toHaveBeenCalled();
	});
});
