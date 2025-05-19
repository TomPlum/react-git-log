export interface GetColumnBackgroundSizeProps {
  nodeSize: number
}

export const getColumnBackgroundSize = ({ nodeSize }: GetColumnBackgroundSizeProps) => {
  return  (nodeSize <= 16 ? 6 : 8) * 2
}
