export type InertiaLink = {
	url: string;
	label: string;
	active: boolean;
};

export type PageShared = {
	app?: {
		urls?: {
			external?: {
				shopify?: string;
			};
		};
	};
	locale?: {
		current?: string;
	};
	[key: string]: unknown;
};
