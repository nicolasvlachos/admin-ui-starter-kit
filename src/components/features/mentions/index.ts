// Hooks
export {
    useMentions,
    useMentionsSearch,
    type MentionEditorHandle,
    type UseMentionsOptions,
    type UseMentionsReturn,
    type UseMentionsSearchOptions,
    type UseMentionsSearchReturn,
} from './hooks';

// UI partials
export {
    MentionChip,
    MentionContent,
    MentionContentComponent,
    MentionPicker,
    MentionInlineSuggestions,
    type MentionChipProps,
    type MentionContentProps,
    type MentionPickerProps,
    type MentionInlineSuggestionsProps,
} from './partials';

// Strings
export {
    defaultMentionPickerStrings,
    defaultMentionInlineSuggestionsStrings,
    type MentionPickerStrings,
    type MentionInlineSuggestionsStrings,
} from './mentions.strings';

// Utils
export {
    buildMentionHtml,
    splitHtmlByMentions,
    parseMentionsFromHtml,
    type MentionHtmlSegment,
} from './utils';

// Types
export type {
    Mention,
    MentionResource,
    MentionSuggestion,
    MentionTone,
    MentionsConfig,
    MentionsResourceSearch,
} from './mentions.types';
