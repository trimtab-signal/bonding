import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../packages/k4-ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/k4-element/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: { autodocs: 'tag' },
};
export default config;
