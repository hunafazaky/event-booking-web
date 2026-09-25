import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

// Adapted from neobrutalism.dev's button (verified against their
// actual component source). Two deliberate deviations from their
// exact code: (1) the hover "press" effect uses arbitrary Tailwind
// values (translate-x-[4px]) instead of their custom boxShadowX/Y
// utility names, since those depend on theme plumbing not worth
// replicating for a fixed 4px offset; (2) three extra semantic
// variants (success/warning/info) beyond their default/neutral/
// reverse/noShadow set, using this project's own status tokens.
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-base text-sm font-base ring-offset-white transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          'text-main-foreground bg-main border-2 border-border shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none',
        noShadow: 'text-main-foreground bg-main border-2 border-border',
        neutral:
          'bg-secondary-background text-foreground border-2 border-border shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none',
        reverse:
          'text-main-foreground bg-main border-2 border-border hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-shadow',
        success:
          'text-success-foreground bg-success border-2 border-border shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none',
        warning:
          'text-warning-foreground bg-warning border-2 border-border shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none',
        info: 'text-info-foreground bg-info border-2 border-border shadow-shadow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-8 gap-1.5 px-2.5 text-xs [&_svg]:size-3.5',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'size-10',
        'icon-xs': 'size-8 [&_svg]:size-3.5',
        'icon-sm': 'size-9',
        'icon-lg': 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ButtonPrimitive> & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
