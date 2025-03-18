import { useContext } from 'react'
import { GitContext } from './GitContext'

export const useGitContext = () => useContext(GitContext)