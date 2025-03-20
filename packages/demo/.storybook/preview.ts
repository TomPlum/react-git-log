import type { Preview } from '@storybook/react'
import './preview.scss'
import '@theme-toggles/react/css/Within.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      }
    }
  }
}

export default preview