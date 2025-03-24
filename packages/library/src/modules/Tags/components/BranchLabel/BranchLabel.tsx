import { useGitContext } from 'context/GitContext'
import styles from './BranchLabel.module.scss'
import { formatBranch } from 'modules/Tags/utils/formatBranch'
import { useMemo } from 'react'
import { Link } from '../Link'
import { BranchIcon } from '../BranchIcon'
import { BranchLabelProps } from './types'

export const BranchLabel = ({ name }: BranchLabelProps) => {
  const { githubRepositoryUrl } = useGitContext()

  const displayName = formatBranch(name)

  const linkHref = useMemo(() => {
    if (githubRepositoryUrl) {
      return `${githubRepositoryUrl}/tree/${displayName}`
    }
  }, [displayName, githubRepositoryUrl])

  if (githubRepositoryUrl) {
    return (
      <>
        <Link
          href={linkHref}
          text={displayName}
          className={styles.branchName}
        />

        <BranchIcon
          className={styles.icon}
        />
      </>
    )
  }

  return (
    <>
      <span className={styles.branchName}>
        {displayName}
      </span>

      <BranchIcon
        className={styles.icon}
      />
    </>
  )
}