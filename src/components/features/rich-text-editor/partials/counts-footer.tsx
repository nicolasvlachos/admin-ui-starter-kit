import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import type { RichTextEditorStrings } from '../rich-text-editor.strings';
import type { TiptapEditor } from '../rich-text-editor.types';

interface CountsFooterTextProps {
	text: string;
	maxLength?: number;
	strings: RichTextEditorStrings;
}

export function CountsFooterText({ text, maxLength, strings }: CountsFooterTextProps) {
	const chars = text.length;
	const words = text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
	const overLimit = typeof maxLength === 'number' && chars > maxLength;

	return (
		<div className="border-border flex items-center justify-end gap-3 border-t px-3 py-1.5">
			<Text
				tag="span"
				size="xs"
				type={overLimit ? 'error' : 'secondary'}
				weight={overLimit ? 'medium' : 'regular'}
				className={cn('tabular-nums')}
			>
				{chars}
				{typeof maxLength === 'number' ? ` / ${maxLength}` : ''} {strings.counts.characters}
			</Text>
			<Text tag="span" size="xs" type="secondary" className="tabular-nums">
				{words} {strings.counts.words}
			</Text>
		</div>
	);
}

CountsFooterText.displayName = 'CountsFooterText';

interface CountsFooterProps {
	editor: TiptapEditor;
	sourceMode: boolean;
	sourceValue: string;
	maxLength?: number;
	strings: RichTextEditorStrings;
}

export function CountsFooter({
	editor,
	sourceMode,
	sourceValue,
	maxLength,
	strings,
}: CountsFooterProps) {
	const text = sourceMode
		? sourceValue.replace(/<[^>]*>/g, '')
		: (editor?.getText() ?? '');

	return <CountsFooterText text={text} maxLength={maxLength} strings={strings} />;
}

CountsFooter.displayName = 'CountsFooter';
