import sleepRepositoryData from 'test/data/sleep.txt?raw'
import { parseGitLogOutput } from 'test/data/gitLogParser'
import { sleepRepositoryRowColumnState } from 'test/data/sleepState'
import { GraphColumnState } from 'modules/Graph/components/GraphColumn'
import { graphColumn } from 'test/elements/GraphColumn'
import { describe } from 'vitest'
import { render, within } from '@testing-library/react'
import { GitLog } from './GitLog'
import { sleepCommits } from 'test/data/sleepCommits'

describe('Integration', () => {
  it('should render the correct elements in each column for the sleep repository git log entries', { timeout: 120 * 1000 }, () => {
    const gitLogEntries = parseGitLogOutput(sleepRepositoryData)

    render(
      <GitLog
        currentBranch='release'
        entries={gitLogEntries}
      />
    )

    const debugMetrics: Record<string, number> = {}

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

        if (columnState.isNode) {
          const commit = sleepCommits[rowIndex - 1]
          const missingNodeMsg = `Expected commit node element in row ${rowIndex}, column ${columnIndex} with hash ${commit.hash}, but it was not found in the graph`
          expect(graphColumn.withCommitNode({ hash: commit.hash }), missingNodeMsg)
          debugMetrics['commit-nodes'] = (debugMetrics['commit-nodes'] ?? 0) + 1
        }

        if (columnState.isHorizontalLine) {
          const insideCurrentColumn = within(columnElement)

          // Nodes in the first column always have half-width horizontal lines.
          // A nodes that are the target of merges also have half-width ones.
          if (columnState.isNode && (columnState.mergeSourceColumns || columnIndex === 0)) {
            const halfWidthLine = graphColumn.halfWidthRightHorizontalLineId
            const message = `Expected half-width, right-side, horizontal line element in row ${rowIndex}, column ${columnIndex}, but it was not found.`
            expect(insideCurrentColumn.getByTestId(halfWidthLine), message).toBeInTheDocument()
          } else {
            const fullWidthLine = graphColumn.fullWidthHorizontalLineId
            const message = `Expected full-width horizontal line element in row ${rowIndex}, column ${columnIndex}, but it was not found.`
            expect(insideCurrentColumn.getByTestId(fullWidthLine), message).toBeInTheDocument()
          }
        }
      })

      // Check table TODO
    })

    console.debug('Metrics from GitLog integration test for TomPlum/sleep @ release')
    console.debug(JSON.stringify(debugMetrics))
  })
})