import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { PreviewPage, PreviewSection, Row } from '../../PreviewLayout';

export default function ButtonPage() {
	return (
		<PreviewPage title="UI · Button" description="shadcn primitive button — variants, sizes, button group.">
			<PreviewSection title="Variants" span="full">
				<Row>
					<Button>default</Button>
					<Button variant="outline">outline</Button>
					<Button variant="secondary">secondary</Button>
					<Button variant="ghost">ghost</Button>
					<Button variant="destructive">destructive</Button>
					<Button variant="link">link</Button>
				</Row>
			</PreviewSection>

			<PreviewSection title="Sizes" span="full">
				<Row>
					<Button size="xs">xs</Button>
					<Button size="sm">sm</Button>
					<Button size="default">default</Button>
					<Button size="lg">lg</Button>
				</Row>
			</PreviewSection>

			<PreviewSection title="Button group">
				<ButtonGroup>
					<Button variant="outline">Day</Button>
					<Button variant="outline">Week</Button>
					<Button variant="outline">Month</Button>
				</ButtonGroup>
			</PreviewSection>
		</PreviewPage>
	);
}
