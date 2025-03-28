import { PropsWithChildren } from 'react'
import { GitLogPagedProps } from './types'
import { Tags } from './modules/Tags'
import { Graph } from './modules/Graph'
import { Table } from './modules/Table'
import { GitLogCore } from './components/GitLogCore'

export const GitLogPaged = ({ children, branchName, ...props }: PropsWithChildren<GitLogPagedProps>) => {
  return (
    <GitLogCore
      {...props}
      isServerSidePaginated
      currentBranch={branchName}
      componentName="GitLogPaged"
    >
      {children}
    </GitLogCore>
  )
}

GitLogPaged.Tags = Tags
GitLogPaged.Graph = Graph
GitLogPaged.Table = Table