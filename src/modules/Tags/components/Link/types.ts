import { HTMLAttributes } from 'react'

export interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  text: string
  href?: string
  className?: string
}