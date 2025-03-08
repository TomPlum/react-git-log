import { Commit } from 'modules/Visualiser'

export interface GitLogProps {
  data: Commit[]
  selected?: string
  colour?: string
  onSelect: (selected: Commit) => void
}