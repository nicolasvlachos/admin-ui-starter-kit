import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Quote,
	Redo2,
	Strikethrough,
	Undo2,
} from 'lucide-react';

import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultRichTextEditorStrings } from '../rich-text-editor.strings';
import type {
	RichTextEditorHandle,
	RichTextEditorProps,
	ToolbarButtonConfig,
} from '../rich-text-editor.types';
import {
	insertHtmlIntoEditable,
	readCaretContext,
	replaceBeforeCaret,
} from './caret-helpers';
import { CountsFooterText } from './counts-footer';
import { normalizeHtml, toEditorContent } from './html-helpers';
import { RichTextEditorToolbar } from './rich-text-editor-toolbar';

/**
 * Fallback editor used when the TipTap runtime is unavailable (e.g. in
 * environments where the package failed to load). Renders a
 * `contenteditable` surface with the same imperative handle so callers
 * never need to care which variant they got.
 */
export const FallbackRichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(function FallbackRichTextEditor(
	{
		value,
		onChange,
		placeholder,
		compact = false,
		minHeight,
		maxHeight,
		disabled = false,
		showCounts = false,
		maxLength,
		extraToolbarItems,
		toolbarTrailing,
		footerSlot,
		hideSourceToggle = false,
		autoFocus = false,
		className,
		onCaretChange,
		strings: stringsProp,
	},
	ref,
) {
	const strings = useStrings(defaultRichTextEditorStrings, stringsProp);
	const editableRef = useRef<HTMLDivElement>(null);
	const [isFocused, setIsFocused] = useState(false);
	const [sourceMode, setSourceMode] = useState(false);
	const [sourceValue, setSourceValue] = useState('');
	const externalValueRef = useRef<string>(normalizeHtml(value));
	const onCaretChangeRef = useRef(onCaretChange);
	onCaretChangeRef.current = onCaretChange;

	useEffect(() => {
		const editable = editableRef.current;
		if (!editable || isFocused) return;
		const next = toEditorContent(value);
		if (normalizeHtml(editable.innerHTML) !== normalizeHtml(next)) {
			editable.innerHTML = next;
		}
		externalValueRef.current = normalizeHtml(value);
	}, [isFocused, value]);

	useEffect(() => {
		if (!autoFocus) return;
		editableRef.current?.focus();
	}, [autoFocus]);

	const emitEditableChange = useCallback(() => {
		const editable = editableRef.current;
		const html = normalizeHtml(editable?.innerHTML ?? '');
		externalValueRef.current = html;
		onChange(html);
		onCaretChangeRef.current?.();
	}, [onChange]);

	useImperativeHandle(
		ref,
		() => ({
			focus: () => editableRef.current?.focus(),
			getHTML: () => normalizeHtml(editableRef.current?.innerHTML ?? ''),
			setHTML: (html: string) => {
				const next = normalizeHtml(html);
				externalValueRef.current = next;
				if (editableRef.current) {
					editableRef.current.innerHTML = toEditorContent(next);
				}
				onChange(next);
			},
			insertHTML: (html: string) => {
				insertHtmlIntoEditable(editableRef.current, html);
				emitEditableChange();
			},
			isEmpty: () => normalizeHtml(editableRef.current?.innerHTML ?? '') === '',
			clear: () => {
				externalValueRef.current = '';
				if (editableRef.current) editableRef.current.innerHTML = '<p></p>';
				onChange('');
			},
			getCaretContext: () => readCaretContext(),
			replaceBeforeCaret: (length: number, html: string) => {
				replaceBeforeCaret(null, length, html, () => emitEditableChange());
			},
		}),
		[emitEditableChange, onChange],
	);

	const contentStyle = useMemo(
		() => ({
			minHeight: minHeight ?? (compact ? '2rem' : '12rem'),
			...(maxHeight ? { maxHeight, overflowY: 'auto' as const } : {}),
		}),
		[compact, maxHeight, minHeight],
	);

	const toggleSourceMode = useCallback(() => {
		if (sourceMode) {
			const normalized = normalizeHtml(sourceValue);
			externalValueRef.current = normalized;
			if (editableRef.current) {
				editableRef.current.innerHTML = toEditorContent(normalized);
			}
			onChange(normalized);
			setSourceMode(false);
			return;
		}
		setSourceValue(editableRef.current?.innerHTML ?? toEditorContent(value));
		setSourceMode(true);
	}, [onChange, sourceMode, sourceValue, value]);

	const handleSourceChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const next = e.target.value;
			setSourceValue(next);
			const normalized = normalizeHtml(next);
			externalValueRef.current = normalized;
			onChange(normalized);
		},
		[onChange],
	);

	const placeholderText = typeof placeholder === 'string' ? placeholder : '';
	const isEmpty = normalizeHtml(externalValueRef.current) === '';
	const placeholderNode =
		placeholderText.length > 0 && !isFocused && isEmpty ? (
			<span className="text-muted-foreground pointer-events-none absolute left-3 top-2 text-sm">
				{placeholderText}
			</span>
		) : null;

	const toolbarButtons = useMemo<ToolbarButtonConfig[]>(
		() => [
			{ id: 'bold', icon: Bold, label: strings.toolbar.bold, isActive: () => false, run: () => undefined, disabled: true },
			{ id: 'italic', icon: Italic, label: strings.toolbar.italic, isActive: () => false, run: () => undefined, disabled: true },
			{ id: 'strike', icon: Strikethrough, label: strings.toolbar.strike, isActive: () => false, run: () => undefined, disabled: true },
			{ id: 'bullet-list', icon: List, label: strings.toolbar.bulletList, isActive: () => false, run: () => undefined, disabled: true },
			{ id: 'ordered-list', icon: ListOrdered, label: strings.toolbar.orderedList, isActive: () => false, run: () => undefined, disabled: true },
			{ id: 'blockquote', icon: Quote, label: strings.toolbar.blockquote, isActive: () => false, run: () => undefined, disabled: true },
			{ id: 'undo', icon: Undo2, label: strings.toolbar.undo, isActive: () => false, run: () => undefined, disabled: true },
			{ id: 'redo', icon: Redo2, label: strings.toolbar.redo, isActive: () => false, run: () => undefined, disabled: true },
		],
		[strings],
	);

	const text = sourceMode
		? sourceValue.replace(/<[^>]*>/g, '')
		: (editableRef.current?.innerText ?? normalizeHtml(value).replace(/<[^>]*>/g, ''));
	const countsFooter =
		showCounts ? (
			<CountsFooterText text={text} maxLength={maxLength} strings={strings} />
		) : null;

	return (
		<div
			className={cn(
				'border-input bg-background rounded-md border',
				disabled && 'opacity-70',
				className,
			)}
		>
			<RichTextEditorToolbar
				buttons={toolbarButtons}
				extraToolbarItems={extraToolbarItems}
				hideSourceToggle={hideSourceToggle}
				sourceMode={sourceMode}
				toggleSourceMode={toggleSourceMode}
				disabled={disabled}
				hasEditor
				toolbarTrailing={toolbarTrailing}
				strings={strings}
			/>

			{sourceMode ? (
				<textarea
					value={sourceValue}
					onChange={handleSourceChange}
					disabled={disabled}
					spellCheck={false}
					className={cn(
						'bg-muted/50 w-full resize-y px-3 py-2 font-mono text-xs leading-relaxed focus-visible:outline-none',
						disabled && 'cursor-not-allowed',
					)}
					style={contentStyle}
				/>
			) : (
				<div className="relative" style={contentStyle}>
					{placeholderNode}
					<div
						ref={editableRef}
						contentEditable={!disabled}
						suppressContentEditableWarning
						onInput={emitEditableChange}
						onKeyUp={() => onCaretChangeRef.current?.()}
						onMouseUp={() => onCaretChangeRef.current?.()}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						className={cn(
							'prose prose-sm prose-p:my-0.5 prose-p:leading-relaxed prose-headings:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 max-w-none px-3 py-2 text-sm focus-visible:outline-none dark:prose-invert',
							'h-full min-h-full',
							disabled && 'cursor-not-allowed',
						)}
						dangerouslySetInnerHTML={{ __html: toEditorContent(value) }}
					/>
				</div>
			)}

			{!!footerSlot && (
				<div className="px-3 pb-2 pt-1">{footerSlot}</div>
			)}

			{countsFooter}
		</div>
	);
});

FallbackRichTextEditor.displayName = 'FallbackRichTextEditor';
