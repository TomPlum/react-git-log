import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthorData } from './AuthorData'
import type { AuthorDataProps } from './types'
import { table } from 'test/elements/Table'

const renderAuthorData = (props: Partial<AuthorDataProps> = {}) => {
  const defaultProps: AuthorDataProps = {
    author: undefined,
    index: 0,
    isPlaceholder: false,
    style: {},
    ...props,
  }

  return render(<AuthorData {...defaultProps} />)
}

describe('AuthorData', () => {
  it('renders only name if name is provided but no email', () => {
    renderAuthorData({
      author: { name: 'Alice', email: undefined },
      index: 1,
    })

    const el = table.authorData({ row: 1 })

    expect(el.textContent).toBe('Alice')
    expect(el).toHaveAttribute('title', 'Alice')
  })

  it('renders only email if email is provided but no name', () => {
    renderAuthorData({
      author: { name: undefined, email: 'alice@example.com' },
      index: 2,
    })

    const el = table.authorData({ row: 2 })

    expect(el.textContent).toBe('')
    expect(el).toHaveAttribute('title', 'alice@example.com')
  })

  it('renders name and email when both are provided', () => {
    renderAuthorData({
      author: { name: 'Alice', email: 'alice@example.com' },
      index: 3,
    })

    const el = table.authorData({ row: 3 })

    expect(el.textContent).toBe('Alice')
    expect(el).toHaveAttribute('title', 'Alice (alice@example.com)')
  })

  it('renders empty string if no name or email', () => {
    renderAuthorData({
      author: { name: undefined, email: undefined },
      index: 4,
    })

    const el = table.authorData({ row: 4 })

    expect(el.textContent).toBe('')
    expect(el).not.toHaveAttribute('title')
  })

  it('renders placeholder if isPlaceholder is true', () => {
    renderAuthorData({
      isPlaceholder: true,
      author: { name: 'Alice', email: 'alice@example.com' },
      index: 5,
    })

    expect(table.authorData({ row: 5 }).textContent).toBe('-')
  })

  it('applies custom style prop', () => {
    const style = { color: 'rgb(255, 0, 0)' }

    renderAuthorData({
      author: { name: 'Test', email: undefined },
      style,
      index: 6,
    })

    expect(table.authorData({ row: 6 })).toHaveStyle(style)
  })
})