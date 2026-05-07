import { Bell, CreditCard, HelpCircle, Lock, Settings, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, SmartAccordion } from '@/components/base/accordion';
import { Badge } from '@/components/base/badge';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography/text';

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
		value: 'notifications',
		icon: <Bell className="size-4" />,
		title: 'Notifications',
		badge: <Badge variant="secondary">3</Badge>,
		content:
			'Choose which events trigger an email or push notification. Granular per-channel control.',
	},
	{
		value: 'billing',
		icon: <CreditCard className="size-4" />,
		title: 'Billing',
		content: 'Update your payment method, download invoices, and manage seats.',
		disabled: true,
	},
	{
		value: 'support',
		icon: <HelpCircle className="size-4" />,
		title: 'Help & support',
		content: 'Access our help center, community forums, and contact support 24/7.',
	},
];

const faqItems = [
	{ value: 'a', title: 'What is included in the plan?', content: 'Everything in the free tier plus team seats, audit log, and custom roles.' },
	{ value: 'b', title: 'Can I switch plans later?', content: 'Yes — upgrades take effect immediately, downgrades at the next billing cycle.' },
	{ value: 'c', title: 'Do you offer discounts for non-profits?', content: 'We do — drop a note to billing with proof of status.' },
];

export function Default() {
	return (
		<div className="w-full max-w-xl">
			<SmartAccordion items={settingsItems.slice(0, 3)} defaultValue={['account']} />
		</div>
	);
}

export function VariantCard() {
	return (
		<div className="w-full max-w-xl">
			<SmartAccordion items={settingsItems.slice(0, 3)} variant="card" defaultValue={['account']} />
		</div>
	);
}

export function VariantBordered() {
	return (
		<div className="w-full max-w-xl">
			<SmartAccordion items={settingsItems.slice(0, 3)} variant="bordered" defaultValue={['privacy']} />
		</div>
	);
}

export function VariantFlat() {
	return (
		<SmartCard padding="sm" className="w-full max-w-xl">
			<SmartAccordion items={faqItems} variant="flat" iconStyle="none" defaultValue={['a']} />
		</SmartCard>
	);
}

export function IconStyleMedallion() {
	return (
		<div className="w-full max-w-xl">
			<SmartAccordion items={settingsItems.slice(0, 3)} iconStyle="medallion" defaultValue={['account']} />
		</div>
	);
}

export function IconStyleInline() {
	return (
		<div className="w-full max-w-xl">
			<SmartAccordion items={settingsItems.slice(0, 3)} iconStyle="inline" defaultValue={['account']} />
		</div>
	);
}

export function IconStyleNone() {
	return (
		<div className="w-full max-w-xl">
			<SmartAccordion items={faqItems} iconStyle="none" defaultValue={['a']} />
		</div>
	);
}

export function MultipleOpen() {
	return (
		<div className="w-full max-w-xl">
			<SmartAccordion items={settingsItems.slice(0, 3)} multiple defaultValue={['account', 'privacy']} />
		</div>
	);
}

export function WithBadgeAndDisabled() {
	return (
		<div className="w-full max-w-xl">
			<SmartAccordion items={settingsItems} defaultValue={['account']} />
		</div>
	);
}

export function CompoundApi() {
	return (
		<div className="w-full max-w-xl">
			<Accordion defaultValue={['custom']}>
				<AccordionItem value="custom" className="rounded-md border bg-card mb-2">
					<AccordionTrigger className="px-4 py-3">
						<div className="flex items-center gap-2">
							<Sparkles className="size-4 text-primary" />
							<span className="font-semibold">Custom row layout</span>
							<Badge variant="warning">Beta</Badge>
						</div>
					</AccordionTrigger>
					<AccordionContent className="px-4 pb-4">
						<Text type="secondary">
							Drop down to the compound API when you need more than icon + title +
							body — e.g. multi-line meta, action rows, or custom indicators.
						</Text>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="another" className="rounded-md border bg-card">
					<AccordionTrigger className="px-4 py-3">
						<div className="flex w-full items-center justify-between">
							<span className="font-semibold">Two-line trigger</span>
							<Text size="xs" type="secondary">Updated 2h ago</Text>
						</div>
					</AccordionTrigger>
					<AccordionContent className="px-4 pb-4">
						<Text type="secondary">Body content for the second item.</Text>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}

export function RealisticFAQ() {
	return (
		<div className="w-full max-w-xl space-y-4">
			<div>
				<h3 className="text-base font-semibold">Frequently asked questions</h3>
				<p className="text-sm text-muted-foreground">Everything you need to know before signing up.</p>
			</div>
			<SmartAccordion items={faqItems} variant="bordered" iconStyle="none" />
		</div>
	);
}
