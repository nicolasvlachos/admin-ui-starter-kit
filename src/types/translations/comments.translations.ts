/**
 * Translation key shapes for the comments feature — kept loose so consumer
 * apps can extend them. The runtime `useTranslations` hook falls back to
 * `defaultValue` when the bundle isn't supplied, so all keys are optional
 * at the consumer level.
 */
type StringRecord = Record<string, string>;

export interface CommentsActionsI18N extends StringRecord {}
export interface CommentsFormsI18N extends StringRecord {}
export interface CommentsGeneralI18N extends StringRecord {}
export interface CommentsMessagesI18N extends StringRecord {}
export interface CommentsPagesI18N extends StringRecord {}
export interface CommentsTablesI18N extends StringRecord {}
