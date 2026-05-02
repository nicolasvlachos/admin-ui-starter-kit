import Heading from '@/components/typography/heading';
import Text from '@/components/typography/text';
import Label from '@/components/typography/label';
import TextLink from '@/components/typography/text-link';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

const SIZES = ['xxs', 'xs', 'sm', 'base', 'lg', 'xl'] as const;
const TYPES = ['main', 'inverse', 'secondary', 'discrete', 'error', 'success', 'primary'] as const;
const WEIGHTS = ['regular', 'medium', 'semibold', 'bold'] as const;

export default function TypographyPage() {
	return (
		<PreviewPage title="Typography" description="Heading, Text, Label, TextLink.">
			<PreviewSection title="Heading — tags" span="full">
				<Col>
					{(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((tag) => (
						<Heading key={tag} tag={tag}>{tag.toUpperCase()} — The quick brown fox</Heading>
					))}
				</Col>
			</PreviewSection>

			<PreviewSection title="Heading with subHeading & alignment">
				<Col>
					<Heading tag="h3" subHeading="A short supporting line.">Left aligned</Heading>
					<Heading tag="h3" align="center" subHeading="Centered subheading.">Centered</Heading>
					<Heading tag="h3" align="right" subHeading="Right aligned subheading.">Right</Heading>
				</Col>
			</PreviewSection>

			<PreviewSection title="Text — sizes" span="full">
				<Col>
					{SIZES.map((size) => (
						<Text key={size} size={size}>
							{size}: The quick brown fox jumps over the lazy dog.
						</Text>
					))}
				</Col>
			</PreviewSection>

			<PreviewSection title="Text — types">
				<Col>
					{TYPES.map((type) => (
						<Text key={type} type={type}>
							type=&quot;{type}&quot; — sample text
						</Text>
					))}
				</Col>
			</PreviewSection>

			<PreviewSection title="Text — weights">
				<Col>
					{WEIGHTS.map((w) => (
						<Text key={w} weight={w}>weight={w} — sample text</Text>
					))}
				</Col>
			</PreviewSection>

			<PreviewSection title="Text — content prop & asHTML">
				<Col>
					<Text content="Rendered via content prop" />
					<Text asHTML content="<strong>Sanitized</strong> HTML &lt;script&gt;alert(1)&lt;/script&gt;" />
				</Col>
			</PreviewSection>

			<PreviewSection title="Label">
				<Col>
					<Label>Default label</Label>
					<Label className="text-primary">Custom class</Label>
				</Col>
			</PreviewSection>

			<PreviewSection title="TextLink">
				<Col>
					<TextLink href="#">Default link</TextLink>
					<TextLink href="#" underline={false}>Without underline</TextLink>
					<TextLink href="#" type="primary" weight="semibold">Primary semibold</TextLink>
					<TextLink href="#" type="error">Destructive</TextLink>
				</Col>
			</PreviewSection>
		</PreviewPage>
	);
}
