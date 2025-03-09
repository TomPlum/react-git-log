import { darkThemeColors, GitLogVisualiserProps } from './types.ts'
import { GitGraph } from './components/GitGraph'
import { useMemo } from 'react'
import { GitContext, GitContextBag } from 'modules/Visualiser/context'

export const GitLogVisualiser = ({
   padding,
   entries,
   colours = darkThemeColors,
   showGitLog = true,
   showBranchesTags = true,
   showCommitNodeHashes = false
}: GitLogVisualiserProps) => {

  const value = useMemo<GitContextBag>(() => ({
    colours,
    padding,
    showGitLog,
    showBranchesTags,
    showCommitNodeHashes,
    entries
  }), [colours, entries, padding, showBranchesTags, showCommitNodeHashes, showGitLog])
  
  return (
    <GitContext.Provider value={value}>
       <GitGraph />
    </GitContext.Provider>
  )
}