import { useController, useFormContext } from 'react-hook-form';
import { RichTextEditor, type RichTextEditorProps } from './rich-text-editor';

export interface FormRichTextEditorProps
    extends Omit<RichTextEditorProps, 'value' | 'onChange'> {
    name: string;
}

export function FormRichTextEditor({ name, ...props }: FormRichTextEditorProps) {
    const { control } = useFormContext();
    const { field } = useController({ name, control });

    return (
        <RichTextEditor className="form-rich-text-editor--component"
            {...props}
            value={typeof field.value === 'string' ? field.value : ''}
            onChange={field.onChange}
        />
    );
}
