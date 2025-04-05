import { GitLogCoreProps } from './types'
import { Children, isValidElement, PropsWithChildren, ReactElement, useCallback, useMemo, useState } from 'react'
import { GitContext, GitContextBag } from 'context/GitContext'
import { computeNodePositions, computeRelationships, GraphData, temporalTopologicalSort } from 'data'
import { Tags } from 'modules/Tags'
import { Graph, GraphOrientation } from 'modules/Graph'
import { Table } from 'modules/Table'
import { Layout } from 'components/Layout'
import { Commit } from 'types/Commit'
import { DEFAULT_NODE_SIZE, NODE_BORDER_WIDTH } from 'constants/constants'
import { ThemeContextProvider } from 'context/ThemeContext'

export const GitLogCore = ({
  children,
  entries,
  showHeaders = false,
  rowSpacing = 0,
  theme = 'light',
  colours = 'rainbow-light',
  classes,
  defaultGraphWidth,
  onSelectCommit,
  githubRepositoryUrl,
  currentBranch,
  paging,
  headCommitHash,
  componentName,
  indexStatus,
  isServerSidePaginated = false,
  showGitIndex = true
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
  }, [currentBranch, entries, headCommitHash])

  const [nodeSize, setNodeSize] = useState(DEFAULT_NODE_SIZE)
  const [graphOrientation, setGraphOrientation] = useState<GraphOrientation>('normal')
  const [selectedCommit, setSelectedCommit] = useState<Commit>()
  const [previewedCommit, setPreviewedCommit] = useState<Commit>()

  const smallestAvailableGraphWidth = graphData.graphWidth * (nodeSize + (NODE_BORDER_WIDTH * 2))

  // TODO: Are we using graphWidth here or just ditching enableResize?
  const [, setGraphWidth] = useState(defaultGraphWidth ?? smallestAvailableGraphWidth)

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

    return ({
      hash: 'index',
      branch: headCommit.branch,
      parents: [headCommit.hash],
      children: [],
      authorDate: new Date().toString(),
      message: '// WIP',
      committerDate: new Date().toString(),
      isBranchTip: false,
      x: 0,
      y: 0
    })
  }, [headCommit])

  const pageIndices = useMemo(() => {
    const page = paging?.page ?? 0
    const size = paging?.size ?? entries.length

    const startIndex = Math.max(0, page * size)
    const endIndex = Math.min(entries.length, startIndex + size)

    return { startIndex, endIndex }
  }, [entries.length, paging])

  const isIndexVisible = useMemo<boolean>(() => {
    if (!showGitIndex) {
      return false
    }

    if (isServerSidePaginated) {
      return entries.some(({ hash }) => hash === headCommitHash)
    }

    if (paging) {
      return pageIndices.startIndex === 0
    }

    return true
  }, [entries, headCommitHash, isServerSidePaginated, pageIndices.startIndex, paging, showGitIndex])

  const graphContainerWidthValue = useMemo<number>(() => {
    if (defaultGraphWidth && defaultGraphWidth >= smallestAvailableGraphWidth) {
      return defaultGraphWidth
    }

    return smallestAvailableGraphWidth
  }, [defaultGraphWidth, smallestAvailableGraphWidth])

  const value = useMemo<GitContextBag>(() => ({
    showTable: Boolean(table),
    showBranchesTags: Boolean(tags),
    classes,
    selectedCommit,
    setSelectedCommit: handleSelectCommit,
    previewedCommit,
    setPreviewedCommit,
    githubRepositoryUrl,
    showHeaders,
    currentBranch,
    headCommit,
    indexCommit,
    graphData,
    paging: pageIndices,
    rowSpacing,
    graphWidth: graphContainerWidthValue,
    setGraphWidth,
    headCommitHash,
    isServerSidePaginated,
    isIndexVisible,
    nodeSize,
    setNodeSize,
    graphOrientation,
    setGraphOrientation,
    indexStatus
  }), [
    classes,
    selectedCommit,
    previewedCommit,
    handleSelectCommit,
    githubRepositoryUrl,
    showHeaders,
    headCommit,
    currentBranch,
    indexCommit,
    graphData,
    pageIndices,
    graphContainerWidthValue,
    setGraphWidth,
    rowSpacing,
    table,
    tags,
    headCommitHash,
    isServerSidePaginated,
    isIndexVisible,
    nodeSize,
    graphOrientation,
    indexStatus
  ])

  return (
    <GitContext.Provider value={value}>
      <ThemeContextProvider theme={theme} colours={colours} graphWidth={graphData.graphWidth}>
        <Layout tags={tags} graph={graph} table={table} />
      </ThemeContextProvider>
    </GitContext.Provider>
  )
}

GitLogCore.Tags = Tags
GitLogCore.Graph = Graph
GitLogCore.Table = Table