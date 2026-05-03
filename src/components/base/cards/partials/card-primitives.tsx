/**
 * Internal layout primitives — re-exported from `smart-card.tsx` for
 * advanced composition (deeply customised layouts that still want the
 * design-system surface tokens). Each primitive is intentionally thin:
 * a single responsibility, a single set of default classes, no business
 * logic. The BEM hooks (`card--component`, `card--header`, etc.) are
 * applied here so the public DOM contract lives in one place.
 */
import {
	type ComponentPropsWithRef,
	type ComponentPropsWithoutRef,
} from 'react';

import {
	Card as CardPrimitive,
	CardContent as CardContentPrimitive,
	CardDescription as CardDescriptionPrimitive,
	CardFooter as CardFooterPrimitive,
	CardHeader as CardHeaderPrimitive,
	CardTitle as CardTitlePrimitive,
} from '@/components/ui/card';
import Text from '@/components/typography/text';
import { cn } from '@/lib/utils';

import { CARD_BEM } from '../smart-card.tokens';

import { hasRenderableContent } from './has-renderable-content';

export function CardShell({ className, ...props }: ComponentPropsWithRef<'div'>) {
	return (
		<CardPrimitive
			className={cn(
				CARD_BEM.root,
				'flex flex-col gap-6 py-6 ring-0',
				className,
			)}
			{...props}
		/>
	);
}

export function CardHeader({
	className,
	...props
}: ComponentPropsWithoutRef<'div'>) {
	return (
		<CardHeaderPrimitive
			className={cn(CARD_BEM.header, 'flex flex-col gap-0.5 px-6', className)}
			{...props}
		/>
	);
}

export function CardTitle({
	className,
	children,
	...props
}: ComponentPropsWithoutRef<'div'>) {
	if (!hasRenderableContent(children)) return null;

	const isPlainText =
		typeof children === 'string' ||
		typeof children === 'number' ||
		typeof children === 'bigint';

	if (!isPlainText) {
		return (
			<CardTitlePrimitive
				className={cn(CARD_BEM.title, 'leading-none font-semibold', className)}
				{...props}
			>
				{children}
			</CardTitlePrimitive>
		);
	}

	return (
		<Text
			data-slot="card-title"
			tag="div"
			weight="semibold"
			lineHeight="none"
			className={cn(CARD_BEM.title, 'leading-none font-semibold', className)}
			{...props}
		>
			{children}
		</Text>
	);
}

export function CardDescription({
	className,
	children,
	...props
}: ComponentPropsWithoutRef<'div'>) {
	if (!hasRenderableContent(children)) return null;

	const isPlainText =
		typeof children === 'string' ||
		typeof children === 'number' ||
		typeof children === 'bigint';

	if (!isPlainText) {
		return (
			<CardDescriptionPrimitive
				className={cn(
					CARD_BEM.description,
					'text-muted-foreground text-sm',
					className,
				)}
				{...props}
			>
				{children}
			</CardDescriptionPrimitive>
		);
	}

	return (
		<Text
			data-slot="card-description"
			tag="div"
			type="secondary"
			className={cn(
				CARD_BEM.description,
				'text-muted-foreground text-sm',
				className,
			)}
			{...props}
		>
			{children}
		</Text>
	);
}

export function CardContent({
	className,
	...props
}: ComponentPropsWithoutRef<'div'>) {
	return (
		<CardContentPrimitive
			className={cn(CARD_BEM.content, 'px-6', className)}
			{...props}
		/>
	);
}

export function CardFooter({
	className,
	...props
}: ComponentPropsWithoutRef<'div'>) {
	return (
		<CardFooterPrimitive
			className={cn(CARD_BEM.footer, 'flex items-center px-6', className)}
			{...props}
		/>
	);
}
