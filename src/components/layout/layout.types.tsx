 
/**
 * Shared layout types used across page, header, and sidebar.
 *
 * The layout layer is framework-agnostic by contract. It never imports a
 * router package. Navigation is delegated to the consumer through
 * `renderLink`, with a backwards-compatible `LinkComponent` bridge for older
 * call sites.
 */
import type { ComponentType, MouseEvent, ReactNode } from 'react';

export interface LayoutLinkRenderProps {
	/** Destination URL. When omitted, render non-interactive content. */
	href?: string;
	children: ReactNode;
	className?: string;
	target?: string;
	rel?: string;
	onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
	'aria-label'?: string;
	/** Consumer hint for active styling; renderers may ignore it. */
	active?: boolean;
	/** Consumer hint to render as muted/non-interactive. */
	disabled?: boolean;
	/** Consumer hint for external-link behavior. */
	external?: boolean;
}

/**
 * Primary navigation seam. Consumers can wire Inertia, Next, React Router,
 * TanStack Router, or a plain anchor without this package importing them.
 *
 * Example:
 *   renderLink={({ href, children, className }) => (
 *     <Link href={href ?? '#'} className={className}>{children}</Link>
 *   )}
 */
export type LayoutLinkRenderer = (props: LayoutLinkRenderProps) => ReactNode;

/** Backwards-compatible component style. Prefer `renderLink` for new code. */
export type LinkComponent = ComponentType<{
	href?: string;
	className?: string;
	children?: ReactNode;
	target?: string;
	rel?: string;
	onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
	'aria-label'?: string;
}>;

export interface LayoutNavigationAdapter {
	/** Preferred renderer for framework-native links. */
	renderLink?: LayoutLinkRenderer;
	/** Compatibility bridge for old call sites. Prefer `renderLink`. */
	LinkComponent?: LinkComponent;
}

/** Default link renderer — native anchor with disabled fallback. */
export const defaultRenderLink: LayoutLinkRenderer = ({
	href,
	children,
	disabled,
	external,
	rel,
	target,
	...props
}) => {
	if (!href || disabled) {
		return <span {...props}>{children}</span>;
	}

	const resolvedTarget = target ?? (external ? '_blank' : undefined);
	const resolvedRel = rel ?? (external ? 'noopener noreferrer' : undefined);

	return (
		<a href={href} target={resolvedTarget} rel={resolvedRel} {...props}>
			{children}
		</a>
	);
};

export const DefaultLinkComponent: LinkComponent = ({ children, ...props }) => (
	<a {...props}>{children}</a>
);

/** Resolve the final renderer while preserving `LinkComponent` compatibility. */
export function resolveLayoutLinkRenderer({
	renderLink,
	LinkComponent,
}: LayoutNavigationAdapter = {}): LayoutLinkRenderer {
	if (renderLink) return renderLink;
	if (LinkComponent) {
		return ({ active, disabled, external, children, ...props }) => {
			void active;
			void external;
			if (disabled || !props.href) return <span className={props.className}>{children}</span>;
			return <LinkComponent {...props}>{children}</LinkComponent>;
		};
	}
	return defaultRenderLink;
}

/** Plain navigation item used by sidebar / breadcrumbs / page header. */
export interface NavLink {
	label: ReactNode;
	href?: string;
	handle?: string;
	badge?: string | number;
	disabled?: boolean;
	external?: boolean;
}

/** Hierarchical navigation item — extends `NavLink` with optional children. */
export interface NavItem extends NavLink {
	icon?: LayoutIconSource;
	children?: NavItem[];
	group?: string;
}

/** Breadcrumb entry. The last item with no `href` renders as the current page. */
export interface BreadcrumbItem {
	label: ReactNode;
	href?: string;
	handle?: string;
}

export type LayoutIconSource =
	| ComponentType<{ className?: string }>
	| ComponentType<React.SVGProps<SVGSVGElement>>
	| ReactNode
	| string;

export interface LayoutUser {
	name: string;
	email?: string;
	avatar?: string;
	role?: string;
}

export interface ExternalLinkItem {
	label: ReactNode;
	url: string;
	icon?: ComponentType<{ className?: string }>;
}
