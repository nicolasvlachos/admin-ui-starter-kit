import { Text } from '@/components/typography/text';
import Heading from '@/components/typography/heading';
import { Button } from '@/components/base/buttons';
import { Badge } from '@/components/base/badge/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/base/display/avatar';
import {
    Item,
    ItemContent,
    ItemGroup,
    ItemMedia,
    ItemTitle,
} from '@/components/base/item';
import { cn } from '@/lib/utils';
import { useStrings } from '@/lib/strings';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { defaultContactCardStrings, type ContactCardProps } from './types';

function deriveInitials(name: string, initials?: string): string {
	if (initials) return initials;
	return name
		.split(' ')
		.map((part) => part[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();
}

/**
 * ContactCard — Avatar + name + role + contact details (email, phone, location)
 * with optional Contact / Profile actions and a status badge.
 *
 * Contact details render through `<ItemGroup>` + `<Item>` so density and
 * media slots stay aligned with the rest of the library; the header and CTA
 * row remain bespoke because they are not Item-shaped.
 */
export function ContactCard({
	name,
	role,
	email,
	phone,
	location,
	avatarUrl,
	initials,
	badge,
	badgeVariant = 'success',
	onContact,
	onViewProfile,
	className,
	strings: stringsProp,
}: ContactCardProps) {
	const strings = useStrings(defaultContactCardStrings, stringsProp);
	return (
		<div
			className={cn(
				'overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 sm:p-7',
				className,
			)}
		>
			<div className="flex items-start gap-4">
				<Avatar className="h-16 w-16 shrink-0 border-2 border-border">
					{!!avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
					<AvatarFallback className="text-lg font-bold">
						{deriveInitials(name, initials)}
					</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1 pt-0.5">
					<div className="flex items-center gap-2.5">
						<Heading tag="h4" className="truncate text-lg">
							{name}
						</Heading>
						{!!badge && <Badge variant={badgeVariant}>{badge}</Badge>}
					</div>
					{!!role && (
						<Text type="secondary" className="mt-1">
							{role}
						</Text>
					)}
				</div>
			</div>

			{!!(email || phone || location) && (
				<ItemGroup className="mt-6 gap-1">
					{!!email && (
						<Item size="xs" className="px-0">
							<ItemMedia variant="icon" className="text-muted-foreground">
								<Mail />
							</ItemMedia>
							<ItemContent>
								<ItemTitle bold={false}>{email}</ItemTitle>
							</ItemContent>
						</Item>
					)}
					{!!phone && (
						<Item size="xs" className="px-0">
							<ItemMedia variant="icon" className="text-muted-foreground">
								<Phone />
							</ItemMedia>
							<ItemContent>
								<ItemTitle bold={false}>{phone}</ItemTitle>
							</ItemContent>
						</Item>
					)}
					{!!location && (
						<Item size="xs" className="px-0">
							<ItemMedia variant="icon" className="text-muted-foreground">
								<MapPin />
							</ItemMedia>
							<ItemContent>
								<ItemTitle bold={false}>{location}</ItemTitle>
							</ItemContent>
						</Item>
					)}
				</ItemGroup>
			)}

			{!!(onContact || onViewProfile) && (
				<div className="mt-6 flex items-center gap-2">
					{!!onContact && (
						<Button
							variant="secondary"
							buttonStyle="solid"
							icon={Mail}
							onClick={onContact}
							className="flex-1"
						>
							{strings.contact}
						</Button>
					)}
					{!!onViewProfile && (
						<Button
							variant="secondary"
							buttonStyle="ghost"
							icon={ExternalLink}
							onClick={onViewProfile}
						>
							{strings.profile}
						</Button>
					)}
				</div>
			)}
		</div>
	);
}

ContactCard.displayName = 'ContactCard';
