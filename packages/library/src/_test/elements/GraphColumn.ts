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

  public id({ row, column }: At<true>) {
    return `graph-column-row-${row}-col-${column}`
  }

  public commitNodeId({ hash }: Node<true>) {
    return `commit-node-${hash}`
  }

  public backgroundId({ column }: Background<true>, type: 'selected' | 'previewed') {
    return `column-background-${column}-${type}`
  }

  public indexPseudoCommitNodeId = 'index-pseudo-commit-node'
  public fullHeightVerticalLineId = 'vertical-line-full-height'
  public bottomHalfVerticalLineId = 'vertical-line-bottom-half'
  public bottomHalfDottedVerticalLineId = 'vertical-line-bottom-half-dotted'
  public topHalfDottedVerticalLineId = 'vertical-line-top-half-dotted'
  public topHalfVerticalLineId = 'vertical-line-top-half'
  public headCommitVerticalLineId = 'head-commit-vertical-line'
  public fullWidthHorizontalLineId = 'horizontal-line-full-width'
  public halfWidthRightHorizontalLineId = 'horizontal-line-right-half'
  public leftDownCurveId = 'left-down-curve'
  public leftDownCurveCurvedLineId = 'left-down-curve-curved-line'
  public leftDownCurveLeftLineId = 'left-down-curve-left-line'
  public leftDownCurveBottomLineId = 'left-down-curve-bottom-line'
  public leftUpCurveId = 'left-up-curve'
  public leftUpCurveCurvedLineId = 'left-up-curve-curved-line'
  public leftUpCurveLeftLineId = 'left-up-curve-left-line'
  public leftUpCurveTopLineId = 'left-up-curve-top-line'

  public at<T extends boolean = true>({ row, column, shouldExist }: At<T> = {} as At<T>) {
    return this.getElement(this.id({ row, column }), shouldExist)
  }

  public withCommitNode<T extends boolean = true>({ hash, shouldExist }: Node<T> = {} as Node<T>) {
    return this.getElement(this.commitNodeId({ hash }), shouldExist)
  }

  public withIndexPseudoCommitNode<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.indexPseudoCommitNodeId, shouldExist)
  }

  public withFullHeightVerticalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.fullHeightVerticalLineId, shouldExist)
  }

  public withBottomHalfVerticalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.bottomHalfVerticalLineId, shouldExist)
  }

  public withTopHalfDottedVerticalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.topHalfDottedVerticalLineId, shouldExist)
  }

  public withTopHalfVerticalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.topHalfVerticalLineId, shouldExist)
  }

  public withHeadCommitVerticalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.headCommitVerticalLineId, shouldExist)
  }

  public withFullWidthHorizontalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.fullWidthHorizontalLineId, shouldExist)
  }

  public withHalfWidthRightHorizontalLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.halfWidthRightHorizontalLineId, shouldExist)
  }

  public withSelectedBackground<T extends boolean = true>({ column, shouldExist }: Background<T> = {} as Background<T>) {
    return this.getElement(this.backgroundId({ column }, 'selected'), shouldExist)
  }

  public withPreviewedBackground<T extends boolean = true>({ column, shouldExist }: Background<T> = {} as Background<T>) {
    return this.getElement(this.backgroundId({ column }, 'previewed'), shouldExist)
  }

  public withLeftDownCurve<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.leftDownCurveId, shouldExist)
  }

  public withLeftDownCurveCurvedLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.leftDownCurveCurvedLineId, shouldExist)
  }

  public withLeftDownCurveLeftLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.leftDownCurveLeftLineId, shouldExist)
  }

  public withLeftDownCurveBottomLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.leftDownCurveBottomLineId, shouldExist)
  }

  public withLeftUpCurve<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.leftUpCurveId, shouldExist)
  }

  public withLeftUpCurveCurvedLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.leftUpCurveCurvedLineId, shouldExist)
  }

  public withLeftUpCurveLeftLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.leftUpCurveLeftLineId, shouldExist)
  }

  public withLeftUpCurveTopLine<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.leftUpCurveTopLineId, shouldExist)
  }
}

export const graphColumn = new GraphColumnElement()