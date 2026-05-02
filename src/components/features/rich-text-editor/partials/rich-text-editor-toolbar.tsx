import { Code2 } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/base/buttons/button';

import type { RichTextEditorStrings } from '../rich-text-editor.strings';
import type {
	RichTextEditorToolbarItem,
	ToolbarButtonConfig,
} from '../rich-text-editor.types';

export interface RichTextEditorToolbarProps {
	buttons: ToolbarButtonConfig[];
	extraToolbarItems?: ReadonlyArray<RichTextEditorToolbarItem>;
	hideSourceToggle?: boolean;
	sourceMode: boolean;
	toggleSourceMode: () => void;
	disabled?: boolean;
	/**
	 * The TipTap variant disables built-in buttons until the editor instance
	 * is ready; the fallback variant simply marks them disabled. This flag
	 * lets callers force the disabled state without re-deriving it per button.
	 */
	hasEditor?: boolean;
	toolbarTrailing?: ReactNode;
	strings: RichTextEditorStrings;
}

export function RichTextEditorToolbar({
	buttons,
	extraToolbarItems,
	hideSourceToggle = false,
	sourceMode,
	toggleSourceMode,
	disabled = false,
	hasEditor = true,
	toolbarTrailing,
	strings,
}: RichTextEditorToolbarProps) {
	const hasExtras = (extraToolbarItems?.length ?? 0) > 0;

	return (
		<div className="border-border flex flex-wrap items-center gap-1 border-b p-1.5">
			{buttons.map((button) => {
				const Icon = button.icon;
				const isActive = button.isActive();

				return (
					<Button
						key={button.id}
						type="button"
						variant={isActive ? 'primary' : 'secondary'}
						buttonStyle={isActive ? 'solid' : 'ghost'}
						size="icon-xs"
						onClick={button.run}
						disabled={disabled || !hasEditor || sourceMode || button.disabled}
						aria-label={button.label}
						title={button.label}
					>
						<Icon className="h-3.5 w-3.5" />
					</Button>
				);
			})}

			{!hideSourceToggle && (
				<>
					<div className="bg-border mx-1 h-4 w-px" />

					<Button
						type="button"
						variant={sourceMode ? 'primary' : 'secondary'}
						buttonStyle={sourceMode ? 'solid' : 'ghost'}
						size="icon-xs"
						onClick={toggleSourceMode}
						disabled={disabled || !hasEditor}
						aria-label={strings.toolbar.sourceCode}
						title={strings.toolbar.sourceCode}
					>
						<Code2 className="h-3.5 w-3.5" />
					</Button>
				</>
			)}

			{hasExtras && (
				<>
					<div className="bg-border mx-1 h-4 w-px" />
					{extraToolbarItems?.map((item) => {
						const Icon = item.icon;
						const isActive = item.isActive?.() ?? false;
						return (
							<Button
								key={item.id}
								type="button"
								variant={isActive ? 'primary' : 'secondary'}
								buttonStyle={isActive ? 'solid' : 'ghost'}
								size="icon-xs"
								onClick={item.onClick}
								disabled={disabled || !hasEditor || sourceMode || item.disabled}
								aria-label={item.label}
								title={item.label}
							>
								<Icon className="h-3.5 w-3.5" />
							</Button>
						);
					})}
				</>
			)}

			{!!toolbarTrailing && (
				<div className="ml-auto flex items-center gap-1">{toolbarTrailing}</div>
			)}
		</div>
	);
}

RichTextEditorToolbar.displayName = 'RichTextEditorToolbar';
