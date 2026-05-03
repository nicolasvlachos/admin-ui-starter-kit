/**
 * ImageUpload — preview-first image picker. Drops in a file → renders an img
 * preview with a configurable aspect ratio and fit mode. Layout can be
 * stacked (preview on top, controls below) or inline (preview alongside
 * controls). Reflects controlled `value` and reports change via `onChange`.
 * Strings overridable for i18n.
 */
import { ImageIcon, Trash2 } from 'lucide-react';
import React, { useEffect, useId, useMemo, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useFiles } from '@/hooks/use-files';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE_MB = 2;

type ImageUploadAspectRatio = 'square' | 'standard' | 'widescreen' | 'portrait';
type ImageUploadLayout = 'stacked' | 'inline';
type ImageUploadFit = 'cover' | 'contain';

const ASPECT_RATIO_CLASSES: Record<ImageUploadAspectRatio, string> = {
    square: 'aspect-square',
    standard: 'aspect-[4/3]',
    widescreen: 'aspect-[16/9]',
    portrait: 'aspect-[9/16]',
};

export interface ImageUploadStrings {
    select: string;
    change: string;
    remove: string;
    noSelection: string;
    keepCurrent: string;
    /** Template for the supports-text. `{ext}` is the comma-separated allowed
     *  extensions; `{size}` is the max-size MB number. */
    supportsTemplate: string;
    /** Summary line when `multiple` is set and more than one file is selected.
     *  Receives the count of files beyond the displayed one — e.g. `count=3`
     *  for "+ 3 more files". Override to swap the English plural-`s` rule
     *  (`'+ ' + count + ' more file' + (count === 1 ? '' : 's')`) for the
     *  consumer locale. */
    moreFiles: (count: number) => string;
}

export const defaultImageUploadStrings: ImageUploadStrings = {
    select: 'Select image',
    change: 'Change image',
    remove: 'Remove',
    noSelection: 'No file selected yet.',
    keepCurrent: 'Current image stays until you upload a new one.',
    supportsTemplate: 'Supports {ext} files up to {size} MB.',
    moreFiles: (count) => `+ ${count} more file${count === 1 ? '' : 's'}`,
};

export interface ImageUploadProps {
    accept?: string;
    multiple?: boolean;
    value?: File;
    onChange?: (file?: File) => void;
    disabled?: boolean;
    defaultPreviewUrl?: string;
    aspectRatio?: ImageUploadAspectRatio;
    fit?: ImageUploadFit;
    maxWidth?: number | string;
    layout?: ImageUploadLayout;
    invalid?: boolean;
    /** Override default strings (button labels, helper text, supports template). */
    strings?: Partial<ImageUploadStrings>;
    /** @deprecated Use `strings.select` instead. */
    selectButtonText?: string;
    /** @deprecated Use `strings.change` instead. */
    changeButtonText?: string;
    /** @deprecated Use `strings.remove` instead. */
    removeButtonText?: string;
}

function ImageUploadImpl(
    {
    accept = '.png,.jpg,.jpeg,.gif,.svg',
    multiple = false,
    value,
    onChange,
    disabled,
    defaultPreviewUrl,
    aspectRatio = 'square',
    fit = 'cover',
    maxWidth,
    layout = 'stacked',
    invalid,
    selectButtonText,
    changeButtonText,
    removeButtonText,
    strings: stringsProp,
}: ImageUploadProps,
    forwardedRef: React.ForwardedRef<HTMLInputElement>,
) {
    const strings = useStrings(defaultImageUploadStrings, {
        ...(selectButtonText !== undefined ? { select: selectButtonText } : {}),
        ...(changeButtonText !== undefined ? { change: changeButtonText } : {}),
        ...(removeButtonText !== undefined ? { remove: removeButtonText } : {}),
        ...stringsProp,
    });
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const allowedExtensions = useMemo(() => {
        if (!accept) {
            return ['png', 'jpg', 'jpeg', 'gif', 'svg'];
        }

        const parsed = accept
            .split(',')
            .map((item) => item.trim())
            .map((item) => {
                if (!item) return null;
                if (item.startsWith('.')) {
                    return item.slice(1).toLowerCase();
                }

                if (item.includes('/')) {
                    const subtype = item.split('/')[1] ?? '';
                    if (subtype === '*' || subtype.length === 0) {
                        return null;
                    }
                    return subtype.replace(/\+.*/, '').toLowerCase();
                }

                return item.toLowerCase();
            })
            .filter((ext): ext is string => Boolean(ext));

        if (parsed.length === 0) {
            return undefined;
        }

        return Array.from(new Set(parsed));
    }, [accept]);

    const fileRules = useMemo(
        () => ({
            maxFiles: multiple ? undefined : 1,
            allowedExtensions,
        }),
        [multiple, allowedExtensions]
    );

    const { files, setFiles, remove, removeAll, validationErrors } = useFiles(fileRules);

    // Reflect controlled value into local preview if provided
    useEffect(() => {
        if (value) {
            setFiles([value]);
        } else {
            removeAll();
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    }, [value, setFiles, removeAll]);

    const selected = files[0];
	const selectOrChangeButtonLabel = selected ? strings.change : strings.select;
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | undefined>(undefined);

    const acceptedExtensionsLabel = useMemo(() => {
        if (!allowedExtensions || allowedExtensions.length === 0) {
            return null;
        }
        return allowedExtensions.map((ext) => ext.toUpperCase()).join(', ');
    }, [allowedExtensions]);

    useEffect(() => {
        const file = selected?.file ?? value;
        if (!file) {
            setFilePreviewUrl(undefined);
            return;
        }
        const url = URL.createObjectURL(file);
        setFilePreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [selected, value]);

    const previewUrl = filePreviewUrl ?? defaultPreviewUrl;
    const hasPreview = Boolean(previewUrl);
    const aspectClass = ASPECT_RATIO_CLASSES[aspectRatio] ?? ASPECT_RATIO_CLASSES.square;
    const imgFitClass = fit === 'contain' ? 'object-contain p-3' : 'object-cover';
    // Default max-width caps the preview at a sensible thumbnail size — without
    // this, an `aspect-square` preview inside a wide form column becomes a
    // huge square (`w-full` × 1:1 ratio = container width tall). Consumers
    // can override via the `maxWidth` prop.
    const computedMaxWidth = maxWidth ? (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth) : '240px';
    const wrapperStyle = layout === 'inline' ? undefined : { maxWidth: computedMaxWidth };
    const inlinePreviewStyle =
        layout === 'inline'
            ? {
                  maxWidth: maxWidth ? computedMaxWidth : '185px',
                  width: '100%',
              }
            : undefined;

    const handleInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const list = e.target.files;
            if (!list || list.length === 0) {
                removeAll();
                onChange?.(undefined);
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
                return;
            }
            setFiles(list);
            onChange?.(list[0]);
        },
        [removeAll, setFiles, onChange]
    );

    const triggerFileDialog = useCallback(() => {
        if (disabled) return;
        inputRef.current?.click();
    }, [disabled]);

    const handleRemove = useCallback(() => {
        if (selected) {
            remove(selected.id);
        }
        onChange?.(undefined);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [selected, remove, onChange]);

    return (
        <div className="space-y-3" style={wrapperStyle}>
            <input
                ref={(node) => { inputRef.current = node; if (typeof forwardedRef === "function") forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; }}
                id={inputId}
                type="file"
                className="sr-only"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={handleInput}
            />

            <div className={cn(layout === 'inline' ? 'flex items-start gap-4' : 'space-y-3')}>
                <div
                    className={cn(
                        'relative overflow-hidden rounded-md border transition-colors',
                        layout === 'inline' ? 'flex-shrink-0 w-full' : 'w-full',
                        aspectClass,
                        hasPreview
                            ? 'border-border bg-muted/20'
                            : cn(
                                  'border-dashed bg-background text-muted-foreground dark:bg-foreground',
                                  invalid ? 'border-destructive' : 'border-muted-foreground/60'
                              )
                    )}
                    style={inlinePreviewStyle}
                >
                    {hasPreview && previewUrl ? (
                        <img
                            src={previewUrl}
                            alt={selected?.name || 'Selected image'}
                            className={cn('absolute inset-0 h-full w-full', imgFitClass)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon aria-hidden className="h-8 w-8" />
                        </div>
                    )}
                </div>

                <div className={cn('space-y-2', layout === 'inline' && 'flex-1 min-w-0')}>
                    <div className="flex flex-wrap items-center gap-2">
	                <Button
	                    type="button"
	                    variant="secondary"
	                    buttonStyle="outline"
	                    onClick={triggerFileDialog}
	                    disabled={disabled}
	                >
	                    {selectOrChangeButtonLabel}
	                </Button>
                        {!selected && !!hasPreview && (
                            <Text size="xs" type="secondary">{strings.keepCurrent}</Text>
                          )}
                    </div>

                    {!!acceptedExtensionsLabel && (
                        <Text size="xs" type="secondary">
                            {strings.supportsTemplate
                                .replace('{ext}', acceptedExtensionsLabel)
                                .replace('{size}', String(MAX_FILE_SIZE_MB))}
                        </Text>
                      )}

                    {!!selected && (
                        <div className="space-y-1">
                            <Text weight="medium" title={selected.name} className="truncate">
                                {selected.name}
                            </Text>
                            <Text size="xs" type="secondary">
                                {selected.formattedSize}
                            </Text>
                            {!!multiple && files.length > 1 && (
                                <Text size="xs" type="secondary">
                                    {strings.moreFiles(files.length - 1)}
                                </Text>
                              )}
                            <Button
                                type="button"
                                variant="error"
                                buttonStyle="ghost"
                                size="xs"
                                icon={Trash2}
                                onClick={handleRemove}
                            >
                                {strings.remove}
                            </Button>
                        </div>
                      )}

                    {!selected && !hasPreview && (
                        <Text size="xs" type="secondary">{strings.noSelection}</Text>
                    )}
                </div>
            </div>

            {/* Validation errors */}
            {Object.keys(validationErrors).length > 0 && (
                <div className="space-y-1">
                    {Object.entries(validationErrors).map(([name, err]) => (
                        <Text key={name} size="xs" type="error">
                            {name}: {err}
                        </Text>
                    ))}
                </div>
            )}
        </div>
    );
}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(ImageUploadImpl);
ImageUpload.displayName = 'ImageUpload';

export { ImageUpload };
