import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import classNames from 'classnames'
import styles from './GitIcon.module.scss'
import Icon from 'assets/git.svg?react'

export interface GitIconProps {
  className?: string
}

export const GitIcon = ({ className }: GitIconProps) => {
  const { textColour, shiftAlphaChannel } = useTheme()

  return (
    <Icon
      style={{ fill: shiftAlphaChannel(textColour, 0.8) }}
      className={classNames(styles.icon, className)}
    />
  )
}