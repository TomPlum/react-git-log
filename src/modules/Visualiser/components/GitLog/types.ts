import { Commit } from 'modules/Visualiser'

export interface GitLogProps {
  data: Commit[]
  selected?: string
  hovered?: string
  colour?: string
  onSelect: (selected: Commit) => void
  onHover: (hovered?: Commit) => void
}