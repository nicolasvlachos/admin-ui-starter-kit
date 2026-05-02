import type { AnchorHTMLAttributes } from 'react';

type TableLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export const TableLink = (props: TableLinkProps) => {
	return (
		<a
			className="text-foreground underline decoration-border decoration-dotted underline-offset-2 transition-colors duration-150 hover:text-foreground hover:decoration-muted-foreground"
			{...props}
		>
			{props.children}
		</a>
	);
};
