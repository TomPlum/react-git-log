import { Commit } from 'modules/Visualiser'

export interface BranchesTagsProps {
  commits: Commit[]
  commitNodeSpacing: number
  previewBranchAtHash?: string
}

export interface BranchTagTooltipProps {
  branch: string
}

export interface BranchTagProps {
  id: string
  branch: string
  height: number
  color: string
  lineRight: number
  lineWidth: number
}