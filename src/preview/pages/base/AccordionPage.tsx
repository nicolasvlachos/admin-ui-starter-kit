import { HelpCircle, Lock, Settings } from 'lucide-react';

import { SmartAccordion } from '@/components/base/accordion';
import { Badge } from '@/components/base/badge';
import { SmartCard } from '@/components/base/cards';

import { Col, PreviewPage, PreviewSection } from '../../PreviewLayout';

const settingsItems = [
	{
		value: 'account',
		icon: <Settings className="size-4" />,
		title: 'Account settings',
		badge: <Badge variant="primary">New</Badge>,
		content:
			'Manage your account preferences, security settings, and personal information. You can also configure two-factor authentication here.',
	},
	{
		value: 'privacy',
		icon: <Lock className="size-4" />,
		title: 'Privacy & security',
		content:
			'Control who can see your profile and what data we collect. View our latest security audits and transparency reports.',
	},
	{
		value: 'support',
		icon: <HelpCircle className="size-4" />,
		title: 'Help & support',
		content:
			"Access our help center, community forums, and contact support. We're here to help you 24/7.",
	},
];

const flatItems = [
	{ value: 'a', title: 'What is included in the plan?', content: 'Everything in the free tier plus team seats, audit log, and custom roles.' },
	{ value: 'b', title: 'Can I switch plans later?', content: 'Yes — upgrades take effect immediately, downgrades at the next billing cycle.' },
	{ value: 'c', title: 'Do you offer discounts for non-profits?', content: 'We do — drop a note to billing with proof of status.' },
];

export default function AccordionPage() {
	return (
		<PreviewPage
			title="Base · Accordion"
			description="Two tiers — pass-through compound parts (Accordion / AccordionItem / AccordionTrigger / AccordionContent) for full control, or SmartAccordion for the canonical icon + title + optional badge + body admin pattern."
		>
			<PreviewSection title="SmartAccordion · variant='card' (default)" span="full">
				<Col className="max-w-xl">
					<SmartAccordion items={settingsItems} defaultValue={['account']} />
				</Col>
			</PreviewSection>

			<PreviewSection title="variant='bordered' — single shell" span="full">
				<Col className="max-w-xl">
					<SmartAccordion items={settingsItems} variant="bordered" defaultValue={['privacy']} />
				</Col>
			</PreviewSection>

			<PreviewSection title="variant='flat' · iconStyle='none' — FAQ surface" span="full">
				<SmartCard padding="sm">
					<SmartAccordion items={flatItems} variant="flat" iconStyle="none" defaultValue={['a']} />
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="multiple={true} — several open at once" span="full">
				<Col className="max-w-xl">
					<SmartAccordion items={settingsItems} multiple defaultValue={['account', 'privacy']} />
				</Col>
			</PreviewSection>

			<PreviewSection title="iconStyle='inline' — icon flush with title" span="full">
				<Col className="max-w-xl">
					<SmartAccordion items={settingsItems} iconStyle="inline" defaultValue={['support']} />
				</Col>
			</PreviewSection>
		</PreviewPage>
	);
}
