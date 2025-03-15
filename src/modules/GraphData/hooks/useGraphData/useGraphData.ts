import { useGitContext } from 'modules/Visualiser/context'
import { useMemo } from 'react'
import { temporalTopologicalSort } from 'modules/Visualiser/utils/temporalTopologicalSort'
import { computeNodePositions } from 'modules/Visualiser/utils/computeNodeColumns'

export const useGraphData = () => {
  const { commits: commitData, currentBranch } = useGitContext()

  return useMemo(() => {
    const temporallySorted = temporalTopologicalSort(commitData)
    return computeNodePositions(temporallySorted, currentBranch)
  }, [commitData, currentBranch])
}