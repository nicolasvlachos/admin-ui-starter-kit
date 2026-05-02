export interface Conversation {
    initials: string;
    name: string;
    preview: string;
    time: string;
    unread: number;
}

export interface RecentConversationRowProps {
    conversations: Conversation[];
    className?: string;
}
