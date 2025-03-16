import classNames from 'classnames'
import styles from './Link.module.scss'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { LinkProps } from './types'

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