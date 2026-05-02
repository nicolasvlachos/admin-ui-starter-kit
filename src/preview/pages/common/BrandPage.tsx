import Logo from '@/preview/_brand/logo';
import AppLogo from '@/preview/_brand/app-logo';
import { PreviewPage, PreviewSection, Row, Col } from '../../PreviewLayout';

export default function BrandPage() {
	return (
		<PreviewPage title="Common · Brand" description="Logo + AppLogo (sized variants). Source images expected at /assets/media/gct-logo[-light].png.">
			<PreviewSection title="Logo">
				<Col>
					<Logo className="w-40 h-auto" />
					<Logo className="w-40 h-auto" inverted />
				</Col>
			</PreviewSection>

			<PreviewSection title="AppLogo — sizes" span="full">
				<Row>
					<AppLogo size="small" />
					<AppLogo size="medium" />
					<AppLogo size="large" />
				</Row>
			</PreviewSection>

			<PreviewSection title="AppLogo — variants">
				<Row>
					<AppLogo variant="dark" />
					<div className="rounded-md bg-foreground p-3">
						<AppLogo variant="light" />
					</div>
				</Row>
			</PreviewSection>
		</PreviewPage>
	);
}
