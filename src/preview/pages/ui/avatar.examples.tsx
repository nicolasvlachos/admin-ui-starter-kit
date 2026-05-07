import { Avatar, AvatarFallback, AvatarImage, AvatarGroup, AvatarGroupCount, AvatarBadge } from '@/components/ui/avatar';
import { Row } from '../../PreviewLayout';

export function Sizes() {
	return (
		<>
			<Row>
								<Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
								<Avatar><AvatarFallback>MD</AvatarFallback></Avatar>
								<Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
							</Row>
		</>
	);
}

export function WithImageFallback() {
	return (
		<>
			<Row>
								<Avatar><AvatarImage src="https://i.pravatar.cc/64?img=1" /><AvatarFallback>U1</AvatarFallback></Avatar>
								<Avatar><AvatarImage src="https://i.pravatar.cc/64?img=12" /><AvatarFallback>U2</AvatarFallback></Avatar>
								<Avatar><AvatarImage src="/__missing__.png" /><AvatarFallback>JD</AvatarFallback></Avatar>
							</Row>
		</>
	);
}

export function WithBadge() {
	return (
		<>
			<Row>
								<Avatar>
									<AvatarFallback>EM</AvatarFallback>
									<AvatarBadge className="bg-chart-2">{''}</AvatarBadge>
								</Avatar>
								<Avatar size="lg">
									<AvatarFallback>SP</AvatarFallback>
									<AvatarBadge className="bg-warning">{''}</AvatarBadge>
								</Avatar>
							</Row>
		</>
	);
}

export function Group() {
	return (
		<>
			<AvatarGroup>
								<Avatar><AvatarFallback>VP</AvatarFallback></Avatar>
								<Avatar><AvatarFallback>SM</AvatarFallback></Avatar>
								<Avatar><AvatarFallback>KD</AvatarFallback></Avatar>
								<AvatarGroupCount>+3</AvatarGroupCount>
							</AvatarGroup>
		</>
	);
}
