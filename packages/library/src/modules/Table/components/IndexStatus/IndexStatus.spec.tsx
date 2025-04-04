import { render, screen } from '@testing-library/react'
import { IndexStatus } from 'modules/Table/components/IndexStatus/IndexStatus'
import * as gitContext from 'context/GitContext'
import { gitContextBag } from 'test/stubs'

describe('Index Status', () => {
  it('should render the status numbers correctly', () => {
    vi.spyOn(gitContext, 'useGitContext').mockReturnValueOnce(gitContextBag({
      indexStatus: {
        modified: 4,
        added: 2,
        deleted: 3
      }
    }))

    render(<IndexStatus />)

    const added = screen.getByTestId('index-status-added')
    expect(added).toBeInTheDocument()
    expect(added).toHaveTextContent('2')

    const modified = screen.getByTestId('index-status-modified')
    expect(modified).toBeInTheDocument()
    expect(modified).toHaveTextContent('4')

    const deleted = screen.getByTestId('index-status-deleted')
    expect(deleted).toBeInTheDocument()
    expect(deleted).toHaveTextContent('3')
  })

  it('should not render the added indicator if there are 0 added files in the index status', () => {
    vi.spyOn(gitContext, 'useGitContext').mockReturnValueOnce(gitContextBag({
      indexStatus: {
        modified: 4,
        added: 0,
        deleted: 3
      }
    }))

    render(<IndexStatus />)

    const added = screen.queryByTestId('index-status-added')
    expect(added).not.toBeInTheDocument()

    expect(screen.getByTestId('index-status-modified')).toBeInTheDocument()
    expect(screen.getByTestId('index-status-deleted')).toBeInTheDocument()
  })

  it('should not render the modified indicator if there are 0 modified files in the index status', () => {
    vi.spyOn(gitContext, 'useGitContext').mockReturnValueOnce(gitContextBag({
      indexStatus: {
        modified: 0,
        added: 1,
        deleted: 3
      }
    }))

    render(<IndexStatus />)

    const modified = screen.queryByTestId('index-status-modified')
    expect(modified).not.toBeInTheDocument()

    expect(screen.getByTestId('index-status-added')).toBeInTheDocument()
    expect(screen.getByTestId('index-status-deleted')).toBeInTheDocument()
  })

  it('should not render the deleted indicator if there are 0 deleted files in the index status', () => {
    vi.spyOn(gitContext, 'useGitContext').mockReturnValueOnce(gitContextBag({
      indexStatus: {
        modified: 2,
        added: 1,
        deleted: 0
      }
    }))

    render(<IndexStatus />)

    const deleted = screen.queryByTestId('index-status-deleted')
    expect(deleted).not.toBeInTheDocument()

    expect(screen.getByTestId('index-status-modified')).toBeInTheDocument()
    expect(screen.getByTestId('index-status-added')).toBeInTheDocument()
  })
})