/**
 * NavigationTabs — large pill tab strip for prominent in-page navigation.
 * Active tab gets full-primary fill with inverse text. Lighter-weight
 * alternative is `TabNavigationMenu` (compact card-style pills).
 */
import { useStrings, type StringsProp } from '@/lib/strings';
import { cn } from '@/lib/utils';

export interface NavigationTabItem {
	label: string;
	to: string;
}

export interface NavigationTabsItem {
	label: string;
	url: string;
	active?: boolean;
}

export interface NavigationTabsStrings {
	tabsAria: string;
}

export const defaultNavigationTabsStrings: NavigationTabsStrings = {
	tabsAria: 'Tabs',
};

interface NavigationTabsProps {
	items: NavigationTabsItem[];
	currentUrl?: string;
	strings?: StringsProp<NavigationTabsStrings>;
}

function NavigationTabs({ items, currentUrl: currentUrlProp, strings: stringsProp }: NavigationTabsProps) {
	const strings = useStrings(defaultNavigationTabsStrings, stringsProp);
	const url = currentUrlProp ?? (typeof window !== 'undefined' ? window.location.pathname : '/');

	const normalizeUrl = (rawUrl: string): string => {
		try {
			const urlObj = new URL(rawUrl, window.location.origin);
			return urlObj.pathname.replace(/\/+$/, '');
		} catch {
			return rawUrl.replace(/\/+$/, '').split('?')[0];
		}
	};

	const currentUrl = normalizeUrl(url);

	const clsDefault = 'whitespace-nowrap flex items-center gap-1 leading-tight rounded-full border border-transparent px-4 py-1.5 text-sm bg-background text-foreground hover:text-background hover:bg-primary transition-all duration-150';
	return (
		<div className={cn('navigation-tabs--component', 'navigation-tabs-container w-full my-5')}>
			<nav className="inline-flex bg-muted rounded-4xl items-center gap-3 p-3" aria-label={strings.tabsAria}>
				{items.map((item) => {
					const itemUrl = normalizeUrl(item.url);
					const isActive = currentUrl === itemUrl;

					return (
						<a
							href={item.url}
							key={item.url}
							className={cn(clsDefault, {
								'!bg-primary !text-background font-semibold': isActive,
							})}
						>
							{item.label}
						</a>
					);
				})}
			</nav>
		</div>
	);
}

export default NavigationTabs;

NavigationTabs.displayName = 'NavigationTabs';
