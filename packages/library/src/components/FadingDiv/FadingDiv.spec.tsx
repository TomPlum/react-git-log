import { gitContextBag, themeFunctions } from 'test/stubs'
import { render, screen } from '@testing-library/react'
import { FadingDiv } from 'components/FadingDiv/FadingDiv'
import * as themeHook from 'hooks/useTheme'
import * as gitContext from 'context/GitContext/useGitContext'

describe('FadingDiv', () => {
  it('should render a motion.div from framer motion if enableExperimentalMotion is on', () => {
    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      enableExperimentalAnimation: true
    }))

    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions({
      hoverTransitionDuration: 1000
    }))

    render(<FadingDiv />)

    expect(screen.getByTestId('fading-div')).toBeInTheDocument()
  })

  it('should render a regular div if enableExperimentalMotion is off', () => {
    vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
      enableExperimentalAnimation: false
    }))

    render(<FadingDiv />)

    expect(screen.queryByTestId('fading-div')).not.toBeInTheDocument()
  })
})