import Icon from 'assets/tag.svg?react'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import styles from './TagIcon.module.scss'
import classNames from 'classnames'
import { TagIconProps } from './types'

export const TagIcon = ({ className }: TagIconProps) => {
  const { textColour } = useTheme()

  return (
    <Icon
      style={{ stroke: textColour }}
      className={classNames(styles.icon, className)}
    />
  )
}