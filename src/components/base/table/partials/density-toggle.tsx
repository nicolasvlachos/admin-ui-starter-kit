/**
 * DensityToggle — small icon button that flips between "dense" and
 * "comfortable" table modes. Stateless: render-time `dense` boolean +
 * `onChange` callback. Pair with `usePersistentDensity` from `../hooks`
 * when you want to persist the choice to localStorage.
 *
 * Used internally by `DataTableToolbar`; exposed for consumers building
 * custom toolbars.
 */
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonClass =
	'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30';

export interface DensityToggleProps {
	dense: boolean;
	onChange: (next: boolean) => void;
	denseLabel?: string;
	comfortableLabel?: string;
	className?: string;
}

export function DensityToggle({
	dense,
	onChange,
	denseLabel = 'Dense',
	comfortableLabel = 'Comfortable',
	className,
}: DensityToggleProps) {
	const label = dense ? comfortableLabel : denseLabel;
	const Icon = dense ? Maximize2 : Minimize2;
	return (
		<button
			type="button"
			aria-label={label}
			aria-pressed={dense}
			onClick={() => onChange(!dense)}
			className={cn(buttonClass, className)}
		>
			<Icon className="size-3.5" />
		</button>
	);
}

DensityToggle.displayName = 'DensityToggle';
