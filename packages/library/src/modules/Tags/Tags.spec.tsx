import * as gitContext from 'context/GitContext'
import { commit, gitContextBag, graphData } from 'test/stubs'
import { Tags } from './Tags'
import { render } from '@testing-library/react'
import { CommitNodeLocation } from 'data'
import { tag } from 'test/elements/Tag'
import { sleepCommits } from 'test/data/sleep/sleepCommits'

describe('Tags', () => {
  it('should render correctly when the URL builder function is passed in', () => {
    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      graphData: graphData({
        commits: sleepCommits,
        positions: new Map<string, CommitNodeLocation>(
          sleepCommits.map((commit, index) => (
            [commit.hash, [index, 0]]
          ))
        )
      }),
      paging: {
        startIndex: 0,
        endIndex: sleepCommits.length,
      },
      remoteProviderUrlBuilder: ({ commit }) => ({
        branch: `https://github.com/TomPlum/tree/${commit.branch}`,
        commit: `https://github.com/TomPlum/commits/${commit.hash}`
      })
    }))

    const { asFragment } = render(<Tags />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('should render a tag for the row that has the selected commit', () => {
    const selectedCommit = commit({
      hash: 'selected'
    })

    vi.spyOn(gitContext, 'useGitContext').mockReturnValueOnce(gitContextBag({
      selectedCommit: selectedCommit,
      graphData: graphData({
        commits: [selectedCommit],
        positions: new Map<string, CommitNodeLocation>([['selected', [0, 0]]])
      }),
      paging: {
        startIndex: 0,
        endIndex: 1
      }
    }))

    render(<Tags />)

    expect(tag.atRow({ row: 0 })).toBeInTheDocument()
  })

  it('should render a tag for the row that has the previewed commit', () => {
    const previewedCommit = commit({
      hash: 'previewed'
    })

    vi.spyOn(gitContext, 'useGitContext').mockReturnValueOnce(gitContextBag({
      previewedCommit,
      graphData: graphData({
        commits: [previewedCommit],
        positions: new Map<string, CommitNodeLocation>([['previewed', [0, 0]]])
      }),
      paging: {
        startIndex: 0,
        endIndex: 1
      }
    }))

    render(<Tags />)

    expect(tag.atRow({ row: 0 })).toBeInTheDocument()
  })
})