import { Canvas2DGraphProps, GitLogProps, HTMLGridGraphProps } from '@tomplum/react-git-log'

export interface GitLogStoryProps extends GitLogProps, HTMLGridGraphProps, Canvas2DGraphProps {
  pageSize?: number
  page?: number
  showTable: boolean
  showBranchesTags: boolean
  showCommitNodeHashes: boolean
  renderStrategy: 'html-grid' | 'canvas'
}