import styles from './RepositoryItem.module.scss'
import { RepositoryItemProps } from './types'
import { cloneElement } from 'react'

export const RepositoryItem = ({ name, branch, icon }: RepositoryItemProps) => {
  return (
    <div className={styles.item}>
      {cloneElement(icon, {
        className: styles.icon
      })}

      <div className={styles.details}>
        <p className={styles.name}>
          {name}
        </p>

        <p className={styles.branch}>
          {branch}
        </p>
      </div>
    </div>
  )
}