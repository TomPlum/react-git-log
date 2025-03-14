import { Commit, GitLogVisualiserProps, ROW_HEIGHT } from './types.ts'
import { GitGraph } from './components/GitGraph'
import { useCallback, useMemo, useState } from 'react'
import { GitContext, GitContextBag } from 'modules/Visualiser/context'
import { lightThemeColors, useTheme } from 'modules/Visualiser/hooks/useTheme'
import { buildGraph } from 'modules/Visualiser/utils/buildGraph'
import { generateRainbowGradient } from 'modules/Visualiser/hooks/useTheme/createRainbowTheme'

export const GitLogVisualiser = ({
   entries,
   theme = 'light',
   showGitLog = true,
   showBranchesTags = true,
   showCommitNodeHashes = false,
   enableExperimentalAnimation = false,
   showCommitNodeTooltips = false,
   showTableHeaders = false,
   graphWidth = 400,
   classes,
   timestampFormat = 'YYYY-MM-DD HH:mm:ss',
   onSelectCommit,
   githubRepositoryUrl
}: GitLogVisualiserProps) => {
  const [selectedCommit, setSelectedCommit] = useState<Commit>()
  const [previewedCommit, setPreviewedCommit] = useState<Commit>()

  const { shiftAlphaChannel } = useTheme()

  const { commits } = useMemo(() => {
    return buildGraph(entries, ROW_HEIGHT)
  }, [entries])

  const themeColours = useMemo<string[]>(() => {
    // TODO: Are we keeping colours as a prop?
 /*   if (colours) {
      return colours
    }*/

    if (theme) {
      const maxConcurrentActiveBranches = [...new Set(commits.map(({ x }) => x))].length
      const rainbowColours = generateRainbowGradient(maxConcurrentActiveBranches)

      return theme === 'dark'
        ? rainbowColours.map(colour => shiftAlphaChannel(colour, 0.4))
        : rainbowColours
    }

    return lightThemeColors
  }, [commits, shiftAlphaChannel, theme])

  const handleSelectCommit = useCallback((commit?: Commit) => {
    setSelectedCommit(commit)
    onSelectCommit?.(commit)
  }, [onSelectCommit])

  const value = useMemo<GitContextBag>(() => ({
    colours: themeColours,
    showGitLog,
    showBranchesTags,
    showCommitNodeHashes,
    classes,
    theme,
    timestampFormat,
    selectedCommit,
    setSelectedCommit: handleSelectCommit,
    previewedCommit,
    setPreviewedCommit,
    enableExperimentalAnimation,
    githubRepositoryUrl,
    showCommitNodeTooltips,
    showTableHeaders,
    graphWidth,
    commits
  }), [
    showBranchesTags,
    showCommitNodeHashes,
    showGitLog,
    themeColours,
    classes,
    theme,
    timestampFormat,
    selectedCommit,
    previewedCommit,
    handleSelectCommit,
    enableExperimentalAnimation,
    githubRepositoryUrl,
    showCommitNodeTooltips,
    showTableHeaders,
    graphWidth,
    commits
  ])
  
  return (
    <GitContext.Provider value={value}>
       <GitGraph />
    </GitContext.Provider>
  )
}