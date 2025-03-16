import { useContext } from 'react'
import { GitContext } from './GitContext.ts'

export const useGitContext = () => useContext(GitContext)