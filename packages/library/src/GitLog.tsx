import { GitLogProps } from './types'
import { PropsWithChildren } from 'react'
import { Tags } from './modules/Tags'
import { GraphCanvas2D, GraphHTMLGrid } from './modules/Graph'
import { Table } from './modules/Table'
import { GitLogCore } from './components/GitLogCore'

export const GitLog = ({ children, ...props }: PropsWithChildren<GitLogProps>) => {
  return (
    <GitLogCore
      {...props}
      componentName="GitLog"
    >
      {children}
    </GitLogCore>
  )
}

GitLog.Tags = Tags
GitLog.GraphCanvas2D = GraphCanvas2D
GitLog.GraphHTMLGrid = GraphHTMLGrid
GitLog.Table = Table