import { useGitContext } from 'context/GitContext'
import styles from './BranchLabel.module.scss'
import { formatBranch } from 'modules/Tags/utils/formatBranch'
import { useMemo } from 'react'
import { Link } from '../Link'
import { BranchIcon } from '../BranchIcon'
import { BranchLabelProps } from './types'

export const BranchLabel = ({ commit }: BranchLabelProps) => {
  const { remoteProviderUrlBuilder } = useGitContext()

  const displayName = formatBranch(commit.branch)

  const linkHref = useMemo(() => {
    const branchLink = remoteProviderUrlBuilder?.({ commit }).branch

    if (branchLink) {
      return branchLink
    }
  }, [commit, remoteProviderUrlBuilder])

  if (linkHref) {
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