import { useCallback, useEffect, useMemo, useState } from 'react'
import type { GitLogUrlBuilder, GitLogUrlBuilderArgs } from '@tomplum/react-git-log'
import { ColourSelection } from '@components/ColourSelector'
import { rainbow } from 'themes'
import { StoryStateProps } from './types'
import { useGitLogEntries } from '@hooks/useGitLogEntries'
import { useDemoContext } from '@context'

const getRepositoryConfig = (name: string) => {
  switch (name) {
    case 'TomPlum/sleep': {
      return {
        branchName: 'release',
        fileNameEntireHistory: 'sleep.txt',
        fileNameCheckedOutBranch: 'sleep-release.txt',
        headCommitHash: '1352f4c',
        headCommitCheckoutOutBranch: 'e059c28',
        url: 'https://github.com/TomPlum/sleep'
      }
    }
    case 'TomPlum/advent-of-code-2019': {
      return {
        branchName: 'master',
        fileNameEntireHistory: 'advent-of-code-2019.txt',
        fileNameCheckedOutBranch: 'advent-of-code-2019-master.txt',
        headCommitHash: 'c88f0b9',
        headCommitCheckoutOutBranch: '12d47cc',
        url: 'https://github.com/TomPlum/advent-of-code-2019'
      }
    }
    case 'TomPlum/learn-japanese': {
      return {
        branchName: 'feature/JPUI-51',
        fileNameEntireHistory: 'learn-japanese.txt',
        fileNameCheckedOutBranch: 'learn-japanese-feature.txt',
        headCommitHash: 'de80ee8',
        headCommitCheckoutOutBranch: 'de80ee8d',
        url: 'https://github.com/TomPlum/learn-japanese'
      }
    }
    default: {
      throw Error(`Invalid repository name '${name}'`)
    }
  }
}

export const useStoryState = ({ isServerSidePaginated, onChangeRepository }: StoryStateProps = {}) => {
  const [repository, setRepository] = useState('TomPlum/sleep')

  const { theme } = useDemoContext()

  const {
    branchName,
    fileNameEntireHistory,
    fileNameCheckedOutBranch,
    headCommitHash,
    headCommitCheckoutOutBranch,
    url
  } = getRepositoryConfig(repository)

  const { data, isLoading } = useGitLogEntries({
    fileName: isServerSidePaginated ? fileNameCheckedOutBranch : fileNameEntireHistory
  })

  const [colours, setColours] = useState<ColourSelection>({ id: 'rainbow', colors: rainbow })

  const handleChangeColors = useCallback((selected: ColourSelection) => {
    setColours(selected)
  }, [])

  const backgroundColour = theme === 'dark' ? '#1a1a1a' : 'white'

  const buildUrls = useMemo<GitLogUrlBuilder>(() => {
    return ({ commit }: GitLogUrlBuilderArgs) => {
      const formattedBranch = commit.branch
        .replace('refs/heads/', '')
        .replace('refs/remotes/origin/', '')
        .replace('refs/tags/', '')

      return {
        branch: `${url}/tree/${formattedBranch}`,
        commit: `${url}/commit/${commit.hash}`
      }
    }
  }, [url])

  useEffect(() => {
    onChangeRepository?.({
      repository,
      branchName
    })
  }, [branchName, onChangeRepository, repository])

  return {
    loading: isLoading,
    branch: branchName,
    headCommitHash: isServerSidePaginated ? headCommitCheckoutOutBranch : headCommitHash,
    entries: data,
    colours,
    repository,
    backgroundColour,
    handleChangeColors,
    handleChangeRepository: setRepository,
    buildUrls
  }
}