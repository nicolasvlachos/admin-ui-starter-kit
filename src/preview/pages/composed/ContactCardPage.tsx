import { ContactCard } from '@/components/composed/cards/contact-card';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

export default function ContactCardPage() {
	return (
		<PreviewPage title="Composed · Contact card" description="ContactCard — name, role, email, phone, location, badge.">
			<PreviewSection title="With all fields">
				<ContactCard
					name="Sarah Smitha"
					role="Account Manager"
					email="maria@giftcometrue.com"
					phone="+1 888 123 456"
					location="New York, NY"
					badge="Online"
					badgeVariant="success"
					onContact={() => {}}
					onViewProfile={() => {}}
				/>
			</PreviewSection>

			<PreviewSection title="With initials only">
				<ContactCard
					name="Georgi Johnson"
					role="Head of Operations"
					email="georgi@giftcometrue.com"
					initials="GI"
					badge="Away"
					badgeVariant="warning"
					onContact={() => {}}
					onViewProfile={() => {}}
				/>
			</PreviewSection>

			<PreviewSection title="Minimal">
				<ContactCard name="Emma Williamsa" />
			</PreviewSection>

			<PreviewSection title="Different badge variants" span="full">
				<Col>
					{(['primary', 'secondary', 'success', 'info', 'warning', 'error'] as const).map((v) => (
						<ContactCard
							key={v}
							name={`Variant: ${v}`}
							role="Demo"
							email="demo@example.com"
							badge={v}
							badgeVariant={v}
						/>
					))}
				</Col>
			</PreviewSection>
		</PreviewPage>
	);
}
