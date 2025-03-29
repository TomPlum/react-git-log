import { GitLogCoreProps } from './types'
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

export const GitLogCore = ({
  children,
  entries,
  enableExperimentalAnimation = false,
  showHeaders = false,
  rowSpacing = 0,
  theme = 'light',
  colours = 'rainbow-light',
  classes,
  defaultGraphWidth = 300,
  onSelectCommit,
  githubRepositoryUrl,
  currentBranch,
  paging,
  headCommitHash,
  componentName,
  isServerSidePaginated = false
}: PropsWithChildren<GitLogCoreProps>) => {
  const { tags, graph, table } = useMemo(() => {
    let tags: ReactElement | undefined = undefined
    let graph: ReactElement | undefined = undefined
    let table: ReactElement | undefined = undefined

    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        if (child.type === GitLogCore.Tags) {
          if (tags) {
            throw new Error(`<${componentName} /> can only have one <${componentName}.Tags /> child.`)
          }

          tags = child
        } else if (child.type === GitLogCore.Graph) {
          if (graph) {
            throw new Error(`<${componentName} /> can only have one <${componentName}.Graph /> child.`)
          }

          graph = child
        } else if (child.type === GitLogCore.Table) {
          if (table) throw new Error(`<${componentName} /> can only have one <${componentName}.Table /> child.`)
          table = child
        }
      }
    })

    if (!graph) {
      console.warn(`react-git-log is not designed to work without a <${componentName}.Graph /> component.`)
    }

    return { tags, graph, table }
  }, [children, componentName])

  const [selectedCommit, setSelectedCommit] = useState<Commit>()
  const [previewedCommit, setPreviewedCommit] = useState<Commit>()
  const [graphWidth, setGraphWidth] = useState(defaultGraphWidth)

  const { shiftAlphaChannel } = useTheme()

  const graphData = useMemo<GraphData>(() => {
    const { children, parents, hashToCommit } = computeRelationships(entries, headCommitHash)
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

  const headCommit = useMemo<Commit | undefined>(() => {
    if (isServerSidePaginated) {
      return graphData.commits.find(it => it.hash === headCommitHash)
    }

    return graphData.commits.find(it => it.branch.includes(currentBranch))
  }, [currentBranch, graphData.commits, headCommitHash, isServerSidePaginated])

  const indexCommit = useMemo<Commit | undefined>(() => {
    if (!headCommit) {
      return undefined
    }

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

    return { startIndex, endIndex }
  }, [entries.length, paging])

  const isIndexVisible = useMemo<boolean>(() => {
    if (isServerSidePaginated) {
      return entries.some(({ hash }) => hash === headCommitHash)
    }

    if (paging) {
      return pageIndices.startIndex === 0
    }

    return true
  }, [entries, headCommitHash, isServerSidePaginated, pageIndices.startIndex, paging])

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
    showHeaders,
    currentBranch,
    headCommit,
    indexCommit,
    graphData,
    paging: pageIndices,
    rowSpacing,
    graphWidth: defaultGraphWidth ?? graphWidth,
    setGraphWidth,
    headCommitHash,
    isServerSidePaginated,
    isIndexVisible
  }), [
    themeColours,
    classes,
    theme,
    selectedCommit,
    previewedCommit,
    handleSelectCommit,
    enableExperimentalAnimation,
    githubRepositoryUrl,
    showHeaders,
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
    tags,
    headCommitHash,
    isServerSidePaginated,
    isIndexVisible
  ])

  return (
    <GitContext.Provider value={value}>
      <Layout tags={tags} graph={graph} table={table} />
    </GitContext.Provider>
  )
}

GitLogCore.Tags = Tags
GitLogCore.Graph = Graph
GitLogCore.Table = Table