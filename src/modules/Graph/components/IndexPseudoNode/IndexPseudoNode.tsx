import { GraphRow } from 'modules/Graph/components/GraphRow'
import { IndexPseudoNodeProps } from './types'
import { GraphColumnState } from 'modules/Graph/components/GraphColumn'
import { useMemo } from 'react'
import { useGitContext } from 'modules/Visualiser/context'

export const IndexPseudoNode = ({ graphWidth }: IndexPseudoNodeProps) => {
  const { indexCommit } = useGitContext()

  const indexColumns = useMemo(() => {
    const columns = new Array<GraphColumnState>(graphWidth).fill({})

    columns[0] = {
      isNode: true,
      isVerticalLine: true
    }

    return columns
  }, [graphWidth])

  return (
    <GraphRow
      id={-1}
      key={'index'}
      width={graphWidth}
      commit={indexCommit}
      columns={indexColumns}
    />
  )
}