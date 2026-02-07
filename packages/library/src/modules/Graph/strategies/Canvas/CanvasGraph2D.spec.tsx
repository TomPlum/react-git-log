import { render, screen } from '@testing-library/react'
import { Canvas2DGraph } from 'modules/Graph/strategies/Canvas/Canvas2DGraph'
import * as gitContext from 'context/GitContext/useGitContext'
import { commit, gitContextBag, graphContextBag, graphData } from 'test/stubs'
import { describe, it, expect, beforeEach } from 'vitest'
import * as graphContext from 'modules/Graph/context'

describe('CanvasGraph2D', () => {
  beforeEach(() => {
    vi.spyOn(graphContext, 'useGraphContext').mockReturnValue(graphContextBag())
  })

  it('should apply margin-top to the canvas element when showHeaders is false', () => {
    const selectedCommit = commit({ hash: 'selected' })

    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(
      gitContextBag({
        showHeaders: false,
        selectedCommit,
        graphData: graphData({
          hashToCommit: new Map([[selectedCommit.hash, selectedCommit]]),
          positions: new Map([[selectedCommit.hash, [0, 0]]])
        })
      })
    )

    render(<Canvas2DGraph />)

    expect(screen.getByTestId('graph-2d-canvas')).toHaveStyle('margin-top: 12px')
  })

  it('should NOT apply margin-top to the canvas element when showHeaders is true', () => {
    const selectedCommit = commit({ hash: 'selected' })

    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(
      gitContextBag({
        showHeaders: true,
        selectedCommit,
        graphData: graphData({
          hashToCommit: new Map([[selectedCommit.hash, selectedCommit]]),
          positions: new Map([[selectedCommit.hash, [0, 0]]])
        })
      })
    )

    render(<Canvas2DGraph />)

    expect(screen.getByTestId('graph-2d-canvas')).toHaveStyle('margin-top: undefined')
  })
})