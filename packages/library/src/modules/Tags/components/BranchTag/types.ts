import { Commit } from 'types'

export interface BranchTagProps {
  id: string
  commit: Commit
  height: number
  lineRight: number
  lineWidth: number
}