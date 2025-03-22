import { screen } from '@testing-library/react'

interface At<T> extends ShouldExist<T> {
  row: number
  column: number
}

interface Node<T> extends ShouldExist<T> {
  hash: string
}

interface ShouldExist<T> {
  shouldExist?: T
}

class GraphColumnElement {
  private getElement<T extends boolean>(testId: string, shouldExist: T = true as T): T extends true ? HTMLElement : HTMLElement | null {
    return (shouldExist ? screen.getByTestId(testId) : screen.queryByTestId(testId)) as any
  }

  public at<T extends boolean = true>({ row, column, shouldExist }: At<T> = {} as At<T>) {
    return this.getElement(`graph-column-row-${row}-col-${column}`, shouldExist)
  }

  public withCommitNode<T extends boolean = true>({ hash, shouldExist }: Node<T> = {} as Node<T>) {
    return this.getElement(`commit-node-${hash}`, shouldExist)
  }

  public withIndexPseudoCommitNode<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('index-pseudo-commit-node', shouldExist)
  }

  public withFullHeightVerticalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('vertical-line-full-height', shouldExist)
  }

  public withFullWidthHorizontalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('horizontal-line-full-width', shouldExist)
  }

  public withHalfWidthRightHorizontalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('horizontal-line-right-half', shouldExist)
  }
}

export const graphColumn = new GraphColumnElement()