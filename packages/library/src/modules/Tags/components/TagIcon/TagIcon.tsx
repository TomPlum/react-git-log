// eslint-disable-next-line import/extensions
import Icon from 'assets/tag.svg?react'
import { useTheme } from 'hooks/useTheme'
import styles from './TagIcon.module.scss'
import classNames from 'classnames'
import { TagIconProps } from './types'

export const TagIcon = ({ className }: TagIconProps) => {
  const { textColour } = useTheme()

  return (
    <Icon
      id='tag-icon'
      data-testid='tag-icon'
      style={{ stroke: textColour }}
      className={classNames(styles.icon, className)}
    />
  )
}