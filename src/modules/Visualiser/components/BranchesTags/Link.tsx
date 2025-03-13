import classNames from 'classnames'
import styles from './Link.module.scss'
import { HTMLAttributes } from 'react'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'

export interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  text: string
  href?: string
  className?: string
}

export const Link = ({ href, text, className, ...props }: LinkProps) => {
  const { textColour } = useTheme()
  
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: textColour }}
      className={classNames(styles.link, className)}
      {...props}
    >
      {text}
    </a>
  )
}