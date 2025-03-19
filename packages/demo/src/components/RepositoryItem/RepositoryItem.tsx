import styles from './RepositoryItem.module.scss'
import { RepositoryItemProps } from './types'

export const RepositoryItem = ({ name, icon }: RepositoryItemProps) => {
  return (
    <div className={styles.item}>
      {icon}

      <p className={styles.name}>
        {name}
      </p>
    </div>
  )
}