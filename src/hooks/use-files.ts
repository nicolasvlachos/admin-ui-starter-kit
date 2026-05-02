import { useState, useCallback } from 'react';

// Validation rule definitions for files
type FileValidationRules = {
  maxSize?: number;              // Max file size in bytes
  minSize?: number;              // Min file size in bytes
  allowedExtensions?: string[];  // e.g. ['jpg', 'png', 'pdf']
  maxFiles?: number;             // Max number of files allowed
  customValidator?: (file: File) => boolean | string; // Return true if valid, string message if invalid
};

// Extended file metadata returned by the hook
export interface FileMeta {
  id: string;
  file: File;
  name: string;
  size: number;
  formattedSize: string;
  type: string;
  extension: string;
  lastModified: number;
}

// Hook return types
type UseFilesReturn = {
  files: FileMeta[];
  addFiles: (incoming: FileList | File[]) => void;
  setFiles: (incoming: FileList | File[]) => void;
  remove: (id: string) => void;
  removeAll: () => void;
  formatSize: (bytes: number) => string;
  validationErrors: Record<string, string>;
};

// Utility to format bytes into human-readable strings
const defaultFormatSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(2)} ${sizes[i]}`;
};

// Simple unique ID generator using timestamp and incremental counter
let idCounter = 0;
const generateId = (): string => {
  const ts = Date.now().toString(36);
  const count = (idCounter++).toString(36);
  return `${ts}-${count}`;
};

export const useFiles = (
  rules?: FileValidationRules
): UseFilesReturn => {
  const [files, setFilesState] = useState<FileMeta[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Format size callback
  const formatSize = useCallback(defaultFormatSize, []);

  // Validate a single file, return error message or null
  const validateFile = useCallback((file: File): string | null => {
    if (rules?.minSize !== undefined && file.size < rules.minSize) {
      return `Size (${defaultFormatSize(file.size)}) is smaller than minimum (${defaultFormatSize(
        rules.minSize
      )}).`;
    }
    if (rules?.maxSize !== undefined && file.size > rules.maxSize) {
      return `Size (${defaultFormatSize(file.size)}) exceeds maximum (${defaultFormatSize(
        rules.maxSize
      )}).`;
    }
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (
      rules?.allowedExtensions &&
      !rules.allowedExtensions.map((e) => e.toLowerCase()).includes(ext)
    ) {
      return `Extension (.${ext}) is not allowed.`;
    }
    if (rules?.customValidator) {
      const result = rules.customValidator(file);
      if (result !== true) {
        return typeof result === 'string'
          ? result
          : 'Custom validation failed.';
      }
    }
    return null;
  }, [rules]);

  // Add or replace files core logic
  const processFiles = useCallback(
    (incoming: FileList | File[], replace = false) => {
      const incomingList: File[] = Array.isArray(incoming) ? incoming : Array.from(incoming);
      const newValidationErrors: Record<string, string> = {};

      setFilesState((prevFiles) => {
        const baseFiles = replace ? [] : [...prevFiles];

        incomingList.forEach((file) => {
          const ext = file.name.split('.').pop()?.toLowerCase() || '';

          const isDuplicate = baseFiles.some(
            (f) => f.name === file.name && f.size === file.size && f.extension === ext
          );
          if (isDuplicate) {
            return;
          }

          const error = validateFile(file);
          if (error) {
            newValidationErrors[file.name] = error;
            return;
          }

          if (rules?.maxFiles !== undefined && baseFiles.length + 1 > rules.maxFiles) {
            newValidationErrors[file.name] = `Cannot exceed max files limit of ${rules.maxFiles}.`;
            return;
          }

          const meta: FileMeta = {
            id: generateId(),
            file,
            name: file.name,
            size: file.size,
            formattedSize: defaultFormatSize(file.size),
            type: file.type,
            extension: ext,
            lastModified: file.lastModified,
          };
          baseFiles.push(meta);
        });

        return baseFiles;
      });

      setValidationErrors(newValidationErrors);
    },
    [rules?.maxFiles, validateFile]
  );

  const addFiles = useCallback(
    (incoming: FileList | File[]) => processFiles(incoming, false),
    [processFiles]
  );

  const setFiles = useCallback(
    (incoming: FileList | File[]) => processFiles(incoming, true),
    [processFiles]
  );

  const remove = useCallback(
    (id: string) => {
      setFilesState((prev) => prev.filter((f) => f.id !== id));
    },
    []
  );

  const removeAll = useCallback(() => {
    setFilesState((prev) => (prev.length === 0 ? prev : []));
    setValidationErrors({});
  }, []);

  return {
    files,
    addFiles,
    setFiles,
    remove,
    removeAll,
    formatSize,
    validationErrors,
  };
};
