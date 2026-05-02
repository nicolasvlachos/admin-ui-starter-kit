export interface TeamMember {
    initials: string;
    name: string;
    role: string;
    dept: string;
    active: string;
}

export interface TeamMemberRowProps {
    members: TeamMember[];
    className?: string;
}
