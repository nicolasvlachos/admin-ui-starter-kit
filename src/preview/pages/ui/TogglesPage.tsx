import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { PreviewPage, PreviewSection, Row, Col } from '../../PreviewLayout';

export default function TogglesPage() {
	const [agreed, setAgreed] = useState(false);
	const [enabled, setEnabled] = useState(true);
	const [size, setSize] = useState('md');
	const [vol, setVol] = useState<number>(40);

	return (
		<PreviewPage title="UI · Toggles" description="Checkbox, Switch, RadioGroup, Slider primitives.">
			<PreviewSection title="Checkbox">
				<Row>
					<label className="inline-flex items-center gap-2 text-sm">
						<Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} /> I agree
					</label>
					<label className="inline-flex items-center gap-2 text-sm opacity-50">
						<Checkbox disabled /> Disabled
					</label>
					<label className="inline-flex items-center gap-2 text-sm">
						<Checkbox indeterminate /> Indeterminate
					</label>
				</Row>
			</PreviewSection>

			<PreviewSection title="Switch">
				<Row>
					<label className="inline-flex items-center gap-2 text-sm">
						<Switch checked={enabled} onCheckedChange={setEnabled} />
						{enabled ? 'On' : 'Off'}
					</label>
					<label className="inline-flex items-center gap-2 text-sm">
						<Switch size="sm" defaultChecked />
						sm
					</label>
				</Row>
			</PreviewSection>

			<PreviewSection title="RadioGroup">
				<RadioGroup value={size} onValueChange={setSize}>
					<Col>
						{['sm', 'md', 'lg'].map((s) => (
							<label key={s} className="inline-flex items-center gap-2 text-sm">
								<RadioGroupItem value={s} /> {s.toUpperCase()}
							</label>
						))}
					</Col>
				</RadioGroup>
			</PreviewSection>

			<PreviewSection title="Slider">
				<Slider value={[vol]} onValueChange={(v) => setVol(Array.isArray(v) ? v[0] : v)} />
				<div className="mt-2 text-xs text-muted-foreground">value: {vol}</div>
			</PreviewSection>
		</PreviewPage>
	);
}
