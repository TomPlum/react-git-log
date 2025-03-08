import { Commit } from 'modules/Visualiser'

export interface GitLogProps {
  data: Commit[]
  selected?: string
  onSelect: (selected: Commit) => void
}