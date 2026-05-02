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
import * as TiptapReact from '@tiptap/react';
import * as StarterKitModule from '@tiptap/starter-kit';

import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultRichTextEditorStrings } from '../rich-text-editor.strings';
import type {
	RichTextEditorHandle,
	RichTextEditorProps,
	ToolbarButtonConfig,
} from '../rich-text-editor.types';
import { readCaretContext, replaceBeforeCaret } from './caret-helpers';
import { CountsFooter } from './counts-footer';
import { normalizeHtml, toEditorContent } from './html-helpers';
import { RichTextEditorToolbar } from './rich-text-editor-toolbar';

const EditorContent = TiptapReact.EditorContent;
const useTiptapEditor = TiptapReact.useEditor;
const StarterKit =
	'default' in StarterKitModule ? StarterKitModule.default : StarterKitModule;

export const TiptapRichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(function TiptapRichTextEditor(
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
	const [isFocused, setIsFocused] = useState(false);
	const [sourceMode, setSourceMode] = useState(false);
	const [sourceValue, setSourceValue] = useState('');
	const isFocusedRef = useRef(false);
	const externalValueRef = useRef<string>(normalizeHtml(value));
	const onCaretChangeRef = useRef(onCaretChange);
	onCaretChangeRef.current = onCaretChange;

	const editor = useTiptapEditor({
		extensions: [StarterKit],
		content: toEditorContent(value),
		editable: !disabled,
		immediatelyRender: false,
		autofocus: autoFocus ? 'end' : false,
		onFocus: () => {
			isFocusedRef.current = true;
			setIsFocused(true);
		},
		onBlur: () => {
			isFocusedRef.current = false;
			setIsFocused(false);
		},
		onUpdate: ({ editor: currentEditor }: { editor: { getHTML: () => string } }) => {
			const html = normalizeHtml(currentEditor.getHTML());
			if (!isFocusedRef.current) {
				return;
			}

			if (html !== externalValueRef.current) {
				externalValueRef.current = html;
				onChange(html);
			}

			onCaretChangeRef.current?.();
		},
		editorProps: {
			attributes: {
				class: 'prose prose-sm prose-p:my-0.5 prose-p:leading-relaxed prose-headings:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 max-w-none px-3 py-2 text-sm focus:outline-none dark:prose-invert',
			},
		},
	});

	useEffect(() => {
		if (!editor) {
			return;
		}

		const current = normalizeHtml(editor.getHTML());
		const next = normalizeHtml(value);
		externalValueRef.current = next;

		if (current !== next) {
			editor.commands.setContent(toEditorContent(next), { emitUpdate: false });
		}
	}, [editor, value]);

	useEffect(() => {
		if (!editor) {
			return;
		}

		editor.setEditable(!disabled);
	}, [disabled, editor]);

	useEffect(() => {
		if (typeof document === 'undefined') return;
		const handler = () => {
			if (!isFocusedRef.current) return;
			onCaretChangeRef.current?.();
		};
		document.addEventListener('selectionchange', handler);
		return () => document.removeEventListener('selectionchange', handler);
	}, []);

	useImperativeHandle(
		ref,
		() => ({
			focus: () => {
				editor?.chain().focus().run();
			},
			getHTML: () => normalizeHtml(editor?.getHTML() ?? ''),
			setHTML: (html: string) => {
				const next = normalizeHtml(html);
				externalValueRef.current = next;
				editor?.commands.setContent(toEditorContent(next), { emitUpdate: false });
				onChange(next);
			},
			insertHTML: (html: string) => {
				if (!editor) return;
				editor.chain().focus().insertContent(html).run();
			},
			isEmpty: () => normalizeHtml(editor?.getHTML() ?? '') === '',
			clear: () => {
				externalValueRef.current = '';
				editor?.commands.setContent('<p></p>', { emitUpdate: false });
				onChange('');
			},
			getCaretContext: () => readCaretContext(),
			replaceBeforeCaret: (length: number, html: string) => {
				replaceBeforeCaret(editor, length, html, (next) => {
					externalValueRef.current = normalizeHtml(next);
					onChange(externalValueRef.current);
				});
			},
		}),
		[editor, onChange],
	);

	const contentStyle = useMemo(
		() => ({
			minHeight: minHeight ?? (compact ? '2rem' : '12rem'),
			...(maxHeight ? { maxHeight, overflowY: 'auto' as const } : {}),
		}),
		[compact, maxHeight, minHeight],
	);

	const toggleSourceMode = useCallback(() => {
		if (!editor) return;

		if (sourceMode) {
			const html = toEditorContent(sourceValue);
			editor.commands.setContent(html, { emitUpdate: false });
			const normalized = normalizeHtml(sourceValue);
			externalValueRef.current = normalized;
			onChange(normalized);
			setSourceMode(false);
		} else {
			setSourceValue(editor.getHTML());
			setSourceMode(true);
		}
	}, [editor, onChange, sourceMode, sourceValue]);

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

	const toolbarButtons = useMemo<ToolbarButtonConfig[]>(
		() => [
			{
				id: 'bold',
				icon: Bold,
				label: strings.toolbar.bold,
				isActive: () => Boolean(editor?.isActive('bold')),
				run: () => editor?.chain().focus().toggleBold().run(),
			},
			{
				id: 'italic',
				icon: Italic,
				label: strings.toolbar.italic,
				isActive: () => Boolean(editor?.isActive('italic')),
				run: () => editor?.chain().focus().toggleItalic().run(),
			},
			{
				id: 'strike',
				icon: Strikethrough,
				label: strings.toolbar.strike,
				isActive: () => Boolean(editor?.isActive('strike')),
				run: () => editor?.chain().focus().toggleStrike().run(),
			},
			{
				id: 'bullet-list',
				icon: List,
				label: strings.toolbar.bulletList,
				isActive: () => Boolean(editor?.isActive('bulletList')),
				run: () => editor?.chain().focus().toggleBulletList().run(),
			},
			{
				id: 'ordered-list',
				icon: ListOrdered,
				label: strings.toolbar.orderedList,
				isActive: () => Boolean(editor?.isActive('orderedList')),
				run: () => editor?.chain().focus().toggleOrderedList().run(),
			},
			{
				id: 'blockquote',
				icon: Quote,
				label: strings.toolbar.blockquote,
				isActive: () => Boolean(editor?.isActive('blockquote')),
				run: () => editor?.chain().focus().toggleBlockquote().run(),
			},
			{
				id: 'undo',
				icon: Undo2,
				label: strings.toolbar.undo,
				isActive: () => false,
				run: () => editor?.chain().focus().undo().run(),
				disabled: !editor?.can().chain().focus().undo().run(),
			},
			{
				id: 'redo',
				icon: Redo2,
				label: strings.toolbar.redo,
				isActive: () => false,
				run: () => editor?.chain().focus().redo().run(),
				disabled: !editor?.can().chain().focus().redo().run(),
			},
		],
		[editor, strings],
	);

	const countsFooter =
		showCounts && editor ? (
			<CountsFooter
				editor={editor}
				sourceMode={sourceMode}
				sourceValue={sourceValue}
				maxLength={maxLength}
				strings={strings}
			/>
		) : null;

	const placeholderText = typeof placeholder === 'string' ? placeholder : '';
	const showPlaceholder =
		placeholderText.length > 0 && !isFocused && Boolean(editor?.isEmpty);
	const placeholderNode = showPlaceholder ? (
		<span className="text-muted-foreground pointer-events-none absolute left-3 top-2 text-sm">
			{placeholderText}
		</span>
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
				hasEditor={Boolean(editor)}
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
						'bg-muted/50 w-full resize-y px-3 py-2 font-mono text-xs leading-relaxed focus:outline-none',
						disabled && 'cursor-not-allowed',
					)}
					style={contentStyle}
				/>
			) : (
				<div className="relative" style={contentStyle}>
					{placeholderNode}

					<EditorContent
						editor={editor}
						className={cn(
							'h-full',
							'[&_.ProseMirror]:h-full',
							'[&_.ProseMirror]:min-h-full',
							'[&_.ProseMirror]:outline-none',
						)}
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

TiptapRichTextEditor.displayName = 'TiptapRichTextEditor';

export const hasTiptapRuntime =
	typeof EditorContent === 'function' &&
	typeof useTiptapEditor === 'function' &&
	typeof StarterKit === 'object' &&
	StarterKit !== null;
