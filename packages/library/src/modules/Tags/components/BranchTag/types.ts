import { Commit } from 'modules/Visualiser'

export interface BranchTagProps {
  id: string
  commit: Commit
  height: number
  lineRight: number
  lineWidth: number
}