import { Canvas2DGraphProps, GitLogPagedProps, HTMLGridGraphProps, TableProps } from '@tomplum/react-git-log'

export interface GitLogPagedStoryProps extends GitLogPagedProps<unknown>, HTMLGridGraphProps, Canvas2DGraphProps, TableProps {
  showTable: boolean
  showCommitNodeHashes: boolean
  renderStrategy: 'html-grid' | 'canvas'
}