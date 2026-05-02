/**
 * CommentComposer — TipTap-backed rich text editor with inline reference
 * picker and attachment uploader. Default composer for `<Comments>`.
 *
 * Mention/reference handling is delegated to the shared
 * `features/mentions` module: `useMentions` drives picker state +
 * caret-trigger detection, `<MentionPicker>` renders the popover, and
 * `<MentionChip>` renders draft-list chips. The same primitives power
 * inline references in `features/event-log`.
 */
import { AtSign, Loader2, Paperclip, Send, X } from 'lucide-react';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { ReactNode } from 'react';

import { Button } from '@/components/base/buttons';
import { Popover, PopoverTrigger } from '@/components/base/popover';
import { Text } from '@/components/typography';
import {
    RichTextEditor,
    type RichTextEditorHandle,
    type RichTextEditorToolbarItem,
} from '@/components/features/rich-text-editor/rich-text-editor';
import {
    MentionInlineSuggestions,
    MentionPicker,
    parseMentionsFromHtml,
    useMentions,
} from '@/components/features/mentions';
import { useResolvedStrings } from '../comments-provider';
import { interpolateString } from '../comments.strings';
import type {
    CommentComposerProps,
    CommentFormValues,
} from '../comments.types';
import { CommentAttachmentChip } from './comment-attachment-chip';
import { useAttachmentUpload } from '../hooks/use-attachment-upload';

export interface CommentComposerHandle {
    focus(): void;
    clear(): void;
    /** Imperatively set the draft body. */
    setBody(html: string): void;
}

function hasMeaningfulContent(html: string): boolean {
    if (!html || typeof html !== 'string') return false;
    const text = html.replace(/<[^>]*>/g, '').trim();
    return text.length > 0;
}

export const CommentComposer = forwardRef<
    CommentComposerHandle,
    CommentComposerProps
>(function CommentComposer(
    {
        context,
        canComment = true,
        isSubmitting = false,
        errors,
        resetKey = 0,
        onSubmit,
        onCancel,
        editingComment,
        strings: stringsProp,
        resources: resourcesProp,
        onResourceSearch: onResourceSearchProp,
        attachments: attachmentsProp,
        initialValues,
        autoFocus = false,
        inlineSubmit = true,
        placeholder,
    },
    ref,
) {
    const strings = useResolvedStrings(stringsProp);

    const resources = resourcesProp;
    const onResourceSearch = onResourceSearchProp;
    const attachmentsConfig = attachmentsProp;

    const editorRef = useRef<RichTextEditorHandle>(null);
    const [body, setBody] = useState<string>(
        () => initialValues?.content ?? editingComment?.content ?? '',
    );
    const [contentError, setContentError] = useState<string | null>(null);

    /**
     * Mentions state — picker + caret-trigger detection. The hook reads
     * the editor handle via the ref we pass; on suggestion select it
     * inserts the chip and replaces the trigger range automatically.
     */
    const mentions = useMentions({
        resources,
        onResourceSearch,
        editorRef,
        initialMentions:
            initialValues?.references ?? editingComment?.references,
    });

    const attachmentUpload = useAttachmentUpload({
        ...attachmentsConfig,
        initialAttachments: initialValues?.attachments ?? undefined,
    });

    useImperativeHandle(
        ref,
        () => ({
            focus: () => editorRef.current?.focus(),
            clear: () => {
                editorRef.current?.clear();
                mentions.reset();
                attachmentUpload.reset();
                setContentError(null);
            },
            setBody: (html) => {
                editorRef.current?.setHTML(html);
            },
        }),
        [attachmentUpload, mentions],
    );

    // Reset on context change / resetKey bump
    useEffect(() => {
        editorRef.current?.setHTML(initialValues?.content ?? '');
        mentions.setMentions(initialValues?.references ?? []);
        attachmentUpload.setAttachments(initialValues?.attachments ?? []);
        setContentError(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.id, context.type, resetKey]);

    // Sync editing comment payload
    useEffect(() => {
        if (!editingComment) return;
        editorRef.current?.setHTML(editingComment.content ?? '');
        mentions.setMentions(editingComment.references ?? []);
        const list = (editingComment.attachments ?? editingComment.media ?? []).filter(
            (a): a is NonNullable<typeof a> => !!a,
        );
        attachmentUpload.setAttachments(list);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingComment?.id]);

    // Surface server-side errors
    useEffect(() => {
        if (errors?.content) {
            setContentError(errors.content);
        }
    }, [errors]);

    const handleSubmit = (event?: React.FormEvent) => {
        event?.preventDefault();
        const html = editorRef.current?.getHTML() ?? body;
        if (!hasMeaningfulContent(html)) {
            setContentError(strings.invalidContent);
            return;
        }
        setContentError(null);

        const values: CommentFormValues = {
            content: html,
            commentableId: context.id,
            commentableType: context.type,
            contentType: 'html',
            references: mentions.mentions,
            attachments: attachmentUpload.uploadedAttachments,
            editingId: editingComment?.id,
        };

        onSubmit(values);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleAttachmentClick = () => fileInputRef.current?.click();
    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        attachmentUpload.addFiles(files);
    };

    const hasAttachments = attachmentUpload.attachments.length > 0;
    const isEditing = !!editingComment;

    const submitLabel = isSubmitting
        ? strings.composerSubmitting
        : isEditing
          ? strings.composerSave
          : strings.composerSubmit;

    const eyebrow: ReactNode = isEditing ? (
        <ComposerEyebrow
            label={strings.composerEditingEyebrow}
            closeLabel={strings.composerCancel}
            onClose={onCancel}
        />
    ) : null;

    const extraToolbarItems = useMemo<ReadonlyArray<RichTextEditorToolbarItem>>(() => {
        const items: RichTextEditorToolbarItem[] = [];
        if (resources && Object.keys(resources).length > 0) {
            items.push({
                id: 'reference',
                icon: AtSign,
                label: strings.composerReferenceLabel,
                onClick: () => mentions.setPickerOpen(true),
            });
        }
        if (attachmentsConfig?.onUpload && !attachmentsConfig.disabled) {
            items.push({
                id: 'attachment',
                icon: Paperclip,
                label: strings.composerAttachmentLabel,
                onClick: handleAttachmentClick,
            });
        }
        return items;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        resources,
        attachmentsConfig?.onUpload,
        attachmentsConfig?.disabled,
        strings.composerReferenceLabel,
        strings.composerAttachmentLabel,
    ]);

    if (!canComment) return null;

    const submitButton = (
        <Button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSubmitting || attachmentUpload.isUploading}
            icon={isSubmitting ? Loader2 : Send}
        >
            {submitLabel}
        </Button>
    );

    const cancelButton = (isEditing || onCancel) ? (
        <Button
            type="button"
            variant="secondary"
            buttonStyle="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
        >
            {strings.composerCancel}
        </Button>
    ) : null;

    // Mentions live as inline `<span class="rsc-mention" contenteditable="false">`
    // chips inside the editor body — they're visible, dismissible (single
    // backspace deletes the whole span), and the HTML→mentions sync keeps
    // `mentions.mentions` aligned automatically. Rendering them again as a
    // chip-list below the editor was redundant and confusing.

    const attachmentChips = hasAttachments ? (
        <div className="flex flex-wrap items-center gap-1.5">
            {attachmentUpload.attachments.map((attachment) => (
                <CommentAttachmentChip
                    key={attachment.id}
                    attachment={attachment}
                    editable
                    onRemove={attachmentUpload.removeAttachment}
                    onRetry={attachmentUpload.retryAttachment}
                    strings={stringsProp}
                />
            ))}
        </div>
    ) : null;

    const footerSlot = hasAttachments ? attachmentChips : null;

    const trailingSubmit = inlineSubmit !== false ? submitButton : null;
    const showFooterRow = inlineSubmit === false || isEditing;

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            {eyebrow}

            <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                accept={attachmentsConfig?.accept}
                onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = '';
                }}
            />

            {/* Manual button-click flow: regular popover anchored to the
                hidden trigger. The inline-trigger flow uses the panel
                rendered below — no focus stealing while the user types. */}
            {!mentions.triggerActive && (
                <Popover open={mentions.pickerOpen} onOpenChange={mentions.setPickerOpen}>
                    <PopoverTrigger
                        render={
                            <button
                                type="button"
                                className="sr-only"
                                tabIndex={-1}
                            />
                        }
                    >
                        {strings.composerReferenceLabel}
                    </PopoverTrigger>
                    <MentionPicker
                        open={mentions.pickerOpen}
                        activeKind={mentions.activeKind}
                        setActiveKind={mentions.setActiveKind}
                        kinds={mentions.kinds}
                        resources={resources}
                        query={mentions.query}
                        setQuery={mentions.setQuery}
                        suggestions={mentions.suggestions}
                        isLoading={mentions.isLoading}
                        onSelect={mentions.pickSuggestion}
                        strings={{
                            title: strings.composerReferenceMenuTitle,
                            searchPlaceholder: strings.composerReferenceSearchPlaceholder,
                            empty: strings.composerReferenceEmpty,
                            loading: strings.composerReferenceLoading,
                        }}
                    />
                </Popover>
            )}

            <div className="relative">
                <RichTextEditor
                    ref={editorRef}
                    value={body}
                    onChange={(html) => {
                        setBody(html);
                        // Sync the draft's mentions list with what's
                        // actually present in the HTML — when the user
                        // backspaces a chip span out of the body, the
                        // chip-list below shrinks too. We merge with
                        // the previously-known list so consumer-supplied
                        // `href` / `data` payloads survive parsing.
                        const parsed = parseMentionsFromHtml<string>(html);
                        const previous = mentions.mentions;
                        const previousIds = previous.map((m) => m.id).join('|');
                        const currentIds = parsed.map((m) => m.id).join('|');
                        if (previousIds !== currentIds) {
                            const byId = new Map(previous.map((m) => [m.id, m]));
                            const merged = parsed.map(
                                (p) => byId.get(p.id) ?? p,
                            );
                            mentions.setMentions(merged);
                        }
                    }}
                    placeholder={placeholder ?? strings.composerPlaceholder}
                    minHeight="3rem"
                    autoFocus={autoFocus || isEditing}
                    extraToolbarItems={extraToolbarItems}
                    toolbarTrailing={trailingSubmit}
                    footerSlot={footerSlot}
                    onCaretChange={mentions.handleCaretChange}
                />

                <MentionInlineSuggestions
                    open={mentions.triggerActive && mentions.pickerOpen}
                    activeKind={mentions.activeKind}
                    setActiveKind={mentions.setActiveKind}
                    onManualKindChange={() => mentions.setManualKindOverride(true)}
                    kinds={mentions.kinds}
                    resources={resources}
                    query={mentions.query}
                    suggestions={mentions.suggestions}
                    suggestionsByKind={mentions.suggestionsByKind}
                    isLoading={mentions.isLoading}
                    onSelect={mentions.pickSuggestion}
                    strings={{
                        title: strings.composerReferenceMenuTitle,
                        empty: strings.composerReferenceEmpty,
                        loading: strings.composerReferenceLoading,
                    }}
                />
            </div>

            {contentError && (
                <Text size="xs" type="error">
                    {contentError}
                </Text>
            )}

            {showFooterRow && (
                <div className="flex items-center justify-end gap-2">
                    {cancelButton}
                    {submitButton}
                </div>
            )}
        </form>
    );
});

/* ------------------------------------------------------------------ */
/*  ComposerEyebrow                                                    */
/* ------------------------------------------------------------------ */

function ComposerEyebrow({
    label,
    closeLabel,
    onClose,
}: {
    label: string;
    closeLabel: string;
    onClose?: () => void;
}) {
    return (
        <div className="bg-muted/40 ring-border/60 flex items-center justify-between rounded px-2.5 py-1.5 ring-1 ring-inset">
            <Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wide">
                {label}
            </Text>
            {onClose ? (
                <button
                    type="button"
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground inline-flex size-4 items-center justify-center rounded transition-colors"
                    aria-label={closeLabel}
                >
                    <X className="size-3" />
                </button>
            ) : null}
        </div>
    );
}

/** Helper export for templated reply eyebrow. */
export function makeReplyEyebrow(template: string, name?: string): string {
    return interpolateString(template, { name: name ?? '' });
}
