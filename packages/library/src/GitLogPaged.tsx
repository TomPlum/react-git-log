import { PropsWithChildren } from 'react'
import { GitLogPagedProps } from './types'
import { Tags } from './modules/Tags'
import { GraphCanvas2D, GraphHTMLGrid } from './modules/Graph'
import { Table } from './modules/Table'
import { GitLogCore } from './components/GitLogCore'

export const GitLogPaged = <T,>({ children, branchName, ...props }: PropsWithChildren<GitLogPagedProps<T>>) => {
  return (
    <GitLogCore<T>
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
GitLogPaged.GraphCanvas2D = GraphCanvas2D
GitLogPaged.GraphHTMLGrid = GraphHTMLGrid
GitLogPaged.Table = Table