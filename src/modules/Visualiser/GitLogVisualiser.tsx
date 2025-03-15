import { Commit, GitLogVisualiserProps } from './types.ts'
import { GitGraph } from './components/GitGraph'
import { useCallback, useMemo, useState } from 'react'
import { GitContext, GitContextBag } from 'modules/Visualiser/context'
import { lightThemeColors, useTheme } from 'modules/Visualiser/hooks/useTheme'
import { generateRainbowGradient } from 'modules/Visualiser/hooks/useTheme/createRainbowTheme'
import { temporalTopologicalSort } from 'modules/GraphData/temporalTopologicalSort.ts'
import { computeNodePositions } from 'modules/GraphData/computeNodeColumns.ts'
import { computeRelationships } from 'modules/GraphData/computeRelationships.ts'
import { GraphData } from 'modules/GraphData'

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
   githubRepositoryUrl,
   currentBranch
}: GitLogVisualiserProps) => {
  const [selectedCommit, setSelectedCommit] = useState<Commit>()
  const [previewedCommit, setPreviewedCommit] = useState<Commit>()

  const { shiftAlphaChannel } = useTheme()

  const graphData = useMemo<GraphData>(() => {
    const { children, parents, hashToCommit } = computeRelationships(entries)
    const sortedCommits = temporalTopologicalSort([...hashToCommit.values()], children, hashToCommit)
    const { graphWidth, positions, edges } = computeNodePositions(sortedCommits, currentBranch, children, parents)

    return {
      children,
      parents,
      hashToCommit,
      graphWidth,
      positions,
      edges,
      commits: sortedCommits
    }
  }, [currentBranch, entries])

  const themeColours = useMemo<string[]>(() => {
    // TODO: Are we keeping colours as a prop?
 /*   if (colours) {
      return colours
    }*/

    if (theme) {
      const rainbowColours = generateRainbowGradient(graphData.graphWidth)

      return theme === 'dark'
        ? rainbowColours.map(colour => shiftAlphaChannel(colour, 0.4))
        : rainbowColours
    }

    return lightThemeColors
  }, [graphData.graphWidth, shiftAlphaChannel, theme])

  const handleSelectCommit = useCallback((commit?: Commit) => {
    setSelectedCommit(commit)
    onSelectCommit?.(commit)
  }, [onSelectCommit])

  const headCommit = useMemo<Commit>(() => {
    return graphData.commits.find(it => it.branch.includes(currentBranch))!
  }, [currentBranch, graphData.commits])

  const indexCommit = useMemo<Commit>(() => ({
    hash: 'index',
    branch: headCommit.branch,
    parents: [headCommit.hash],
    authorDate: new Date().toString(),
    message: '// Work in-progress...',
    committerDate: new Date().toString(),
    isBranchTip: false,
    refs: 'index',
    x: 0,
    y: 0
  }), [headCommit.branch, headCommit.hash])

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
    defaultGraphContainerWidth: graphWidth,
    currentBranch,
    headCommit,
    indexCommit,
    graphData
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
    currentBranch,
    headCommit,
    indexCommit,
    graphData
  ])
  
  return (
    <GitContext.Provider value={value}>
       <GitGraph />
    </GitContext.Provider>
  )
}