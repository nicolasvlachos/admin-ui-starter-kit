import { ArrowRight, Plus, Download, Trash2, Heart } from 'lucide-react';
import {
	BaseButton,
	Button,
	LoaderButton,
	TooltipButton,
	GoogleButton,
	TextButton,
	PageActionButton,
	type ButtonVariant,
	type ButtonStyle,
	type ButtonSize,
} from '@/components/base/buttons';
import { PreviewPage, PreviewSection, Row, Col } from '../../PreviewLayout';

const VARIANTS: ButtonVariant[] = ['dark', 'primary', 'secondary', 'error', 'warning', 'success', 'light', 'action'];
const STYLES: ButtonStyle[] = ['solid', 'outline', 'ghost'];
const SIZES: ButtonSize[] = ['xs', 'sm', 'default', 'lg'];

export default function ButtonsPage() {
	return (
		<PreviewPage
			title="Buttons"
			description="Base buttons (variant × style × size), and the higher-level Button + specialty buttons."
		>
			<PreviewSection title="BaseButton — variants × styles" span="full">
				<Col>
					{STYLES.map((s) => (
						<div key={s} className="space-y-2">
							<div className="text-xs uppercase tracking-wide text-muted-foreground">{s}</div>
							<Row>
								{VARIANTS.map((v) => (
									<BaseButton key={v} variant={v} buttonStyle={s}>
										{v}
									</BaseButton>
								))}
							</Row>
						</div>
					))}
				</Col>
			</PreviewSection>

			<PreviewSection title="Sizes">
				<Row>
					{SIZES.map((sz) => (
						<BaseButton key={sz} size={sz}>
							size={sz}
						</BaseButton>
					))}
				</Row>
			</PreviewSection>

			<PreviewSection title="Icon sizes">
				<Row>
					<BaseButton size="icon-xs" icon={Plus}>{''}</BaseButton>
					<BaseButton size="icon-sm" icon={Plus}>{''}</BaseButton>
					<BaseButton size="icon" icon={Plus}>{''}</BaseButton>
					<BaseButton size="icon-lg" icon={Plus}>{''}</BaseButton>
				</Row>
			</PreviewSection>

			<PreviewSection title="With icons (left / right)">
				<Row>
					<BaseButton icon={Download} iconPosition="left">Download</BaseButton>
					<BaseButton icon={ArrowRight} iconPosition="right">Continue</BaseButton>
					<BaseButton variant="error" icon={Trash2}>Delete</BaseButton>
					<BaseButton variant="success" buttonStyle="outline" icon={Heart}>Favorite</BaseButton>
				</Row>
			</PreviewSection>

			<PreviewSection title="States">
				<Row>
					<BaseButton>Default</BaseButton>
					<BaseButton disabled>Disabled</BaseButton>
					<BaseButton fullWidth>fullWidth</BaseButton>
				</Row>
			</PreviewSection>

			<PreviewSection title="Button (combo: loader + link + tooltip)" span="full">
				<Row>
					<Button>Plain</Button>
					<Button loading>Loading…</Button>
					<Button handlesLoading icon={Download}>handlesLoading</Button>
					<Button withTooltip="I am a tooltip" icon={Heart}>Hover me</Button>
					<Button href="#" icon={ArrowRight} iconPosition="right">As anchor</Button>
				</Row>
			</PreviewSection>

			<PreviewSection title="LoaderButton">
				<Row>
					<LoaderButton loading>Saving…</LoaderButton>
					<LoaderButton loading={false}>Idle</LoaderButton>
					<LoaderButton loading variant="success" loadingLabels={{ loading: 'Working' }}>
						Custom label
					</LoaderButton>
				</Row>
			</PreviewSection>

			<PreviewSection title="TooltipButton">
				<Row>
					<TooltipButton withTooltip="Hello tooltip">Hover</TooltipButton>
					<TooltipButton withTooltip="Save changes" variant="success" icon={Plus}>Save</TooltipButton>
				</Row>
			</PreviewSection>

			<PreviewSection title="GoogleButton">
				<Row>
					<GoogleButton>Continue with Google</GoogleButton>
				</Row>
			</PreviewSection>

			<PreviewSection title="TextButton">
				<Row>
					<TextButton size="xs">extra small</TextButton>
					<TextButton size="sm">small</TextButton>
					<TextButton size="base">base</TextButton>
				</Row>
			</PreviewSection>

			<PreviewSection title="PageActionButton">
				<Row>
					<PageActionButton variant="primary">Primary</PageActionButton>
					<PageActionButton variant="secondary">Secondary</PageActionButton>
					<PageActionButton variant="error">Delete</PageActionButton>
				</Row>
			</PreviewSection>
		</PreviewPage>
	);
}
