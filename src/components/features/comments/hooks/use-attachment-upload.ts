/**
 * useAttachmentUpload — manages a list of in-flight + uploaded
 * `CommentAttachment`s for a comment composer.
 *
 * Pass the consumer-supplied `onUpload` callback directly via the
 * `attachments` prop on `<Comments>` (or `<CommentComposer>`). Aborts
 * in-flight uploads when an attachment is removed.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type {
    CommentAttachment,
    CommentsAttachmentsConfig,
} from '../comments.types';

interface InFlightEntry {
    controller: AbortController;
}

export interface UseAttachmentUploadOptions extends CommentsAttachmentsConfig {
    /** Initial attachments — useful when editing an existing comment. */
    initialAttachments?: ReadonlyArray<CommentAttachment>;
    /** Fires when the list of uploaded attachments changes. */
    onChange?: (attachments: ReadonlyArray<CommentAttachment>) => void;
    /** Fires when a validation or upload error happens. */
    onError?: (error: string) => void;
}

export interface UseAttachmentUploadReturn {
    /** All attachments — uploading + uploaded + failed. */
    attachments: ReadonlyArray<CommentAttachment>;
    /** Subset of attachments that finished uploading. Use this in the form payload. */
    uploadedAttachments: ReadonlyArray<CommentAttachment>;
    /** True while at least one upload is in flight. */
    isUploading: boolean;
    /** Add files. Validates against `maxSize` / `maxFiles` first. */
    addFiles: (files: ReadonlyArray<File> | FileList) => void;
    /** Remove an attachment by id (aborts in-flight uploads). */
    removeAttachment: (id: string) => void;
    /** Retry a failed upload. */
    retryAttachment: (id: string) => void;
    /** Replace the list (used when editing or after submit). */
    setAttachments: (attachments: ReadonlyArray<CommentAttachment>) => void;
    /** Clear the list and abort everything in flight. */
    reset: () => void;
}

export function useAttachmentUpload(
    options: UseAttachmentUploadOptions = {},
): UseAttachmentUploadReturn {
    const {
        onUpload,
        maxSize,
        maxFiles,
        // `accept` is consumed by the surrounding `<input type="file"
        // accept>` element, not here — destructuring is intentional
        // even though we don't reference it inside the hook.
        disabled,
        initialAttachments,
        onChange,
        onError,
    } = options;

    const [attachments, setAttachmentsState] = useState<CommentAttachment[]>(() =>
        initialAttachments ? [...initialAttachments] : [],
    );
    const inFlightRef = useRef<Map<string, InFlightEntry>>(new Map());
    const fileCacheRef = useRef<Map<string, File>>(new Map());
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const updateAttachment = useCallback(
        (id: string, patch: Partial<CommentAttachment>) => {
            setAttachmentsState((prev) =>
                prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
            );
        },
        [],
    );

    const setAttachments = useCallback(
        (next: ReadonlyArray<CommentAttachment>) => {
            setAttachmentsState([...next]);
        },
        [],
    );

    const beginUpload = useCallback(
        (id: string, file: File) => {
            if (!onUpload) return;
            const controller = new AbortController();
            inFlightRef.current.set(id, { controller });

            updateAttachment(id, {
                status: 'uploading',
                progress: 0,
                error: undefined,
            });

            const onProgress = (progress: number) => {
                updateAttachment(id, { progress });
            };

            onUpload({ file, onProgress, signal: controller.signal })
                .then((uploaded) => {
                    inFlightRef.current.delete(id);
                    updateAttachment(id, {
                        ...uploaded,
                        id,
                        status: 'uploaded',
                        progress: 100,
                        error: undefined,
                    });
                })
                .catch((err: unknown) => {
                    inFlightRef.current.delete(id);
                    if (controller.signal.aborted) {
                        return;
                    }
                    const message =
                        err instanceof Error ? err.message : 'Upload failed';
                    updateAttachment(id, {
                        status: 'failed',
                        error: message,
                    });
                    onError?.(message);
                });
        },
        [onError, onUpload, updateAttachment],
    );

    const addFiles = useCallback(
        (filesInput: ReadonlyArray<File> | FileList) => {
            if (disabled || !onUpload) return;
            const files = Array.from(filesInput);
            if (files.length === 0) return;

            setAttachmentsState((prev) => {
                const next = [...prev];
                for (const file of files) {
                    if (
                        typeof maxFiles === 'number' &&
                        next.length >= maxFiles
                    ) {
                        onError?.('Too many attachments.');
                        break;
                    }
                    if (
                        typeof maxSize === 'number' &&
                        file.size > maxSize
                    ) {
                        onError?.('File is too large.');
                        continue;
                    }

                    const id =
                        typeof crypto !== 'undefined' && 'randomUUID' in crypto
                            ? crypto.randomUUID()
                            : `att-${Date.now()}-${Math.random().toString(36).slice(2)}`;

                    fileCacheRef.current.set(id, file);

                    next.push({
                        id,
                        name: file.name,
                        size: file.size,
                        mimeType: file.type,
                        status: 'uploading',
                        progress: 0,
                    });

                    queueMicrotask(() => beginUpload(id, file));
                }
                return next;
            });
        },
        [beginUpload, disabled, maxFiles, maxSize, onError, onUpload],
    );

    const removeAttachment = useCallback((id: string) => {
        const entry = inFlightRef.current.get(id);
        if (entry) {
            entry.controller.abort();
            inFlightRef.current.delete(id);
        }
        fileCacheRef.current.delete(id);
        setAttachmentsState((prev) => prev.filter((a) => a.id !== id));
    }, []);

    const retryAttachment = useCallback(
        (id: string) => {
            const file = fileCacheRef.current.get(id);
            if (!file) return;
            beginUpload(id, file);
        },
        [beginUpload],
    );

    const reset = useCallback(() => {
        for (const entry of inFlightRef.current.values()) {
            entry.controller.abort();
        }
        inFlightRef.current.clear();
        fileCacheRef.current.clear();
        setAttachmentsState([]);
    }, []);

    useEffect(() => {
        onChangeRef.current?.(attachments);
    }, [attachments]);

    useEffect(() => {
        const inFlight = inFlightRef.current;
        return () => {
            for (const entry of inFlight.values()) {
                entry.controller.abort();
            }
        };
    }, []);

    const uploadedAttachments = useMemo(
        () => attachments.filter((a) => a.status === 'uploaded' || !a.status),
        [attachments],
    );

    const isUploading = useMemo(
        () => attachments.some((a) => a.status === 'uploading'),
        [attachments],
    );

    return {
        attachments,
        uploadedAttachments,
        isUploading,
        addFiles,
        removeAttachment,
        retryAttachment,
        setAttachments,
        reset,
    };
}
