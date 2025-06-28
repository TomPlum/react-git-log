import { parseGitLogOutput } from 'test/data/gitLogParser'
import { fireEvent, render } from '@testing-library/react'
import sleepRepositoryDataReleaseBranch from 'test/data/sleep-paginated/sleep-release-branch.txt?raw'
import { GitLogPaged } from './GitLogPaged'
import { afterEach, beforeEach, describe } from 'vitest'
import { act } from 'react'
import { graphColumn } from 'test/elements/GraphColumn'
import { Commit } from 'types/Commit'
import { table } from 'test/elements/Table'
import { GitLogEntry } from 'types/GitLogEntry'

const today = Date.UTC(2025, 2, 24, 18, 0, 0)

const sleepRepositoryLogEntries = parseGitLogOutput(sleepRepositoryDataReleaseBranch)
const headCommitHash = 'e059c28'

const getSleepRepositoriesLogEntries = (quantity: number): GitLogEntry[] => {
  const entries = sleepRepositoryLogEntries.slice(0, quantity + 1)
  entries[quantity - 1].parents = []
  return entries
}

describe('GitLogPaged', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(today)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const paginationTests = [
    { start: 0, end: 20 },
    { start: 20, end: 40 },
    { start: 40, end: 80 },
  ]

  paginationTests.forEach(({ start, end }) => {
    it(`should render correctly and match the snapshot the paginated GitLogPaged component with a GraphHTMLGrid with paging [${start}, ${end}]`, () => {
      const gitLogEntries = parseGitLogOutput(sleepRepositoryDataReleaseBranch).slice(start, end)

      const { asFragment } = render(
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

      expect(asFragment()).toMatchSnapshot()
    })
  })

  it('should render correctly and match the snapshot the paginated GitLogPaged component with a GraphCanvas2D', () => {
    const gitLogEntries = parseGitLogOutput(sleepRepositoryDataReleaseBranch).slice(30, 70)

    const { asFragment } = render(
      <GitLogPaged
        showHeaders
        branchName='release'
        headCommitHash='1352f4c'
        entries={gitLogEntries}
      >
        <GitLogPaged.Tags />
        <GitLogPaged.GraphCanvas2D />
        <GitLogPaged.Table />
      </GitLogPaged>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should log a warning if the graph subcomponent is not rendered', () => {
    const consoleWarn = vi.spyOn(console, 'warn')

    render(
      <GitLogPaged
        entries={[]}
        branchName='main'
        headCommitHash='123'
      />
    )

    expect(consoleWarn).toHaveBeenCalledExactlyOnceWith(
      'react-git-log is not designed to work without a <GitLogPaged.GraphCanvas2D /> or a <GitLogPaged.GraphHTMLGrid /> component.'
    )
  })

  it('should throw an error if the tags subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLogPaged
          entries={[]}
          branchName='main'
          headCommitHash={headCommitHash}
        >
          <GitLogPaged.Tags />
          <GitLogPaged.Tags />
        </GitLogPaged>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLogPaged /> can only have one <GitLogPaged.Tags /> child.'
    )
  })

  it('should throw an error if the table subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLogPaged
          entries={[]}
          branchName='main'
          headCommitHash={headCommitHash}
        >
          <GitLogPaged.Table />
          <GitLogPaged.Table />
        </GitLogPaged>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLogPaged /> can only have one <GitLogPaged.Table /> child.'
    )
  })

  it('should throw an error if the HTML grid graph subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLogPaged
          entries={[]}
          branchName='main'
          headCommitHash={headCommitHash}
        >
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.GraphHTMLGrid />
        </GitLogPaged>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLogPaged /> can only have one <GitLogPaged.GraphHTMLGrid /> child.'
    )
  })

  it('should throw an error if the canvas graph subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLogPaged
          entries={[]}
          branchName='main'
          headCommitHash={headCommitHash}
        >
          <GitLogPaged.GraphCanvas2D />
          <GitLogPaged.GraphCanvas2D />
        </GitLogPaged>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLogPaged /> can only have one <GitLogPaged.GraphCanvas2D /> child.'
    )
  })

  it('should throw an error if the graph subcomponent is rendered twice with different variants', () => {
    const renderBadComponent = () => {
      render(
        <GitLogPaged
          entries={[]}
          branchName='main'
          headCommitHash={headCommitHash}
        >
          <GitLogPaged.GraphCanvas2D />
          <GitLogPaged.GraphHTMLGrid />
        </GitLogPaged>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLogPaged /> can only have one <GitLogPaged.GraphHTMLGrid /> or <GitLogPaged.GraphCanvas2D /> child.'
    )
  })

  describe('onSelectCommit Callback', () => {
    it.each([0, 1, 2])('should call onSelectCommit with the commit details when clicking on column index [%s] in the index pseudo-commits row', (columnIndex: number) => {
      const handleSelectCommit = vi.fn()

      render(
        <GitLogPaged
          showGitIndex
          branchName='release'
          headCommitHash={headCommitHash}
          onSelectCommit={handleSelectCommit}
          entries={getSleepRepositoriesLogEntries(6)}
        >
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.Table />
        </GitLogPaged>
      )

      expect(handleSelectCommit).not.toHaveBeenCalled()

      act(() => {
        graphColumn.at({ row: 0, column: columnIndex })?.click()
      })

      expect(handleSelectCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-03-24T18:00:00.000Z',
        branch: 'release',
        children: [],
        committerDate: '2025-03-24T18:00:00.000Z',
        hash: 'index',
        isBranchTip: false,
        message: '// WIP',
        parents: [
          'e059c28',
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
        <GitLogPaged<CustomCommit>
          showGitIndex
          branchName='release'
          headCommitHash={headCommitHash}
          onSelectCommit={handleSelectCommit}
          entries={getSleepRepositoriesLogEntries(6).map(entry => ({
            ...entry,
            customField: 'testing',
            moreMetaData: [678]
          }))}
        >
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.Table />
        </GitLogPaged>
      )

      expect(handleSelectCommit).not.toHaveBeenCalled()

      act(() => {
        graphColumn.at({ row: 1, column: 0 })?.click()
      })

      expect(handleSelectCommit).toHaveBeenCalledExactlyOnceWith<Commit<CustomCommit>[]>({
        authorDate: '2025-02-25 17:08:06 +0000',
        branch: 'release',
        children: [],
        committerDate: '2025-02-25 17:08:06 +0000',
        hash: 'e059c28',
        isBranchTip: true,
        author: {
          email: 'Thomas.Plumpton@hotmail.co.uk',
          name: 'Thomas Plumpton',
        },
        message: 'Merge pull request #39 from TomPlum/renovate/vite-6.x',
        parents: [
          '0b78e07',
          '867c511',
        ],
        customField: 'testing',
        moreMetaData: [678]
      })
    })

    it.each([0, 1])('should call onSelectCommit with the commit details when clicking on column index [%s] in a commits row', (columnIndex: number) => {
      const handleSelectCommit = vi.fn()

      render(
        <GitLogPaged
          branchName='release'
          headCommitHash={headCommitHash}
          onSelectCommit={handleSelectCommit}
          entries={getSleepRepositoriesLogEntries(2)}
        >
          <GitLogPaged.Tags />
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.Table />
        </GitLogPaged>
      )

      expect(handleSelectCommit).not.toHaveBeenCalled()

      act(() => {
        graphColumn.at({ row: 1, column: columnIndex })?.click()
      })

      expect(handleSelectCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-02-25 17:08:06 +0000',
        branch: 'release',
        author: {
          name: 'Thomas Plumpton',
          email: 'Thomas.Plumpton@hotmail.co.uk',
        },
        children: [],
        committerDate: '2025-02-25 17:08:06 +0000',
        hash: 'e059c28',
        isBranchTip: true,
        message: 'Merge pull request #39 from TomPlum/renovate/vite-6.x',
        parents: ['0b78e07', '867c511']
      })
    })

    it('should call onSelectCommit with the commit details when clicking on one of the table columns of the index pseudo-commit row', () => {
      const handleSelectCommit = vi.fn()

      render(
        <GitLogPaged
          showGitIndex
          branchName='release'
          headCommitHash={headCommitHash}
          onSelectCommit={handleSelectCommit}
          entries={getSleepRepositoriesLogEntries(6)}
        >
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.Table />
        </GitLogPaged>
      )

      expect(handleSelectCommit).not.toHaveBeenCalled()

      act(() => {
        table.row({ row: 0 })?.click()
      })

      expect(handleSelectCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-03-24T18:00:00.000Z',
        branch: 'release',
        children: [],
        committerDate: '2025-03-24T18:00:00.000Z',
        hash: 'index',
        isBranchTip: false,
        message: '// WIP',
        parents: [
          'e059c28',
        ]
      })
    })

    it('should call onSelectCommit with the commit details when clicking on one of the table columns', () => {
      const handleSelectCommit = vi.fn()

      render(
        <GitLogPaged
          branchName='release'
          headCommitHash={headCommitHash}
          onSelectCommit={handleSelectCommit}
          entries={getSleepRepositoriesLogEntries(2)}
        >
          <GitLogPaged.Tags />
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.Table />
        </GitLogPaged>
      )

      expect(handleSelectCommit).not.toHaveBeenCalled()

      act(() => {
        table.row({ row: 1 })?.click()
      })

      expect(handleSelectCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-02-25 17:08:06 +0000',
        branch: 'release',
        author: {
          email: 'Thomas.Plumpton@hotmail.co.uk',
          name: 'Thomas Plumpton',
        },
        children: [],
        committerDate: '2025-02-25 17:08:06 +0000',
        hash: 'e059c28',
        isBranchTip: true,
        message: 'Merge pull request #39 from TomPlum/renovate/vite-6.x',
        parents: ['0b78e07', '867c511']
      })
    })
  })

  describe('onPreviewCommit Callback', () => {
    it.each([0, 1, 2])('should call onPreviewCommit with the commit details when mousing over column index [%s] in the index pseudo-commits row', (columnIndex: number) => {
      const handlePreviewCommit = vi.fn()

      render(
        <GitLogPaged
          showGitIndex
          branchName='release'
          headCommitHash={headCommitHash}
          onPreviewCommit={handlePreviewCommit}
          entries={getSleepRepositoriesLogEntries(6)}
        >
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.Table />
        </GitLogPaged>
      )

      expect(handlePreviewCommit).not.toHaveBeenCalled()

      fireEvent.mouseOver(graphColumn.at({ row: 0, column: columnIndex }))

      expect(handlePreviewCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-03-24T18:00:00.000Z',
        branch: 'release',
        children: [],
        committerDate: '2025-03-24T18:00:00.000Z',
        hash: 'index',
        isBranchTip: false,
        message: '// WIP',
        parents: [
          'e059c28',
        ]
      })
    })

    it.each([0, 1])('should call onPreviewCommit with the commit details when mousing over column index [%s] in a commits row', (columnIndex: number) => {
      const handlePreviewCommit = vi.fn()

      render(
        <GitLogPaged
          branchName='release'
          headCommitHash={headCommitHash}
          onPreviewCommit={handlePreviewCommit}
          entries={getSleepRepositoriesLogEntries(2)}
        >
          <GitLogPaged.Tags />
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.Table />
        </GitLogPaged>
      )

      expect(handlePreviewCommit).not.toHaveBeenCalled()

      act(() => {
        fireEvent.mouseOver(graphColumn.at({ row: 1, column: columnIndex }))
      })

      expect(handlePreviewCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-02-25 17:08:06 +0000',
        branch: 'release',
        author: {
          email: 'Thomas.Plumpton@hotmail.co.uk',
          name: 'Thomas Plumpton'
        },
        children: [],
        committerDate: '2025-02-25 17:08:06 +0000',
        hash: 'e059c28',
        isBranchTip: true,
        message: 'Merge pull request #39 from TomPlum/renovate/vite-6.x',
        parents: ['0b78e07', '867c511']
      })
    })

    it('should call onPreviewCommit with the custom data passed into the log', () => {
      const handlePreviewCommit = vi.fn()

      interface CustomCommit {
        test: string
        anotherTest: number
      }

      render(
        <GitLogPaged<CustomCommit>
          branchName='release'
          headCommitHash={headCommitHash}
          onPreviewCommit={handlePreviewCommit}
          entries={getSleepRepositoriesLogEntries(3).map(entry => ({
            ...entry,
            test: 'hello',
            anotherTest: 5
          }))}
        >
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.Table />
        </GitLogPaged>
      )

      expect(handlePreviewCommit).not.toHaveBeenCalled()

      act(() => {
        fireEvent.mouseOver(graphColumn.at({ row: 1, column: 0 }))
      })

      expect(handlePreviewCommit).toHaveBeenCalledExactlyOnceWith<Commit<CustomCommit>[]>({
        authorDate: '2025-02-25 17:08:06 +0000',
        branch: 'release',
        author: {
          email: 'Thomas.Plumpton@hotmail.co.uk',
          name: 'Thomas Plumpton',
        },
        children: [],
        committerDate: '2025-02-25 17:08:06 +0000',
        hash: 'e059c28',
        isBranchTip: true,
        message: 'Merge pull request #39 from TomPlum/renovate/vite-6.x',
        parents: ['0b78e07', '867c511'],
        test: 'hello',
        anotherTest: 5
      })
    })

    it('should call onPreviewCommit with the commit details when mousing over on one of the table columns of the index pseudo-commit row', () => {
      const handlePreviewCommit = vi.fn()

      render(
        <GitLogPaged
          showGitIndex
          branchName='release'
          headCommitHash={headCommitHash}
          onPreviewCommit={handlePreviewCommit}
          entries={getSleepRepositoriesLogEntries(6)}
        >
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.Table />
        </GitLogPaged>
      )

      expect(handlePreviewCommit).not.toHaveBeenCalled()

      act(() => {
        fireEvent.mouseOver(table.row({ row: 0 }))
      })

      expect(handlePreviewCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-03-24T18:00:00.000Z',
        branch: 'release',
        children: [],
        committerDate: '2025-03-24T18:00:00.000Z',
        hash: 'index',
        isBranchTip: false,
        message: '// WIP',
        parents: [
          'e059c28',
        ]
      })
    })

    it('should call onPreviewCommit with the commit details when mousing over on one of the table columns', () => {
      const handlePreviewCommit = vi.fn()

      render(
        <GitLogPaged
          branchName='release'
          headCommitHash={headCommitHash}
          onPreviewCommit={handlePreviewCommit}
          entries={getSleepRepositoriesLogEntries(2)}
        >
          <GitLogPaged.Tags />
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.Table />
        </GitLogPaged>
      )

      expect(handlePreviewCommit).not.toHaveBeenCalled()

      act(() => {
        fireEvent.mouseOver(table.row({ row: 1 }))
      })

      expect(handlePreviewCommit).toHaveBeenCalledExactlyOnceWith<Commit[]>({
        authorDate: '2025-02-25 17:08:06 +0000',
        branch: 'release',
        author: {
          email: 'Thomas.Plumpton@hotmail.co.uk',
          name: 'Thomas Plumpton',
        },
        children: [],
        committerDate: '2025-02-25 17:08:06 +0000',
        hash: 'e059c28',
        isBranchTip: true,
        message: 'Merge pull request #39 from TomPlum/renovate/vite-6.x',
        parents: ['0b78e07', '867c511'],
      })
    })
  })
})