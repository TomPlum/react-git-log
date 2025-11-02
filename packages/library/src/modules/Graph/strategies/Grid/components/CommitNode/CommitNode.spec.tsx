import * as graphContext from 'modules/Graph/context'
import * as gitContext from 'context/GitContext'
import * as selectCommit from 'hooks/useSelectCommit'
import * as themeHook from 'hooks/useTheme'
import { commit, gitContextBag, graphContextBag, themeFunctions } from 'test/stubs'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { CommitNode } from 'modules/Graph/strategies/Grid/components/CommitNode/CommitNode'
import { commitNode } from 'test/elements/CommitNode'
import { expect } from 'vitest'

describe('CommitNode', () => {
  it('should render a tooltip on hover of the node if the prop is enabled', async () => {
    vi.spyOn(graphContext, 'useGraphContext').mockReturnValue(graphContextBag({
      showCommitNodeTooltips: true
    }))

    vi.spyOn(selectCommit, 'useSelectCommit').mockReturnValue({
      selectCommitHandler: {
        onMouseOut: vi.fn(),
        onClick: vi.fn(),
        onMouseOver: vi.fn()
      }
    })

    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions())

    render(
      <CommitNode
        colour='white'
        commit={commit({
          hash: 'commit-to-hover'
        })}
      />
    )

    const commitElement = commitNode.withHash({ hash: 'commit-to-hover' })

    await userEvent.hover(commitElement)
    expect(commitElement).toBeInTheDocument()

    const tooltip = commitNode.tooltip({ hash: 'commit-to-hover' })
    expect(tooltip).toBeInTheDocument()

    await userEvent.unhover(commitElement)
    await waitFor(() => {
      expect(commitNode.tooltip({ hash: 'commit-to-hover', shouldExist: false })).not.toBeInTheDocument()
    })
    expect(commitElement).toBeInTheDocument()
  })

  it('should render a custom tooltip on hover of the node if the custom tooltip prop is passed', async () => {
    vi.spyOn(graphContext, 'useGraphContext').mockReturnValue(graphContextBag({
      showCommitNodeTooltips: true,
      tooltip: () => (
        <div data-testid='custom-tooltip'>
          Custom Tooltip
        </div>
      )
    }))

    vi.spyOn(selectCommit, 'useSelectCommit').mockReturnValue({
      selectCommitHandler: {
        onMouseOut: vi.fn(),
        onClick: vi.fn(),
        onMouseOver: vi.fn()
      }
    })

    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions())

    render(
      <CommitNode
        colour='white'
        commit={commit({
          hash: 'commit-to-hover'
        })}
      />
    )

    const commitElement = commitNode.withHash({
      hash: 'commit-to-hover'
    })

    await userEvent.hover(commitElement)
    expect(commitElement).toBeInTheDocument()

    const tooltip = screen.getByTestId('custom-tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent('Custom Tooltip')

    await userEvent.unhover(commitElement)
    await waitFor(() => {
      expect(tooltip).not.toBeInTheDocument()
    })
    expect(commitElement).toBeInTheDocument()
  })

  it('should not render a tooltip on hover of the node if the prop is disabled', async () => {
    vi.spyOn(graphContext, 'useGraphContext').mockReturnValue(graphContextBag({
      showCommitNodeTooltips: false
    }))

    vi.spyOn(selectCommit, 'useSelectCommit').mockReturnValue({
      selectCommitHandler: {
        onMouseOut: vi.fn(),
        onClick: vi.fn(),
        onMouseOver: vi.fn()
      }
    })

    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions())

    render(
      <CommitNode
        colour='white'
        commit={commit({
          hash: 'commit-to-hover'
        })}
      />
    )

    const commitElement = commitNode.withHash({ hash: 'commit-to-hover' })

    await userEvent.hover(commitElement)

    expect(commitElement).toBeInTheDocument()
    expect(commitNode.tooltip({ hash: 'commit-to-hover', shouldExist: false })).not.toBeInTheDocument()
  })

  it('should render the commits hash next to the node if showCommitNodeHashes is true', () => {
    const rowSpacing = 12
    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      rowSpacing
    }))

    vi.spyOn(graphContext, 'useGraphContext').mockReturnValue(graphContextBag({
      showCommitNodeHashes: true,
      nodeSize: 24
    }))

    vi.spyOn(selectCommit, 'useSelectCommit').mockReturnValue({
      selectCommitHandler: {
        onMouseOut: vi.fn(),
        onClick: vi.fn(),
        onMouseOver: vi.fn()
      }
    })

    const expectedTextColour = 'rgb(0, 78, 91)'
    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions({
      textColour: expectedTextColour,
      theme: 'dark'
    }))

    render(
      <CommitNode
        colour='white'
        commit={commit({
          hash: '8a1b7c0e'
        })}
      />
    )

    expect(commitNode.withHash({ hash: '8a1b7c0e' })).toBeInTheDocument()

    const hashLabelElement = commitNode.hashLabel({ hash: '8a1b7c0e' })
    expect(hashLabelElement).toBeInTheDocument()
    expect(hashLabelElement).toHaveTextContent('8a1b7c0e')

    const hashLabelStyle = getComputedStyle(hashLabelElement)
    expect(hashLabelStyle.color).toBe(expectedTextColour)
    expect(hashLabelStyle.top).toBe('calc(50% - 10px)')
    expect(hashLabelStyle.height).toBe('20px')
    expect(hashLabelStyle.left).toBe('calc(50% + 17px)')
    expect(hashLabelStyle.background).toBe('rgb(26, 26, 26)')
  })

  it('should render the commits hash with a light background if the theme is light', () => {
    vi.spyOn(graphContext, 'useGraphContext').mockReturnValue(graphContextBag({
      showCommitNodeHashes: true
    }))

    vi.spyOn(selectCommit, 'useSelectCommit').mockReturnValue({
      selectCommitHandler: {
        onMouseOut: vi.fn(),
        onClick: vi.fn(),
        onMouseOver: vi.fn()
      }
    })

    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions({
      theme: 'light'
    }))

    render(
      <CommitNode
        colour='white'
        commit={commit({
          hash: '12345'
        })}
      />
    )

    expect(commitNode.withHash({ hash: '12345' })).toBeInTheDocument()

    const hashLabelElement = commitNode.hashLabel({ hash: '12345' })
    expect(hashLabelElement).toBeInTheDocument()

    const hashLabelStyle = getComputedStyle(hashLabelElement)
    expect(hashLabelStyle.background).toBe('white')
  })

  it('should invoke the onClick event handler from the select commit handler hook when clicking the node', async () => {
    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag())

    const onClickHandler = vi.fn()
    vi.spyOn(selectCommit, 'useSelectCommit').mockReturnValue({
      selectCommitHandler: {
        onMouseOut: vi.fn(),
        onClick: onClickHandler,
        onMouseOver: vi.fn()
      }
    })

    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions())

    const commitObject = commit({
      hash: 'commit-to-click'
    })

    render(
      <CommitNode
        colour='white'
        commit={commitObject}
      />
    )

    const commitNodeElement = commitNode.withHash({ hash: 'commit-to-click' })
    expect(commitNodeElement).toBeInTheDocument()

    await userEvent.click(commitNodeElement)
    expect(onClickHandler).toHaveBeenCalledExactlyOnceWith(commitObject)
  })

  it('should invoke the onClick event handler from the select commit handler hook when pressing the enter key on the node', async () => {
    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag())

    const onClickHandler = vi.fn()
    vi.spyOn(selectCommit, 'useSelectCommit').mockReturnValue({
      selectCommitHandler: {
        onMouseOut: vi.fn(),
        onClick: onClickHandler,
        onMouseOver: vi.fn()
      }
    })

    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions())

    const commitObject = commit({
      hash: 'commit-to-click'
    })

    render(
      <CommitNode
        colour='white'
        commit={commitObject}
      />
    )

    const commitNodeElement = commitNode.withHash({ hash: 'commit-to-click' })
    expect(commitNodeElement).toBeInTheDocument()

    fireEvent.keyDown(commitNodeElement, { key: 'Enter', code: 'Enter', keyCode: 13 })
    expect(onClickHandler).toHaveBeenCalledExactlyOnceWith(commitObject)
  })

  it('should render an inner circle element when the commit is a merge commit and the node theme is default', async () => {
    vi.spyOn(graphContext, 'useGraphContext').mockReturnValue(graphContextBag({
      nodeTheme: 'default',
      nodeSize: 24
    }))

    vi.spyOn(selectCommit, 'useSelectCommit').mockReturnValue({
      selectCommitHandler: {
        onMouseOut: vi.fn(),
        onClick: vi.fn(),
        onMouseOver: vi.fn()
      }
    })

    const expectedBackgroundColour = 'rgb(56, 79, 240)'
    const expectedBorderColour = 'rgb(28, 66, 146)'
    const getCommitNodeColours = vi.fn().mockReturnValue({
      backgroundColour: expectedBackgroundColour,
      borderColour: expectedBorderColour
    })
    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions({
      getCommitNodeColours: getCommitNodeColours
    }))

    const commitObject = commit({
      hash: '0e22d17a',
      parents: ['1', '2']
    })

    const commitColour = 'rgb(0, 51, 123)'

    render(
      <CommitNode
        colour={commitColour}
        commit={commitObject}
      />
    )

    expect(commitNode.withHash({ hash: '0e22d17a' })).toBeInTheDocument()

    const mergeCircle = commitNode.mergeCircle({ hash: '0e22d17a' })
    expect(mergeCircle).toBeInTheDocument()
    expect(getCommitNodeColours).toHaveBeenCalledWith({ columnColour: commitColour })
    expect(getComputedStyle(mergeCircle).background).toBe(expectedBorderColour)
  })

  it('should not render an inner circle element when the commit is a merge commit but the node theme is plain', async () => {
    vi.spyOn(graphContext, 'useGraphContext').mockReturnValue(graphContextBag({
      nodeTheme: 'plain'
    }))

    vi.spyOn(selectCommit, 'useSelectCommit').mockReturnValue({
      selectCommitHandler: {
        onMouseOut: vi.fn(),
        onClick: vi.fn(),
        onMouseOver: vi.fn()
      }
    })

    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions())

    const commitObject = commit({
      hash: '0e22d17a',
      parents: ['1', '2']
    })

    render(
      <CommitNode
        colour='white'
        commit={commitObject}
      />
    )

    expect(commitNode.withHash({ hash: '0e22d17a' })).toBeInTheDocument()
    expect(commitNode.mergeCircle({ hash: '0e22d17a', shouldExist: false })).not.toBeInTheDocument()
  })

  it('should render the commit node element with the correct styles', async () => {
    vi.spyOn(graphContext, 'useGraphContext').mockReturnValue(graphContextBag({
      nodeTheme: 'plain'
    }))

    vi.spyOn(selectCommit, 'useSelectCommit').mockReturnValue({
      selectCommitHandler: {
        onMouseOut: vi.fn(),
        onClick: vi.fn(),
        onMouseOver: vi.fn()
      }
    })

    const expectedNodeBackgroundColour = 'rgb(254, 200, 67)'
    const expectedNodeBorderColour = 'rgb(28, 66, 146)'
    const getCommitNodeColours = vi.fn().mockReturnValue({
      backgroundColour: expectedNodeBackgroundColour,
      borderColour: expectedNodeBorderColour
    })
    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions({
      getCommitNodeColours: getCommitNodeColours
    }))

    const commitColour = 'rgb(78, 12, 90)'

    render(
      <CommitNode
        colour={commitColour}
        commit={commit({ hash: 'abc123' })}
      />
    )

    expect(getCommitNodeColours).toHaveBeenCalledWith({ columnColour: commitColour })

    const commitNodeElement = commitNode.withHash({ hash: 'abc123' })
    expect(commitNodeElement).toBeInTheDocument()

    const commitNodeStyle = getComputedStyle(commitNodeElement)
    expect(commitNodeStyle.backgroundColor).toBe(expectedNodeBackgroundColour)
    expect(commitNodeStyle.borderWidth).toBe('2px')
    expect(commitNodeStyle.borderColor).toBe(expectedNodeBorderColour)
    expect(commitNodeStyle.borderStyle).toBe('solid')
  })

  it('should render a title and link out to the commit if the commit URL is defined in the builder', async () => {
    const mockUrlBuilder = vi.fn().mockReturnValue({
      commit: 'https://github.com/TomPlum/commit/test-commit-id'
    })

    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      remoteProviderUrlBuilder: mockUrlBuilder
    }))

    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    const testCommit = commit({ hash: 'abc1234567' })

    render(
      <CommitNode
        colour={'red'}
        commit={testCommit}
      />
    )

    const commitNode = screen.getByTitle('View Commit')
    expect(commitNode).toBeInTheDocument()

    await userEvent.click(commitNode)

    expect(mockUrlBuilder).toHaveBeenCalledWith({ commit : testCommit })
    expect(windowOpenSpy).toHaveBeenCalledExactlyOnceWith(
      'https://github.com/TomPlum/commit/test-commit-id',
      '_blank'
    )
  })
})