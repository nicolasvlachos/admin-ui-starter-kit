import { useState } from 'react';
import { NotificationBanner } from '@/components/base/display/notification-banner';
import { ShowIf } from '@/components/base/display/show-if';
import { BooleanIndicator } from '@/components/base/display/boolean-indicator';
import { ThrottleAlert } from '@/components/base/display/throttle-alert';
import { VisuallyHidden } from '@/components/base/display/visually-hidden';
import { PlaceholderPattern } from '@/components/base/display/placeholder-pattern';
import { PreviewPage, PreviewSection, Col } from '../../PreviewLayout';

export default function DisplayPage() {
	const [show, setShow] = useState(true);

	return (
		<PreviewPage title="Base · Display" description="NotificationBanner, ShowIf, BooleanIndicator, ThrottleAlert, VisuallyHidden, PlaceholderPattern.">
			<PreviewSection title="NotificationBanner" span="full">
				<Col>
					<NotificationBanner type="info" title="Heads up" message="An informational notice." />
					<NotificationBanner type="success" title="Saved" message="All changes have been saved." />
					<NotificationBanner type="warning" title="Be careful" message="This will affect 24 records." />
					<NotificationBanner type="error" title="Failed" message="Something went wrong." dismissible onDismiss={() => {}} />
				</Col>
			</PreviewSection>

			<PreviewSection title="ShowIf">
				<Col>
					<button
						type="button"
						className="self-start rounded-md border border-border px-3 py-1 text-sm"
						onClick={() => setShow((v) => !v)}
					>
						{show ? 'Hide' : 'Show'} content
					</button>
					<ShowIf when={show} fallback={<span className="text-sm text-muted-foreground">Hidden — fallback shown.</span>}>
						<span className="text-sm">Visible only when <code>when</code> is true.</span>
					</ShowIf>
				</Col>
			</PreviewSection>

			<PreviewSection title="BooleanIndicator">
				<Col>
					<BooleanIndicator label="Verified" value trueVariant="success" />
					<BooleanIndicator label="Active" value={false} />
					<BooleanIndicator label="Subscribed" value trueLabel="Yes" falseLabel="No" trueVariant="primary" />
				</Col>
			</PreviewSection>

			<PreviewSection title="ThrottleAlert">
				<ThrottleAlert
					message="Too many failed attempts. Please wait."
					attempts={5}
					remaining="2 minutes"
				/>
			</PreviewSection>

			<PreviewSection title="VisuallyHidden">
				<button type="button" className="rounded-md border border-border px-3 py-1 text-sm">
					<span aria-hidden>×</span>
					<VisuallyHidden>Close</VisuallyHidden>
				</button>
				<div className="mt-2 text-xs text-muted-foreground">
					The button has accessible name &quot;Close&quot; — only the × is visible.
				</div>
			</PreviewSection>

			<PreviewSection title="PlaceholderPattern">
				<div className="relative h-32 overflow-hidden rounded-lg border border-border">
					<PlaceholderPattern className="absolute inset-0 size-full text-muted" />
				</div>
			</PreviewSection>
		</PreviewPage>
	);
}
