import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Row, Col } from '../../PreviewLayout';

export function CheckboxExample() {
	const [agreed, setAgreed] = useState(false);
	return (
		<>
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
		</>
	);
}

export function SwitchExample() {
	const [enabled, setEnabled] = useState(true);
	return (
		<>
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
		</>
	);
}

export function RadioGroupExample() {
	const [size, setSize] = useState('md');
	return (
		<>
			<RadioGroup value={size} onValueChange={setSize}>
								<Col>
									{['sm', 'md', 'lg'].map((s) => (
										<label key={s} className="inline-flex items-center gap-2 text-sm">
											<RadioGroupItem value={s} /> {s.toUpperCase()}
										</label>
									))}
								</Col>
							</RadioGroup>
		</>
	);
}

export function SliderExample() {
	const [vol, setVol] = useState<number>(40);
	return (
		<>
			<Slider value={[vol]} onValueChange={(v) => setVol(Array.isArray(v) ? v[0] : v)} />
							<div className="mt-2 text-xs text-muted-foreground">value: {vol}</div>
		</>
	);
}
