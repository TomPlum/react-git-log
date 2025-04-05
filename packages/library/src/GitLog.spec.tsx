import { afterEach, beforeEach, describe } from 'vitest'
import { render } from '@testing-library/react'
import { GitLog } from './GitLog'
import { entry } from 'test/stubs'
import { gitLog } from 'test/elements/GitLog'
import { parseGitLogOutput } from 'test/data/gitLogParser'
// eslint-disable-next-line import/extensions
import sleepRepositoryData from 'test/data/sleep/sleep.txt?raw'
import { formatBranch } from 'modules/Tags/utils/formatBranch'
import { GitLogUrlBuilder } from './types'

const today = Date.UTC(2025, 2, 24, 18, 0, 0)

const urlBuilderFunction: GitLogUrlBuilder = ({ commit }) => ({
  branch: `https://github.com/TomPlum/sleep/tree/${formatBranch(commit.branch)}`,
  commit: `https://github.com/TomPlum/sleep/tree/${commit.hash}`
})

describe('GitLog', () => {

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(today)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Classes & Style Objects', () => {
    it('should pass the given container class to the git log layout container element', () => {
      render(
        <GitLog
          currentBranch={'test'}
          entries={[entry({ branch: 'test' })]}
          classes={{ containerClass: 'styles.customContainerClass' }}
        >
          <GitLog.Graph />
        </GitLog>
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
        >
          <GitLog.Graph />
        </GitLog>
      )

      const gitLogContainer = gitLog.container()
      expect(gitLogContainer).toBeInTheDocument()
      expect(gitLogContainer?.style.background).toBe('purple')
    })
  })

  it('should render correctly and match the snapshot of the GitLog component', { timeout: 1000 * 10 } ,() => {
    const gitLogEntries = parseGitLogOutput(sleepRepositoryData)

    const { asFragment } = render(
      <GitLog
        showHeaders
        currentBranch='release'
        entries={gitLogEntries}
        indexStatus={{
          added: 2,
          deleted: 1,
          modified: 10
        }}
        urls={urlBuilderFunction}
      >
        <GitLog.Tags />
        <GitLog.Graph />
        <GitLog.Table />
      </GitLog>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should render correctly and match the snapshot of the GitLog component in flipped orientation', { timeout: 1000 * 10 } ,() => {
    const gitLogEntries = parseGitLogOutput(sleepRepositoryData)

    const { asFragment } = render(
      <GitLog
        showHeaders
        currentBranch='release'
        entries={gitLogEntries}
        urls={urlBuilderFunction}
      >
        <GitLog.Tags />
        <GitLog.Graph orientation='flipped' />
        <GitLog.Table />
      </GitLog>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should render correctly and match the snapshot of the GitLog component with a custom node size', { timeout: 1000 * 10 } ,() => {
    const gitLogEntries = parseGitLogOutput(sleepRepositoryData)

    const { asFragment } = render(
      <GitLog
        showHeaders
        currentBranch='release'
        entries={gitLogEntries}
        defaultGraphWidth={100}
        urls={urlBuilderFunction}
      >
        <GitLog.Tags />
        <GitLog.Graph nodeSize={12} />
        <GitLog.Table />
      </GitLog>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should render correctly and match the snapshot of the GitLog component when there is no data', { timeout: 1000 * 10 } ,() => {
    const { asFragment } = render(
      <GitLog
        showHeaders
        entries={[]}
        currentBranch='release'
        urls={urlBuilderFunction}
      >
        <GitLog.Tags />
        <GitLog.Graph />
        <GitLog.Table />
      </GitLog>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should render correctly and match the snapshot of the GitLog component when the index is disabled', { timeout: 1000 * 10 } ,() => {
    const gitLogEntries = parseGitLogOutput(sleepRepositoryData)

    const { asFragment } = render(
      <GitLog
        showHeaders
        showGitIndex={false}
        currentBranch='release'
        entries={gitLogEntries}
        urls={urlBuilderFunction}
      >
        <GitLog.Tags />
        <GitLog.Graph />
        <GitLog.Table />
      </GitLog>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should log a warning if the graph subcomponent is not rendered', () => {
    const consoleWarn = vi.spyOn(console, 'warn')

    render(
      <GitLog
        entries={[]}
        currentBranch='main'
      />
    )

    expect(consoleWarn).toHaveBeenCalledExactlyOnceWith(
      'react-git-log is not designed to work without a <GitLog.Graph /> component.'
    )
  })

  it('should throw an error if the tags subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLog
          entries={[]}
          currentBranch='main'
        >
          <GitLog.Tags />
          <GitLog.Tags />
        </GitLog>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLog /> can only have one <GitLog.Tags /> child.'
    )
  })

  it('should throw an error if the table subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLog
          entries={[]}
          currentBranch='main'
        >
          <GitLog.Table />
          <GitLog.Table />
        </GitLog>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLog /> can only have one <GitLog.Table /> child.'
    )
  })

  it('should throw an error if the graph subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLog
          entries={[]}
          currentBranch='main'
        >
          <GitLog.Graph />
          <GitLog.Graph />
        </GitLog>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLog /> can only have one <GitLog.Graph /> child.'
    )
  })
})