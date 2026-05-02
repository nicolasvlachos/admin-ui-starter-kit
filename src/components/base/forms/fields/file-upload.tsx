/**
 * FileUpload — drag-and-drop file picker with single or multiple-file modes,
 * validation surfacing, and a file list preview. Uses `useFiles` for client-
 * side validation (size limits, accepted types) and emits raw `File`
 * instances upward via `onChange` / `onChangeFiles`. Strings overridable.
 */
import { File as FileIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useFiles } from '@/hooks/use-files';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

export interface FileUploadStrings {
	instruction: string;
	helper: string;
	browse: string;
	remove: string;
}

export const defaultFileUploadStrings: FileUploadStrings = {
	instruction: 'Drag a file here or click to browse',
	helper: '',
	browse: 'Browse files',
	remove: 'Remove',
};

export interface FileUploadProps {
    accept?: string;
    multiple?: boolean;
    value?: File | File[];
    onChange?: (file?: File) => void;
    onChangeFiles?: (files: File[]) => void;
    disabled?: boolean;
    invalid?: boolean;
    /** Override default English strings (instruction, helper, browse, remove). */
    strings?: Partial<FileUploadStrings>;
    /** @deprecated Use `strings.instruction` instead. */
    instructionText?: string;
    /** @deprecated Use `strings.browse` instead. */
    browseButtonText?: string;
    /** @deprecated Use `strings.remove` instead. */
    removeButtonText?: string;
    /** @deprecated Use `strings.helper` instead. */
    helperText?: string;
}

function FileUploadImpl(
    {
        accept,
        multiple = false,
        value,
        onChange,
        onChangeFiles,
        disabled,
        invalid,
        instructionText: customInstructionText,
        browseButtonText,
        removeButtonText,
        helperText,
        strings: stringsProp,
    }: FileUploadProps,
    forwardedRef: React.ForwardedRef<HTMLInputElement>,
) {
    const strings = useStrings(defaultFileUploadStrings, {
        ...(customInstructionText !== undefined ? { instruction: customInstructionText } : {}),
        ...(helperText !== undefined ? { helper: helperText } : {}),
        ...(browseButtonText !== undefined ? { browse: browseButtonText } : {}),
        ...(removeButtonText !== undefined ? { remove: removeButtonText } : {}),
        ...stringsProp,
    });
    const { files: managedFiles, setFiles, remove, removeAll, validationErrors } = useFiles({
        maxFiles: multiple ? undefined : 1,
    });

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Reflect controlled value into local state
    useEffect(() => {
        if (multiple) {
            if (Array.isArray(value) && value.length > 0) {
                setFiles(value);
            } else if (!value) {
                removeAll();
            }
            return;
        }

        if (value instanceof File) {
            setFiles([value]);
        } else if (!value) {
            removeAll();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, multiple]);

    const selectedSingle = managedFiles[0];
    const fileName = selectedSingle?.name ?? (value instanceof File ? value.name : '');
    const fileSize =
        selectedSingle?.formattedSize ??
        (value instanceof File ? `${Math.round((value.size / 1024) * 100) / 100} KB` : '');
    const hasMultipleFiles = multiple && managedFiles.length > 0;
    const hasSingleFile = !multiple && fileName.length > 0;

    const openFileDialog = useCallback(() => {
        if (!disabled) {
            inputRef.current?.click();
        }
    }, [disabled]);

    const handleFiles = useCallback(
        (incoming: FileList | File[]) => {
            if (!incoming || incoming.length === 0) {
                removeAll();
                if (multiple) {
                    onChangeFiles?.([]);
                } else {
                    onChange?.(undefined);
                }
                return;
            }

            const arrayFiles = Array.from(incoming as unknown as File[]);
            setFiles(incoming);

            if (multiple) {
                onChangeFiles?.(arrayFiles);
            } else {
                onChange?.(arrayFiles[0]);
            }
        },
        [multiple, onChange, onChangeFiles, removeAll, setFiles]
    );

    const handleInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const list = e.target.files;
            if (!list || list.length === 0) {
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
                return;
            }

            handleFiles(list);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        },
        [handleFiles]
    );

    const handleRemoveSingle = useCallback(() => {
        if (selectedSingle) {
            remove(selectedSingle.id);
        }
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        onChange?.(undefined);
    }, [onChange, remove, selectedSingle]);

    const handleRemoveMultiple = useCallback(
        (id: string) => {
            const remaining = managedFiles.filter((item) => item.id !== id).map((item) => item.file);
            remove(id);
            onChangeFiles?.(remaining);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        },
        [managedFiles, onChangeFiles, remove]
    );

    const preventDefaults = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleDragEnter = useCallback(
        (event: React.DragEvent) => {
            preventDefaults(event);
            if (!disabled) {
                setIsDragging(true);
            }
        },
        [disabled, preventDefaults]
    );

    const handleDragLeave = useCallback(
        (event: React.DragEvent) => {
            preventDefaults(event);
            setIsDragging(false);
        },
        [preventDefaults]
    );

    const handleDrop = useCallback(
        (event: React.DragEvent) => {
            preventDefaults(event);
            setIsDragging(false);

            if (disabled) {
                return;
            }

            const files = event.dataTransfer?.files;
            if (!files || files.length === 0) {
                return;
            }

            handleFiles(files);

            if (inputRef.current) {
                inputRef.current.value = '';
            }
        },
        [disabled, handleFiles, preventDefaults]
    );

    const dragStateClasses = useMemo(() => {
        const baseClasses =
            'relative flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-6 py-10 text-center transition-colors duration-150';
        const defaultBorder = invalid ? 'border-destructive' : 'border-muted-foreground/60';
        const bgClasses = 'bg-muted/40';
        const hoverClasses = 'hover:border-primary hover:bg-primary/10 hover:text-primary';
        const disabledClasses = disabled
            ? 'cursor-not-allowed opacity-60 hover:border-muted-foreground/60 hover:bg-muted/40 hover:text-muted-foreground'
            : '';
        const draggingClasses = !disabled && isDragging ? 'border-primary bg-primary/15 text-primary' : '';

        return cn(baseClasses, defaultBorder, bgClasses, hoverClasses, disabledClasses, draggingClasses);
    }, [disabled, isDragging, invalid]);

    return (
        <div className="space-y-3">
            <div
                role="button"
                tabIndex={disabled ? -1 : 0}
                className={dragStateClasses}
                onClick={(event) => {
                    if (event.defaultPrevented) {
                        return;
                    }

                    openFileDialog();
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openFileDialog();
                    }
                }}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                aria-disabled={disabled}
                aria-invalid={invalid || undefined}
            >
                <input
                    ref={(node) => {
                        inputRef.current = node;
                        if (typeof forwardedRef === 'function') {
                            forwardedRef(node);
                        } else if (forwardedRef) {
                            forwardedRef.current = node;
                        }
                    }}
                    type="file"
                    className="hidden"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleInput}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    disabled={disabled}
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <UploadIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                    <Text weight="medium">{strings.instruction}</Text>
                    {!!strings.helper && (
                        <Text size="xs" type="secondary">{strings.helper}</Text>
                    )}
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    buttonStyle="outline"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openFileDialog();
                    }}
                    disabled={disabled}
                >
                    {strings.browse}
                </Button>
            </div>

            {/* Multiple files list */}
            {!!hasMultipleFiles && (
                <div className="space-y-2">
                    {managedFiles.map((meta) => (
                        <div key={meta.id} className="flex items-center gap-3 border rounded-md p-3 bg-card">
                            <div className="shrink-0 h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <FileIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Text tag="div" weight="medium" className="truncate" title={meta.name}>
                                    {meta.name}
                                </Text>
                                <Text tag="div" size="xs" type="secondary">{meta.formattedSize}</Text>
                            </div>
                            <Button
                                type="button"
                                variant="error"
                                buttonStyle="ghost"
                                size="xs"
                                icon={Trash2Icon}
                                onClick={() => handleRemoveMultiple(meta.id)}
                            >
                                {strings.remove}
                            </Button>
                        </div>
                    ))}
                </div>
              )}

            {/* Single file display */}
            {!!hasSingleFile && (
                <div className="flex items-center gap-3 border rounded-md p-3 bg-card">
                    <div className="shrink-0 h-10 w-10 rounded bg-muted flex items-center justify-center">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <Text tag="div" weight="medium" className="truncate" title={fileName}>
                            {fileName}
                        </Text>
                        <Text tag="div" size="xs" type="secondary">{fileSize}</Text>
                    </div>
                    <Button
                        type="button"
                        variant="error"
                        buttonStyle="ghost"
                        size="xs"
                        icon={Trash2Icon}
                        onClick={handleRemoveSingle}
                    >
                        {strings.remove}
                    </Button>
                </div>
              )}

            {/* Validation errors — rendered as semantic alert rows so they
                read clearly under the dropzone instead of as a bullet list. */}
            {Object.keys(validationErrors).length > 0 && (
                <ul className="space-y-1.5">
                    {Object.entries(validationErrors).map(([name, err]) => (
                        <li
                            key={name}
                            role="alert"
                            className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2"
                        >
                            <span aria-hidden="true" className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                                <span className="size-1.5 rounded-full bg-destructive" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <Text size="xs" weight="medium" className="truncate text-destructive">
                                    {name}
                                </Text>
                                <Text size="xs" type="secondary" className="text-destructive/80">
                                    {err}
                                </Text>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(FileUploadImpl);
FileUpload.displayName = 'FileUpload';

export { FileUpload };
