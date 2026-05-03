import { formatHex, oklch } from 'culori';
import QR from 'qrcode';
import type { HTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type QRCodeProps = HTMLAttributes<HTMLDivElement> & {
	data: string;
	foreground?: string;
	background?: string;
	robustness?: 'L' | 'M' | 'Q' | 'H';
};

const oklchRegex = /oklch\\(([.\\d-]+)\\s+([.\\d]+)\\s+([.\\d]+)\\)/;

function getOklch(color: string, fallback: [number, number, number]) {
	const oklchMatch = color.match(oklchRegex);

	if (!oklchMatch) {
		return { l: fallback[0], c: fallback[1], h: fallback[2] };
	}

	return {
		l: Number.parseFloat(oklchMatch[1]),
		c: Number.parseFloat(oklchMatch[2]),
		h: Number.parseFloat(oklchMatch[3]),
	};
}

export function QRCode({
	data,
	foreground,
	background,
	robustness = 'M',
	className,
	...props
}: QRCodeProps) {
	const [svg, setSvg] = useState<string | null>(null);

	useEffect(() => {
		const generateQR = async () => {
			try {
				const text = String(data ?? '').trim();
				if (!text) {
					setSvg(null);
					return;
				}

				const styles = getComputedStyle(document.documentElement);
				const foregroundColor =
					foreground ?? styles.getPropertyValue('--foreground');
				const backgroundColor =
					background ?? styles.getPropertyValue('--background');

				const foregroundOklch = getOklch(foregroundColor, [
					0.21, 0.006, 285.885,
				]);
				const backgroundOklch = getOklch(backgroundColor, [0.985, 0, 0]);

				const newSvg = await QR.toString(text, {
					type: 'svg',
					color: {
						dark: formatHex(
							oklch({ mode: 'oklch', ...foregroundOklch }),
						),
						light: formatHex(
							oklch({ mode: 'oklch', ...backgroundOklch }),
						),
					},
					width: 200,
					errorCorrectionLevel: robustness,
					margin: 0,
				});

				setSvg(newSvg);
			} catch {
				// QR generation failure (invalid data, oversized payload) — render falls
				// back to empty SVG; consumer can surface their own error from the parent.
				setSvg('');
			}
		};

		void generateQR();
	}, [data, foreground, background, robustness]);

	if (!svg) {
		return null;
	}

	return (
		<div
			className={cn('qr-code--component', 'size-full', '[&_svg]:size-full', className)}
			dangerouslySetInnerHTML={{ __html: svg }}
			{...props}
		/>
	);
}

export default QRCode;

QRCode.displayName = 'QRCode';
