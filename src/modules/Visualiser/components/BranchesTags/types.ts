import { Commit } from 'modules/Visualiser'
import * as React from 'react'
import { CSSProperties } from 'react'

export interface BranchesTagsProps {
  commits: Commit[]
  commitNodeSpacing: number
}

export interface BranchTagTooltipProps {
  branch: string
}

export interface BranchTagProps {
  id: string
  branch: string
  hash: string
  height: number
  color: string
  lineRight: number
  lineWidth: number
  icon: React.ReactElement<{ className?: string, style?: CSSProperties }>
}