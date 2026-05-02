export interface PaginationLabels {
	previous?: string;
	next?: string;
	of?: string;
	entries?: string;
	page?: string;
	rowsPerPage?: string;
	ariaLabel?: string;
}

export interface PaginationType {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	path: string;
	prev_page_url: string | null;
	next_page_url: string | null;
}
