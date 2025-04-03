import { GraphRow } from 'modules/Graph/components/GraphRow'
import { usePlaceholderData } from 'modules/Graph/hooks/usePlaceholderData'

export const SkeletonGraph = () => {
  const { placeholderData } = usePlaceholderData()
  
  return (
    <>
      {placeholderData.map(({ commit, columns }, i) => (
        <GraphRow
          id={i}
          commit={commit}
          columns={columns}
          key={`skeleton_row_${i}`}
        />
      ))}
    </>
  )
}