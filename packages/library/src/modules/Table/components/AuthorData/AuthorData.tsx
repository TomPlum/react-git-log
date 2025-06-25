import styles from './AuthorData.module.scss'
import { AuthorDataProps } from './types'
import { useMemo } from 'react'

export const AuthorData = ({ author, index, style, isPlaceholder }: AuthorDataProps) => {
  const authorTitle = useMemo(() => {
    if (author) {
      if (author.name && author.email) {
        return `${author.name} (${author.email})`
      }

      if (author.name && !author.email) {
        return author.name
      }

      if (author.email && !author.name) {
        return author.email
      }
    }

    return undefined
  }, [author])

  const authorName = useMemo(() => {
    if (author?.name) {
      return author.name
    }

    return ''
  }, [author])
  
  return (
    <div
      style={style}
      title={authorTitle}
      className={styles.author}
      id={`react-git-log-table-data-author-${index}`}
      data-testid={`react-git-log-table-data-author-${index}`}
    >
      {isPlaceholder ? '-' : authorName}
    </div>
  )
}