import { useGitContext } from 'modules/Visualiser/context'
import styles from './BranchLabel.module.scss'
import { formatBranch } from 'modules/Visualiser/utils/formatBranch'
import { useMemo } from 'react'
import { Link } from './Link'
import { BranchIcon } from './BranchIcon'

export interface BranchLabelProps {
  name: string
}

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

        <BranchIcon className={styles.icon} />
      </>
    )
  }

  return (
    <>
      <span className={styles.branchName}>
        {displayName}
      </span>

      <BranchIcon className={styles.icon} />
    </>
  )
}