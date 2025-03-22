import classNames from 'classnames'
import styles from './HeadCommitVerticalLine.module.scss'
import { HeadCommitVerticalLineProps } from './types'

export const HeadCommitVerticalLine = ({ columnColour }: HeadCommitVerticalLineProps) => {
  return (
    <div
      id='head-commit-vertical-line'
      data-testid='head-commit-vertical-line'
      style={{
        height: '50%',
        top: '50%',
        borderRight: `2px solid ${columnColour}`
      }}
      className={classNames(styles.line, styles.vertical)}
    />
  )
}