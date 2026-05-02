import { cn } from '@/lib/utils';

type LogoSize = 'small' | 'medium' | 'large' | 'expand';

export default function AppLogo({ size = 'small', variant = 'dark' }: { size?: LogoSize, variant?: 'light'|'dark' }) {

    const cls = cn('w-full h-auto block', {
        'max-w-[135px]': size === 'small',
        'max-w-[165px]': size === 'medium',
        'max-w-[225px]': size === 'large',
        'max-w-auto': size === 'expand',
    })


	const path = variant === 'dark'
		? '/assets/media/gct-logo.png'
		: '/assets/media/gct-logo-light.png'
    return (
        <div className="flex items-center justify-start rounded-md">
			<img src={path} alt="Logo" className={cls}/>
		</div>
    );
}
