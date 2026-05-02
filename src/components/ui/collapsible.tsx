import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import * as React from "react"

import { Slot } from "@/components/ui/slot"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  asChild = false,
  nativeButton,
  render,
  children,
  ...props
}: CollapsiblePrimitive.Trigger.Props & { asChild?: boolean; nativeButton?: boolean }) {
  const slotRender = asChild ? <Slot /> : undefined
  const safeRender: CollapsiblePrimitive.Trigger.Props["render"] = typeof render === "function"
    ? ((renderProps, state) => {
      const { nativeButton: _nativeButton, ...rest } = renderProps as Record<string, unknown>
      void _nativeButton
      return render(rest as typeof renderProps, state)
    })
    : render
  let inferredNativeButton = true
  if (asChild && React.isValidElement(children)) {
    if (typeof children.type === "string") {
      inferredNativeButton = children.type === "button"
    } else {
      const childProps = (children.props ?? {}) as Record<string, unknown>
      inferredNativeButton = !("href" in childProps)
    }
  }
  const resolvedNativeButton = nativeButton ?? (asChild ? inferredNativeButton : true)
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      render={slotRender ?? safeRender}
      nativeButton={resolvedNativeButton}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Trigger>
  )
}

function CollapsibleContent({ ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
