/**
 * AiFeedback — thumbs-up / thumbs-down voter with an optional follow-up
 * comment field. Wires into model-improvement loops: emits the vote via
 * `onVote` immediately and a comment via `onSubmitComment` when the user
 * submits the textarea. After `submitted=true` the surface is replaced with
 * a thank-you confirmation. Strings overridable for i18n.
 */
import { useState } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { Textarea } from '@/components/base/forms/fields';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiFeedbackStrings,
	type AiFeedbackProps,
	type AiFeedbackVote,
} from './types';

export function AiFeedback({
	value,
	onVote,
	onSubmitComment,
	allowComment = true,
	submitted = false,
	className,
	strings: stringsProp,
}: AiFeedbackProps) {
	const strings = useStrings(defaultAiFeedbackStrings, stringsProp);
	const [internalVote, setInternalVote] = useState<AiFeedbackVote>(null);
	const [comment, setComment] = useState('');
	const vote = value ?? internalVote;

	const cast = (next: AiFeedbackVote) => {
		const resolved = vote === next ? null : next;
		if (value === undefined) setInternalVote(resolved);
		onVote?.(resolved);
	};

	if (submitted) {
		return (
			<div
				className={cn(
					'inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5',
					className,
				)}
			>
				<ThumbsUp className="size-3.5 text-success" />
				<Text size="xs" type="success" weight="medium">
					{strings.thanks}
				</Text>
			</div>
		);
	}

	return (
		<div className={cn('inline-flex flex-col gap-2', className)}>
			<div className="flex items-center gap-2">
				<Text size="xs" type="secondary">{strings.prompt}</Text>
				<Button
					type="button"
					variant="secondary"
					buttonStyle={vote === 'up' ? 'solid' : 'ghost'}
					size="icon-xs"
					aria-label={strings.thumbsUpAria}
					aria-pressed={vote === 'up'}
					onClick={() => cast('up')}
					className={cn(vote === 'up' && 'text-success bg-success/15 hover:bg-success/20')}
				>
					<ThumbsUp className="size-3.5" />
				</Button>
				<Button
					type="button"
					variant="secondary"
					buttonStyle={vote === 'down' ? 'solid' : 'ghost'}
					size="icon-xs"
					aria-label={strings.thumbsDownAria}
					aria-pressed={vote === 'down'}
					onClick={() => cast('down')}
					className={cn(vote === 'down' && 'text-destructive bg-destructive/15 hover:bg-destructive/20')}
				>
					<ThumbsDown className="size-3.5" />
				</Button>
			</div>

			{!!allowComment && !!vote && (
				<div className="flex flex-col gap-2">
					<Textarea
						value={comment}
						onChange={(e) => setComment((e.target as HTMLTextAreaElement).value)}
						placeholder={strings.commentPlaceholder}
						minRows={2}
					/>
					<div className="flex justify-end">
						<Button
							type="button"
							onClick={() => {
								onSubmitComment?.(comment, vote);
								setComment('');
							}}
							disabled={!comment.trim()}
						>
							{strings.submit}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

AiFeedback.displayName = 'AiFeedback';
