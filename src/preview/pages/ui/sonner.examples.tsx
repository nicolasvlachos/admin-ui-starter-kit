import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Row } from '../../PreviewLayout';

export function TriggerToasts() {
	return (
		<>
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
		</>
	);
}
