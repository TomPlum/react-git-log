import { GraphRow } from 'modules/Graph/strategies/Grid/components/GraphRow'
import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'
import { useMemo } from 'react'
import { useGitContext } from 'context/GitContext'
import { useGraphContext } from 'modules/Graph/context'

export const IndexPseudoRow = () => {
  const { indexCommit } = useGitContext()
  const { graphWidth } = useGraphContext()

  const indexColumns = useMemo(() => {
    const columns = new Array<GraphColumnState>(graphWidth).fill({})

    columns[0] = {
      isNode: true,
      isVerticalLine: true
    }

    return columns
  }, [graphWidth])

  if (indexCommit) {
    return (
      <GraphRow
        id={0}
        key={'index'}
        commit={indexCommit}
        columns={indexColumns}
      />
    )
  }

  return null
}