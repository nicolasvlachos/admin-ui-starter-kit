import { useState } from 'react';
import { Inbox, Heart, ShoppingBag, Sparkles, Users } from 'lucide-react';
import { BreadcrumbProgress, CategoryNavCard } from '@/components/composed/navigation';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function NavigationExtrasPage() {
	const [step, setStep] = useState(2);
	const [activeCategory, setActiveCategory] = useState('orders');

	return (
		<PreviewPage title="Composed · Navigation (extras)" description="BreadcrumbProgress wizard + CategoryNavCard sidebar.">
			<PreviewSection title="BreadcrumbProgress" span="full">
				<BreadcrumbProgress
					steps={[
						{ id: 'cart', label: 'Cart', hint: 'Review items' },
						{ id: 'shipping', label: 'Shipping', hint: 'Address' },
						{ id: 'payment', label: 'Payment', hint: 'Card / wallet' },
						{ id: 'review', label: 'Review', hint: 'Confirm order' },
						{ id: 'done', label: 'Done', hint: 'Receipt' },
					]}
					currentIndex={step}
					onStepClick={(_, idx) => setStep(idx)}
				/>
			</PreviewSection>

			<PreviewSection title="CategoryNavCard">
				<CategoryNavCard
					title="Inbox"
					activeId={activeCategory}
					onSelect={setActiveCategory}
					items={[
						{ id: 'all', label: 'All', icon: Inbox, count: 142 },
						{ id: 'orders', label: 'Orders', icon: ShoppingBag, count: 24, hint: 'Pending review' },
						{ id: 'reviews', label: 'Reviews', icon: Heart, count: 8 },
						{ id: 'team', label: 'Team', icon: Users, count: 3 },
						{ id: 'ai', label: 'AI suggestions', icon: Sparkles, hint: 'Auto-generated' },
					]}
				/>
			</PreviewSection>
		</PreviewPage>
	);
}
