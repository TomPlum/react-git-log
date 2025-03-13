import Icon from 'assets/branch.svg?react'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import styles from './BranchIcon.module.scss'
import classNames from 'classnames'

export interface BranchIconProps {
  className?: string
}

export const BranchIcon = ({ className }: BranchIconProps) => {
  const { textColour } = useTheme()

  return (
    <Icon
      style={{ fill: textColour }}
      className={classNames(styles.icon, className)}
    />
  )
}