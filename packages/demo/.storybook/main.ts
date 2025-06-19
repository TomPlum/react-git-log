import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(tsx)'
  ],
  staticDirs: [
    '../public'
  ],
  core: {
    disableWhatsNewNotifications: true
  },
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs'
  ],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => {
        return prop.parent ? !/node_modules/.test(prop.parent.fileName) : true
      },
    }
  },
  framework: {
    name: '@storybook/react-vite',
    options: {}
  }
}
export default config