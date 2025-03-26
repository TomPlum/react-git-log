import { CSSProperties } from 'react'
import { CommitAuthor } from 'types/Commit'

export interface AuthorDataProps {
  index: number
  style: CSSProperties
  author?: CommitAuthor
  isPlaceholder: boolean
}