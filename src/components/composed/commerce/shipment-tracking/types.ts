export interface TrackingStep {
    label: string;
    done: boolean;
}

export interface ShipmentDetail {
    label: string;
    value: string;
}

export interface ShipmentTrackingCardProps {
    trackingNumber: string;
    carrier?: string;
    status: string;
    steps: TrackingStep[];
    details?: ShipmentDetail[];
    className?: string;
}
