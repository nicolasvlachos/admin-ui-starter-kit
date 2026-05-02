import { cn } from '@/lib/utils';

interface LogoProps {
	className?: string;
	title?: string;
	alt?: string;
	inverted?: boolean;
}

const Logo = ({ className, title, alt, inverted = false }: LogoProps) => {
	const src = '/assets/media/gct-logo.png';
	return (
		<img
			title={title ?? 'Brand logo'}
			className={cn(className, 'dark:invert-100')}
			style={{ filter: inverted ? 'brightness(5)' : 'brightness(1)' }}
			src={src}
			alt={alt ?? 'GCT'}
			width={350}
			height={62}
		/>
	);
}

export default Logo;
