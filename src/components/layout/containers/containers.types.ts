import type { HTMLAttributes, ReactNode } from 'react';

export type ContainerWidth = 'narrow' | 'default' | 'wide' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'default' | 'lg';
export type ContainerElement = 'div' | 'main' | 'section';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
	/** Content. */
	children?: ReactNode;
	/** Semantic element for the outer wrapper. */
	as?: ContainerElement;
	/** Max-width preset. `narrow` -> 7xl centered, `default` -> fluid, `wide` -> screen-2xl, `full` -> no clamp. */
	width?: ContainerWidth;
	/** Padding preset for the inner column. Ignored when `bare` is true. */
	padding?: ContainerPadding;
	/** When true, removes the padded inner box and renders the children directly. */
	bare?: boolean;
	/** Class name for the inner padded/clamped column. */
	innerClassName?: string;
}

export type SectionElement = 'section' | 'div';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
	/** Content. */
	children?: ReactNode;
	/** Semantic element. Defaults to `section`; use `div` for non-landmark grouping. */
	as?: SectionElement;
	/** Spacing density between this section and its siblings. */
	density?: 'tight' | 'default' | 'loose';
}
