import { fireEvent, render } from '@testing-library/react'
import { TableRow } from 'modules/Table/components/TableRow/TableRow'
import { commit, gitContextBag, graphData, themeFunctions } from 'test/stubs'
import * as gitContext from 'context/GitContext'
import * as useTheme from 'hooks/useTheme'
import { table } from 'test/elements/Table'

describe('Table Row', () => {
  it('should not render a different background colour for the selected commit if enableSelectedCommitStyling is false', () => {
    const selectedCommit = commit()

    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      selectedCommit,
      graphData: graphData({
        positions: new Map([[selectedCommit.hash, [2, 0]]])
      }),
      enableSelectedCommitStyling: false
    }))

    const getCommitColour = vi.fn().mockReturnValue('test-commit-colour')
    const selectedCommitBackgroundColour = 'rgb(245, 210, 98)'
    const reduceOpacity = vi.fn().mockReturnValue(selectedCommitBackgroundColour)
    vi.spyOn(useTheme, 'useTheme').mockReturnValue(themeFunctions({
      getCommitColour,
      reduceOpacity
    }))

    render(
      <TableRow index={2} commit={selectedCommit} />
    )

    fireEvent.mouseOver(table.row({ row: 2 }))

    // If the row is not selected, then it has a transparent background colour added to the gradient
    const expectedBackground = 'linear-gradient( to bottom, transparent 2px, transparent 2px, transparent 38px, transparent 38px )'
    expect(table.authorData({ row: 2 })).toHaveStyle({ background: expectedBackground })
    expect(table.timestampData({ row: 2 })).toHaveStyle({ background: expectedBackground })
    expect(table.commitMessageData({ row: 2 })).toHaveStyle({ background: expectedBackground })
  })

  it('should not render any extra background styles for the previewed commit if enablePreviewedCommitStyling is false', () => {
    const previewedCommit = commit({
      hash: 'previewed'
    })

    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      previewedCommit,
      graphData: graphData({
        positions: new Map([[previewedCommit.hash, [3, 0]]])
      }),
      enablePreviewedCommitStyling: false
    }))

    const previewedCommitBackgroundColour = 'rgb(67, 10, 26)'
    vi.spyOn(useTheme, 'useTheme').mockReturnValue(themeFunctions({
      hoverColour: previewedCommitBackgroundColour
    }))

    render(
      <TableRow index={3} commit={previewedCommit} />
    )

    fireEvent.mouseOver(table.row({ row: 3 }))

    // If the row is not previewed, then it has a transparent background colour added to the gradient
    const expectedBackground = 'linear-gradient( to bottom, transparent 2px, transparent 2px, transparent 38px, transparent 38px )'
    expect(table.authorData({ row: 3 })).toHaveStyle({ background: expectedBackground })
    expect(table.timestampData({ row: 3 })).toHaveStyle({ background: expectedBackground })
    expect(table.commitMessageData({ row: 3 })).toHaveStyle({ background: expectedBackground })
  })
})