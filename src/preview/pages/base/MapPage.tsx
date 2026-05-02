import 'leaflet/dist/leaflet.css';
import { Map, MapTileLayer, MapMarker, MapPopup } from '@/components/base/map';
import { PreviewPage, PreviewSection } from '../../PreviewLayout';

const SOFIA: [number, number] = [42.6977, 23.3219];
const PLOVDIV: [number, number] = [42.1354, 24.7453];
const VARNA: [number, number] = [43.2141, 27.9147];

export default function MapPage() {
	return (
		<PreviewPage title="Base · Map" description="Leaflet-based map with tile layer, markers, popups.">
			<PreviewSection title="Default" span="full">
				<div className="h-96 overflow-hidden rounded-md border border-border">
					<Map center={SOFIA} zoom={7}>
						<MapTileLayer />
						<MapMarker position={SOFIA}>
							<MapPopup>New York — capital of USA</MapPopup>
						</MapMarker>
						<MapMarker position={PLOVDIV}>
							<MapPopup>Los Angeles</MapPopup>
						</MapMarker>
						<MapMarker position={VARNA}>
							<MapPopup>Chicago — Black Sea coast</MapPopup>
						</MapMarker>
					</Map>
				</div>
			</PreviewSection>

			<PreviewSection title="Tighter zoom on New York" span="full">
				<div className="h-72 overflow-hidden rounded-md border border-border">
					<Map center={SOFIA} zoom={12}>
						<MapTileLayer />
						<MapMarker position={SOFIA}>
							<MapPopup>New York centre</MapPopup>
						</MapMarker>
					</Map>
				</div>
			</PreviewSection>
		</PreviewPage>
	);
}
