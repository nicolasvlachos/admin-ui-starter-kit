import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

export default function InputsPage() {
	const [text, setText] = useState('');
	const [body, setBody] = useState('');
	const [fruit, setFruit] = useState<string | null>(null);

	return (
		<PreviewPage title="UI · Inputs" description="Input, Textarea, Select primitives.">
			<PreviewSection title="Input">
				<Col>
					<Input placeholder="Type something…" value={text} onChange={(e) => setText(e.target.value)} />
					<Input disabled placeholder="Disabled" />
					<Input aria-invalid placeholder="Invalid state" />
					<Input type="email" placeholder="email@example.com" />
				</Col>
			</PreviewSection>

			<PreviewSection title="Textarea">
				<Textarea placeholder="Multi-line input…" value={body} onChange={(e) => setBody(e.target.value)} />
			</PreviewSection>

			<PreviewSection title="Select">
				<Select value={fruit} onValueChange={setFruit}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Pick a fruit" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="apple">Apple</SelectItem>
						<SelectItem value="banana">Banana</SelectItem>
						<SelectItem value="cherry">Cherry</SelectItem>
						<SelectItem value="date">Date</SelectItem>
					</SelectContent>
				</Select>
				<div className="mt-2 text-xs text-muted-foreground">value: {fruit || '—'}</div>
			</PreviewSection>
		</PreviewPage>
	);
}
