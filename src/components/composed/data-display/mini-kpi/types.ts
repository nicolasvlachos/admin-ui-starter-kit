export interface KpiItem {
    value: string;
    label: string;
}

export interface MiniKpiRowProps {
    kpis: KpiItem[];
    className?: string;
}
