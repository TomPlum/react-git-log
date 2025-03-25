import { describe } from 'vitest'
import { render } from '@testing-library/react'
import { GitLog } from './GitLog'
import { entry } from 'test/stubs'
import { gitLog } from 'test/elements/GitLog'
import { table } from 'test/elements/Table'

describe('GitLog', () => {
  describe('Classes & Style Objects', () => {
    it('should pass the given container class to the git log layout container element', () => {
      render(
        <GitLog
          currentBranch={'test'}
          entries={[entry({ branch: 'test' })]}
          classes={{ containerClass: 'styles.customContainerClass' }}
        />
      )

      const gitLogContainer = gitLog.container()
      expect(gitLogContainer).toBeInTheDocument()
      expect(gitLogContainer.className).toContain('styles.customContainerClass')
    })

    it('should pass the given table class to the git log table element', () => {
      render(
        <GitLog
          currentBranch={'test'}
          entries={[entry({ branch: 'test' })]}
          classes={{ tableClass: 'styles.customLogTableClass' }}
        >
          <GitLog.Table />
        </GitLog>
      )

      const gitLogTable = gitLog.table()
      expect(gitLogTable).toBeInTheDocument()
      expect(gitLogTable.className).toContain('styles.customLogTableClass')
    })

    it('should pass the given container style object to the git log layout container element', () => {
      render(
        <GitLog
          currentBranch={'test'}
          entries={[entry({ branch: 'test' })]}
          classes={{
            containerStyles: {
              background: 'purple'
            }
          }}
        />
      )

      const gitLogContainer = gitLog.container()
      expect(gitLogContainer).toBeInTheDocument()
      expect(gitLogContainer?.style.background).toBe('purple')
    })

    it('should pass the given table style objects to the git log table element', () => {
      render(
        <GitLog
          currentBranch={'test'}
          entries={[entry({ branch: 'test' })]}
          showTableHeaders
          classes={{
            tableStyles: {
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
            }
          }}
        >
          <GitLog.Table />
        </GitLog>
      )

      const gitLogTable = gitLog.table()
      expect(gitLogTable).toBeInTheDocument()

      expect(table.container()?.style.background).toBe('blueviolet')
      expect(table.head()?.style.background).toBe('darkolivegreen')
      expect(table.row({ row: 0 })?.style.background).toBe('lightgoldenrodyellow')
      expect(table.timestampData({ row: 0 })?.style.background).toBe('mediumvioletred')
      expect(table.commitMessageData({ row: 0 })?.style.background).toBe('mediumvioletred')
    })
  })
})