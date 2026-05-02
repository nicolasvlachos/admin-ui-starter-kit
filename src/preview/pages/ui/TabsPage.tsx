import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function TabsPage() {
	return (
		<PreviewPage title="UI · Tabs" description="Tab list with content panels.">
			<PreviewSection title="Default" span="full">
				<Tabs defaultValue="overview">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="activity">Activity</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
					</TabsList>
					<TabsContent value="overview" className="mt-3 text-sm">Overview panel content.</TabsContent>
					<TabsContent value="activity" className="mt-3 text-sm">Activity panel content.</TabsContent>
					<TabsContent value="settings" className="mt-3 text-sm">Settings panel content.</TabsContent>
				</Tabs>
			</PreviewSection>
		</PreviewPage>
	);
}
