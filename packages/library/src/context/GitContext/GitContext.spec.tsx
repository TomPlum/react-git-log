import { commit } from 'test/stubs'
import { renderHook } from '@testing-library/react'
import { useGitContext } from 'context/GitContext/useGitContext'

describe('GitContext default implementation', () => {
  const consoleSpy = vi.spyOn(console, 'debug')

  it('should log a warning message when calling setGraphOrientation if the context is not initialised', () => {
    const { result } = renderHook(useGitContext)
    result.current.setGraphOrientation('flipped')
    expect(consoleSpy).toHaveBeenCalledExactlyOnceWith('Tried to invoke setGraphOrientation(flipped) before the GitContext was initialised.')
  })

  it('should log a warning message when calling setNodeSize if the context is not initialised', () => {
    const { result } = renderHook(useGitContext)
    result.current.setNodeSize(27)
    expect(consoleSpy).toHaveBeenCalledExactlyOnceWith('Tried to invoke setNodeSize(27) before the GitContext was initialised.')
  })

  it('should log a warning message when calling setGraphWidth if the context is not initialised', () => {
    const { result } = renderHook(useGitContext)
    result.current.setGraphWidth(78)
    expect(consoleSpy).toHaveBeenCalledExactlyOnceWith('Tried to invoke setGraphWidth(78) before the GitContext was initialised.')
  })

  it('should log a warning message when calling setSelectedCommit if the context is not initialised', () => {
    const { result } = renderHook(useGitContext)
    const testCommit = commit()

    result.current.setSelectedCommit(testCommit)

    const stringifiedCommit = JSON.stringify(testCommit)
    expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(
      `Tried to invoke setSelectedCommit(${stringifiedCommit}) before the GitContext was initialised.`
    )
  })

  it('should log a warning message when calling setPreviewedCommit if the context is not initialised', () => {
    const { result } = renderHook(useGitContext)
    const testCommit = commit()

    result.current.setPreviewedCommit(testCommit)

    const stringifiedCommit = JSON.stringify(testCommit)
    expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(
      `Tried to invoke setPreviewedCommit(${stringifiedCommit}) before the GitContext was initialised.`
    )
  })
})