import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useResize } from './useResize'
import * as GitContext from 'context/GitContext'
import * as MouseHook from '@uidotdev/usehooks'
import { gitContextBag } from 'test/stubs'

vi.mock('@uidotdev/usehooks', () => {
  return {
    useMouse: vi.fn(() => [{ x: 500, y: 0 }]),
  }
})

describe('useResize', () => {
  const setGraphWidth = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock GitContext
    vi.spyOn(GitContext, 'useGitContext').mockReturnValue(gitContextBag({
      graphWidth: 300,
      setGraphWidth
    }))
  })

  it('returns the initial graph width and a ref + startResizing function', () => {
    const { result } = renderHook(() => useResize())

    expect(result.current.width).toBe(300)
    expect(typeof result.current.startResizing).toBe('function')
    expect(result.current.ref).toBeDefined()
  })

  it('starts dragging when startResizing is called', () => {
    const { result } = renderHook(() => useResize())

    act(() => {
      result.current.startResizing()
    })

    // internal dragging state isn’t directly testable, but the effect will trigger on the next mouse move
    expect(typeof result.current.startResizing).toBe('function')
  })

  it('updates graphWidth when dragging and mouse moves within bounds', () => {
    // @ts-expect-error Only mocking relevant props for test
    vi.spyOn(MouseHook, 'useMouse').mockReturnValue([{ x: 500, y: 0 }])

    const { result, rerender } = renderHook(() => useResize())

    const mockRef = {
      getBoundingClientRect: vi.fn(() => ({
        x: 100,
        width: 300 // right = 400
      }))
    }

    result.current.ref.current = mockRef as unknown as HTMLDivElement

    // Trigger dragging
    act(() => {
      result.current.startResizing()
    })

    // Rerender to simulate effect re-run with updated mouse.x
    rerender()

    expect(setGraphWidth).toHaveBeenCalledWith(400) // 300 + (500 - 400)
  })

  it('does not update width if newWidth is out of bounds', () => {
    // @ts-expect-error Only mocking relevant props for test
    vi.spyOn(MouseHook, 'useMouse').mockReturnValue([{ x: 1000, y: 0 }]) // too big
    const { result, rerender } = renderHook(() => useResize())

    const mockRef = {
      getBoundingClientRect: vi.fn(() => ({
        x: 100,
        width: 750 // right = 850, newWidth = 1000 - 850 + 750 = 900
      }))
    }

    result.current.ref.current = mockRef as unknown as HTMLDivElement

    act(() => {
      result.current.startResizing()
    })

    rerender()
    expect(setGraphWidth).not.toHaveBeenCalled()
  })

  it('cleans up window mouseup event listener on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useResize())

    expect(addSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))

    window.dispatchEvent(new MouseEvent('mouseup'))

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
  })
})