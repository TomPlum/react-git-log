import { screen } from '@testing-library/react'
import { ShouldExist } from 'test/elements/types'

interface Row <T> extends ShouldExist<T> {
  row: number
}

class Tag {
  private getElement<T extends boolean>(testId: string, shouldExist: T = true as T): T extends true ? HTMLElement : HTMLElement | null {
    return (shouldExist ? screen.getByTestId(testId) : screen.queryByTestId(testId)) as any
  }

  public id({ row }: Row<true>) {
    return `tag-${row}`
  }

  public emptyId({ row }: Row<true>) {
    return `empty-tag-${row}`
  }

  public atRow<T extends boolean = true>({ row, shouldExist }: Row<T> = {} as Row<T>) {
    return this.getElement(this.id({ row }), shouldExist)
  }

  public empty<T extends boolean = true>({ row, shouldExist }: Row<T> = {} as Row<T>) {
    return this.getElement(this.emptyId({ row }), shouldExist)
  }
}

export const tag = new Tag()