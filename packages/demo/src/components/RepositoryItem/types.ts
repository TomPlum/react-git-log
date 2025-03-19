import { ReactElement } from 'react'

export interface RepositoryItemProps {
  icon: ReactElement<{ className?: string }>
  name: string
}