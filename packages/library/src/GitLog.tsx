import { GitLogProps } from './types'
import { Children, isValidElement, PropsWithChildren, ReactElement, useCallback, useMemo, useState } from 'react'
import { GitContext, GitContextBag } from 'context/GitContext'
import { neonAuroraDarkColours, neonAuroraLightColours, useTheme } from 'hooks/useTheme'
import { generateRainbowGradient } from 'hooks/useTheme/createRainbowTheme'
import { computeNodePositions, computeRelationships, GraphData, temporalTopologicalSort } from 'data'
import { Tags } from 'modules/Tags'
import { Graph } from 'modules/Graph'
import { Table } from 'modules/Table'
import { Layout } from 'components/Layout'
import { Commit } from 'types/Commit'

export const GitLog = ({
   children,
   entries,
   enableExperimentalAnimation = false,
   showTableHeaders = false,
   rowSpacing = 0,
   theme = 'light',
   colours = 'rainbow-light',
   classes,
   defaultGraphWidth = 300,
   onSelectCommit,
   githubRepositoryUrl,
   currentBranch,
   paging
}: PropsWithChildren<GitLogProps>) => {
  const { tags, graph, table } = useMemo(() => {
    let tags: ReactElement | undefined = undefined
    let graph: ReactElement | undefined = undefined
    let table: ReactElement | undefined = undefined

    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        if (child.type === GitLog.Tags) {
          if (tags) {
            throw new Error('<GitLog /> can only have one <GitLog.Tags /> child.')
          }

          tags = child
        } else if (child.type === GitLog.Graph) {
          if (graph) {
            throw new Error('<GitLog /> can only have one <GitLog.Graph /> child.')
          }

          graph = child
        } else if (child.type === GitLog.Table) {
          if (table) throw new Error('<GitLog /> can only have one <GitLog.Table /> child.')
          table = child
        }
      }
    })

    if (!graph) {
      console.warn('react-git-log is not designed to work without a <GitLog.Graph /> component.')
    }

    return { tags, graph, table }
  }, [children])

  const [selectedCommit, setSelectedCommit] = useState<Commit>()
  const [previewedCommit, setPreviewedCommit] = useState<Commit>()
  const [graphWidth, setGraphWidth] = useState(defaultGraphWidth)

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
    showTable: Boolean(table),
    showBranchesTags: Boolean(tags),
    classes,
    theme,
    selectedCommit,
    setSelectedCommit: handleSelectCommit,
    previewedCommit,
    setPreviewedCommit,
    enableExperimentalAnimation,
    githubRepositoryUrl,
    showTableHeaders,
    currentBranch,
    headCommit,
    indexCommit,
    graphData,
    paging: pageIndices,
    rowSpacing,
    graphWidth: defaultGraphWidth ?? graphWidth,
    setGraphWidth
  }), [
    themeColours,
    classes,
    theme,
    selectedCommit,
    previewedCommit,
    handleSelectCommit,
    enableExperimentalAnimation,
    githubRepositoryUrl,
    showTableHeaders,
    headCommit,
    currentBranch,
    indexCommit,
    graphData,
    pageIndices,
    graphWidth,
    setGraphWidth,
    defaultGraphWidth,
    rowSpacing,
    table,
    tags
  ])
  
  return (
    <GitContext.Provider value={value}>
       <Layout tags={tags} graph={graph} table={table} />
    </GitContext.Provider>
  )
}

GitLog.Tags = Tags
GitLog.Graph = Graph
GitLog.Table = Table