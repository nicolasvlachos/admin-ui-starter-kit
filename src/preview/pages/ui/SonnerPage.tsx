import { toast } from 'sonner';
import { Toaster } from '@/components/base/toaster';
import { Button } from '@/components/ui/button';
import { PreviewPage, PreviewSection, Row } from '../../PreviewLayout';

export default function SonnerPage() {
	return (
		<PreviewPage title="UI · Sonner toaster" description="Toast notifications.">
			<Toaster />
			<PreviewSection title="Trigger toasts" span="full">
				<Row>
					<Button onClick={() => toast('Default toast')}>Default</Button>
					<Button variant="outline" onClick={() => toast.success('Saved successfully')}>Success</Button>
					<Button variant="outline" onClick={() => toast.warning('Heads up')}>Warning</Button>
					<Button variant="destructive" onClick={() => toast.error('Failed to save')}>Error</Button>
					<Button variant="secondary" onClick={() => toast.info('FYI')}>Info</Button>
					<Button variant="ghost" onClick={() => {
						const id = toast.loading('Working…');
						setTimeout(() => toast.success('Done', { id }), 1500);
					}}>Loading → success</Button>
				</Row>
			</PreviewSection>
		</PreviewPage>
	);
}
