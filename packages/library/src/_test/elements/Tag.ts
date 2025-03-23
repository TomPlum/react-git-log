import { screen } from '@testing-library/react'
import { ShouldExist } from 'test/elements/types'

interface Row <T> extends ShouldExist<T> {
  row: number
}

class Tag {
  private getElement<T extends boolean>(testId: string, shouldExist: T = true as T): T extends true ? HTMLElement : HTMLElement | null {
    return (shouldExist ? screen.getByTestId(testId) : screen.queryByTestId(testId)) as any
  }

  public branchIconId = 'branch-icon'
  public tagIconId = 'tag-icon'
  public gitIconId = 'git-icon'

  public id({ row }: Row<true>) {
    return `tag-${row}`
  }

  public tooltipId({ row }: Row<true>) {
    return `tag-${row}-tooltip`
  }

  public emptyId({ row }: Row<true>) {
    return `empty-tag-${row}`
  }

  public lineId({ row }: Row<true>) {
    return `tag-line-${row}`
  }

  public labelId({ row }: Row<true>) {
    return `tag-label-${row}`
  }

  public atRow<T extends boolean = true>({ row, shouldExist }: Row<T> = {} as Row<T>) {
    return this.getElement(this.id({ row }), shouldExist)
  }

  public empty<T extends boolean = true>({ row, shouldExist }: Row<T> = {} as Row<T>) {
    return this.getElement(this.emptyId({ row }), shouldExist)
  }

  public line<T extends boolean = true>({ row, shouldExist }: Row<T> = {} as Row<T>) {
    return this.getElement(this.lineId({ row }), shouldExist)
  }

  public label<T extends boolean = true>({ row, shouldExist }: Row<T> = {} as Row<T>) {
    return this.getElement(this.labelId({ row }), shouldExist)
  }

  public branchIcon<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.branchIconId, shouldExist)
  }

  public tagIcon<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.tagIconId, shouldExist)
  }

  public gitIcon<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement(this.gitIconId, shouldExist)
  }

  public tooltip<T extends boolean = true>({ row, shouldExist }: Row<T> = {} as Row<T>) {
    return this.getElement(this.tooltipId({ row }), shouldExist)
  }
}

export const tag = new Tag()