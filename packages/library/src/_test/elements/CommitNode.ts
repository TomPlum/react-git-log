import { ShouldExist } from './types'
import { screen } from '@testing-library/react'

interface WithHash<T> extends ShouldExist<T> {
  hash: string
}

class CommitNodeElement {
  private getElement<T extends boolean>(testId: string, shouldExist: T = true as T): T extends true ? HTMLElement : HTMLElement | null {
    return (shouldExist ? screen.getByTestId(testId) : screen.queryByTestId(testId)) as any
  }

  public withHash<T extends boolean = true>({ hash, shouldExist }: WithHash<T> = {} as WithHash<T>) {
    return this.getElement(`commit-node-${hash}`, shouldExist)
  }

  public tooltip<T extends boolean = true>({ hash, shouldExist }: WithHash<T> = {} as WithHash<T>) {
    return this.getElement(`commit-node-tooltip-${hash}`, shouldExist)
  }

  public hashLabel<T extends boolean = true>({ hash, shouldExist }: WithHash<T> = {} as WithHash<T>) {
    return this.getElement(`commit-node-hash-${hash}`, shouldExist)
  }

  public mergeCircle<T extends boolean = true>({ hash, shouldExist }: WithHash<T> = {} as WithHash<T>) {
    return this.getElement(`commit-node-merge-circle-${hash}`, shouldExist)
  }

}

export const commitNode = new CommitNodeElement()