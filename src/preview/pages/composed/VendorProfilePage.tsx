import { VendorProfileCard } from '@/components/composed/cards/vendor-profile';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

export default function VendorProfilePage() {
	return (
		<PreviewPage title="Composed · Vendor profile" description="VendorProfileCard with metrics, stats and actions.">
			<PreviewSection title="With everything">
				<VendorProfileCard
					name="Dimitar Kostadinov"
					role="Experience Vendor"
					verified
					earnings="8,420 USD"
					earningsChange="+12.5%"
					metrics={[
						{ label: 'Experiences hosted', value: '47' },
						{ label: 'Avg. rating', value: '4.8 / 5.0' },
						{ label: 'Repeat customers', value: '68%' },
					]}
					stats={[
						{ label: 'This month', value: '1,240 USD', change: '+8%' },
						{ label: 'Bookings', value: '23', change: '+3' },
						{ label: 'Conversion', value: '74%', change: '+5%' },
						{ label: 'Avg. order', value: '54 USD', change: '-2%' },
					]}
					onMessage={() => {}}
					onHire={() => {}}
				/>
			</PreviewSection>

			<PreviewSection title="Minimal">
				<VendorProfileCard name="Emma Garcia" role="New vendor" />
			</PreviewSection>
		</PreviewPage>
	);
}
