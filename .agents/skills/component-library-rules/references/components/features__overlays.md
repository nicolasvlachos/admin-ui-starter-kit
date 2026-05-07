---
id: features/overlays
title: "Features · Overlays"
family: "Overlays"
sourcePath: src/components/features/overlays
examples:
  - APISurface
  - DialogDefault
  - DialogEmphasisTones
  - DialogRichContent
  - DialogFormPattern
  - Drawer4Directions
  - AlertDialogConfirmationPatterns
  - BestPractices
imports:
  - @/components/base/badge
  - @/components/base/buttons
  - @/components/base/display/avatar
  - @/components/features/overlays
  - @/components/typography
tags:
  - overlays
  - features
---

# Features · Overlays

**Source:** `src/components/features/overlays`

## Examples

```tsx
import { useState } from 'react';
import {
	AlertCircle,
	BadgeCheck,
	CheckCircle2,
	CreditCard,
	FileText,
	HelpCircle,
	Info,
	Send,
	Settings,
	ShieldAlert,
	Sparkles,
	Trash2,
	UserPlus,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/base/display/avatar';
import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { AlertDialog, Dialog, Drawer } from '@/components/features/overlays';

export function APISurface() {
	return (
		<>
			<Text type="secondary">
								All overlays accept the same core props: <code className="rounded bg-muted px-1 py-0.5 text-xs">{'{ open, onOpenChange, onClose, title, description, onConfirm, onCancel, onAsyncConfirm, tone, emphasis, alertMessage, footer, isLoading }'}</code>. Backed by the native <code className="rounded bg-muted px-1 py-0.5 text-xs">{'<dialog>'}</code> element for proper focus trapping, ESC handling, and accessibility — no extra portal libraries.
							</Text>
		</>
	);
}

export function DialogDefault() {
	// Dialog state
		const [defaultOpen, setDefaultOpen] = useState(false);
	return (
		<>
			<div className="flex flex-wrap gap-3">
								<Button variant="primary" icon={Settings} onClick={() => setDefaultOpen(true)}>Open dialog</Button>
							</div>
							<Dialog
								open={defaultOpen}
								onOpenChange={setDefaultOpen}
								title="Save workspace settings?"
								description="Changes will apply immediately for everyone on the team. You can edit them again later from Settings → Workspace."
								onConfirm={() => setDefaultOpen(false)}
							/>
		</>
	);
}

export function DialogEmphasisTones() {
	const [emphasisInfoOpen, setEmphasisInfoOpen] = useState(false);
	const [emphasisWarningOpen, setEmphasisWarningOpen] = useState(false);
	const [emphasisSuccessOpen, setEmphasisSuccessOpen] = useState(false);
	return (
		<>
			<div className="flex flex-wrap gap-3">
								<Button variant="primary" icon={Info} onClick={() => setEmphasisInfoOpen(true)}>Info</Button>
								<Button variant="warning" icon={AlertCircle} onClick={() => setEmphasisWarningOpen(true)}>Warning</Button>
								<Button variant="success" icon={CheckCircle2} onClick={() => setEmphasisSuccessOpen(true)}>Success</Button>
							</div>
							<Dialog
								open={emphasisInfoOpen}
								onOpenChange={setEmphasisInfoOpen}
								title="New beta feature available"
								description="The redesigned analytics dashboard is live for early-access workspaces. Try it out and let us know what works."
								tone="info"
								emphasis
								confirmVariant="primary"
								onConfirm={() => setEmphasisInfoOpen(false)}
							/>
							<Dialog
								open={emphasisWarningOpen}
								onOpenChange={setEmphasisWarningOpen}
								title="Reset workspace?"
								description="This resets all custom views and starred items for your team. Members will see the default layout next sign-in."
								tone="warning"
								emphasis
								confirmVariant="warning"
								alertMessage="Reset is irreversible — exports of custom views are not generated automatically."
								onConfirm={() => setEmphasisWarningOpen(false)}
							/>
							<Dialog
								open={emphasisSuccessOpen}
								onOpenChange={setEmphasisSuccessOpen}
								title="Subscription activated"
								description="Your team is on the Pro Annual plan until May 12, 2027. The first invoice has been emailed to your billing contact."
								tone="success"
								emphasis
								confirmVariant="success"
								onConfirm={() => setEmphasisSuccessOpen(false)}
							/>
		</>
	);
}

export function DialogRichContent() {
	const [richContentOpen, setRichContentOpen] = useState(false);
	return (
		<>
			<div className="flex flex-wrap gap-3">
								<Button variant="primary" icon={UserPlus} onClick={() => setRichContentOpen(true)}>Invite teammate</Button>
							</div>
							<Dialog
								open={richContentOpen}
								onOpenChange={setRichContentOpen}
								title="Invite to workspace"
								description="They'll get an email with a link to join your workspace as an Editor."
								size="md"
								onConfirm={() => setRichContentOpen(false)}
							>
								<div className="space-y-3">
									<div className="rounded-lg border border-border bg-muted/30 p-3">
										<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wider">Invitation preview</Text>
										<div className="mt-2 flex items-center gap-3">
											<Avatar className="size-9">
												<AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">YO</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<Text weight="semibold">You invited stefan@example.com</Text>
												<Text size="xs" type="secondary">Editor · Read & write access</Text>
											</div>
										</div>
									</div>
									<div className="space-y-2">
										{[
											{ icon: BadgeCheck, label: 'Can edit pages and components' },
											{ icon: BadgeCheck, label: 'Can manage their own API keys' },
											{ icon: BadgeCheck, label: 'Cannot manage billing or members' },
										].map((row) => (
											<div key={row.label} className="flex items-center gap-2">
												<row.icon className="size-3.5 shrink-0 text-success" aria-hidden="true" />
												<Text size="xs" type="secondary">{row.label}</Text>
											</div>
										))}
									</div>
								</div>
							</Dialog>
		</>
	);
}

export function DialogFormPattern() {
	const [formOpen, setFormOpen] = useState(false);
	return (
		<>
			<div className="flex flex-wrap gap-3">
								<Button variant="primary" icon={CreditCard} onClick={() => setFormOpen(true)}>Add payment method</Button>
							</div>
							<Dialog
								open={formOpen}
								onOpenChange={setFormOpen}
								title="Add a payment method"
								description="We'll authorize a 0.00 USD transaction to verify the card."
								formId="payment-form"
								size="md"
							>
								<form
									id="payment-form"
									onSubmit={(e) => {
										e.preventDefault();
										setFormOpen(false);
									}}
									className="space-y-3"
								>
									<label className="block">
										<Text tag="span" size="xs" weight="medium" className="block mb-1">Card number</Text>
										<input
											type="text"
											placeholder="4242 4242 4242 4242"
											className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm tabular-nums outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
										/>
									</label>
									<div className="grid grid-cols-2 gap-3">
										<label className="block">
											<Text tag="span" size="xs" weight="medium" className="block mb-1">Expiry</Text>
											<input
												type="text"
												placeholder="MM / YY"
												className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm tabular-nums outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
											/>
										</label>
										<label className="block">
											<Text tag="span" size="xs" weight="medium" className="block mb-1">CVC</Text>
											<input
												type="text"
												placeholder="123"
												className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm tabular-nums outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
											/>
										</label>
									</div>
								</form>
							</Dialog>
		</>
	);
}

export function Drawer4Directions() {
	// Drawer state
		const [drawerRightOpen, setDrawerRightOpen] = useState(false);
	const [drawerLeftOpen, setDrawerLeftOpen] = useState(false);
	const [drawerBottomOpen, setDrawerBottomOpen] = useState(false);
	const [drawerCustomOpen, setDrawerCustomOpen] = useState(false);
	return (
		<>
			<div className="flex flex-wrap gap-3">
								<Button variant="secondary" buttonStyle="outline" onClick={() => setDrawerRightOpen(true)}>Right · booking detail</Button>
								<Button variant="secondary" buttonStyle="outline" onClick={() => setDrawerLeftOpen(true)}>Left · navigation</Button>
								<Button variant="secondary" buttonStyle="outline" onClick={() => setDrawerBottomOpen(true)}>Bottom · sheet</Button>
								<Button variant="secondary" buttonStyle="outline" onClick={() => setDrawerCustomOpen(true)}>Right · no footer</Button>
							</div>

							<Drawer
								open={drawerRightOpen}
								onOpenChange={setDrawerRightOpen}
								direction="right"
								title="Booking #BKG-2026-0412"
								description="Inspect, edit, or cancel a booking from the side drawer — keeps the table visible behind."
								onConfirm={() => setDrawerRightOpen(false)}
							>
								<div className="space-y-4">
									<div className="rounded-lg border border-border bg-muted/30 p-3">
										<div className="flex items-center justify-between">
											<Text size="xxs" type="secondary" weight="medium" className="uppercase tracking-wider">Status</Text>
											<Badge variant="success">Paid</Badge>
										</div>
										<Text tag="div" size="lg" weight="bold" className="mt-1 tabular-nums">180.00 USD</Text>
									</div>
									<div className="space-y-2">
										{[
											['Customer', 'Sarah Smitha'],
											['Experience', 'Spa Day Voucher'],
											['Date', 'Apr 18, 2026 · 14:00'],
											['Guests', '2'],
										].map(([k, v]) => (
											<div key={k} className="flex items-center justify-between border-b border-border/50 py-1.5 last:border-0">
												<Text size="xs" type="secondary">{k}</Text>
												<Text weight="medium">{v}</Text>
											</div>
										))}
									</div>
								</div>
							</Drawer>

							<Drawer
								open={drawerLeftOpen}
								onOpenChange={setDrawerLeftOpen}
								direction="left"
								title="Workspace"
								description="Quick-jump to common pages."
								showCancel={false}
								showConfirm={false}
							>
								<nav className="space-y-1">
									{[
										{ icon: FileText, label: 'Bookings' },
										{ icon: UserPlus, label: 'Customers' },
										{ icon: CreditCard, label: 'Invoices' },
										{ icon: Settings, label: 'Settings' },
									].map((item) => (
										<button key={item.label} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-muted/50">
											<item.icon className="size-4 text-muted-foreground" />
											<Text>{item.label}</Text>
										</button>
									))}
								</nav>
							</Drawer>

							<Drawer
								open={drawerBottomOpen}
								onOpenChange={setDrawerBottomOpen}
								direction="bottom"
								title="Quick actions"
								onConfirm={() => setDrawerBottomOpen(false)}
							>
								<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
									{[
										{ icon: Send, label: 'Send invoice' },
										{ icon: UserPlus, label: 'Add customer' },
										{ icon: CreditCard, label: 'Record payment' },
										{ icon: FileText, label: 'New booking' },
									].map((a) => (
										<button key={a.label} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card px-3 py-4 transition-colors hover:bg-muted/40">
											<span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
												<a.icon className="size-4" />
											</span>
											<Text size="xs" weight="medium" align="center">{a.label}</Text>
										</button>
									))}
								</div>
							</Drawer>

							<Drawer
								open={drawerCustomOpen}
								onOpenChange={setDrawerCustomOpen}
								direction="right"
								title="Help & shortcuts"
								description="No footer — useful for read-only side panels."
								showCancel={false}
								showConfirm={false}
							>
								<Text type="secondary">
									Hide the footer entirely with <code className="rounded bg-muted px-1 py-0.5 text-xs">{'showCancel={false}'}</code> + <code className="rounded bg-muted px-1 py-0.5 text-xs">{'showConfirm={false}'}</code> for read-only side panels (help, settings, audit logs).
								</Text>
							</Drawer>
		</>
	);
}

export function AlertDialogConfirmationPatterns() {
	// AlertDialog state
		const [confirmOpen, setConfirmOpen] = useState(false);
	const [destructiveOpen, setDestructiveOpen] = useState(false);
	const [unsavedOpen, setUnsavedOpen] = useState(false);
	const [logoutOpen, setLogoutOpen] = useState(false);
	return (
		<>
			<div className="flex flex-wrap gap-3">
								<Button variant="primary" icon={Send} onClick={() => setConfirmOpen(true)}>Send invoice</Button>
								<Button variant="error" icon={Trash2} onClick={() => setDestructiveOpen(true)}>Delete</Button>
								<Button variant="warning" buttonStyle="outline" icon={AlertCircle} onClick={() => setUnsavedOpen(true)}>Discard unsaved</Button>
								<Button variant="secondary" buttonStyle="outline" icon={ShieldAlert} onClick={() => setLogoutOpen(true)}>Sign out</Button>
							</div>

							<AlertDialog
								open={confirmOpen}
								onOpenChange={setConfirmOpen}
								title="Send invoice now?"
								description="The customer will be emailed the PDF and a Stripe payment link. You can cancel any time before they pay."
								tone="info"
								onConfirm={() => setConfirmOpen(false)}
							/>
							<AlertDialog
								open={destructiveOpen}
								onOpenChange={setDestructiveOpen}
								title="Delete this booking?"
								description="The booking, its payment, and all associated notes will be removed. This cannot be undone."
								destructive
								onConfirm={() => setDestructiveOpen(false)}
							/>
							<AlertDialog
								open={unsavedOpen}
								onOpenChange={setUnsavedOpen}
								title="Discard unsaved changes?"
								description="You have edits that haven't been saved yet. Leave the page and lose them?"
								tone="warning"
								onConfirm={() => setUnsavedOpen(false)}
							/>
							<AlertDialog
								open={logoutOpen}
								onOpenChange={setLogoutOpen}
								title="Sign out of this device?"
								description="You'll need to sign in again next time you visit."
								onConfirm={() => setLogoutOpen(false)}
							/>
		</>
	);
}

export function BestPractices() {
	return (
		<>
			<div className="space-y-2 text-sm text-muted-foreground">
								<div className="flex items-start gap-2">
									<HelpCircle className="size-4 shrink-0 mt-0.5 text-info" aria-hidden="true" />
									<Text>
										<strong className="text-foreground font-semibold">Dialog</strong> for changes that affect content — settings, confirmations, edit forms.
									</Text>
								</div>
								<div className="flex items-start gap-2">
									<HelpCircle className="size-4 shrink-0 mt-0.5 text-info" aria-hidden="true" />
									<Text>
										<strong className="text-foreground font-semibold">Drawer</strong> for content that lives next to the current view — record details, filters, navigation.
									</Text>
								</div>
								<div className="flex items-start gap-2">
									<HelpCircle className="size-4 shrink-0 mt-0.5 text-info" aria-hidden="true" />
									<Text>
										<strong className="text-foreground font-semibold">AlertDialog</strong> for binary decisions that block other actions until resolved — destructive ops, sign-out, unsaved changes.
									</Text>
								</div>
								<div className="flex items-start gap-2">
									<Sparkles className="size-4 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
									<Text>
										<strong className="text-foreground font-semibold">Async confirms</strong> — pass <code className="rounded bg-muted px-1 py-0.5 text-xs">onAsyncConfirm</code> instead of <code className="rounded bg-muted px-1 py-0.5 text-xs">onConfirm</code> to show a loading state while the action runs and auto-close on success.
									</Text>
								</div>
							</div>
		</>
	);
}
```

## Example exports

- `APISurface`
- `DialogDefault`
- `DialogEmphasisTones`
- `DialogRichContent`
- `DialogFormPattern`
- `Drawer4Directions`
- `AlertDialogConfirmationPatterns`
- `BestPractices`

