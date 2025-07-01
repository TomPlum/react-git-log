import { afterEach, beforeEach, describe } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { GitLog } from './GitLog'
import { entry } from 'test/stubs'
import { gitLog } from 'test/elements/GitLog'
import { parseGitLogOutput } from 'test/data/gitLogParser'
import sleepRepositoryData from 'test/data/sleep/sleep.txt?raw'
import { formatBranch } from 'modules/Tags/utils/formatBranch'
import { GitLogUrlBuilder } from './types'
import { graphColumn } from 'test/elements/GraphColumn'
import { act } from 'react'
import { Commit } from 'types/Commit'
import { table } from 'test/elements/Table'
import { createCanvas } from 'canvas'
import { GitLogEntry } from 'types/GitLogEntry'

const today = Date.UTC(2025, 2, 24, 18, 0, 0)

const urlBuilderFunction: GitLogUrlBuilder = ({ commit }) => ({
  branch: `https://github.com/TomPlum/sleep/tree/${formatBranch(commit.branch)}`,
  commit: `https://github.com/TomPlum/sleep/commits/${commit.hash}`
})

const sleepRepositoryLogEntries = parseGitLogOutput(sleepRepositoryData)

const getSleepRepositoriesLogEntries = (quantity: number): GitLogEntry[] => {
  const entries = sleepRepositoryLogEntries.slice(0, quantity + 1)
  entries[quantity - 1].parents = []
  return entries
}

describe('GitLog', () => {

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(today)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('HTML Grid Graph', () => {
    describe('Classes & Style Objects', () => {
      it('should pass the given container class to the git log layout container element', () => {
        render(
          <GitLog
            currentBranch={'test'}
            entries={[entry({ branch: 'test' })]}
            classes={{ containerClass: 'styles.customContainerClass' }}
          >
            <GitLog.GraphHTMLGrid />
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
            <GitLog.GraphHTMLGrid />
          </GitLog>
        )

        const gitLogContainer = gitLog.container()
        expect(gitLogContainer).toBeInTheDocument()
        expect(gitLogContainer?.style.background).toBe('purple')
      })
    })

    it('should render correctly and match the snapshot of the GitLog component', { timeout: 1000 * 10 } ,() => {
      const { asFragment } = render(
        <GitLog
          showHeaders
          currentBranch='release'
          entries={sleepRepositoryLogEntries}
          indexStatus={{
            added: 2,
            deleted: 1,
            modified: 10
          }}
          urls={urlBuilderFunction}
        >
          <GitLog.Tags />
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    it('should render correctly and match the snapshot of the GitLog component in flipped orientation', { timeout: 1000 * 10 } ,() => {

      const { asFragment } = render(
        <GitLog
          showHeaders
          currentBranch='release'
          entries={sleepRepositoryLogEntries}
          urls={urlBuilderFunction}
        >
          <GitLog.Tags />
          <GitLog.GraphHTMLGrid orientation='flipped' />
          <GitLog.Table />
        </GitLog>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    it('should render correctly and match the snapshot of the GitLog component with a custom node size', { timeout: 1000 * 10 } ,() => {
      const { asFragment } = render(
        <GitLog
          showHeaders
          currentBranch='release'
          entries={sleepRepositoryLogEntries}
          defaultGraphWidth={100}
          urls={urlBuilderFunction}
        >
          <GitLog.Tags />
          <GitLog.GraphHTMLGrid nodeSize={12} />
          <GitLog.Table />
        </GitLog>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    it('should render correctly and match the snapshot of the GitLog component that has been filtered', { timeout: 1000 * 10 } ,() => {
      const { asFragment } = render(
        <GitLog
          showHeaders
          currentBranch='release'
          entries={sleepRepositoryLogEntries}
          defaultGraphWidth={100}
          filter={commits => {
            return commits.filter(({ message }) => {
              return message.includes('deps')
            })
          }}
        >
          <GitLog.Tags />
          <GitLog.GraphHTMLGrid />
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
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    it('should render correctly and match the snapshot of the GitLog component when the index is disabled', { timeout: 1000 * 10 } ,() => {
      const { asFragment } = render(
        <GitLog
          showHeaders
          showGitIndex={false}
          currentBranch='release'
          urls={urlBuilderFunction}
          entries={sleepRepositoryLogEntries}
        >
          <GitLog.Tags />
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('Canvas2D Graph', () => {
    beforeAll(() => {
      // @ts-expect-error Only mocking some props for the sake of the test
      HTMLCanvasElement.prototype.getContext = function () {
        const canvas = createCanvas(this.width, this.height)
        return canvas.getContext('2d')
      }
    })

    it('should render correctly and match the snapshot of the GitLog component', { timeout: 1000 * 10 } ,() => {
      const { asFragment } = render(
        <GitLog
          showHeaders
          currentBranch='release'
          entries={sleepRepositoryLogEntries}
          indexStatus={{
            added: 2,
            deleted: 1,
            modified: 10
          }}
          urls={urlBuilderFunction}
        >
          <GitLog.Tags />
          <GitLog.GraphCanvas2D />
          <GitLog.Table />
        </GitLog>
      )

      expect(asFragment()).toMatchSnapshot()
    })
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
      'react-git-log is not designed to work without a <GitLog.GraphCanvas2D /> or a <GitLog.GraphHTMLGrid /> component.'
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

  it('should throw an error if the HTML grid graph subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLog
          entries={[]}
          currentBranch='main'
        >
          <GitLog.GraphHTMLGrid />
          <GitLog.GraphHTMLGrid />
        </GitLog>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLog /> can only have one <GitLog.GraphHTMLGrid /> child.'
    )
  })

  it('should throw an error if the canvas graph subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLog
          entries={[]}
          currentBranch='main'
        >
          <GitLog.GraphCanvas2D />
          <GitLog.GraphCanvas2D />
        </GitLog>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLog /> can only have one <GitLog.GraphCanvas2D /> child.'
    )
  })

  it('should throw an error if graph subcomponent is rendered twice with different variants', () => {
    const renderBadComponent = () => {
      render(
        <GitLog
          entries={[]}
          currentBranch='main'
        >
          <GitLog.GraphCanvas2D />
          <GitLog.GraphHTMLGrid />
        </GitLog>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLog /> can only have one <GitLog.GraphHTMLGrid /> or <GitLog.GraphCanvas2D /> child.'
    )
  })

  describe('onSelectCommit Callback', () => {
    it.each([0, 1, 2])('should call onSelectCommit with the commit details when clicking on column index [%s] in the index pseudo-commits row', (columnIndex: number) => {
      const handleSelectCommit = vi.fn()

      render(
        <GitLog
          showGitIndex
          currentBranch='release'
          onSelectCommit={handleSelectCommit}
          entries={getSleepRepositoriesLogEntries(6)}
        >
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(handleSelectCommit).not.toHaveBeenCalled()

      act(() => {
        graphColumn.at({ row: 0, column: columnIndex })?.click()
      })

      expect(handleSelectCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-03-24T18:00:00.000Z',
        branch: 'refs/remotes/origin/release',
        children: [],
        committerDate: '2025-03-24T18:00:00.000Z',
        hash: 'index',
        isBranchTip: false,
        message: '// WIP',
        parents: [
          '1352f4c',
        ]
      })
    })

    it('should call onSelectCommit with custom data passed into the log entries', () => {
      const handleSelectCommit = vi.fn()

      interface CustomCommit {
        customField: string,
        moreMetaData: number[]
      }

      render(
        <GitLog<CustomCommit>
          showGitIndex
          currentBranch='release'
          onSelectCommit={handleSelectCommit}
          entries={getSleepRepositoriesLogEntries(6).map(entry => ({
            ...entry,
            customField: 'testing',
            moreMetaData: [678]
          }))}
        >
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(handleSelectCommit).not.toHaveBeenCalled()

      act(() => {
        graphColumn.at({ row: 1, column: 0 })?.click()
      })

      expect(handleSelectCommit).toHaveBeenCalledExactlyOnceWith<Commit<CustomCommit>[]>({
        authorDate: '2025-03-24 17:03:58 +0000',
        branch: 'refs/remotes/origin/renovate/all-minor-patch',
        children: [],
        committerDate: '2025-03-24 17:03:58 +0000',
        author: {
          email: '29139614+renovate[bot]@users.noreply.github.com',
          name: 'renovate[bot]',
        },
        hash: '2079fb6',
        isBranchTip: true,
        message: 'fix(deps): update all non-major dependencies',
        parents: [
          '1352f4c',
        ],
        customField: 'testing',
        moreMetaData: [678]
      })
    })

    it.each([0, 1, 2])('should call onSelectCommit with the commit details when clicking on column index [%s] in a commits row', (columnIndex: number) => {
      const handleSelectCommit = vi.fn()

      render(
        <GitLog
          currentBranch='release'
          onSelectCommit={handleSelectCommit}
          entries={getSleepRepositoriesLogEntries(2)}
        >
          <GitLog.Tags />
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(handleSelectCommit).not.toHaveBeenCalled()

      act(() => {
        graphColumn.at({ row: 1, column: columnIndex })?.click()
      })

      expect(handleSelectCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-03-24 17:03:58 +0000',
        branch: 'refs/remotes/origin/renovate/all-minor-patch',
        author: {
          name: 'renovate[bot]',
          email: '29139614+renovate[bot]@users.noreply.github.com',
        },
        children: [],
        committerDate: '2025-03-24 17:03:58 +0000',
        hash: '2079fb6',
        isBranchTip: true,
        message: 'fix(deps): update all non-major dependencies',
        parents: ['1352f4c']
      })
    })

    it('should call onSelectCommit with the commit details when clicking on one of the table columns of the index pseudo-commit row', () => {
      const handleSelectCommit = vi.fn()

      render(
        <GitLog
          showGitIndex
          currentBranch='release'
          onSelectCommit={handleSelectCommit}
          entries={getSleepRepositoriesLogEntries(6)}
        >
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(handleSelectCommit).not.toHaveBeenCalled()

      act(() => {
        table.row({ row: 0 })?.click()
      })

      expect(handleSelectCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-03-24T18:00:00.000Z',
        branch: 'refs/remotes/origin/release',
        children: [],
        committerDate: '2025-03-24T18:00:00.000Z',
        hash: 'index',
        isBranchTip: false,
        message: '// WIP',
        parents: [
          '1352f4c',
        ]
      })
    })

    it('should call onSelectCommit with the commit details when clicking on one of the table columns', () => {
      const handleSelectCommit = vi.fn()

      render(
        <GitLog
          currentBranch='release'
          onSelectCommit={handleSelectCommit}
          entries={getSleepRepositoriesLogEntries(2)}
        >
          <GitLog.Tags />
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(handleSelectCommit).not.toHaveBeenCalled()

      act(() => {
        table.row({ row: 1 })?.click()
      })

      expect(handleSelectCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-03-22 02:47:00 +0000',
        branch: 'refs/remotes/origin/renovate/ant-design-icons-6.x',
        author: {
          name: 'renovate[bot]',
          email: '29139614+renovate[bot]@users.noreply.github.com',
        },
        children: [],
        committerDate: '2025-03-22 02:47:00 +0000',
        hash: '6d76309',
        isBranchTip: true,
        message: 'fix(deps): update dependency @ant-design/icons to v6',
        parents: []
      })
    })
  })

  describe('onPreviewCommit Callback', () => {
    it.each([0, 1, 2])('should call onPreviewCommit with the commit details when mousing over column index [%s] in the index pseudo-commits row', (columnIndex: number) => {
      const handlePreviewCommit = vi.fn()

      render(
        <GitLog
          showGitIndex
          currentBranch='release'
          onPreviewCommit={handlePreviewCommit}
          entries={getSleepRepositoriesLogEntries(6)}
        >
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(handlePreviewCommit).not.toHaveBeenCalled()

      fireEvent.mouseOver(graphColumn.at({ row: 0, column: columnIndex }))

      expect(handlePreviewCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-03-24T18:00:00.000Z',
        branch: 'refs/remotes/origin/release',
        children: [],
        committerDate: '2025-03-24T18:00:00.000Z',
        hash: 'index',
        isBranchTip: false,
        message: '// WIP',
        parents: [
          '1352f4c',
        ]
      })
    })

    it.each([0, 1, 2])('should call onPreviewCommit with the commit details when mousing over column index [%s] in a commits row', (columnIndex: number) => {
      const handlePreviewCommit = vi.fn()

      render(
        <GitLog
          currentBranch='release'
          onPreviewCommit={handlePreviewCommit}
          entries={getSleepRepositoriesLogEntries(2)}
        >
          <GitLog.Tags />
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(handlePreviewCommit).not.toHaveBeenCalled()

      act(() => {
        fireEvent.mouseOver(graphColumn.at({ row: 1, column: columnIndex }))
      })

      expect(handlePreviewCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-03-24 17:03:58 +0000',
        branch: 'refs/remotes/origin/renovate/all-minor-patch',
        author: {
          name: 'renovate[bot]',
          email: '29139614+renovate[bot]@users.noreply.github.com',
        },
        children: [],
        committerDate: '2025-03-24 17:03:58 +0000',
        hash: '2079fb6',
        isBranchTip: true,
        message: 'fix(deps): update all non-major dependencies',
        parents: ['1352f4c']
      })
    })

    it('should call onPreviewCommit with the custom data passed into the log', () => {
      const handlePreviewCommit = vi.fn()

      interface CustomCommit {
        test: string
        anotherTest: number
      }

      render(
        <GitLog<CustomCommit>
          currentBranch='release'
          onPreviewCommit={handlePreviewCommit}
          entries={getSleepRepositoriesLogEntries(3).map(entry => ({
            ...entry,
            test: 'hello',
            anotherTest: 5
          }))}
        >
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(handlePreviewCommit).not.toHaveBeenCalled()

      act(() => {
        fireEvent.mouseOver(graphColumn.at({ row: 1, column: 0 }))
      })

      expect(handlePreviewCommit).toHaveBeenCalledExactlyOnceWith<Commit<CustomCommit>[]>({
        authorDate: '2025-03-24 17:03:58 +0000',
        branch: 'refs/remotes/origin/renovate/all-minor-patch',
        author: {
          name: 'renovate[bot]',
          email: '29139614+renovate[bot]@users.noreply.github.com',
        },
        children: [],
        committerDate: '2025-03-24 17:03:58 +0000',
        hash: '2079fb6',
        isBranchTip: true,
        message: 'fix(deps): update all non-major dependencies',
        parents: ['1352f4c'],
        test: 'hello',
        anotherTest: 5
      })
    })

    it('should call onPreviewCommit with the commit details when mousing over on one of the table columns of the index pseudo-commit row', () => {
      const handlePreviewCommit = vi.fn()

      render(
        <GitLog
          showGitIndex
          currentBranch='release'
          onPreviewCommit={handlePreviewCommit}
          entries={getSleepRepositoriesLogEntries(6)}
        >
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(handlePreviewCommit).not.toHaveBeenCalled()

      act(() => {
        fireEvent.mouseOver(table.row({ row: 0 }))
      })

      expect(handlePreviewCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-03-24T18:00:00.000Z',
        branch: 'refs/remotes/origin/release',
        children: [],
        committerDate: '2025-03-24T18:00:00.000Z',
        hash: 'index',
        isBranchTip: false,
        message: '// WIP',
        parents: [
          '1352f4c',
        ]
      })
    })

    it('should call onPreviewCommit with the commit details when mousing over on one of the table columns', () => {
      const handlePreviewCommit = vi.fn()

      render(
        <GitLog
          currentBranch='release'
          onPreviewCommit={handlePreviewCommit}
          entries={getSleepRepositoriesLogEntries(2)}
        >
          <GitLog.Tags />
          <GitLog.GraphHTMLGrid />
          <GitLog.Table />
        </GitLog>
      )

      expect(handlePreviewCommit).not.toHaveBeenCalled()

      act(() => {
        fireEvent.mouseOver(table.row({ row: 1 }))
      })

      expect(handlePreviewCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-03-22 02:47:00 +0000',
        branch: 'refs/remotes/origin/renovate/ant-design-icons-6.x',
        author: {
          name: 'renovate[bot]',
          email: '29139614+renovate[bot]@users.noreply.github.com',
        },
        children: [],
        committerDate: '2025-03-22 02:47:00 +0000',
        hash: '6d76309',
        isBranchTip: true,
        message: 'fix(deps): update dependency @ant-design/icons to v6',
        parents: []
      })
    })
  })
})