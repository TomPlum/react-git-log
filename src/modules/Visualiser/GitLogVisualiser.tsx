import { GitLogVisualiserProps } from './types.ts'
import { GitGraph } from './components/GitGraph'
import { useMemo, useState } from 'react'
import { GitContext, GitContextBag } from 'modules/Visualiser/context'

export const GitLogVisualiser = ({
   padding,
   entries,
   showGitLog,
   showBranchesTags,
   showCommitNodeHashes
}: GitLogVisualiserProps) => {
  const [colours] = useState<string[]>([])

  const value = useMemo<GitContextBag>(() => ({
    colours,
    padding,
    showGitLog: showGitLog ?? true,
    showBranchesTags: showBranchesTags ?? true,
    showCommitNodeHashes: showCommitNodeHashes ?? false,
    entries
  }), [colours, entries, padding, showBranchesTags, showCommitNodeHashes, showGitLog])
  
  return (
    <GitContext.Provider value={value}>
       <GitGraph />
    </GitContext.Provider>
  )
}