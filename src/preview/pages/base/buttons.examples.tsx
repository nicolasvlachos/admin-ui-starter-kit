import { useState } from 'react';
import { ArrowRight, Plus, Download, Trash2, Heart, Save, Share2 } from 'lucide-react';
import {
	BaseButton,
	Button,
	LoaderButton,
	TooltipButton,
	GoogleButton,
	ShopifyButton,
	TextButton,
	PageActionButton,
	type ButtonVariant,
	type ButtonStyle,
	type ButtonSize,
} from '@/components/base/buttons';

const VARIANTS: ButtonVariant[] = ['dark', 'primary', 'secondary', 'error', 'warning', 'success', 'light', 'action'];
const STYLES: ButtonStyle[] = ['solid', 'outline', 'ghost'];
const SIZES: ButtonSize[] = ['xs', 'sm', 'default', 'lg'];
const ICON_SIZES: ButtonSize[] = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'];

export function Default() {
	return <Button>Save changes</Button>;
}

export function AllVariantsSolid() {
	return (
		<div className="flex flex-wrap gap-2">
			{VARIANTS.map((v) => (
				<BaseButton key={v} variant={v} buttonStyle="solid">
					{v}
				</BaseButton>
			))}
		</div>
	);
}

export function AllVariantsOutline() {
	return (
		<div className="flex flex-wrap gap-2">
			{VARIANTS.map((v) => (
				<BaseButton key={v} variant={v} buttonStyle="outline">
					{v}
				</BaseButton>
			))}
		</div>
	);
}

export function AllVariantsGhost() {
	return (
		<div className="flex flex-wrap gap-2">
			{VARIANTS.map((v) => (
				<BaseButton key={v} variant={v} buttonStyle="ghost">
					{v}
				</BaseButton>
			))}
		</div>
	);
}

export function VariantStyleMatrix() {
	return (
		<div className="space-y-4">
			{STYLES.map((s) => (
				<div key={s} className="space-y-2">
					<div className="text-xs uppercase tracking-wide text-muted-foreground">{s}</div>
					<div className="flex flex-wrap gap-2">
						{VARIANTS.map((v) => (
							<BaseButton key={v} variant={v} buttonStyle={s}>
								{v}
							</BaseButton>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

export function Sizes() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			{SIZES.map((sz) => (
				<BaseButton key={sz} size={sz}>
					size={sz}
				</BaseButton>
			))}
		</div>
	);
}

export function IconOnlySizes() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			{ICON_SIZES.map((sz) => (
				<BaseButton key={sz} size={sz} icon={Plus}>{''}</BaseButton>
			))}
		</div>
	);
}

export function WithIconLeft() {
	return (
		<div className="flex flex-wrap gap-2">
			<BaseButton icon={Download}>Download</BaseButton>
			<BaseButton icon={Save} variant="success">Save</BaseButton>
			<BaseButton icon={Trash2} variant="error" buttonStyle="outline">Delete</BaseButton>
		</div>
	);
}

export function WithIconRight() {
	return (
		<div className="flex flex-wrap gap-2">
			<BaseButton icon={ArrowRight} iconPosition="right">Continue</BaseButton>
			<BaseButton icon={Share2} iconPosition="right" variant="secondary">Share</BaseButton>
		</div>
	);
}

export function StateDisabled() {
	return (
		<div className="flex flex-wrap gap-2">
			<BaseButton disabled>Disabled solid</BaseButton>
			<BaseButton disabled buttonStyle="outline">Disabled outline</BaseButton>
			<BaseButton disabled buttonStyle="ghost">Disabled ghost</BaseButton>
		</div>
	);
}

export function StateFullWidth() {
	return (
		<div className="w-full max-w-md">
			<BaseButton fullWidth icon={Save}>Save and continue</BaseButton>
		</div>
	);
}

export function ButtonComboFeatures() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button>Plain</Button>
			<Button loading>Saving</Button>
			<Button handlesLoading icon={Download}>Auto-loading</Button>
			<Button withTooltip="Add to favorites" icon={Heart}>Favorite</Button>
			<Button href="#" icon={ArrowRight} iconPosition="right">As anchor</Button>
		</div>
	);
}

export function LoaderButtonStates() {
	return (
		<div className="flex flex-wrap gap-2">
			<LoaderButton>Idle</LoaderButton>
			<LoaderButton loading>Saving</LoaderButton>
			<LoaderButton loading variant="success" strings={{ loading: 'Publishing…' }}>
				Publish
			</LoaderButton>
			<LoaderButton loading variant="error" strings={{ loading: 'Deleting…' }}>
				Delete
			</LoaderButton>
		</div>
	);
}

export function LoaderButtonInteractive() {
	const [loading, setLoading] = useState(false);
	return (
		<Button
			loading={loading}
			icon={Save}
			onClick={() => {
				setLoading(true);
				setTimeout(() => setLoading(false), 1500);
			}}
		>
			Click to simulate save
		</Button>
	);
}

export function TooltipButtonExample() {
	return (
		<div className="flex flex-wrap gap-2">
			<TooltipButton withTooltip="Hello tooltip">Hover me</TooltipButton>
			<TooltipButton withTooltip="Save changes" variant="success" icon={Save}>Save</TooltipButton>
			<TooltipButton withTooltip="Permanently delete" variant="error" icon={Trash2} size="icon-sm">{''}</TooltipButton>
		</div>
	);
}

export function GoogleButtonExample() {
	return (
		<div className="flex flex-col gap-2 max-w-xs">
			<GoogleButton>Continue with Google</GoogleButton>
		</div>
	);
}

export function ShopifyButtonExample() {
	return (
		<div className="flex flex-col gap-2 max-w-xs">
			<ShopifyButton resource="orders" id="1024" text="Open order #1024 in Shopify" />
		</div>
	);
}

export function TextButtonSizes() {
	return (
		<div className="flex flex-wrap items-baseline gap-4">
			<TextButton size="xs">Extra small link</TextButton>
			<TextButton size="sm">Small link</TextButton>
			<TextButton size="base">Base link</TextButton>
		</div>
	);
}

export function PageActionButtonVariants() {
	return (
		<div className="flex flex-wrap gap-2">
			<PageActionButton variant="primary">Save</PageActionButton>
			<PageActionButton variant="secondary">Discard</PageActionButton>
			<PageActionButton variant="error">Delete order</PageActionButton>
		</div>
	);
}

export function PageActionButtonSizes() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<PageActionButton variant="primary" size="xs">xs</PageActionButton>
			<PageActionButton variant="primary" size="sm">sm</PageActionButton>
			<PageActionButton variant="primary" size="base">base</PageActionButton>
		</div>
	);
}

export function RealisticToolbar() {
	return (
		<div className="flex w-full max-w-2xl items-center justify-between rounded-md border bg-card px-4 py-3">
			<div className="flex items-center gap-2">
				<Button buttonStyle="ghost" variant="secondary" icon={ArrowRight}>Back</Button>
				<div className="text-sm font-medium">Order #1042</div>
			</div>
			<div className="flex items-center gap-2">
				<Button variant="error" buttonStyle="outline" icon={Trash2}>Delete</Button>
				<Button variant="secondary" icon={Share2}>Share</Button>
				<Button variant="primary" icon={Save}>Save changes</Button>
			</div>
		</div>
	);
}
