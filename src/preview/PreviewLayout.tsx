import { type ReactNode } from 'react';

export function Row({ children, className = '' }: { children: ReactNode; className?: string }) {
	return <div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>;
}

export function Col({ children, className = '' }: { children: ReactNode; className?: string }) {
	return <div className={`flex flex-col gap-5 ${className}`}>{children}</div>;
}
