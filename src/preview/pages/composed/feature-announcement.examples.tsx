// @ts-nocheck
import { Sparkles, Zap, Shield } from 'lucide-react';
import { FeatureAnnouncementCard } from '@/components/composed/cards/feature-announcement';
import { Col } from '../../PreviewLayout';

export function WithIconTagsAction() {
	return (
		<>
			<Col>
								<FeatureAnnouncementCard
									icon={Sparkles}
									title="AI Gift Recommendations"
									description="Our new AI engine analyses recipient preferences and past orders to suggest perfectly matched gifts. Now available for all vendors."
									tags={['AI', 'Personalization', 'Beta']}
									actionLabel="Learn more"
									onAction={() => {}}
								/>
								<FeatureAnnouncementCard
									icon={Zap}
									title="Faster checkout"
									description="One-tap pay with stored cards now works on all flows."
									tags={['Performance']}
									actionLabel="Try it"
									onAction={() => {}}
								/>
								<FeatureAnnouncementCard
									icon={Shield}
									title="Two-factor authentication"
									description="Extra layer of security for vendor accounts."
								/>
							</Col>
		</>
	);
}
