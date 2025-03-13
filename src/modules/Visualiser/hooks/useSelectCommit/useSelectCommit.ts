import { useCallback } from 'react'
import { Commit } from 'modules/Visualiser'
import { useGitContext } from 'modules/Visualiser/context'
import { SelectCommitHandler } from './types'

export const useSelectCommit = (): SelectCommitHandler => {
  const { selectedCommit, setPreviewedCommit, setSelectedCommit } = useGitContext()
  
  const handleMouseOver = useCallback((commit: Commit) => {
    setPreviewedCommit(commit)
  }, [setPreviewedCommit])

  const handleMouseOut = useCallback(() => {
    setPreviewedCommit(undefined)
  }, [setPreviewedCommit])

  const handleClickCommit = useCallback((commit: Commit) => {
    if (selectedCommit?.hash === commit.hash) {
      setSelectedCommit(undefined)
    } else {
      setSelectedCommit(commit)
    }
  }, [selectedCommit, setSelectedCommit])

  return {
    selectCommitHandler: {
      onMouseOver: handleMouseOver,
      onMouseOut: handleMouseOut,
      onClick: handleClickCommit
    }
  }
}