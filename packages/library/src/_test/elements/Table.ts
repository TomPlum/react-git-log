import { screen } from '@testing-library/react'
import { ShouldExist } from './types'

interface HasRow<T> extends ShouldExist<T> {
  row: number
}

export class Table {
  private getElement<T extends boolean>(testId: string, shouldExist: T = true as T): T extends true ? HTMLElement : HTMLElement | null {
    return (shouldExist ? screen.getByTestId(testId) : screen.queryByTestId(testId)) as any
  }

  public container<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('react-git-log-table', shouldExist)
  }

  public head<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('react-git-log-table-head', shouldExist)
  }

  public commitMessageHeader<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('react-git-log-table-header-commit-message', shouldExist)
  }

  public timestampHeader<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('react-git-log-table-header-timestamp', shouldExist)
  }

  public authorHeader<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('react-git-log-table-header-author', shouldExist)
  }

  public row<T extends boolean = true>({ row, shouldExist }: HasRow<T> = {} as HasRow<T>) {
    return this.getElement(`react-git-log-table-row-${row}`, shouldExist)
  }

  public commitMessageData<T extends boolean = true>({ row, shouldExist }: HasRow<T> = {} as HasRow<T>) {
    return this.getElement(`react-git-log-table-data-commit-message-${row}`, shouldExist)
  }

  public timestampData<T extends boolean = true>({ row, shouldExist }: HasRow<T> = {} as HasRow<T>) {
    return this.getElement(`react-git-log-table-data-timestamp-${row}`, shouldExist)
  }

  public authorData<T extends boolean = true>({ row, shouldExist }: HasRow<T> = {} as HasRow<T>) {
    return this.getElement(`react-git-log-table-data-author-${row}`, shouldExist)
  }
}

export const table = new Table()