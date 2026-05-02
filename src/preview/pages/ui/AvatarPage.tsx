import { Avatar, AvatarFallback, AvatarImage, AvatarGroup, AvatarGroupCount, AvatarBadge } from '@/components/ui/avatar';
import { PreviewPage, PreviewSection, Row } from '../../PreviewLayout';

export default function AvatarPage() {
	return (
		<PreviewPage title="UI · Avatar" description="Avatar with fallback, image, sizes, group, badge.">
			<PreviewSection title="Sizes">
				<Row>
					<Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
					<Avatar><AvatarFallback>MD</AvatarFallback></Avatar>
					<Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
				</Row>
			</PreviewSection>

			<PreviewSection title="With image fallback">
				<Row>
					<Avatar><AvatarImage src="https://i.pravatar.cc/64?img=1" /><AvatarFallback>U1</AvatarFallback></Avatar>
					<Avatar><AvatarImage src="https://i.pravatar.cc/64?img=12" /><AvatarFallback>U2</AvatarFallback></Avatar>
					<Avatar><AvatarImage src="/__missing__.png" /><AvatarFallback>JD</AvatarFallback></Avatar>
				</Row>
			</PreviewSection>

			<PreviewSection title="With badge">
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
			</PreviewSection>

			<PreviewSection title="Group">
				<AvatarGroup>
					<Avatar><AvatarFallback>VP</AvatarFallback></Avatar>
					<Avatar><AvatarFallback>SM</AvatarFallback></Avatar>
					<Avatar><AvatarFallback>KD</AvatarFallback></Avatar>
					<AvatarGroupCount>+3</AvatarGroupCount>
				</AvatarGroup>
			</PreviewSection>
		</PreviewPage>
	);
}
