import { Commit } from 'types/Commit'

export interface BranchTagProps {
  id: string
  commit: Commit
  height: number
  lineRight: number
  lineWidth: number
}