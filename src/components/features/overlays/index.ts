// Components
export { Dialog } from './dialog';
export { Drawer } from './drawer';
export { AlertDialog } from './alert-dialog';

// Hooks
export {
    useNativeDialog,
    type UseNativeDialogOptions,
    type UseNativeDialogReturn,
    useOverlayActions,
    type UseOverlayActionsOptions,
    type UseOverlayActionsReturn,
} from './hooks';

// Types
export type {
    OverlayTone,
    OverlaySize,
    DrawerDirection,
    ButtonVariant,
    ButtonStyle,
    OverlayBaseProps,
    OverlayActionProps,
    OverlayEmphasisProps,
    DialogProps,
    DrawerProps,
    AlertDialogProps,
} from './overlays.types';

// Strings
export {
    defaultOverlayStrings,
    defaultAlertDialogStrings,
    type OverlayStrings,
} from './overlays.strings';
