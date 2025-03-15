import styles from 'modules/Visualiser/components/BranchesTags/BranchLabel.module.scss'
import { GitIcon } from 'modules/Visualiser/components/BranchesTags/GitIcon'

export const IndexLabel = () => {
  return (
    <>
      <span className={styles.branchName}>
        index
      </span>

      <GitIcon className={styles.icon} />
    </>
  )
}