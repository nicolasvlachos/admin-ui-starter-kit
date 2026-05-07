import { useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function SingleToggle() {
	const [pressed, setPressed] = useState(false);
	return (
		<>
			<Toggle pressed={pressed} onPressedChange={setPressed}>
								<Bold />
							</Toggle>
		</>
	);
}

export function MultipleSelectGroup() {
	const [marks, setMarks] = useState<string[]>(['bold']);
	return (
		<>
			<ToggleGroup value={marks} onValueChange={setMarks}>
								<ToggleGroupItem value="bold"><Bold /></ToggleGroupItem>
								<ToggleGroupItem value="italic"><Italic /></ToggleGroupItem>
								<ToggleGroupItem value="underline"><Underline /></ToggleGroupItem>
								<ToggleGroupItem value="left"><AlignLeft /></ToggleGroupItem>
								<ToggleGroupItem value="center"><AlignCenter /></ToggleGroupItem>
								<ToggleGroupItem value="right"><AlignRight /></ToggleGroupItem>
							</ToggleGroup>
		</>
	);
}
