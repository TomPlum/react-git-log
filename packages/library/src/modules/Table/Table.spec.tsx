import { render, screen } from '@testing-library/react'
import { gitLog } from 'test/elements/GitLog'
import { table } from 'test/elements/Table'
import { Table } from 'modules/Table/Table'
import * as gitContext from 'context/GitContext'
import { commit, gitContextBag, graphData } from 'test/stubs'

describe('Table', () => {
  it('should pass the given table class to the git log table element', () => {
    render(
      <Table
        className='styles.customLogTableClass'
      />
    )

    const gitLogTable = gitLog.table()
    expect(gitLogTable).toBeInTheDocument()
    expect(gitLogTable.className).toContain('styles.customLogTableClass')
  })

  it('should pass the given table style objects to the git log table element', () => {
    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      showHeaders: true
    }))
    
    render(
      <Table
        styles={{
          table: {
            background: 'blueviolet'
          },
          thead: {
            background: 'darkolivegreen'
          },
          td: {
            background: 'mediumvioletred'
          },
          tr: {
            background: 'lightgoldenrodyellow'
          }
        }}
      />
    )

    const gitLogTable = gitLog.table()
    expect(gitLogTable).toBeInTheDocument()

    expect(table.container()?.style.background).toBe('blueviolet')
    expect(table.head()?.style.background).toBe('darkolivegreen')
    expect(table.emptyRow({ row: 0 })?.style.background).toBe('lightgoldenrodyellow')
    expect(table.timestampData({ row: 0 })?.style.background).toBe('mediumvioletred')
    expect(table.commitMessageData({ row: 0 })?.style.background).toBe('mediumvioletred')
  })

  it('should pass the given timestamp format string to the commit date formatter', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 2, 25))

    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      paging: {
        startIndex: 0,
        endIndex: 2,
      },
      isIndexVisible: false,
      graphData: graphData({
        commits: [
          commit({
            committerDate: '2025-03-05 17:03:58 +0000'
          })
        ]
      })
    }))

    render(
      <Table
        timestampFormat='YYYY MM'
      />
    )

    expect(table.timestampData({ row: 0 })).toHaveTextContent('2025 03')

    vi.useRealTimers()
  })

  it('should render a custom table row if one is passed', () => {
    const selectedCommit = commit({
      hash: '1'
    })

    const previewedCommit = commit({
      hash: '2',
      parents: ['1']
    })

    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      isIndexVisible: false,
      paging: {
        startIndex: 0,
        endIndex: 2,
      },
      selectedCommit,
      previewedCommit,
      graphData: graphData({
        positions: new Map([
          ['1', [0, 1]],
          ['2', [1, 1]],
        ]),
        commits: [
          selectedCommit,
          previewedCommit
        ]
      })
    }))

    const { asFragment } = render(
      <Table
        row={({ commit, selected, backgroundColour, previewed }) => {
          return (
            <div data-testid={`custom-table-row-${commit.hash}`}>
              <p data-testid={`custom-message-${commit.hash}`}>
                {commit.message}
              </p>

              <p data-testid={`custom-selected-${commit.hash}`}>
                {selected ? 'yes' : 'no'}
              </p>

              <p data-testid={`custom-previewed-${commit.hash}`}>
                {previewed ? 'yes' : 'no'}
              </p>

              <p data-testid={`custom-bg-colour-${commit.hash}`}>
                {backgroundColour}
              </p>
            </div>
          )
        }}
      />
    )

    // Hash 1 is the selected commit
    expect(screen.getByTestId('custom-table-row-1')).toBeInTheDocument()
    expect(screen.getByTestId('custom-message-1')).toHaveTextContent(selectedCommit.message)
    expect(screen.getByTestId('custom-selected-1')).toHaveTextContent('yes')
    expect(screen.getByTestId('custom-previewed-1')).toHaveTextContent('no')
    expect(screen.getByTestId('custom-bg-colour-1')).toHaveTextContent('rgba(41, 121, 255, 0.15)')

    // Hash 2 is the previewed commit
    expect(screen.getByTestId('custom-table-row-2')).toBeInTheDocument()
    expect(screen.getByTestId('custom-message-2')).toHaveTextContent(previewedCommit.message)
    expect(screen.getByTestId('custom-selected-2')).toHaveTextContent('no')
    expect(screen.getByTestId('custom-previewed-2')).toHaveTextContent('yes')
    expect(screen.getByTestId('custom-bg-colour-2')).toHaveTextContent('rgba(231, 231, 231, 0.5)')

    expect(asFragment()).toMatchSnapshot()
  })
})