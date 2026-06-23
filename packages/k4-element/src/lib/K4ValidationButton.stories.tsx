import type { Meta, StoryObj } from '@storybook/react';
import K4ValidationButton from './K4ValidationButton';
import './K4ValidationButton.module.css';

const meta: Meta<typeof K4ValidationButton> = {
  title: 'Meatspace/Validation Button',
  component: K4ValidationButton,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof K4ValidationButton>;

export const Default: Story = {
  args: {
    label: 'Validate K4 Topology',
  },
};

export const WithHandlers: Story = {
  args: {
    label: 'Validate K4 Topology',
    onValid: (result) => console.warn('Valid!', result),
    onInvalid: (result) => console.warn('Invalid!', result),
  },
};
