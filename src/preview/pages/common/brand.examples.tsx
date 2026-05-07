// @ts-nocheck
import Logo from '@/preview/_brand/logo';
import AppLogo from '@/preview/_brand/app-logo';
import { Row, Col } from '../../PreviewLayout';

export function LogoExample() {
	return (
		<>
			<Col>
								<Logo className="w-40 h-auto" />
								<Logo className="w-40 h-auto" inverted />
							</Col>
		</>
	);
}

export function AppLogoSizes() {
	return (
		<>
			<Row>
								<AppLogo size="small" />
								<AppLogo size="medium" />
								<AppLogo size="large" />
							</Row>
		</>
	);
}

export function AppLogoVariants() {
	return (
		<>
			<Row>
								<AppLogo variant="dark" />
								<div className="rounded-md bg-foreground p-3">
									<AppLogo variant="light" />
								</div>
							</Row>
		</>
	);
}
