import styles from './IndexStatus.module.scss'
import Pencil from 'assets/pencil.svg?react'
import Plus from 'assets/plus.svg?react'
import Minus from 'assets/minus.svg?react'
import { useGitContext } from 'context/GitContext'
import classNames from 'classnames'

export const IndexStatus = () => {
  const { indexStatus } = useGitContext()

  if (!indexStatus) {
    return null
  }

  return (
    <div className={styles.indexStatus} data-testid='index-status'>
      {indexStatus.modified > 0 && (
        <div data-testid='index-status-modified' className={styles.status}>
          <span className={classNames(styles.value, styles.modified)}>
            {indexStatus.modified}
          </span>

          <div className={styles.iconWrapper}>
            <Pencil className={styles.pencil} />
          </div>
        </div>
      )}

      {indexStatus.added > 0 && (
        <div data-testid='index-status-added' className={styles.status}>
          <span className={classNames(styles.value, styles.added)}>
            {indexStatus.added}
          </span>

          <div className={styles.iconWrapper}>
            <Plus className={styles.plus} />
          </div>
        </div>
      )}

      {indexStatus.deleted > 0 && (
        <div data-testid='index-status-deleted' className={styles.status}>
          <span className={classNames(styles.value, styles.deleted)}>
            {indexStatus.deleted}
          </span>

          <div className={styles.iconWrapper}>
            <Minus className={styles.minus} />
          </div>
        </div>
      )}
    </div>
  )
}