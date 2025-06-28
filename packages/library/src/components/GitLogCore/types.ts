import { GitLogPagedProps, GitLogProps } from '../../types'

export interface GitLogCoreProps<T> extends GitLogProps<T>, Omit<GitLogPagedProps<T>, 'headCommitHash' | 'branchName'> {
  componentName: string
  headCommitHash?: string
  isServerSidePaginated?: boolean
}