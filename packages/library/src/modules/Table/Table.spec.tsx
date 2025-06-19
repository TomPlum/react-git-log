import { render } from '@testing-library/react'
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
})