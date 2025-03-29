import { describe } from 'vitest'
import { render } from '@testing-library/react'
import { GitLog } from './GitLog'
import { entry } from 'test/stubs'
import { gitLog } from 'test/elements/GitLog'
import { parseGitLogOutput } from 'test/data/gitLogParser'
// eslint-disable-next-line import/extensions
import sleepRepositoryData from 'test/data/sleep/sleep.txt?raw'

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

  it('should render correctly and match the snapshot the standard GitLog component', () => {
    const gitLogEntries = parseGitLogOutput(sleepRepositoryData)

    const { asFragment } = render(
      <GitLog
        showHeaders
        currentBranch='release'
        entries={gitLogEntries}
        githubRepositoryUrl='https://github.com/TomPlum/sleep'
      >
        <GitLog.Tags />
        <GitLog.Graph />
        <GitLog.Table />
      </GitLog>
    )

    expect(asFragment()).toMatchSnapshot()
  })
})