import { ColourSelection } from 'components/ColourSelector'
import { ThemeMode } from '@tomplum/react-git-log'

export interface StoryHeaderProps {
  theme: ThemeMode
  colours: ColourSelection
  repository: string
  onChangeRepository: (repository: string) => void
  onChangeColours: (event: ColourSelection) => void
  onChangeTheme: (theme: ThemeMode) => void
}