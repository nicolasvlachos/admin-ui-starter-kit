import { Text } from '@/components/typography';
import Heading from '@/components/typography/heading';
import { cn } from '@/lib/utils';
import type { DatePickerHeader as DatePickerHeaderConfig } from './datepicker.types';

interface DatePickerHeaderProps {
	config: DatePickerHeaderConfig;
	className?: string;
}

export function DatePickerHeader({ config, className }: DatePickerHeaderProps) {
	const { title, description, icon: Icon, align = 'left' } = config;

	return (
		<div
			className={cn('date-picker-header--component', 
				'border-b p-4',
				align === 'center' ? 'text-center' : 'text-left',
				className
			)}
		>
			<div className="flex items-center justify-start gap-3">
				{!!Icon && (
     <div className="flex-shrink-0">
						<Icon className="h-5 w-5 text-primary" />
					</div>
   )}
				<div className={cn('flex-1', align === 'center' && !Icon && 'text-center')}>
					<Heading tag="h3" containerClassName="space-y-0" className="font-semibold text-base leading-none">
						{title}
					</Heading>
					{!!description && <Text type="secondary" className="mt-2">{description}</Text>}
				</div>
			</div>
		</div>
	);
}

DatePickerHeader.displayName = 'DatePickerHeader';
