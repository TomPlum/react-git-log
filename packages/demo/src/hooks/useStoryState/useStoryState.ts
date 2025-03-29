import { useCallback, useEffect, useState } from 'react'
import type { GitLogEntry, ThemeMode } from '@tomplum/react-git-log'
import { ColourSelection } from 'components/ColourSelector'
import { rainbow } from 'themes.ts'
import { fetchLogEntryData } from 'utils/fetchLogEntryData'
import { StoryStateProps } from './types'

const branches: Record<string, string> = {
  'TomPlum/sleep': 'release',
  'TomPlum/learn-japanese': 'feature/JPUI-51',
  'TomPlum/advent-of-code-2019': 'master'
}

export const useStoryState = ({ fromBranch, onChangeRepository }: StoryStateProps = {}) => {

  const [loading, setLoading] = useState(true)

  const [branch, setBranch] = useState('release')
  const [entries, setEntries] = useState<GitLogEntry[]>()

  const [theme, setTheme] = useState<ThemeMode>('dark')
  const [repository, setRepository] = useState('TomPlum/sleep')
  const [colours, setColours] = useState<ColourSelection>({ id: 'rainbow', colors: rainbow })

  const getData = useCallback(async (repository: string) => {
    return fetchLogEntryData(repository)
  }, [])

  useEffect(() => {
    setLoading(true)

    const initialRepositoryName = fromBranch ? `TomPlum/sleep-${fromBranch}` : 'TomPlum/sleep'
    getData(initialRepositoryName).then((data) => {
      setEntries(data)
    }).finally(() => {
      setLoading(false)
    })
  }, [getData, fromBranch])

  const handleChangeRepository = useCallback(async (selected: string) => {
    const newBranch = branches[selected]
    const newEntries = await getData(fromBranch ? `${selected}-${newBranch}` : selected)

    setEntries(newEntries)
    setRepository(selected)
    setBranch(newBranch)

    onChangeRepository?.({
      repository: selected,
      branchName: newBranch,
    })
  }, [getData, onChangeRepository, fromBranch])

  const handleChangeColors = useCallback((selected: ColourSelection) => {
    setColours(selected)
  }, [])

  const backgroundColour = theme === 'dark' ? '#1a1a1a' : 'white'

  const handleChangeTheme = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme)
  }, [])

  return {
    loading,
    branch,
    entries,
    theme,
    colours,
    repository,
    backgroundColour,
    handleChangeColors,
    handleChangeTheme,
    handleChangeRepository
  }
}