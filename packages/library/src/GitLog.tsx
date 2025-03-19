import { Commit, GitLogProps } from 'types'
import { Layout } from './Layout'
import { useCallback, useMemo, useState } from 'react'
import { GitContext, GitContextBag } from 'context/GitContext'
import { neonAuroraDarkColours, neonAuroraLightColours, useTheme } from 'hooks/useTheme'
import { generateRainbowGradient } from 'hooks/useTheme/createRainbowTheme'
import { GraphData, temporalTopologicalSort, computeNodePositions, computeRelationships } from 'data'

export const GitLog = ({
   entries,
   showTable = true,
   showBranchesTags = true,
   showCommitNodeHashes = false,
   enableExperimentalAnimation = false,
   showCommitNodeTooltips = false,
   showTableHeaders = false,
   enableResize = false,
   rowSpacing = 0,
   theme = 'light',
   colours = 'rainbow-light',
   defaultGraphContainerWidth = 300,
   classes,
   timestampFormat = 'YYYY-MM-DD HH:mm:ss',
   onSelectCommit,
   githubRepositoryUrl,
   currentBranch,
   paging
}: GitLogProps) => {
  const [selectedCommit, setSelectedCommit] = useState<Commit>()
  const [previewedCommit, setPreviewedCommit] = useState<Commit>()
  const [graphContainerWidth, setGraphContainerWidth] = useState(defaultGraphContainerWidth)

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
    switch (colours) {
      case 'rainbow-light': {
        return generateRainbowGradient(graphData.graphWidth + 1)
      }
      case 'rainbow-dark': {
        return generateRainbowGradient(graphData.graphWidth + 1)
          .map(colour => shiftAlphaChannel(colour, 0.6))
      }
      case 'neon-aurora-dark': {
        return neonAuroraDarkColours
      }
      case 'neon-aurora-light': {
        return neonAuroraLightColours
      }
      default: {
        if (theme === 'light') {
          return colours
        }

        return colours.map(colour => shiftAlphaChannel(colour, 0.6))
      }
    }
  }, [colours, graphData.graphWidth, shiftAlphaChannel, theme])

  const handleSelectCommit = useCallback((commit?: Commit) => {
    setSelectedCommit(commit)
    onSelectCommit?.(commit)
  }, [onSelectCommit])

  const headCommit = useMemo<Commit>(() => {
    return graphData.commits.find(it => it.branch.includes(currentBranch))!
  }, [currentBranch, graphData.commits])

  const indexCommit = useMemo<Commit>(() => {
    const repositorySegments = githubRepositoryUrl?.split('/')
    const slashes = repositorySegments?.length ?? 0
    const lastTwoSegments = repositorySegments?.slice(slashes - 2, slashes)
    const repositoryName = lastTwoSegments?.join('/')
    const withRepoMessage = ` in ${repositoryName}...`

    return ({
      hash: 'index',
      branch: headCommit.branch,
      parents: [headCommit.hash],
      children: [],
      authorDate: new Date().toString(),
      message: `// Work in-progress${githubRepositoryUrl ? withRepoMessage : '...'}`,
      committerDate: new Date().toString(),
      isBranchTip: false,
      x: 0,
      y: 0
    })
  }, [githubRepositoryUrl, headCommit])

  const pageIndices = useMemo(() => {
    const page = paging?.page ?? 0
    const size = paging?.size ?? entries.length

    const startIndex = Math.max(0, page * size)
    const endIndex = Math.min(entries.length, startIndex + size)

    const isIndexVisible = startIndex === 0

    return { startIndex, endIndex, isIndexVisible }
  }, [entries.length, paging])

  const value = useMemo<GitContextBag>(() => ({
    colours: themeColours,
    showTable,
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
    defaultGraphContainerWidth: defaultGraphContainerWidth,
    currentBranch,
    headCommit,
    indexCommit,
    graphData,
    paging: pageIndices,
    enableResize,
    graphContainerWidth: defaultGraphContainerWidth ?? graphContainerWidth,
    setGraphContainerWidth,
    rowSpacing
  }), [
    showBranchesTags,
    showCommitNodeHashes,
    showTable,
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
    defaultGraphContainerWidth,
    graphContainerWidth,
    currentBranch,
    headCommit,
    indexCommit,
    graphData,
    pageIndices,
    enableResize,
    rowSpacing
  ])
  
  return (
    <GitContext.Provider value={value}>
       <Layout />
    </GitContext.Provider>
  )
}