import { Canvas2DGraphProps, GitLogProps, HTMLGridGraphProps, TableProps } from '@tomplum/react-git-log'

export interface GitLogStoryProps extends GitLogProps, HTMLGridGraphProps, Canvas2DGraphProps, TableProps {
  pageSize?: number
  page?: number
  showTable: boolean
  showBranchesTags: boolean
  showCommitNodeHashes: boolean
  renderStrategy: 'html-grid' | 'canvas'
  indexStatusFilesModified: number
  indexStatusFilesAdded: number
  indexStatusFilesDeleted: number
}