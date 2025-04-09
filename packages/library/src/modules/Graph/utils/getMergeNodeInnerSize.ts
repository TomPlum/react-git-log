export interface GetMergeNodeInnerSizeProps {
  nodeSize: number
}

export const getMergeNodeInnerSize = ({ nodeSize }: GetMergeNodeInnerSizeProps) => {
  return nodeSize > 10 ? nodeSize - 6 : nodeSize - 2
}