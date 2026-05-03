/**
 * Form field exports.
 *
 * Most fields here are presentational and framework-free. The repeater /
 * localized-* fields opt into `react-hook-form` (RHF) — they are the only
 * RHF-coupled components in the library and live here intentionally so the
 * coupling is contained:
 *   - List, StringRepeater, ObjectRepeater
 *   - LocalizedStringField, LocalizedObjectField, LocalizedStringRepeater
 *
 * Apps not using RHF should not import these. All other fields are pure and
 * accept value/onChange directly.
 */

// Hooks
export * from './hooks';

// Base Components
export { Checkbox, type CheckboxProps } from './checkbox';
export { Input, type InputProps } from './input';
export { Textarea, type TextareaProps } from './textarea';
export { Select, type SelectProps, type SelectOption } from './select';
export { DecimalInput, type DecimalInputProps } from './decimal-input';

// Switch Components
export { Switch, ToggleSwitch, type SwitchProps, type ToggleSwitchProps, type ImitationEvent } from './switch';
export { SwitchCard, type SwitchCardProps } from './switch-card';
export { ToggleField, type ToggleFieldProps, type ToggleFieldKind } from './toggle-field';

// Tags Input
export { TagsInput, type TagsInputProps } from './tags-input';

// Phone Input
export {
    PhoneInput,
    DEFAULT_COUNTRY_PREFIXES,
    COUNTRY_PREFIX_MAP,
    type PhoneInputProps,
    type CountryPrefixOption,
    type CountryPrefixInput,
} from './phone-input';

// Percentage Input
export { PercentageInput, type PercentageInputProps } from './percentage-input';

// Slider
export { SliderField, type SliderProps, type SliderImitationEvent } from './slider';

// Card Groups
export { CardCheckboxGroup, type CardCheckboxGroupProps, type CardCheckboxOption } from './card-checkbox-group';
export { CardRadioGroup, type CardRadioGroupProps, type CardRadioOption } from './card-radio-group';
export { ListRadioGroup, type ListRadioGroupProps, type ListRadioOption } from './list-radio-group';

// Currency & Money
export { CurrencyInput, type CurrencyInputProps, type CurrencyOption } from './currency-input';
export { MoneyInput, type MoneyInputProps } from './money-input';
export { RoundingModeSelect, type RoundingModeSelectProps } from './rounding-mode-select';

// Rich Select
export { RichSelect, type RichSelectProps, type RichSelectOption } from './rich-select';

// Dimensions & Weight
export { DimensionsInput, type DimensionsInputProps, type DimensionValue, type DimensionObject } from './dimensions-input';
export { WeightInput, type WeightInputProps, type WeightUnit } from './weight-input';

// Coordinates
export { CoordinatesInput, type CoordinatesInputProps, type CoordinatesValue, type CoordinatesObjectValue } from './coordinates-input';

// Date & Time
export { DateTimeInput, type DateTimeInputProps } from './date-time-input';
export { TimePicker, type TimePickerProps } from './time-picker';

// File & Image Upload
export {
	FileUpload,
	defaultFileUploadStrings,
	type FileUploadProps,
	type FileUploadStrings,
} from './file-upload';
export {
	ImageUpload,
	defaultImageUploadStrings,
	type ImageUploadProps,
	type ImageUploadStrings,
} from './image-upload';

// Phase D additions to the upload subsystem
export {
	Dropzone,
	defaultDropzoneStrings,
	type DropzoneProps,
	type DropzoneStrings,
	type DropzoneSize,
} from './dropzone';
export {
	AvatarUpload,
	defaultAvatarUploadStrings,
	type AvatarUploadProps,
	type AvatarUploadStrings,
	type AvatarUploadSize,
} from './avatar-upload';
export {
	MediaGallery,
	defaultMediaGalleryStrings,
	type MediaGalleryProps,
	type MediaGalleryStrings,
} from './media-gallery';
export {
	UploadProgressList,
	defaultUploadProgressListStrings,
	type UploadProgressListProps,
	type UploadProgressListStrings,
	type UploadItem,
	type UploadStatus,
} from './upload-progress-list';
export {
	UploadTray,
	defaultUploadTrayStrings,
	type UploadTrayProps,
	type UploadTrayStrings,
} from './upload-tray';

// Key-Value
export { KeyValue, type KeyValueProps, type KeyValueItem } from './key-value';
export { KeyValueEditor, type KeyValueEditorProps, type KeyValuePair } from './key-value-editor';

// Repeaters & Lists
export {
	Repeater,
	defaultRepeaterPrimitiveStrings,
	type RepeaterProps,
	type RepeaterStrings,
	type RepeaterItem,
	type RepeaterRowVariant,
	type RepeaterRemoveVariant,
} from './repeater';
export { StringRepeater, type StringRepeaterProps } from './string-repeater';
export { ObjectRepeater, type ObjectRepeaterProps, type ObjectFieldDef } from './object-repeater';
export { List, type ListProps } from './list';

// Pill Radio
export { PillRadioGroup, type PillRadioGroupProps, type PillRadioGroupOption } from './pill-radio-group';

// Localized Fields
export { LocalizedStringField, type LocalizedStringFieldProps } from './localized-string-field';
export { LocalizedObjectField, type LocalizedObjectFieldProps, type LocalizedObjectFieldDef } from './localized-object-field';
export { LocalizedStringRepeater, type LocalizedStringRepeaterProps } from './localized-string-repeater';
