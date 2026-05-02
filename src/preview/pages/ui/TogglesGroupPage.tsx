import { useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function TogglesGroupPage() {
	const [pressed, setPressed] = useState(false);
	const [marks, setMarks] = useState<string[]>(['bold']);

	return (
		<PreviewPage title="UI · Toggle + ToggleGroup" description="Single toggle + radio/multiple group.">
			<PreviewSection title="Single toggle">
				<Toggle pressed={pressed} onPressedChange={setPressed}>
					<Bold />
				</Toggle>
			</PreviewSection>

			<PreviewSection title="Multiple-select group">
				<ToggleGroup value={marks} onValueChange={setMarks}>
					<ToggleGroupItem value="bold"><Bold /></ToggleGroupItem>
					<ToggleGroupItem value="italic"><Italic /></ToggleGroupItem>
					<ToggleGroupItem value="underline"><Underline /></ToggleGroupItem>
					<ToggleGroupItem value="left"><AlignLeft /></ToggleGroupItem>
					<ToggleGroupItem value="center"><AlignCenter /></ToggleGroupItem>
					<ToggleGroupItem value="right"><AlignRight /></ToggleGroupItem>
				</ToggleGroup>
			</PreviewSection>
		</PreviewPage>
	);
}
