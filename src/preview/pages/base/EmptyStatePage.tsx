import { ListPlus, RefreshCw, Upload } from 'lucide-react';

import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards';
import {
	DocumentStackIllustration,
	EmptyState,
	InboxCleanIllustration,
	SearchGlassIllustration,
	StackedCardsIllustration,
	UsersCircleIllustration,
} from '@/components/base/display/empty-state';
import { TextLink } from '@/components/typography';

import { Col, PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function EmptyStatePage() {
	return (
		<PreviewPage
			title="Base · Empty state"
			description="Adaptive zero-data surface. Wrap with the right illustration per resource: products, users, search results, inbox, etc. Slots cover media / actions / footer; consumer overrides every string."
		>
			<PreviewSection title="No products — primary + secondary actions" span="full">
				<SmartCard padding="sm">
					<EmptyState
						media={<StackedCardsIllustration />}
						title="No products yet"
						description="Add your first product to start selling. You can also import an existing catalog."
						actions={
							<>
								<Button>
									<ListPlus className="size-4" />
									Add product
								</Button>
								<Button variant="secondary" buttonStyle="ghost">
									<Upload className="size-4" />
									Import CSV
								</Button>
							</>
						}
						footer={
							<>
								Need help? <TextLink href="#">Read the guide</TextLink>
							</>
						}
					/>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="No invoices">
				<SmartCard padding="sm">
					<EmptyState
						media={<DocumentStackIllustration />}
						title="No invoices yet"
						description="Invoices appear here once a sale is completed."
					/>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="No team members">
				<SmartCard padding="sm">
					<EmptyState
						media={<UsersCircleIllustration />}
						title="Invite your team"
						description="Bring in collaborators to manage the workspace together."
						actions={<Button>Invite member</Button>}
					/>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="No search results">
				<SmartCard padding="sm">
					<EmptyState
						mediaVariant="illustration"
						media={<SearchGlassIllustration />}
						title="No results for &ldquo;quarterly&rdquo;"
						description="Try a broader query, or clear filters to see everything."
						actions={
							<Button variant="secondary" buttonStyle="ghost">
								<RefreshCw className="size-4" />
								Clear filters
							</Button>
						}
						padding="compact"
					/>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="Inbox zero">
				<SmartCard padding="sm">
					<EmptyState
						media={<InboxCleanIllustration />}
						title="You&rsquo;re all caught up"
						description={false}
						padding="compact"
					/>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="With dashed-border affordance" span="full">
				<EmptyState
					border
					mediaVariant="icon"
					media={<ListPlus className="size-6 text-muted-foreground" />}
					title="Drop a file to attach"
					description="Or click to browse. Max 10 MB."
					padding="loose"
				/>
			</PreviewSection>

			<PreviewSection title="Strings prop — full localization" span="full">
				<SmartCard padding="sm">
					<EmptyState
						media={<StackedCardsIllustration />}
						strings={{
							title: 'Aucun produit',
							description: 'Ajoutez votre premier produit pour commencer.',
						}}
					/>
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="Render-prop — fully custom media" span="full">
				<SmartCard padding="sm">
					<EmptyState
						mediaVariant="illustration"
						renderMedia={({ mediaVariant }) => (
							<Col className="items-center gap-1">
								<div className="size-12 rounded-full bg-info/15 ring-8 ring-info/5" />
								<span className="text-xs text-muted-foreground">variant: {mediaVariant}</span>
							</Col>
						)}
						title="Custom rendering through renderMedia"
						description="The render-prop receives the resolved variant so consumers can react to it."
					/>
				</SmartCard>
			</PreviewSection>
		</PreviewPage>
	);
}
