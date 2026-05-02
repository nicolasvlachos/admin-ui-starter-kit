export interface KanbanItem {
    title: string;
    color: string;
}

export interface KanbanColumn {
    title: string;
    items: KanbanItem[];
}

export interface KanbanMicroBoardProps {
    columns: KanbanColumn[];
    className?: string;
}
