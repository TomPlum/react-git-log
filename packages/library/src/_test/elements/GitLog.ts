import { screen } from '@testing-library/react'
import { ShouldExist } from './types'

export class GitLogElement {
  private getElement<T extends boolean>(testId: string, shouldExist: T = true as T): T extends true ? HTMLElement : HTMLElement | null {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (shouldExist ? screen.getByTestId(testId) : screen.queryByTestId(testId)) as any
  }

  public container<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('react-git-log', shouldExist)
  }

  public branches<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('react-git-log-branches', shouldExist)
  }

  public graph<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('react-git-log-graph', shouldExist)
  }

  public table<T extends boolean = true>({ shouldExist }: ShouldExist<T> = {} as ShouldExist<T>) {
    return this.getElement('react-git-log-table', shouldExist)
  }
}

export const gitLog = new GitLogElement()