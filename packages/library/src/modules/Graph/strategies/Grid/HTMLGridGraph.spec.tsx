import { render, screen } from '@testing-library/react'
import { HTMLGridGraph } from 'modules/Graph/strategies/Grid/HTMLGridGraph'
import * as gitContext from 'context/GitContext'
import * as graphContext from 'modules/Graph/context'
import { gitContextBag, graphContextBag, graphData } from 'test/stubs'
import { sleepCommits } from 'test/data/sleep/sleepCommits'
import { CommitNodeLocation } from 'data'

describe('HTML Grid Graph', () => {
  it('should render the graph with the custom commit node if the prop is passed', () => {
    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      isIndexVisible: true,
      graphData: graphData({
        commits: sleepCommits,
        positions: new Map<string, CommitNodeLocation>(
          sleepCommits.map((commit, index) => (
            [commit.hash, [index, 0]]
          ))
        )
      })
    }))

    vi.spyOn(graphContext, 'useGraphContext').mockReturnValue(graphContextBag({
      nodeSize: 21,
      isHeadCommitVisible: true,
      node: ({ commit, nodeSize, isIndexPseudoNode, rowIndex, columnIndex, colour }) => {
        const id = `custom-commit-node-${rowIndex}`

        return (
          <div data-testid={id}>
            <p data-testid={`${id}-hash`}>{commit.hash}</p>
            <p data-testid={`${id}-node-size`}>{nodeSize}</p>
            <p data-testid={`${id}-is-index-node`}>{isIndexPseudoNode ? 'yes' : 'no'}</p>
            <p data-testid={`${id}-column`}>{columnIndex}</p>
            <p data-testid={`${id}-colour`}>{colour}</p>
          </div>
        )
      }
    }))

    const { asFragment } = render(<HTMLGridGraph />)

    // The pseudo node element hardcodes its id (index) to 0, but the first row below the index is also 0.
    expect(screen.getAllByTestId('custom-commit-node-0-is-index-node')[1]).toHaveTextContent('yes')
    expect(screen.getByTestId('custom-commit-node-1-is-index-node')).toHaveTextContent('no')
    expect(screen.getByTestId('custom-commit-node-1-node-size')).toHaveTextContent('21')
    expect(screen.getByTestId('custom-commit-node-1-column')).toHaveTextContent('3')
    expect(screen.getByTestId('custom-commit-node-1-colour')).toHaveTextContent('rgb(51, 51, 51)')

    expect(asFragment()).toMatchSnapshot()
  })
})