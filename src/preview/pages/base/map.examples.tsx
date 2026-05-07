import 'leaflet/dist/leaflet.css';
import { Map, MapTileLayer, MapMarker, MapPopup } from '@/components/base/map';

const NEW_YORK: [number, number] = [40.7128, -74.006];
const LOS_ANGELES: [number, number] = [34.0522, -118.2437];
const CHICAGO: [number, number] = [41.8781, -87.6298];
const SAN_FRANCISCO: [number, number] = [37.7749, -122.4194];

export function Default() {
	return (
		<div className="h-96 w-full max-w-3xl overflow-hidden rounded-md border border-border">
			<Map center={NEW_YORK} zoom={4}>
				<MapTileLayer />
				<MapMarker position={NEW_YORK}>
					<MapPopup>New York</MapPopup>
				</MapMarker>
			</Map>
		</div>
	);
}

export function MultipleMarkers() {
	return (
		<div className="h-96 w-full max-w-3xl overflow-hidden rounded-md border border-border">
			<Map center={[39.5, -98]} zoom={4}>
				<MapTileLayer />
				<MapMarker position={NEW_YORK}>
					<MapPopup>New York — Northeast HQ</MapPopup>
				</MapMarker>
				<MapMarker position={LOS_ANGELES}>
					<MapPopup>Los Angeles — West coast</MapPopup>
				</MapMarker>
				<MapMarker position={CHICAGO}>
					<MapPopup>Chicago — Midwest hub</MapPopup>
				</MapMarker>
				<MapMarker position={SAN_FRANCISCO}>
					<MapPopup>San Francisco — Bay Area</MapPopup>
				</MapMarker>
			</Map>
		</div>
	);
}

export function TighterZoom() {
	return (
		<div className="h-72 w-full max-w-3xl overflow-hidden rounded-md border border-border">
			<Map center={NEW_YORK} zoom={12}>
				<MapTileLayer />
				<MapMarker position={NEW_YORK}>
					<MapPopup>New York — Manhattan</MapPopup>
				</MapMarker>
			</Map>
		</div>
	);
}

export function CompactSize() {
	return (
		<div className="h-48 w-full max-w-md overflow-hidden rounded-md border border-border">
			<Map center={SAN_FRANCISCO} zoom={11}>
				<MapTileLayer />
				<MapMarker position={SAN_FRANCISCO}>
					<MapPopup>San Francisco</MapPopup>
				</MapMarker>
			</Map>
		</div>
	);
}
