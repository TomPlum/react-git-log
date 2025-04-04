import { render, screen } from '@testing-library/react'
import { CommitMessageData } from './CommitMessageData'
import * as gitContext from 'context/GitContext'
import { gitContextBag } from 'test/stubs'

describe('CommitMessageData', () => {
  it('should render the index status if isIndex is true', () => {
    vi.spyOn(gitContext, 'useGitContext').mockReturnValueOnce(gitContextBag({
      indexStatus: {
        modified: 4,
        added: 2,
        deleted: 3
      }
    }))

    render(
      <CommitMessageData
        isIndex
        index={0}
        style={{}}
        commitMessage='test'
      />
    )

    expect(screen.getByTestId('index-status')).toBeInTheDocument()
  })

  it('should not render the index status if isIndex is false', () => {
    render(
      <CommitMessageData
        isIndex={false}
        index={0}
        style={{}}
        commitMessage='test'
      />
    )

    expect(screen.queryByTestId('index-status')).not.toBeInTheDocument()
  })
})