import { useGitContext } from 'context/GitContext'
import { formatBranch } from 'modules/Tags/utils/formatBranch'
import { useMemo } from 'react'
import styles from './TagLabel.module.scss'
import { Link } from '../Link'
import { TagIcon } from '../TagIcon'
import { TagLabelProps } from './types'

export const TagLabel = ({ commit }: TagLabelProps) => {
  const { remoteProviderUrlBuilder } = useGitContext()

  const displayName = formatBranch(commit.branch)

  const linkHref = useMemo(() => {
    if (remoteProviderUrlBuilder) {
      return remoteProviderUrlBuilder({ commit }).branch
    }
  }, [commit, remoteProviderUrlBuilder])

  if (linkHref) {
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