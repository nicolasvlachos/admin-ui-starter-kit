import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function UiCardPage() {
	return (
		<PreviewPage title="UI · Card" description="shadcn primitive card with header / title / description / content / footer.">
			<PreviewSection title="Default">
				<Card>
					<CardHeader>
						<CardTitle>Card title</CardTitle>
						<CardDescription>A short description goes here.</CardDescription>
					</CardHeader>
					<CardContent>Body content area.</CardContent>
					<CardFooter className="text-xs text-muted-foreground">Footer note</CardFooter>
				</Card>
			</PreviewSection>

			<PreviewSection title="Compact (size=sm)">
				<Card size="sm">
					<CardHeader>
						<CardTitle>Compact</CardTitle>
					</CardHeader>
					<CardContent>Smaller padding & gap.</CardContent>
				</Card>
			</PreviewSection>
		</PreviewPage>
	);
}
