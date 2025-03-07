import { GitLogEntry } from '../../types.ts'

export interface GitGraphProps {
  commits: GitLogEntry[]
  showBranchesTags?: boolean
}