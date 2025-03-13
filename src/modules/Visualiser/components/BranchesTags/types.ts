import { Commit } from 'modules/Visualiser'

export interface BranchesTagsProps {
  commits: Commit[]
  commitNodeSpacing: number
}

export interface BranchTagTooltipProps {
  branch: string
}

export interface BranchTagProps {
  id: string
  commit: Commit
  height: number
  color: string
  lineRight: number
  lineWidth: number
}