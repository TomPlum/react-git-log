// eslint-disable-next-line import/extensions
import sleepRepositoryData from 'test/data/sleep/sleep.txt?raw'
// eslint-disable-next-line import/extensions
import sleepRepositoryDataReleaseBranch from 'test/data/sleep-paginated/sleep-release-branch.txt?raw'
import { parseGitLogOutput } from 'test/data/gitLogParser'
import { sleepRepositoryRowColumnState } from 'test/data/sleep/sleepState'
import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'
import { graphColumn } from 'test/elements/GraphColumn'
import { afterEach, beforeEach, describe } from 'vitest'
import { render, within } from '@testing-library/react'
import { GitLog } from './GitLog'
import { sleepCommits } from 'test/data/sleep/sleepCommits'
import { commitNode } from 'test/elements/CommitNode'
import { tag } from 'test/elements/Tag'
import { Commit } from 'types/Commit'
import { formatBranch } from 'modules/Tags/utils/formatBranch'
import { table } from 'test/elements/Table'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import { sleepCommitsRelease } from 'test/data/sleep-paginated/sleep-commits-release'
import { sleepRowColumnStatePaginated } from 'test/data/sleep-paginated/sleepStatePaginated'
import { ElementType } from 'react'
import { GitLogPaged } from './GitLogPaged'

dayjs.extend(utc)
dayjs.extend(relativeTime)

interface DecoratedCommit extends Commit {
  isMostRecentTagInstance: boolean
}

interface IntegrationTestProps {
  rowColumnState: Record<number, GraphColumnState[]>
  repositoryCommits: Commit[]
  Component: ElementType
  isIndexRowShown: boolean
}

const prepareCommits = (commits: Commit[]): DecoratedCommit[] => {
  const tagsSeen = new Map<string, boolean>()

  return commits.map(commit => {
    const isTag = commit.branch.includes('tags/')
    const hasBeenRendered = tagsSeen.has(commit.branch)

    const shouldRenderTag = isTag && !hasBeenRendered
    if (shouldRenderTag) {
      tagsSeen.set(commit.branch, true)
    }

    return {
      ...commit,
      isMostRecentTagInstance: shouldRenderTag
    }
  })
}

const formatTimestamp = (dateString: string) => {
  const commitDate = dayjs.utc(dateString)

  if (dayjs.utc(new Date()).diff(commitDate, 'week') >= 1) {
    return commitDate.format('YYYY-MM-DD HH:mm:ss')
  }

  return commitDate.fromNow()
}

const today = new Date(2025, 2, 24, 18, 0, 0)

/**
 * To print columnData for graph column state for integration tests use
 *    console.log(JSON.stringify(Object.fromEntries(columnData), null, 2))
 * in Graph.tsx.
 */
describe('GitLog Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(today)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render the correct elements in each column for the sleep repository git log entries', { timeout: 60 * 1000 * 5 }, () => {
    const gitLogEntries = parseGitLogOutput(sleepRepositoryData)

    runIntegrationTest({
      repositoryCommits: sleepCommits,
      rowColumnState: sleepRepositoryRowColumnState,
      isIndexRowShown: true,
      Component: () => (
        <GitLog
          showHeaders
          currentBranch='release'
          entries={gitLogEntries}
        >
          <GitLog.Tags />
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )
    })
  })

  // TODO: Keep test or have the Vitest snapshots supersede?
  it.skip('should render the correct elements in each column for paginated sleep repository git log entries', { timeout: 60 * 1000 }, () => {
    // This ensures that the graph renders correctly if the git log entry
    // data is incomplete. This is usually because the consumer is using
    // server-side pagination and has passed a set of entry data that references
    // commits (usually parents) that do not exist in the given dataset. In these
    // instances the graph will render differently by drawing vertical lines from
    // orphaned commit nodes down the bottom of the graph.

    const pageStart = 40
    const pageEnd = 60

    const gitLogEntries = parseGitLogOutput(sleepRepositoryDataReleaseBranch).slice(pageStart, pageEnd)

    runIntegrationTest({
      repositoryCommits: sleepCommitsRelease.slice(pageStart, pageEnd),
      rowColumnState: sleepRowColumnStatePaginated,
      isIndexRowShown: false,
      Component: () => (
        <GitLogPaged
          showHeaders
          branchName='release'
          headCommitHash='1352f4c'
          entries={gitLogEntries}
        >
          <GitLogPaged.Tags />
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.Table />
        </GitLogPaged>
      )
    })
  })

  const runIntegrationTest = ({ Component, repositoryCommits, rowColumnState, isIndexRowShown }: IntegrationTestProps) => {
    const headCommit = repositoryCommits.find(commit => commit.hash === '1352f4c')
    const commits = prepareCommits(repositoryCommits)

    render(<Component />)

    const debugMetrics: Record<string, number> = {}

    // Assert row index 0 first since that contains the index
    // pseudo commit and is separate from the main commit data
    if (isIndexRowShown) {
      const indexNodeColumn = graphColumn.at({ row: 0, column: 0 })
      const insideIndexNodeColumn = within(indexNodeColumn)
      expect(insideIndexNodeColumn.getByTestId(graphColumn.indexPseudoCommitNodeId)).toBeInTheDocument()
      expect(insideIndexNodeColumn.getByTestId(graphColumn.bottomHalfDottedVerticalLineId)).toBeInTheDocument()

      // Other columns on row 0 should be empty
      for (let i = 1; i <= 6; i++) {
        const otherColumn = graphColumn.at({ row: 0, column: i })
        expect(otherColumn).toBeEmptyDOMElement()
      }

      const indexTag = tag.atRow({ row: 0 })
      expect(indexTag).toBeInTheDocument()
      expect(indexTag).toHaveTextContent('index')

      const indexTableRow = table.row({ row: 0 })
      expect(indexTableRow).toBeInTheDocument()
      expect(table.commitMessageData({ row: 0 })).toHaveTextContent('// WIP')
      expect(table.timestampData({ row: 0 })).toHaveTextContent('-')
      expect(table.authorData({ row: 0 })).toHaveTextContent('-')
    }

    // The row/column state is from index 1 on-wards,
    // since the index pseudo-commit is rendered separately.
    Object.entries(rowColumnState).forEach(([index, columnStates]: [string, GraphColumnState[]]) => {
      const rowIndex = Number(index)
      const commit = commits[rowIndex - 1]

      // Check branches / tags
      if (commit.isBranchTip || commit.isMostRecentTagInstance) {
        const tagElement = tag.atRow({ row: rowIndex })
        expect(tagElement).toBeInTheDocument()
        expect(tagElement).toHaveTextContent(formatBranch(commit.branch))
      } else {
        expect(tag.empty({ row: rowIndex })).toBeInTheDocument()
      }

      // Check graph state
      columnStates.forEach((columnState, columnIndex) => {
        const columnElement = graphColumn.at({
          row: Number(rowIndex),
          column: columnIndex
        })

        const insideCurrentColumn = within(columnElement)

        const missingColMsg = `Column container at row ${rowIndex}, column ${columnIndex} was not found in the graph`
        expect(columnElement, missingColMsg).toBeInTheDocument()

        // If the column is supposed to have a commit node in it,
        // assert that it renders the correct elements.
        if (columnState.isNode) {
          const missingNodeMsg = `Expected commit node element in row ${rowIndex}, column ${columnIndex} with hash ${commit.hash}, but it was not found in the graph`
          const commitNodeTestId = graphColumn.commitNodeId({ hash: commit.hash })
          expect(insideCurrentColumn.getByTestId(commitNodeTestId), missingNodeMsg)
          debugMetrics['commit-nodes'] = (debugMetrics['commit-nodes'] ?? 0) + 1

          // If the commit is a merge commit
          if (commit.parents.length > 1) {
            expect(commitNode.mergeCircle({ hash: commit.hash })).toBeInTheDocument()
          }
        }

        // If the column is supposed to have a horizontal line in it,
        // assert that it renders the correct elements.
        if (columnState.isHorizontalLine) {
          // Nodes in the first column always have half-width horizontal lines.
          // A nodes that are the target of merges also have half-width ones.
          if (columnState.isNode && (columnState.mergeSourceColumns || columnIndex === 0)) {
            const halfWidthLine = graphColumn.halfWidthRightHorizontalLineId
            const message = `Expected half-width, right-side, horizontal line element in row ${rowIndex}, column ${columnIndex}, but it was not found.`
            expect(insideCurrentColumn.getByTestId(halfWidthLine), message).toBeInTheDocument()
            debugMetrics['hor-right-half'] = (debugMetrics['hor-right-half'] ?? 0) + 1
          } else {
            const fullWidthLine = graphColumn.fullWidthHorizontalLineId
            const message = `Expected full-width horizontal line element in row ${rowIndex}, column ${columnIndex}, but it was not found.`
            expect(insideCurrentColumn.getByTestId(fullWidthLine), message).toBeInTheDocument()
            debugMetrics['hor-full'] = (debugMetrics['hor-full'] ?? 0) + 1
          }
        }

        // If the column is supposed to have a vertical line in it,
        // assert that it renders the correct elements.
        if (columnState.isVerticalLine) {
          const commit = repositoryCommits[rowIndex - 1]

          if (columnState.isNode) {
            const isHeadCommit = commit.hash === headCommit?.hash

            if (!headCommit && (columnState.isColumnAboveEmpty || commit.isBranchTip)) {
              console.log(commit.hash, columnState)
              expect(insideCurrentColumn.getByTestId(graphColumn.bottomHalfVerticalLineId)).toBeInTheDocument()
            }

            if (columnState.isColumnBelowEmpty || commit.parents.length === 0) {
              const topHalfVerticalLine = insideCurrentColumn.getByTestId(graphColumn.topHalfVerticalLineId)
              expect(topHalfVerticalLine).toBeInTheDocument()

              if (columnState.isFirstRow || columnState.isLastRow) {
                expect(getComputedStyle(topHalfVerticalLine).borderImage).not.toBeUndefined()
              }
            }

            if (isHeadCommit) {
              expect(insideCurrentColumn.getByTestId(graphColumn.topHalfDottedVerticalLineId)).toBeInTheDocument()
              expect(insideCurrentColumn.getByTestId(graphColumn.headCommitVerticalLineId)).toBeInTheDocument()
            }
          } else {
            const fullHeightVerticalLine = insideCurrentColumn.getByTestId(graphColumn.fullHeightVerticalLineId)
            expect(fullHeightVerticalLine).toBeInTheDocument()

            if (columnState.isFirstRow || columnState.isLastRow) {
              expect(getComputedStyle(fullHeightVerticalLine).borderImage).not.toBeUndefined()
            }
          }
        }

        if (columnState.isLeftUpCurve) {
          expect(insideCurrentColumn.getByTestId(graphColumn.leftUpCurveId)).toBeInTheDocument()
        }

        if (columnState.isLeftDownCurve) {
          expect(insideCurrentColumn.getByTestId(graphColumn.leftDownCurveId)).toBeInTheDocument()
        }
      })

      // Check table state
      const tableRowElement = table.row({ row: rowIndex })
      expect(tableRowElement).toBeInTheDocument()

      expect(table.commitMessageData({ row: rowIndex })).toHaveTextContent(commit.message)

      expect(table.authorData({ row: rowIndex })).toHaveTextContent(commit?.author?.name ?? '-')

      if (rowIndex > 1) {
        expect(table.timestampData({ row: rowIndex })).toHaveTextContent(formatTimestamp(commit.committerDate))
      } else {
        // The first commit is an hour ago relative to the stubbed current time
        expect(table.timestampData({ row: 1 })).toHaveTextContent('an hour ago')
      }
    })

    console.debug('Metrics from GitLog integration test for TomPlum/sleep @ release')
    console.debug(JSON.stringify(debugMetrics))
  }
})