import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Cloud, ShoppingBag, Sparkles, Star, Heart, Zap } from 'lucide-react';
import { FormField } from '@/components/base/forms/form-field';
import {
	Input,
	Textarea,
	Select,
	DecimalInput,
	PercentageInput,
	TagsInput,
	FileUpload,
	ImageUpload,
	DateTimeInput,
	TimePicker,
	CoordinatesInput,
	PhoneInput,
	CurrencyInput,
	WeightInput,
	DimensionsInput,
	RichSelect,
	KeyValueEditor,
	SwitchCard,
	ToggleField,
	CardRadioGroup,
	CardCheckboxGroup,
	ListRadioGroup,
	PillRadioGroup,
	StringRepeater,
	List,
	LocalizedStringField,
	RoundingModeSelect,
} from '@/components/base/forms/fields';
import { MetadataList } from '@/components/base/display/metadata';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

function FormDemoProvider({
	defaultValues,
	children,
}: {
	defaultValues: Record<string, unknown>;
	children: React.ReactNode;
}) {
	const methods = useForm({ defaultValues });
	return <FormProvider {...methods}>{children}</FormProvider>;
}

export default function FormsPage() {
	// basics
	const [name, setName] = useState('');
	const [bio, setBio] = useState('');
	const [agree, setAgree] = useState(false);
	const [pro, setPro] = useState(true);
	const [country, setCountry] = useState('bg');
	const [amount, setAmount] = useState('0');
	const [pct, setPct] = useState('15');
	const [tags, setTags] = useState<string[]>(['design', 'ux']);

	// extended
	const [file, setFile] = useState<File | undefined>();
	const [image, setImage] = useState<File | undefined>();
	const [dt, setDt] = useState<string | undefined>();
	const [time, setTime] = useState('14:30:00');
	const [coords, setCoords] = useState({ lat: '42.6977', lng: '23.3219' });
	const [phone, setPhone] = useState('');
	const [phonePrefix, setPhonePrefix] = useState('BG');
	const [price, setPrice] = useState('99.95');
	const [currency, setCurrency] = useState('EUR');
	const [weight, setWeight] = useState('1500');
	const [weightUnit, setWeightUnit] = useState<'g' | 'kg' | 'lb' | 'oz'>('g');
	const [dims, setDims] = useState({ width: '30', height: '20', depth: '10' });
	const [richVal, setRichVal] = useState<string | undefined>('starter');
	const [kvObj, setKvObj] = useState<Record<string, string>>({ env: 'production', region: 'eu' });
	const [switchCard, setSwitchCard] = useState(true);
	const [plan, setPlan] = useState<string>('starter');
	const [features, setFeatures] = useState<string[]>(['ai', 'support']);
	const [tier, setTier] = useState<string>('gold');
	const [pill, setPill] = useState<string | null>('week');
	const [round, setRound] = useState<string | undefined>('half_up');

	return (
		<PreviewPage title="Base · Forms" description="FormField + every Base form field — basics, files, date/time, currency, dimensions, choice variants, repeaters, localized fields.">
			<PreviewSection title="Basic inputs" span="full">
				<Col>
					<FormField label="Full name" hint="As it appears on your ID" required>
						<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sarah Smitha" />
					</FormField>
					<FormField label="Bio" helperText="Up to 240 characters.">
						<Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
					</FormField>
					<FormField label="Email" error="That doesn't look like a valid email." required>
						<Input defaultValue="not-an-email" invalid />
					</FormField>
				</Col>
			</PreviewSection>

			<PreviewSection title="Toggles">
				<Col>
					<ToggleField
						kind="checkbox"
						label="Agreement"
						description="I agree to the terms of service and privacy policy."
						value={agree}
						onChange={setAgree}
					/>
					<ToggleField
						label="Pro mode"
						description="Unlocks advanced settings, keyboard shortcuts, and the developer console."
						value={pro}
						onChange={setPro}
					/>
				</Col>
			</PreviewSection>

			<PreviewSection title="SwitchCard">
				<SwitchCard
					icon={Cloud}
					label="Cloud sync"
					description="Keep your changes synced across devices."
					hint="You can disable this any time."
					value={switchCard}
					onChange={setSwitchCard}
				/>
			</PreviewSection>

			<PreviewSection title="Select / RichSelect / RoundingMode" span="full">
				<Col>
					<FormField label="Country">
						<Select
							value={country}
							onChange={(value) => setCountry(value ?? '')}
							options={[
								{ value: 'bg', label: 'USA' },
								{ value: 'gr', label: 'Greece' },
								{ value: 'ro', label: 'Romania' },
								{ value: 'mk', label: 'North Macedonia' },
							]}
						/>
					</FormField>
					<FormField label="Plan (RichSelect)">
						<RichSelect
							value={richVal}
							onChange={setRichVal}
							options={[
								{ value: 'starter', label: 'Starter', description: '€9 / month' },
								{ value: 'pro', label: 'Pro', description: '€29 / month' },
								{ value: 'enterprise', label: 'Enterprise', description: 'Custom pricing' },
							]}
						/>
					</FormField>
					<FormField label="Rounding mode">
						<RoundingModeSelect value={round} onChange={setRound} />
					</FormField>
				</Col>
			</PreviewSection>

			<PreviewSection title="Numeric inputs" span="full">
				<Col>
					<FormField label="Amount (decimal)">
						<DecimalInput value={amount} onChange={(e) => setAmount(e.target.value)} />
					</FormField>
					<FormField label="Discount (percentage)">
						<PercentageInput value={pct} onChange={(e) => setPct(e.target.value)} />
					</FormField>
					<FormField label="Price (currency)">
						<CurrencyInput
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							currency={currency}
							onCurrencyChange={setCurrency}
							currencies={['EUR', 'USD', 'USD', 'GBP']}
						/>
					</FormField>
					<FormField label="Weight">
						<WeightInput
							value={weight}
							onChange={(e) => setWeight(e.target.value)}
							unit={weightUnit}
							onUnitChange={setWeightUnit}
						/>
					</FormField>
					<FormField label="Dimensions">
						<DimensionsInput
							format="object"
							value={dims}
							onChange={(e) => setDims(e.target.value as { width: string; height: string; depth: string })}
						/>
					</FormField>
				</Col>
			</PreviewSection>

			<PreviewSection title="Phone, coordinates, time" span="full">
				<Col>
					<FormField label="Phone">
						<PhoneInput
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							prefix={phonePrefix}
							onPrefixChange={setPhonePrefix}
						/>
					</FormField>
					<FormField label="Coordinates" hint="Latitude & longitude">
						<CoordinatesInput
							format="object"
							value={coords}
							onChange={(e) => setCoords(e.target.value as { lat: string; lng: string })}
							showPreviewLink
						/>
					</FormField>
					<FormField label="Date & time">
						<DateTimeInput value={dt} onChange={setDt} />
					</FormField>
					<FormField label="Time picker">
						<TimePicker value={time} onChange={setTime} />
					</FormField>
				</Col>
			</PreviewSection>

			<PreviewSection title="Tags / Metadata display" span="full">
				<Col>
					<FormField label="Tags" hint="Comma or Enter to add">
						<TagsInput value={tags} onChange={setTags} placeholder="Add tag…" />
					</FormField>
					<FormField label="Metadata (MetadataList)">
						<MetadataList
							columns={2}
							items={[
								{ label: 'Order ID', value: 'ORD-2026-0412' },
								{ label: 'Customer', value: 'Sarah Smitha' },
								{ label: 'Status', value: 'Paid' },
								{ label: 'Total', value: '2,450 USD' },
							]}
						/>
					</FormField>
				</Col>
			</PreviewSection>

			<PreviewSection title="Choice variants" span="full">
				<Col>
					<FormField label="Plan (CardRadioGroup)">
						<CardRadioGroup
							value={plan}
							onChange={setPlan}
							columns={3}
							options={[
								{ value: 'starter', title: 'Starter', description: '€9 / mo', icon: Sparkles },
								{ value: 'pro', title: 'Pro', description: '€29 / mo', icon: Star },
								{ value: 'enterprise', title: 'Enterprise', description: 'Custom', icon: ShoppingBag },
							]}
						/>
					</FormField>
					<FormField label="Features (CardCheckboxGroup)">
						<CardCheckboxGroup
							value={features}
							onChange={setFeatures}
							columns={3}
							options={[
								{ value: 'ai', title: 'AI assist', description: 'Smart suggestions', icon: Sparkles },
								{ value: 'support', title: 'Premium support', description: '24/7 help', icon: Heart },
								{ value: 'analytics', title: 'Analytics', description: 'Detailed reports', icon: Zap },
							]}
						/>
					</FormField>
					<FormField label="Tier (ListRadioGroup)">
						<ListRadioGroup
							value={tier}
							onChange={setTier}
							options={[
								{ value: 'silver', label: 'Silver', description: 'Up to 100 orders' },
								{ value: 'gold', label: 'Gold', description: 'Up to 500 orders' },
								{ value: 'platinum', label: 'Platinum', description: 'Unlimited orders' },
							]}
						/>
					</FormField>
					<FormField label="Range (PillRadioGroup)">
						<PillRadioGroup
							name="range"
							value={pill}
							onChange={setPill}
							options={[
								{ value: 'day', label: 'Day' },
								{ value: 'week', label: 'Week' },
								{ value: 'month', label: 'Month' },
								{ value: 'year', label: 'Year' },
							]}
						/>
					</FormField>
				</Col>
			</PreviewSection>

			<PreviewSection title="Uploads" span="full">
				<Col>
					<FormField label="Single file" helperText="PDF or DOCX, up to 10MB">
						<FileUpload
							accept="application/pdf,.doc,.docx"
							value={file}
							onChange={setFile}
							browseButtonText="Browse files"
							removeButtonText="Remove"
							helperText="Drop a file here or browse."
						/>
					</FormField>
					<FormField label="Image upload">
						<ImageUpload value={image} onChange={setImage} aspectRatio="square" />
					</FormField>
				</Col>
			</PreviewSection>

			<PreviewSection
				title="Repeaters (shared chrome — sortable, ghost remove, dashed empty)"
				description="StringRepeater · KeyValueEditor · LocalizedStringField · List all flow through the same <Repeater> primitive."
				span="full"
			>
				<FormDemoProvider
					defaultValues={{
						aliases: ['First alias', 'Second alias'],
						todos: ['Send invoice', 'Confirm booking'],
						title: { en: 'Welcome', bg: 'Добре дошли' },
					}}
				>
					<Col>
						<FormField label="Aliases (StringRepeater · sortable)" hint="Drag the handle to reorder.">
							<StringRepeater
								name="aliases"
								sortable
								addButtonText="Add alias"
								placeholder="Alias…"
							/>
						</FormField>
						<FormField label="Metadata (KeyValueEditor · sortable)">
							<KeyValueEditor sortable value={kvObj} onChange={setKvObj} />
						</FormField>
						<FormField label="Todos (List)">
							<List name="todos" addButtonText="Add todo" placeholder="Todo…" />
						</FormField>
						<FormField label="Title (LocalizedStringField — primary)">
							<LocalizedStringField name="title" primaryLocale="en" secondaryLocale="bg" activeLocale="primary" placeholder="Localized title…" />
						</FormField>
						<FormField label="Title (LocalizedStringField — secondary)">
							<LocalizedStringField name="title" primaryLocale="en" secondaryLocale="bg" activeLocale="secondary" placeholder="Локализирано заглавие…" />
						</FormField>
					</Col>
				</FormDemoProvider>
			</PreviewSection>
		</PreviewPage>
	);
}
