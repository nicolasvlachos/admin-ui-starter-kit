import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * Extend tailwind-merge so it knows our custom font-size utilities
 * (`text-xxs`, `text-xs`, `text-sm`, `text-base`, `text-lg` defined in
 * App.css against `--text-*` tokens) belong to the `font-size` group.
 *
 * Without this, twMerge groups them with text-color utilities and drops
 * one of them when both appear (e.g. `text-xxs` + `text-primary-foreground`
 * would lose the color). Registering them here keeps both intact.
 */
const twMerge = extendTailwindMerge({
  override: {
    classGroups: {
      'font-size': [
        { text: ['xxs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
