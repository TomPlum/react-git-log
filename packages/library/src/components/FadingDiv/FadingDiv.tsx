import { motion } from 'framer-motion'
import { PropsWithChildren } from 'react'
import { useGitContext } from 'context/GitContext'
import { useTheme } from 'hooks/useTheme'
import { FadingDivProps } from './types'

export const FadingDiv = ({ children, ...props }: PropsWithChildren<FadingDivProps>) => {
  const { hoverTransitionDuration } = useTheme()
  const { enableExperimentalAnimation } = useGitContext()

  if (enableExperimentalAnimation) {
    return (
      <motion.div
        data-testid="fading-div"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: hoverTransitionDuration }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div {...props}>
      {children}
    </div>
  )
}