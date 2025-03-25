// eslint-disable-next-line import/extensions
import Icon from 'assets/branch.svg?react'
import { useTheme } from 'hooks/useTheme'
import styles from './BranchIcon.module.scss'
import classNames from 'classnames'
import { BranchIconProps } from './types'

export const BranchIcon = ({ className, ...props }: BranchIconProps) => {
  const { textColour } = useTheme()

  return (
    <Icon
      {...props}
      id='branch-icon'
      data-testid='branch-icon'
      style={{ fill: textColour }}
      className={classNames(styles.icon, className)}
    />
  )
}