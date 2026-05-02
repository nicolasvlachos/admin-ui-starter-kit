import { Search, Mail, Lock } from 'lucide-react';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

export default function InputGroupPage() {
	return (
		<PreviewPage title="UI · Input group" description="Input with leading / trailing add-ons.">
			<PreviewSection title="Leading icon">
				<InputGroup>
					<InputGroupAddon><Search className="size-4" /></InputGroupAddon>
					<InputGroupInput placeholder="Search…" />
				</InputGroup>
			</PreviewSection>

			<PreviewSection title="Trailing addon">
				<InputGroup>
					<InputGroupInput placeholder="username" />
					<InputGroupAddon align="inline-end" className="text-muted-foreground">@example.com</InputGroupAddon>
				</InputGroup>
			</PreviewSection>

			<PreviewSection title="Stacked email + password">
				<Col>
					<InputGroup>
						<InputGroupAddon><Mail className="size-4" /></InputGroupAddon>
						<InputGroupInput type="email" placeholder="email@example.com" />
					</InputGroup>
					<InputGroup>
						<InputGroupAddon><Lock className="size-4" /></InputGroupAddon>
						<InputGroupInput type="password" placeholder="••••••••" />
					</InputGroup>
				</Col>
			</PreviewSection>
		</PreviewPage>
	);
}
