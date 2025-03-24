import { render, waitFor } from '@testing-library/react'
import { BranchTag } from './BranchTag'
import { commit, gitContextBag, themeFunctions } from 'test/stubs'
import { tag } from 'test/elements/Tag'
import { userEvent } from '@testing-library/user-event'
import * as themeHook from 'hooks/useTheme'
import * as gitContext from 'context/GitContext/useGitContext'
import { expect } from 'vitest'

describe('BranchTag', () => {
  it('should render a tooltip when mousing over the tag', async () => {
    render(
      <BranchTag
        id='0'
        height={25}
        lineWidth={100}
        lineRight={100}
        commit={commit()}
      />
    )

    const tagElement = tag.atRow({ row: 0 })
    expect(tagElement).toBeInTheDocument()

    await userEvent.hover(tagElement)
    expect(tag.tooltip({ row: 0 })).toBeInTheDocument()

    await userEvent.unhover(tagElement)
    await waitFor(() => {
      expect(tag.tooltip({ row: 0, shouldExist: false })).not.toBeInTheDocument()
    })
  })

  it('should render a branch icon if the commit branch is a branch name', () => {
    render(
      <BranchTag
        id='0'
        height={25}
        lineWidth={100}
        lineRight={100}
        commit={commit({
          branch: 'feature/my-branch'
        })}
      />
    )

    const tagElement = tag.atRow({ row: 0 })
    expect(tagElement).toBeInTheDocument()
    expect(tag.branchIcon()).toBeInTheDocument()
  })

  it('should render a tag icon if the commit branch is a tag name', () => {
    render(
      <BranchTag
        id='0'
        height={25}
        lineWidth={100}
        lineRight={100}
        commit={commit({
          branch: 'tags/my-tag'
        })}
      />
    )

    const tagElement = tag.atRow({ row: 0 })
    expect(tagElement).toBeInTheDocument()
    expect(tag.tagIcon()).toBeInTheDocument()
  })

  it('should render the index label if the commit hash is index', () => {
    render(
      <BranchTag
        id='0'
        height={25}
        lineWidth={100}
        lineRight={100}
        commit={commit({
          hash: 'index'
        })}
      />
    )

    const tagElement = tag.atRow({ row: 0 })
    expect(tagElement).toBeInTheDocument()
    expect(tagElement).toHaveTextContent('index')
    expect(tag.gitIcon()).toBeInTheDocument()
  })

  it('should render a tag line with the correct styles', () => {
    const expectedCommitColour = 'rgb(234, 156, 78)'
    const getCommitColour = vi.fn().mockReturnValue(expectedCommitColour)
    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions({
      getCommitColour
    }))

    const branchTagCommit = commit()
    
    render(
      <BranchTag
        id='0'
        height={25}
        lineWidth={100}
        lineRight={180}
        commit={branchTagCommit}
      />
    )

    expect(getCommitColour).toHaveBeenCalledExactlyOnceWith(branchTagCommit)

    const tagLineElement = tag.line({ row: 0 })
    const style = getComputedStyle(tagLineElement)

    expect(style.opacity).toBe('0.4')
    expect(style.right).toBe('180px')
    expect(style.width).toBe('100px')
    expect(style.borderTopWidth).toBe('2px')
    expect(style.borderTopStyle).toBe('dotted')
    expect(style.borderTopColor).toBe(expectedCommitColour)
    expect(style.animationDuration).toBe('0.3s')
  })

  it('should render a tag line with the correct styles for the selected commit', () => {
    const expectedCommitColour = 'rgb(234, 156, 78)'
    const getCommitColour = vi.fn().mockReturnValue(expectedCommitColour)
    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions({
      getCommitColour
    }))

    const branchTagCommit = commit()
    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      selectedCommit: branchTagCommit
    }))

    render(
      <BranchTag
        id='0'
        height={25}
        lineWidth={100}
        lineRight={180}
        commit={branchTagCommit}
      />
    )

    expect(getCommitColour).toHaveBeenCalledExactlyOnceWith(branchTagCommit)

    const tagLineElement = tag.line({ row: 0 })
    const style = getComputedStyle(tagLineElement)

    expect(style.opacity).toBe('1')
    expect(style.right).toBe('180px')
    expect(style.width).toBe('100px')
    expect(style.borderTopWidth).toBe('2px')
    expect(style.borderTopStyle).toBe('dotted')
    expect(style.borderTopColor).toBe(expectedCommitColour)
    expect(style.animationDuration).toBe('0.3s')
  })

  it('should render a tag line with the correct styles for the previewed commit', () => {
    const expectedCommitColour = 'rgb(234, 156, 78)'
    const getCommitColour = vi.fn().mockReturnValue(expectedCommitColour)
    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions({
      getCommitColour
    }))

    const branchTagCommit = commit()
    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      previewedCommit: branchTagCommit
    }))

    render(
      <BranchTag
        id='0'
        height={25}
        lineWidth={100}
        lineRight={180}
        commit={branchTagCommit}
      />
    )

    expect(getCommitColour).toHaveBeenCalledExactlyOnceWith(branchTagCommit)

    const tagLineElement = tag.line({ row: 0 })
    const style = getComputedStyle(tagLineElement)

    expect(style.opacity).toBe('0.8')
    expect(style.right).toBe('180px')
    expect(style.width).toBe('100px')
    expect(style.borderTopWidth).toBe('2px')
    expect(style.borderTopStyle).toBe('dotted')
    expect(style.borderTopColor).toBe(expectedCommitColour)
    expect(style.animationDuration).toBe('0s')
  })

  it('should render the tag label with the correct styles', () => {
    const expectedCommitColour = 'rgb(234, 156, 78)'
    const getCommitColour = vi.fn().mockReturnValue(expectedCommitColour)

    const expectedBackgroundColor = 'rgb(68, 156, 78)'
    const shiftAlphaChannel = vi.fn().mockReturnValue(expectedBackgroundColor)

    const expectedTextColour = 'rgb(67, 80, 157)'
    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions({
      textColour: expectedTextColour,
      shiftAlphaChannel,
      getCommitColour
    }))

    const branchTagCommit = commit()

    render(
      <BranchTag
        id='0'
        height={25}
        lineWidth={100}
        lineRight={180}
        commit={branchTagCommit}
      />
    )

    expect(shiftAlphaChannel).toHaveBeenCalledExactlyOnceWith(expectedCommitColour, 0.30)

    const tagLabel = tag.label({ row: 0 })
    const style = getComputedStyle(tagLabel)

    expect(style.color).toBe(expectedTextColour)
    expect(style.background).toBe(expectedBackgroundColor)
    expect(style.border).toBe(`2px solid ${expectedCommitColour}`)
  })

  it('should render the tag label with the correct styles for the index tag', () => {
    const expectedCommitColour = 'rgb(234, 156, 78)'
    const getCommitColour = vi.fn().mockReturnValue(expectedCommitColour)

    const expectedBackgroundColor = 'rgb(68, 156, 78)'
    const shiftAlphaChannel = vi.fn().mockReturnValue(expectedBackgroundColor)

    const expectedTextColour = 'rgb(67, 80, 157)'
    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions({
      textColour: expectedTextColour,
      shiftAlphaChannel,
      getCommitColour
    }))

    const branchTagCommit = commit({ hash: 'index' })

    render(
      <BranchTag
        id='0'
        height={25}
        lineWidth={100}
        lineRight={180}
        commit={branchTagCommit}
      />
    )

    expect(shiftAlphaChannel).toHaveBeenCalledWith(expectedCommitColour, 0.05)
    expect(shiftAlphaChannel).toHaveBeenCalledWith(expectedCommitColour, 0.5)

    const tagLabel = tag.label({ row: 0 })
    const style = getComputedStyle(tagLabel)

    expect(style.color).toBe(expectedTextColour)
    expect(style.background).toBe(expectedBackgroundColor)
    expect(style.border).toBe(`2px dashed ${expectedBackgroundColor}`)
  })
})