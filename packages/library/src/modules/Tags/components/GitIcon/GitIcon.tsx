import { useTheme } from 'hooks/useTheme'
import classNames from 'classnames'
import styles from './GitIcon.module.scss'
import Icon from 'assets/git.svg?react'
import { GitIconProps } from './types'

export const GitIcon = ({ className }: GitIconProps) => {
  const { textColour, shiftAlphaChannel } = useTheme()

  return (
    <Icon
      id='git-icon'
      data-testid='git-icon'
      style={{ fill: shiftAlphaChannel(textColour, 0.8) }}
      className={classNames(styles.icon, className)}
    />
  )
}