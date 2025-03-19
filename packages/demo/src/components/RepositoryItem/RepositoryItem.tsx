import styles from './RepositoryItem.module.scss'
import { RepositoryItemProps } from './types'
import { cloneElement } from 'react'

export const RepositoryItem = ({ name, icon }: RepositoryItemProps) => {
  return (
    <div className={styles.item}>
      {cloneElement(icon, {
        className: styles.icon
      })}

      <p className={styles.name}>
        {name}
      </p>
    </div>
  )
}