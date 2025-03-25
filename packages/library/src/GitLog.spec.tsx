import { describe } from 'vitest'
import { render } from '@testing-library/react'
import { GitLog } from './GitLog'
import { entry } from 'test/stubs'
import { gitLog } from 'test/elements/GitLog'

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
  })
})