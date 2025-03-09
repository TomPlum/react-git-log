import { Commit, GitLogVisualiserProps } from './types.ts'
import { GitGraph } from './components/GitGraph'
import { useMemo, useState } from 'react'
import { GitContext, GitContextBag } from 'modules/Visualiser/context'
import { darkThemeColors, lightThemeColors } from 'modules/Visualiser/hooks/useTheme'

export const GitLogVisualiser = ({
   padding,
   entries,
   theme = 'light',
   colours,
   showGitLog = true,
   showBranchesTags = true,
   showCommitNodeHashes = false,
   classes,
   timestampFormat = 'YYYY-MM-DD HH:mm:ss'
}: GitLogVisualiserProps) => {
  const [selectedCommit, setSelectedCommit] = useState<Commit>()
  const [previewedCommit, setPreviewedCommit] = useState<Commit>()

  const themeColours = useMemo<string[]>(() => {
    if (colours) {
      return colours
    }

    if (theme) {
      return theme === 'dark'
        ? darkThemeColors
        : lightThemeColors
    }

    return lightThemeColors
  }, [colours, theme])

  const value = useMemo<GitContextBag>(() => ({
    colours: themeColours,
    padding,
    showGitLog,
    showBranchesTags,
    showCommitNodeHashes,
    entries,
    classes,
    theme,
    timestampFormat,
    selectedCommit,
    setSelectedCommit,
    previewedCommit,
    setPreviewedCommit
  }), [
    entries,
    padding,
    showBranchesTags,
    showCommitNodeHashes,
    showGitLog,
    themeColours,
    classes,
    theme,
    timestampFormat,
    selectedCommit,
    previewedCommit
  ])
  
  return (
    <GitContext.Provider value={value}>
       <GitGraph />
    </GitContext.Provider>
  )
}