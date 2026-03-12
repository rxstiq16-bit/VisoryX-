import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: 
          'bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-[0_4px_14px_0_rgba(139,92,246,0.39)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)] hover:translate-y-[-2px] active:translate-y-[1px] active:shadow-[0_2px_10px_rgba(139,92,246,0.3)]',
        destructive:
          'bg-gradient-to-b from-destructive to-destructive/90 text-white shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.5)] hover:translate-y-[-2px] active:translate-y-[1px] active:shadow-[0_2px_10px_rgba(239,68,68,0.3)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border-2 bg-transparent shadow-sm hover:bg-accent/50 hover:text-accent-foreground hover:border-primary/50 hover:shadow-md hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-sm dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-gradient-to-b from-secondary to-secondary/80 text-secondary-foreground shadow-sm hover:shadow-md hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-sm',
        ghost:
          'hover:bg-accent/80 hover:text-accent-foreground hover:shadow-sm active:bg-accent dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
