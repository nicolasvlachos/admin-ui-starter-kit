import { MoneyDisplay } from '@/components/base/display/money-display';
import { CurrencyPairPreview } from '@/components/base/currency/currency-pair-preview';
import { UIProvider } from '@/lib/ui-provider';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

export default function CurrencyPage() {
	return (
		<PreviewPage title="Base · Currency" description="MoneyDisplay & CurrencyPairPreview — driven by useCurrency() context.">
			<PreviewSection title="MoneyDisplay (default config)" span="full">
				<Col>
					<MoneyDisplay money={{ amount: 124.5, currency: 'USD' }} />
					<MoneyDisplay amount={{ value: '1850.00', currency: 'EUR', symbol: '€' }} size="lg" />
					<MoneyDisplay emptyLabel="—" />
				</Col>
			</PreviewSection>

			<PreviewSection title="Variant: minimal (no secondary even with pair)">
				<MoneyDisplay
					moneyPair={{
						primary: { amount: 124.5, currency: 'USD' },
						secondary: { amount: 63.66, currency: 'EUR' },
					}}
					showPair
					variant="minimal"
					size="base"
				/>
			</PreviewSection>

			<PreviewSection title="Stacked · secondaryEmphasis variants" span="full">
				<Col>
					<MoneyDisplay
						moneyPair={{
							primary: { amount: 124.5, currency: 'USD' },
							secondary: { amount: 63.66, currency: 'EUR' },
						}}
						showPair
						size="base"
						secondaryEmphasis="discrete"
					/>
					<MoneyDisplay
						moneyPair={{
							primary: { amount: 124.5, currency: 'USD' },
							secondary: { amount: 63.66, currency: 'EUR' },
						}}
						showPair
						size="base"
						secondaryEmphasis="muted"
					/>
					<MoneyDisplay
						moneyPair={{
							primary: { amount: 124.5, currency: 'USD' },
							secondary: { amount: 63.66, currency: 'EUR' },
						}}
						showPair
						size="base"
						secondaryEmphasis="match"
					/>
					<MoneyDisplay
						moneyPair={{
							primary: { amount: 124.5, currency: 'USD' },
							secondary: { amount: 63.66, currency: 'EUR' },
						}}
						showPair
						size="base"
						secondaryEmphasis="hidden"
					/>
				</Col>
			</PreviewSection>

			<PreviewSection title="Inline · secondaryEmphasis variants" span="full">
				<Col>
					<MoneyDisplay
						moneyPair={{
							primary: { amount: 124.5, currency: 'USD' },
							secondary: { amount: 63.66, currency: 'EUR' },
						}}
						showPair
						dualPricingDisplay="inline"
						size="base"
						secondaryEmphasis="discrete"
					/>
					<MoneyDisplay
						moneyPair={{
							primary: { amount: 124.5, currency: 'USD' },
							secondary: { amount: 63.66, currency: 'EUR' },
						}}
						showPair
						dualPricingDisplay="inline"
						size="base"
						secondaryEmphasis="muted"
					/>
					<MoneyDisplay
						moneyPair={{
							primary: { amount: 124.5, currency: 'USD' },
							secondary: { amount: 63.66, currency: 'EUR' },
						}}
						showPair
						dualPricingDisplay="inline"
						size="base"
						secondaryEmphasis="match"
					/>
				</Col>
			</PreviewSection>

			<PreviewSection title="CurrencyPairPreview" span="full">
				<Col>
					<CurrencyPairPreview
						pair={{
							source: { value: '100.00', currency: 'EUR', symbol: '€' },
							target: { value: '195.58', currency: 'USD' },
						}}
					/>
					<CurrencyPairPreview pair={null} emptyLabel="No conversion" />
				</Col>
			</PreviewSection>

			<PreviewSection title="With <UIProvider config={{ money: { ... } }}> (dual, with_symbol)" span="full">
				<UIProvider
					config={{
						money: {
							defaultCurrency: 'EUR',
							displayCurrency: 'EUR',
							dualPricingEnabled: true,
							displayMode: 'dual',
							formatMode: 'with_symbol',
						},
					}}
				>
					<Col>
						<MoneyDisplay
							moneyPair={{
								primary: { amount: 49.99, currency: 'EUR' },
								secondary: { amount: 97.78, currency: 'USD' },
							}}
							size="lg"
						/>
						<CurrencyPairPreview
							pair={{
								source: { value: '49.99', currency: 'EUR', symbol: '€' },
								target: { value: '97.78', currency: 'USD', symbol: 'лв' },
							}}
							size="base"
						/>
					</Col>
				</UIProvider>
			</PreviewSection>
		</PreviewPage>
	);
}
