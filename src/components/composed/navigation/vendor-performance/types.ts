export interface VendorMetrics {
    bookings: number;
    revenue: string;
    avgRating: number;
    responseTime: string;
}

export interface VendorPerformanceCardProps {
    vendorName: string;
    rating: number;
    maxRating?: number;
    metrics: VendorMetrics;
    performanceScore: number;
    lastActive: string;
    joinedDate: string;
    className?: string;
}
