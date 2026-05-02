import { UIProvider } from './lib/ui-provider';
import PreviewApp from './preview/PreviewApp';

export default function App() {
	return (
		<UIProvider
			config={{
				money: { defaultCurrency: 'EUR', locale: 'en-GB' },
				dates: { weekStartsOn: 1 },
			}}
		>
			<PreviewApp />
		</UIProvider>
	);
}
