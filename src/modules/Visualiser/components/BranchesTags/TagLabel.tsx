import TagIcon from 'assets/tag.svg?react'
import { useGitContext } from 'modules/Visualiser/context'
import { formatBranch } from 'modules/Visualiser/utils/formatBranch'
import { useMemo } from 'react'
import styles from './TagLabel.module.scss'
import { Link } from './Link'

export interface TagLabelProps {
  name: string
  className?: string
}

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

        <TagIcon className={styles.icon} />
      </>
    )
  }

  return (
    <>
      <span className={styles.tagName}>
        {displayName}
      </span>

      <TagIcon className={styles.icon} />
    </>
  )
}