import { useGitContext } from 'context/GitContext'
import { formatBranch } from 'modules/Tags/utils/formatBranch'
import { useMemo } from 'react'
import styles from './TagLabel.module.scss'
import { Link } from '../Link'
import { TagIcon } from '../TagIcon'
import { TagLabelProps } from './types'

export const TagLabel = ({ name }: TagLabelProps) => {
  const { githubRepositoryUrl } = useGitContext()

  const displayName = formatBranch(name)

  const linkHref = useMemo(() => {
    if (githubRepositoryUrl) {
      return `${githubRepositoryUrl}/tree/${displayName}`
    }
  }, [githubRepositoryUrl, displayName])

  if (githubRepositoryUrl) {
    return (
      <>
        <Link
          href={linkHref}
          text={displayName}
          className={styles.tagName}
        />

        <TagIcon />
      </>
    )
  }

  return (
    <>
      <span className={styles.tagName}>
        {displayName}
      </span>

      <TagIcon  />
    </>
  )
}