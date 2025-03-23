import { screen } from '@testing-library/react'
import { ShouldExist } from './types'

interface At<T> extends ShouldExist<T> {
  row: number
  column: number
}

interface Node<T> extends ShouldExist<T> {
  hash: string
}

interface Background<T> extends ShouldExist<T> {
  column: number
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

  public withHeadCommitVerticalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('head-commit-vertical-line', shouldExist)
  }

  public withFullWidthHorizontalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('horizontal-line-full-width', shouldExist)
  }

  public withHalfWidthRightHorizontalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('horizontal-line-right-half', shouldExist)
  }

  public withSelectedBackground<T extends boolean = true>({ column, shouldExist }: Background<T> = {} as Background<T>) {
    return this.getElement(`column-background-${column}-selected`, shouldExist)
  }

  public withPreviewedBackground<T extends boolean = true>({ column, shouldExist }: Background<T> = {} as Background<T>) {
    return this.getElement(`column-background-${column}-previewed`, shouldExist)
  }

  public withLeftDownCurve<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('left-down-curve', shouldExist)
  }

  public withLeftDownCurveCurvedLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('left-down-curve-curved-line', shouldExist)
  }

  public withLeftDownCurveLeftLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('left-down-curve-left-line', shouldExist)
  }

  public withLeftDownCurveBottomLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('left-down-curve-bottom-line', shouldExist)
  }

  public withLeftUpCurve<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('left-up-curve', shouldExist)
  }

  public withLeftUpCurveCurvedLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('left-up-curve-curved-line', shouldExist)
  }

  public withLeftUpCurveLeftLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('left-up-curve-left-line', shouldExist)
  }

  public withLeftUpCurveTopLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('left-up-curve-top-line', shouldExist)
  }
}

export const graphColumn = new GraphColumnElement()