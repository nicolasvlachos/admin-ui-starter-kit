import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Col } from '../../PreviewLayout';

export function InputExample() {
	const [text, setText] = useState('');
	return (
		<>
			<Col>
								<Input placeholder="Type something…" value={text} onChange={(e) => setText(e.target.value)} />
								<Input disabled placeholder="Disabled" />
								<Input aria-invalid placeholder="Invalid state" />
								<Input type="email" placeholder="email@example.com" />
							</Col>
		</>
	);
}

export function TextareaExample() {
	const [body, setBody] = useState('');
	return (
		<>
			<Textarea placeholder="Multi-line input…" value={body} onChange={(e) => setBody(e.target.value)} />
		</>
	);
}

export function SelectExample() {
	const [fruit, setFruit] = useState<string | null>(null);
	return (
		<>
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
		</>
	);
}
