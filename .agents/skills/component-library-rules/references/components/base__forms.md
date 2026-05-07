---
id: base/forms
title: "Forms"
description: "The full form scope — FormField wrapper plus every field component exported from base/forms/fields: text inputs, numeric, selects, toggles, choice groups, date/time, repeaters, localized fields, and uploads."
layer: base
family: "Forms & inputs"
sourcePath: src/components/base/forms
examples:
  - BasicField
  - WithError
  - WithHelperText
  - InputBasic
  - InputWithIcons
  - InputWithAddons
  - InputClearableLoading
  - InputCharacterCount
  - TextareaExample
  - DecimalInputExample
  - PercentageInputExample
  - CurrencyInputExample
  - MoneyInputExample
  - WeightInputExample
  - DimensionsInputExample
  - SelectExample
  - RichSelectExample
  - RoundingModeSelectExample
  - SwitchExample
  - CheckboxExample
  - ToggleFieldExample
  - SwitchCardExample
  - PillRadioGroupExample
  - ListRadioGroupExample
  - CardRadioGroupExample
  - CardCheckboxGroupExample
  - DateTimeInputExample
  - TimePickerExample
  - SliderExample
  - TagsInputExample
  - PhoneInputExample
  - CoordinatesInputExample
  - StringRepeaterExample
  - ObjectRepeaterExample
  - KeyValueEditorExample
  - ListExample
  - LocalizedStringFieldExample
  - LocalizedObjectFieldExample
  - LocalizedStringRepeaterExample
  - AvatarUploadExample
  - DropzoneExample
  - WholeForm
imports:
  - @/components/base/buttons
  - @/components/base/forms
  - @/components/base/forms/fields
tags:
  - base
  - forms
  - inputs
  - full
  - form
  - scope
  - formfield
---

# Forms

The full form scope — FormField wrapper plus every field component exported from base/forms/fields: text inputs, numeric, selects, toggles, choice groups, date/time, repeaters, localized fields, and uploads.

**Layer:** `base`  
**Source:** `src/components/base/forms`

## Examples

```tsx
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Mail, Search, Lock, Star, Zap, Box, Globe, Shield } from 'lucide-react';

import { FormField, ControlledFormField } from '@/components/base/forms';
import {
	Input,
	Textarea,
	Select,
	Checkbox,
	Switch,
	SwitchCard,
	ToggleField,
	TagsInput,
	PhoneInput,
	PercentageInput,
	SliderField,
	CardCheckboxGroup,
	CardRadioGroup,
	ListRadioGroup,
	PillRadioGroup,
	CurrencyInput,
	MoneyInput,
	RoundingModeSelect,
	RichSelect,
	DimensionsInput,
	WeightInput,
	CoordinatesInput,
	DateTimeInput,
	TimePicker,
	DecimalInput,
	StringRepeater,
	ObjectRepeater,
	KeyValueEditor,
	LocalizedStringField,
	LocalizedObjectField,
	LocalizedStringRepeater,
	List,
	AvatarUpload,
	Dropzone,
} from '@/components/base/forms/fields';
import { Button } from '@/components/base/buttons';

// ─────────────────────────────────────────────────────────────────────────────
// FormField wrapper
// ─────────────────────────────────────────────────────────────────────────────

export function BasicField() {
	const [value, setValue] = useState('');
	return (
		<FormField label="Full name" hint="As it appears on your ID" required>
			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Sarah Smitha"
			/>
		</FormField>
	);
}

export function WithError() {
	return (
		<FormField label="Email" error="That doesn't look like a valid email." required>
			<Input defaultValue="not-an-email" invalid />
		</FormField>
	);
}

export function WithHelperText() {
	return (
		<FormField label="API token" helperText="Stored encrypted at rest. Rotate every 90 days.">
			<Input defaultValue="sk_live_••••••••••••" />
		</FormField>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Text inputs
// ─────────────────────────────────────────────────────────────────────────────

export function InputBasic() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<Input placeholder="Type something…" />
			<Input defaultValue="Pre-filled value" />
			<Input disabled defaultValue="Disabled" />
		</div>
	);
}

export function InputWithIcons() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<Input startIcon={Search} placeholder="Search orders…" />
			<Input endIcon={Mail} placeholder="you@example.com" />
			<Input startIcon={Lock} type="password" defaultValue="hunter2" />
		</div>
	);
}

export function InputWithAddons() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<Input startAddon="$" placeholder="0.00" />
			<Input endAddon="kg" defaultValue="2.4" />
			<Input startAddon="$" endAddon="USD" defaultValue="49.00" />
		</div>
	);
}

export function InputClearableLoading() {
	const [val, setVal] = useState('Click the × to clear');
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<Input
				clearable
				value={val}
				onChange={(e) => setVal(e.target.value)}
				onClear={() => setVal('')}
			/>
			<Input isLoading defaultValue="Loading…" />
			<Input invalid defaultValue="Invalid value" />
		</div>
	);
}

export function InputCharacterCount() {
	const [val, setVal] = useState('A short bio');
	return (
		<div className="w-full max-w-sm">
			<Input
				value={val}
				onChange={(e) => setVal(e.target.value)}
				maxLength={60}
				showCharacterCount
			/>
		</div>
	);
}

export function TextareaExample() {
	const [val, setVal] = useState('');
	return (
		<div className="flex w-full max-w-md flex-col gap-3">
			<FormField label="Description" hint="Up to 200 characters.">
				<Textarea
					value={val}
					onChange={(e) => setVal(e.target.value)}
					placeholder="Write a description…"
					maxLength={200}
					showCharacterCount
				/>
			</FormField>
			<FormField label="Read-only field">
				<Textarea defaultValue="Read-only content the user cannot edit." disabled rows={2} />
			</FormField>
			<FormField label="Bio" error="Bio cannot be empty." required>
				<Textarea invalid placeholder="Tell us about yourself…" rows={2} />
			</FormField>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Numeric inputs
// ─────────────────────────────────────────────────────────────────────────────

export function DecimalInputExample() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<FormField label="Free-form decimal">
				<DecimalInput defaultValue="1234.56" decimalPlaces={2} />
			</FormField>
			<FormField label="With steppers (1–100)">
				<div className="w-44">
					<DecimalInput defaultValue="10" step={1} min={0} max={100} />
				</div>
			</FormField>
			<FormField label="Allows negative">
				<DecimalInput placeholder="0.00" decimalPlaces={2} allowNegative />
			</FormField>
		</div>
	);
}

export function PercentageInputExample() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<FormField label="Discount">
				<PercentageInput defaultValue="12.5" />
			</FormField>
			<FormField label="Tax rate (whole-number steppers)">
				<div className="w-44">
					<PercentageInput defaultValue="20" decimalPlaces={0} step={5} />
				</div>
			</FormField>
		</div>
	);
}

export function CurrencyInputExample() {
	return (
		<div className="w-full max-w-sm">
			<CurrencyInput
				defaultValue="2450.00"
				defaultCurrency="USD"
				currencies={['USD', 'EUR', 'GBP']}
			/>
		</div>
	);
}

export function MoneyInputExample() {
	return (
		<div className="w-full max-w-sm">
			<MoneyInput defaultValue="49.99" defaultCurrency="USD" />
		</div>
	);
}

export function WeightInputExample() {
	return (
		<div className="w-full max-w-sm">
			<WeightInput defaultValue="2.4" defaultUnit="kg" />
		</div>
	);
}

export function DimensionsInputExample() {
	return (
		<div className="w-full max-w-md">
			<DimensionsInput defaultValue={{ width: '30', height: '20', depth: '10' }} format="object" unit="g" />
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Selects
// ─────────────────────────────────────────────────────────────────────────────

export function SelectExample() {
	return (
		<div className="w-full max-w-sm">
			<Select
				options={[
					{ value: 'paid', label: 'Paid' },
					{ value: 'pending', label: 'Pending' },
					{ value: 'overdue', label: 'Overdue' },
				]}
				placeholder="Pick a status…"
				allowClear
			/>
		</div>
	);
}

export function RichSelectExample() {
	return (
		<div className="w-full max-w-md">
			<RichSelect
				options={[
					{ value: 'free', label: 'Free', description: 'Up to 3 projects, community support.' },
					{ value: 'pro', label: 'Pro', description: '$12/mo — unlimited projects, email support.' },
					{ value: 'enterprise', label: 'Enterprise', description: 'Custom pricing, SAML SSO.' },
				]}
				placeholder="Choose a plan…"
			/>
		</div>
	);
}

export function RoundingModeSelectExample() {
	return (
		<div className="w-full max-w-sm">
			<FormField label="Rounding mode">
				<RoundingModeSelect
					defaultValue="half_up"
					labels={{ floor: 'Round down (floor)', half_up: 'Round half up', ceil: 'Round up (ceil)' }}
				/>
			</FormField>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Toggles & checkboxes
// ─────────────────────────────────────────────────────────────────────────────

export function SwitchExample() {
	const [on, setOn] = useState(true);
	return (
		<div className="flex flex-col gap-3">
			<label className="flex items-center gap-2 text-sm">
				<Switch checked={on} onCheckedChange={(e) => setOn(Boolean(e.target.value))} />
				Enable notifications
			</label>
			<label className="flex items-center gap-2 text-sm">
				<Switch defaultChecked disabled />
				Disabled (on)
			</label>
			<label className="flex items-center gap-2 text-sm">
				<Switch invalid />
				Invalid state
			</label>
		</div>
	);
}

export function CheckboxExample() {
	return (
		<div className="flex flex-col gap-3">
			<label className="flex items-center gap-2 text-sm">
				<Checkbox defaultChecked />
				I agree to the terms
			</label>
			<label className="flex items-center gap-2 text-sm">
				<Checkbox />
				Subscribe to the newsletter
			</label>
			<label className="flex items-center gap-2 text-sm">
				<Checkbox disabled defaultChecked />
				Disabled (checked)
			</label>
		</div>
	);
}

export function ToggleFieldExample() {
	return (
		<div className="flex w-full max-w-md flex-col gap-3">
			<ToggleField label="Email digest" description="Receive a weekly summary every Monday." defaultValue />
			<ToggleField
				kind="checkbox"
				label="Beta features"
				description="Opt in to in-progress experiments. May be unstable."
			/>
			<ToggleField label="Leading control" controlPosition="leading" defaultValue />
		</div>
	);
}

export function SwitchCardExample() {
	return (
		<div className="flex w-full max-w-md flex-col gap-3">
			<SwitchCard
				icon={Shield}
				label="Two-factor authentication"
				description="Require a one-time code on every sign-in."
				defaultValue
			/>
			<SwitchCard
				icon={Zap}
				label="Auto-deploy"
				description="Push to production on every merge to main."
			/>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Choice groups
// ─────────────────────────────────────────────────────────────────────────────

export function PillRadioGroupExample() {
	const [val, setVal] = useState<string | null>('week');
	return (
		<PillRadioGroup
			name="range"
			value={val}
			onChange={setVal}
			options={[
				{ value: 'day', label: 'Day' },
				{ value: 'week', label: 'Week' },
				{ value: 'month', label: 'Month' },
				{ value: 'year', label: 'Year' },
			]}
		/>
	);
}

export function ListRadioGroupExample() {
	return (
		<div className="w-full max-w-md">
			<ListRadioGroup
				name="delivery"
				defaultValue="standard"
				options={[
					{ value: 'standard', label: 'Standard', description: '5–7 business days · Free' },
					{ value: 'express', label: 'Express', description: '2–3 business days · $9.99' },
					{ value: 'overnight', label: 'Overnight', description: 'Next business day · $24.99' },
				]}
			/>
		</div>
	);
}

export function CardRadioGroupExample() {
	return (
		<div className="w-full max-w-2xl">
			<CardRadioGroup
				name="plan"
				defaultValue="pro"
				columns={3}
				options={[
					{ value: 'free', label: 'Free', description: '3 projects', icon: Star },
					{ value: 'pro', label: 'Pro', description: 'Unlimited', icon: Zap },
					{ value: 'team', label: 'Team', description: 'Workspaces', icon: Globe },
				]}
			/>
		</div>
	);
}

export function CardCheckboxGroupExample() {
	return (
		<div className="w-full max-w-2xl">
			<CardCheckboxGroup
				name="features"
				defaultValue={['analytics']}
				columns={3}
				options={[
					{ value: 'analytics', label: 'Analytics', description: 'Realtime dashboards', icon: Star },
					{ value: 'webhooks', label: 'Webhooks', description: 'Outbound events', icon: Zap },
					{ value: 'sso', label: 'SSO', description: 'SAML & SCIM', icon: Shield },
				]}
			/>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Date & time
// ─────────────────────────────────────────────────────────────────────────────

export function DateTimeInputExample() {
	const [val, setVal] = useState<string | undefined>(undefined);
	return (
		<div className="flex w-full max-w-sm flex-col gap-2">
			<DateTimeInput value={val} onChange={setVal} placeholder="Pick a date…" />
			<div className="text-xs text-muted-foreground">value: {val ?? '—'}</div>
		</div>
	);
}

export function TimePickerExample() {
	const [val, setVal] = useState('09:30:00');
	return (
		<div className="flex w-full max-w-sm flex-col gap-2">
			<TimePicker value={val} onChange={setVal} />
			<div className="text-xs text-muted-foreground">value: {val}</div>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Other inputs
// ─────────────────────────────────────────────────────────────────────────────

export function SliderExample() {
	const [val, setVal] = useState(40);
	return (
		<div className="flex w-full max-w-md flex-col gap-2">
			<SliderField value={val} onValueChange={setVal} min={0} max={100} step={5} />
			<div className="text-xs text-muted-foreground">value: {val}</div>
		</div>
	);
}

export function TagsInputExample() {
	const [tags, setTags] = useState<string[]>(['design', 'systems']);
	return (
		<div className="w-full max-w-md">
			<TagsInput
				value={tags}
				onChange={setTags}
				placeholder="Add a tag…"
				recommendations={['typography', 'tokens', 'figma', 'a11y']}
			/>
		</div>
	);
}

export function PhoneInputExample() {
	const [val, setVal] = useState('555 0100');
	return (
		<div className="w-full max-w-sm">
			<PhoneInput
				value={val}
				onChange={(e) => setVal(e.target.value)}
				defaultPrefix="US"
			/>
		</div>
	);
}

export function CoordinatesInputExample() {
	return (
		<div className="w-full max-w-md">
			<CoordinatesInput
				defaultValue={{ lat: '37.7749', lng: '-122.4194' }}
				format="object"
			/>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Repeaters (RHF-coupled)
// ─────────────────────────────────────────────────────────────────────────────

export function StringRepeaterExample() {
	const form = useForm({ defaultValues: { tags: ['alpha', 'beta'] } });
	return (
		<FormProvider {...form}>
			<form className="w-full max-w-md">
				<StringRepeater name="tags" placeholder="Tag name" addButtonText="Add tag" />
			</form>
		</FormProvider>
	);
}

export function ObjectRepeaterExample() {
	const form = useForm({
		defaultValues: {
			contacts: [
				{ name: 'Sarah Smitha', email: 'sarah@example.com' },
			],
		},
	});
	return (
		<FormProvider {...form}>
			<form className="w-full max-w-2xl">
				<ObjectRepeater
					name="contacts"
					fields={[
						{ name: 'name', label: 'Name', placeholder: 'Full name' },
						{ name: 'email', label: 'Email', placeholder: 'name@example.com' },
					]}
				/>
			</form>
		</FormProvider>
	);
}

export function KeyValueEditorExample() {
	const [val, setVal] = useState<Record<string, string>>({ env: 'production', region: 'eu-west-1' });
	return (
		<div className="w-full max-w-2xl">
			<KeyValueEditor value={val} onChange={setVal} />
		</div>
	);
}

export function ListExample() {
	const form = useForm({ defaultValues: { aliases: ['acme', 'acme-corp'] } });
	return (
		<FormProvider {...form}>
			<form className="w-full max-w-md">
				<List name="aliases" placeholder="Add an alias…" />
			</form>
		</FormProvider>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Localized fields (RHF-coupled)
// ─────────────────────────────────────────────────────────────────────────────

export function LocalizedStringFieldExample() {
	const form = useForm({ defaultValues: { title: { en: 'Welcome', bg: 'Добре дошли' } } });
	return (
		<FormProvider {...form}>
			<form className="w-full max-w-md">
				<LocalizedStringField
					name="title"
					primaryLocale="en"
					secondaryLocale="bg"
					activeLocale="primary"
					placeholder="Page title"
				/>
			</form>
		</FormProvider>
	);
}

export function LocalizedObjectFieldExample() {
	const form = useForm({
		defaultValues: {
			seo: {
				en: { title: 'About', description: 'About our company.' },
				bg: { title: 'За нас', description: 'За нашата компания.' },
			},
		},
	});
	return (
		<FormProvider {...form}>
			<form className="w-full max-w-2xl">
				<LocalizedObjectField
					name="seo"
					primaryLocale="en"
					secondaryLocale="bg"
					activeLocale="primary"
					fields={[
						{ name: 'title', label: 'Title' },
						{ name: 'description', label: 'Description', type: 'textarea' },
					]}
				/>
			</form>
		</FormProvider>
	);
}

export function LocalizedStringRepeaterExample() {
	const form = useForm({
		defaultValues: { tags: { en: ['systems', 'design'], bg: ['системи', 'дизайн'] } },
	});
	return (
		<FormProvider {...form}>
			<form className="w-full max-w-md">
				<LocalizedStringRepeater
					name="tags"
					primaryLocale="en"
					secondaryLocale="bg"
					activeLocale="primary"
					placeholder="Tag"
				/>
			</form>
		</FormProvider>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Uploads (focused field-shapes — full upload subsystem lives in `base/upload-tray`)
// ─────────────────────────────────────────────────────────────────────────────

export function AvatarUploadExample() {
	return (
		<AvatarUpload defaultPreviewUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" />
	);
}

export function DropzoneExample() {
	return (
		<div className="w-full max-w-md">
			<Dropzone accept="image/*" onDrop={() => {}} />
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Whole form — react-hook-form + ControlledFormField
// ─────────────────────────────────────────────────────────────────────────────

type ProductFormValues = {
	name: string;
	sku: string;
	price: string;
	currency: string;
	description: string;
	category: string;
	published: boolean;
};

export function WholeForm() {
	const form = useForm<ProductFormValues>({
		defaultValues: {
			name: '',
			sku: '',
			price: '',
			currency: 'USD',
			description: '',
			category: '',
			published: false,
		},
	});

	const onSubmit = form.handleSubmit(() => {
		// no-op for showcase
	});

	return (
		<form
			onSubmit={onSubmit}
			className="flex w-full max-w-xl flex-col gap-4 rounded-lg border border-border bg-card p-5"
		>
			<ControlledFormField
				control={form.control}
				name="name"
				label="Product name"
				required
				rules={{ required: true }}
			>
				{(field) => <Input {...field} placeholder="Vintage leather wallet" />}
			</ControlledFormField>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<ControlledFormField
					control={form.control}
					name="sku"
					label="SKU"
					hint="Inventory keeping unit."
				>
					{(field) => <Input {...field} placeholder="LW-0021" startIcon={Box} />}
				</ControlledFormField>

				<ControlledFormField
					control={form.control}
					name="price"
					label="Price"
					required
					rules={{ required: true }}
				>
					{(field) => (
						<MoneyInput
							value={field.value}
							onChange={(e) => field.onChange(e.target.value)}
							defaultCurrency="USD"
						/>
					)}
				</ControlledFormField>
			</div>

			<ControlledFormField
				control={form.control}
				name="category"
				label="Category"
			>
				{(field) => (
					<Select
						options={[
							{ value: 'apparel', label: 'Apparel' },
							{ value: 'accessories', label: 'Accessories' },
							{ value: 'home', label: 'Home & living' },
						]}
						value={field.value}
						onChange={field.onChange}
						placeholder="Choose a category…"
					/>
				)}
			</ControlledFormField>

			<ControlledFormField
				control={form.control}
				name="description"
				label="Description"
			>
				{(field) => <Textarea {...field} rows={3} placeholder="What makes it special?" />}
			</ControlledFormField>

			<ControlledFormField
				control={form.control}
				name="published"
				label="Visibility"
			>
				{(field) => (
					<ToggleField
						label="Published"
						description="Visible in the storefront."
						value={Boolean(field.value)}
						onChange={field.onChange}
					/>
				)}
			</ControlledFormField>

			<div className="flex justify-end gap-2 pt-2">
				<Button type="button" variant="secondary" buttonStyle="ghost">Cancel</Button>
				<Button type="submit" variant="primary">Save product</Button>
			</div>
		</form>
	);
}
```

## Example exports

- `BasicField`
- `WithError`
- `WithHelperText`
- `InputBasic`
- `InputWithIcons`
- `InputWithAddons`
- `InputClearableLoading`
- `InputCharacterCount`
- `TextareaExample`
- `DecimalInputExample`
- `PercentageInputExample`
- `CurrencyInputExample`
- `MoneyInputExample`
- `WeightInputExample`
- `DimensionsInputExample`
- `SelectExample`
- `RichSelectExample`
- `RoundingModeSelectExample`
- `SwitchExample`
- `CheckboxExample`
- `ToggleFieldExample`
- `SwitchCardExample`
- `PillRadioGroupExample`
- `ListRadioGroupExample`
- `CardRadioGroupExample`
- `CardCheckboxGroupExample`
- `DateTimeInputExample`
- `TimePickerExample`
- `SliderExample`
- `TagsInputExample`
- `PhoneInputExample`
- `CoordinatesInputExample`
- `StringRepeaterExample`
- `ObjectRepeaterExample`
- `KeyValueEditorExample`
- `ListExample`
- `LocalizedStringFieldExample`
- `LocalizedObjectFieldExample`
- `LocalizedStringRepeaterExample`
- `AvatarUploadExample`
- `DropzoneExample`
- `WholeForm`

