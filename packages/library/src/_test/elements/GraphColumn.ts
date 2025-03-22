import { screen } from '@testing-library/react'

class GraphColumnElement {
  private getElement<T extends boolean>(testId: string, shouldExist: T = true as T): T extends true ? HTMLElement : HTMLElement | null {
    return (shouldExist ? screen.getByTestId(testId) : screen.queryByTestId(testId)) as any
  }

  public at<T extends boolean = true>({ row, column, shouldExist }: { row: number; column: number; shouldExist?: T } = {} as { row: number; column: number; shouldExist?: T }) {
    return this.getElement(`graph-column-row-${row}-col-${column}`, shouldExist)
  }

  public withCommitNode<T extends boolean = true>({ hash, shouldExist }: { hash: string; shouldExist?: T } = {} as { hash: string; shouldExist?: T }) {
    return this.getElement(`commit-node-${hash}`, shouldExist)
  }

  public withIndexPseudoCommitNode<T extends boolean = true>({ shouldExist }: { shouldExist?: T } = {} as { shouldExist?: T }) {
    return this.getElement('index-pseudo-commit-node', shouldExist)
  }

  public withFullHeightVerticalLine<T extends boolean = true>({ shouldExist }: { shouldExist?: T } = {} as { shouldExist?: T }) {
    return this.getElement('vertical-line-full-height', shouldExist)
  }
}

export const graphColumn = new GraphColumnElement()