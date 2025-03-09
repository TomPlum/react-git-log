import { darkThemeColors, GitLogVisualiserProps, lightThemeColors } from './types.ts'
import { GitGraph } from './components/GitGraph'
import { useMemo } from 'react'
import { GitContext, GitContextBag } from 'modules/Visualiser/context'

export const GitLogVisualiser = ({
   padding,
   entries,
   theme = 'light',
   colours,
   showGitLog = true,
   showBranchesTags = true,
   showCommitNodeHashes = false,
   classes
}: GitLogVisualiserProps) => {

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
    theme
  }), [entries, padding, showBranchesTags, showCommitNodeHashes, showGitLog, themeColours, classes, theme])
  
  return (
    <GitContext.Provider value={value}>
       <GitGraph />
    </GitContext.Provider>
  )
}