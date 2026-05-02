import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import * as React from "react"

import { Slot } from "@/components/ui/slot"
import { cn } from "@/lib/utils"

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  asChild = false,
  nativeButton,
  render,
  children,
  ...props
}: PopoverPrimitive.Trigger.Props & { asChild?: boolean; nativeButton?: boolean }) {
  const slotRender = asChild ? <Slot /> : undefined
  const safeRender: PopoverPrimitive.Trigger.Props["render"] = typeof render === "function"
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
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      render={slotRender ?? safeRender}
      nativeButton={resolvedNativeButton}
      {...props}
    >
      {children}
    </PopoverPrimitive.Trigger>
  )
}

function PopoverAnchor({
  asChild = false,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & { asChild?: boolean }) {
  if (asChild) {
    return <Slot {...props} />
  }

  return <span data-slot="popover-anchor" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  disablePortal = false,
  onOpenAutoFocus,
  onInteractOutside,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    disablePortal?: boolean
    onOpenAutoFocus?: (event: Event) => void
    onInteractOutside?: (event: Event) => void
  }) {
  void onOpenAutoFocus
  void onInteractOutside

  const content = (
    <PopoverPrimitive.Positioner
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      className="isolate z-50"
    >
      <PopoverPrimitive.Popup
        data-slot="popover-content"
        className={cn(
          "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 flex flex-col gap-4 rounded-md p-4 text-sm shadow-md ring-1 duration-100 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 z-50 w-72 origin-(--transform-origin) outline-hidden",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Positioner>
  )

  if (disablePortal) {
    return content
  }

  return <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
