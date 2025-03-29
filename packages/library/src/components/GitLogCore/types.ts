import { GitLogPagedProps, GitLogProps } from '../../types'

export interface GitLogCoreProps extends GitLogProps, Omit<GitLogPagedProps, 'headCommitHash' | 'branchName'> {
  componentName: string
  headCommitHash?: string
  isServerSidePaginated?: boolean
}