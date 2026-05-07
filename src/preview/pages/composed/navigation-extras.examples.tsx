import { useState } from 'react';
import { Inbox, Heart, ShoppingBag, Sparkles, Users } from 'lucide-react';
import { BreadcrumbProgress, CategoryNavCard } from '@/components/composed/navigation';

export function BreadcrumbProgressExample() {
	const [step, setStep] = useState(2);
	return (
		<>
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
		</>
	);
}

export function CategoryNavCardExample() {
	const [activeCategory, setActiveCategory] = useState('orders');
	return (
		<>
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
		</>
	);
}
