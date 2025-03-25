import { CommitAuthor } from './Commit'

/**
 * Represents a single entry in the git log.
 */
export interface GitLogEntry {
  /**
   * The unique hash identifier of the commit.
   */
  hash: string

  /**
   * The name of the branch this commit belongs to.
   */
  branch: string

  /**
   * An array of parent commit hashes.
   *
   * - If this commit is a merge commit, it will have multiple parents.
   * - If this commit is an initial commit, it will have no parents.
   */
  parents: string[]

  /**
   * The commit message describing the changes made in this commit.
   */
  message: string

  /**
   * Details of the user who authored
   * the commit.
   */
  author?: CommitAuthor

  /**
   * The date and time when the commit was applied by the committer.
   *
   * This is typically the timestamp when the commit was finalized.
   */
  committerDate: string

  /**
   * The date and time when the commit was originally authored.
   *
   * This may differ from `committerDate` if the commit was rebased or amended.
   */
  authorDate?: string
}