import { GraphRow } from 'modules/Graph/components/GraphRow'
import { IndexPseudoRowProps } from './types'
import { GraphColumnState } from 'modules/Graph/components/GraphColumn'
import { useMemo } from 'react'
import { useGitContext } from 'context/GitContext'

export const IndexPseudoRow = ({ graphWidth }: IndexPseudoRowProps) => {
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
      id={0}
      key={'index'}
      width={graphWidth}
      commit={indexCommit}
      columns={indexColumns}
    />
  )
}