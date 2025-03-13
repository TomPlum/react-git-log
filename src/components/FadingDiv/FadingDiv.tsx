import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes, PropsWithChildren } from 'react'
import { useGitContext } from 'modules/Visualiser/context'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'

export const FadingDiv = ({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement> & MotionProps>) => {
  const { hoverTransitionDuration } = useTheme()
  const { enableExperimentalAnimation } = useGitContext()

  if (enableExperimentalAnimation) {
    return (
      <motion.div
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