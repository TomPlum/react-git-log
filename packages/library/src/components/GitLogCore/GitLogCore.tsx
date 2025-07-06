import { GitLogCoreProps } from './types'
import { PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { GitContext, GitContextBag } from 'context/GitContext'
import { computeRelationships, GraphData, temporalTopologicalSort, GraphDataBuilder } from 'data'
import { Tags } from 'modules/Tags'
import { GraphCanvas2D, GraphHTMLGrid, GraphOrientation } from 'modules/Graph'
import { Table } from 'modules/Table'
import { Layout } from 'components/Layout'
import { Commit } from 'types/Commit'
import { DEFAULT_NODE_SIZE, NODE_BORDER_WIDTH } from 'constants/constants'
import { ThemeContextProvider } from 'context/ThemeContext'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useCoreComponents } from 'components/GitLogCore/useCoreComponents'

dayjs.extend(utc)

export const GitLogCore = <T,>({
  children,
  entries,
  showHeaders = false,
  rowSpacing = 0,
  theme = 'light',
  colours = 'rainbow-light',
  filter,
  classes,
  defaultGraphWidth,
  onSelectCommit,
  onPreviewCommit,
  urls,
  currentBranch,
  paging,
  headCommitHash,
  componentName,
  indexStatus,
  isServerSidePaginated = false,
  showGitIndex = true,
  enableSelectedCommitStyling = true,
  enablePreviewedCommitStyling = true
}: PropsWithChildren<GitLogCoreProps<T>>) => {
  const { tags, graph, table } = useCoreComponents({
    children,
    componentName
  })

  const { graphData, allCommits } = useMemo<{ graphData: GraphData<T>, allCommits: Commit<T>[] }>(() => {
    const { children, parents, hashToCommit } = computeRelationships(entries, headCommitHash)
    const sortedCommits = temporalTopologicalSort([...hashToCommit.values()], children, hashToCommit)
    const filteredCommits = filter?.(sortedCommits) ?? sortedCommits

    const graphDataBuilder = new GraphDataBuilder<T>({
      commits: sortedCommits,
      filteredCommits,
      children,
      parents,
      currentBranch
    })

    const { graphWidth, positions, edges } = graphDataBuilder.build()

    return {
      allCommits: sortedCommits,
      graphData: {
        children,
        parents,
        hashToCommit,
        graphWidth,
        positions,
        edges,
        commits: filteredCommits
      }
    }
  }, [currentBranch, entries, filter, headCommitHash])

  const [nodeSize, setNodeSize] = useState(DEFAULT_NODE_SIZE)
  const [graphOrientation, setGraphOrientation] = useState<GraphOrientation>('normal')
  const [selectedCommit, setSelectedCommit] = useState<Commit<T>>()
  const [previewedCommit, setPreviewedCommit] = useState<Commit<T>>()

  const smallestAvailableGraphWidth = graphData.graphWidth * (nodeSize + (NODE_BORDER_WIDTH * 2))

  // TODO: Are we using graphWidth here or just ditching enableResize?
  const [, setGraphWidth] = useState(defaultGraphWidth ?? smallestAvailableGraphWidth)

  const handleSelectCommit = useCallback((commit?: Commit<T>) => {
    setSelectedCommit(commit)
    onSelectCommit?.(commit)
  }, [onSelectCommit])

  const handlePreviewCommit = useCallback((commit?: Commit<T>) => {
    setPreviewedCommit(commit)
    onPreviewCommit?.(commit)
  }, [onPreviewCommit])

  const headCommit = useMemo<Commit<T> | undefined>(() => {
    if (isServerSidePaginated) {
      return allCommits.find(({ hash }) => {
        return hash === headCommitHash
      })
    }

    return allCommits.find(({ branch }) => {
      return branch.includes(currentBranch)
    })
  }, [allCommits, currentBranch, headCommitHash, isServerSidePaginated])

  const indexCommit = useMemo<Commit | undefined>(() => {
    if (!headCommit) {
      return undefined
    }

    const today = dayjs.utc().toISOString()

    return {
      hash: 'index',
      branch: headCommit.branch,
      parents: [headCommit.hash],
      children: [],
      authorDate: today,
      message: '// WIP',
      committerDate: today,
      isBranchTip: false
    } as Commit
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


  const value = useMemo<GitContextBag<T>>(() => ({
    showTable: Boolean(table),
    showBranchesTags: Boolean(tags),
    classes,
    filter,
    selectedCommit,
    setSelectedCommit: handleSelectCommit,
    previewedCommit,
    setPreviewedCommit: handlePreviewCommit,
    remoteProviderUrlBuilder: urls,
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
    indexStatus,
    enablePreviewedCommitStyling,
    enableSelectedCommitStyling
  }), [
    classes,
    selectedCommit,
    previewedCommit,
    handleSelectCommit,
    handlePreviewCommit,
    urls,
    filter,
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
    indexStatus,
    enablePreviewedCommitStyling,
    enableSelectedCommitStyling
  ])

  return (
    <GitContext.Provider value={value as GitContextBag}>
      <ThemeContextProvider theme={theme} colours={colours} graphWidth={graphData.graphWidth}>
        <Layout tags={tags} graph={graph} table={table} />
      </ThemeContextProvider>
    </GitContext.Provider>
  )
}

GitLogCore.Tags = Tags
GitLogCore.GraphCanvas2D = GraphCanvas2D
GitLogCore.GraphHTMLGrid = GraphHTMLGrid
GitLogCore.Table = Table