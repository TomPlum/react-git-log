import { useCallback, useEffect, useState } from 'react'
import type { GitLogEntry, ThemeMode } from '@tomplum/react-git-log'
import { ColourSelection } from 'components/ColourSelector'
import { rainbow } from 'themes.ts'
import { StoryStateProps } from './types'
import { useGitLogEntries } from 'hooks/useGitLogEntries'

const getRepositoryConfig = (name: string) => {
  switch (name) {
    case 'TomPlum/sleep': {
      return {
        branchName: 'release',
        fileNameEntireHistory: 'sleep.txt',
        fileNameCheckedOutBranch: 'sleep-release.txt',
        headCommitHash: '1352f4c'
      }
    }
    case 'TomPlum/advent-of-code-2019': {
      return {
        branchName: 'master',
        fileNameEntireHistory: 'advent-of-code-2019.txt',
        fileNameCheckedOutBranch: 'advent-of-code-2019-master.txt',
        headCommitHash: 'c88f0b9'
      }
    }
    case 'TomPlum/learn-japanese': {
      return {
        branchName: 'feature/JPUI-51',
        fileNameEntireHistory: 'learn-japanese.txt',
        fileNameCheckedOutBranch: 'learn-japanese-feature.txt',
        headCommitHash: 'de80ee8'
      }
    }
    default: {
      throw Error(`Invalid repository name '${name}'`)
    }
  }
}

export const useStoryState = ({ isServerSidePaginated, onChangeRepository }: StoryStateProps = {}) => {
  const [repository, setRepository] = useState('TomPlum/sleep')
  const { branchName, fileNameEntireHistory, fileNameCheckedOutBranch, headCommitHash } = getRepositoryConfig(repository)

  const { data, isLoading } = useGitLogEntries({
    fileName: isServerSidePaginated ? fileNameCheckedOutBranch : fileNameEntireHistory
  })

  const [theme, setTheme] = useState<ThemeMode>('dark')
  const [colours, setColours] = useState<ColourSelection>({ id: 'rainbow', colors: rainbow })

  const handleChangeColors = useCallback((selected: ColourSelection) => {
    setColours(selected)
  }, [])

  const backgroundColour = theme === 'dark' ? '#1a1a1a' : 'white'

  const handleChangeTheme = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme)
  }, [])

  useEffect(() => {
    onChangeRepository?.({
      repository,
      branchName
    })
  }, [branchName, onChangeRepository, repository])

  return {
    loading: isLoading,
    branch: branchName,
    headCommitHash,
    entries: data,
    theme,
    colours,
    repository,
    backgroundColour,
    handleChangeColors,
    handleChangeTheme,
    handleChangeRepository: setRepository
  }
}