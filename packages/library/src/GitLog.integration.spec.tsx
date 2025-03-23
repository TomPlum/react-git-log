import sleepRepositoryData from 'test/data/sleep.txt?raw'
import { parseGitLogOutput } from 'test/data/gitLogParser'
import { sleepRepositoryRowColumnState } from 'test/data/sleepState'
import { GraphColumnState } from 'modules/Graph/components/GraphColumn'
import { graphColumn } from 'test/elements/GraphColumn'
import { describe } from 'vitest'
import { render, within } from '@testing-library/react'
import { GitLog } from './GitLog'
import { sleepCommits } from 'test/data/sleepCommits'
import { commitNode } from 'test/elements/CommitNode'

describe('Integration', () => {
  it('should render the correct elements in each column for the sleep repository git log entries', { timeout: 120 * 1000 }, () => {
    const gitLogEntries = parseGitLogOutput(sleepRepositoryData)
    const headCommit = sleepCommits.find(commit => commit.hash === '1352f4c')

    render(
      <GitLog
        currentBranch='release'
        entries={gitLogEntries}
      />
    )

    const debugMetrics: Record<string, number> = {}

    // Assert row index 0 first since that contains the index
    // pseudo commit and is separate from the main commit data
    const indexNodeColumn = graphColumn.at({ row: 0, column: 0 })
    const insideIndexNodeColumn = within(indexNodeColumn)
    expect(insideIndexNodeColumn.getByTestId(graphColumn.indexPseudoCommitNodeId)).toBeInTheDocument()
    expect(insideIndexNodeColumn.getByTestId(graphColumn.bottomHalfDottedVerticalLineId)).toBeInTheDocument()

    // Other columns on row 0 should be empty
    for (let i = 1; i <= 6; i++) {
      const otherColumn = graphColumn.at({ row: 0, column: i })
      expect(otherColumn).toBeEmptyDOMElement()
    }

    // The row/column state is from index 1 on-wards,
    // since the index pseudo-commit is rendered separately.
    Object.entries(sleepRepositoryRowColumnState).forEach(([index, columnStates]: [string, GraphColumnState[]]) => {
      const rowIndex = Number(index)
      // Check branches / tags TODO

      // Check graph state
      columnStates.forEach((columnState, columnIndex) => {
        const columnElement = graphColumn.at({
          row: Number(rowIndex),
          column: columnIndex
        })

        const missingColMsg = `Column container at row ${rowIndex}, column ${columnIndex} was not found in the graph`
        expect(columnElement, missingColMsg).toBeInTheDocument()

        // If the column is supposed to have a commit node in it,
        // assert that it renders the correct elements.
        if (columnState.isNode) {
          const commit = sleepCommits[rowIndex - 1]
          const missingNodeMsg = `Expected commit node element in row ${rowIndex}, column ${columnIndex} with hash ${commit.hash}, but it was not found in the graph`
          expect(graphColumn.withCommitNode({ hash: commit.hash }), missingNodeMsg)
          debugMetrics['commit-nodes'] = (debugMetrics['commit-nodes'] ?? 0) + 1

          // If the commit is a merge commit
          if (commit.parents.length > 1) {
            expect(commitNode.mergeCircle({ hash: commit.hash })).toBeInTheDocument()
          }
        }

        // If the column is supposed to have a horizontal line in it,
        // assert that it renders the correct elements.
        if (columnState.isHorizontalLine) {
          const insideCurrentColumn = within(columnElement)

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
          const insideCurrentColumn = within(columnElement)
          const commit = sleepCommits[rowIndex - 1]

          if (columnState.isNode) {
            const isHeadCommit = commit.hash === headCommit?.hash

            if (!headCommit && (columnState.isColumnAboveEmpty || commit.isBranchTip)) {
              expect(insideCurrentColumn.getByTestId(graphColumn.bottomHalfVerticalLineId)).toBeInTheDocument()
            }

            if (columnState.isColumnBelowEmpty || commit.parents.length === 0) {
              expect(insideCurrentColumn.getByTestId(graphColumn.topHalfVerticalLineId)).toBeInTheDocument()
            }

            if (isHeadCommit) {
              expect(insideCurrentColumn.getByTestId(graphColumn.topHalfDottedVerticalLineId)).toBeInTheDocument()
              expect(insideCurrentColumn.getByTestId(graphColumn.headCommitVerticalLineId)).toBeInTheDocument()
            }
          } else {
            expect(insideCurrentColumn.getByTestId(graphColumn.fullHeightVerticalLineId)).toBeInTheDocument()
          }
        }
      })

      // Check table TODO
    })

    console.debug('Metrics from GitLog integration test for TomPlum/sleep @ release')
    console.debug(JSON.stringify(debugMetrics))
  })
})