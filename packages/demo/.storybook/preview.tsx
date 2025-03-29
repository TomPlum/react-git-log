import type { Preview } from '@storybook/react'
import './preview.scss'
import '@theme-toggles/react/css/Within.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      }
    }
  },
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    )
  ]
}

export default preview