import type { Meta, StoryObj } from '@storybook/react';
import { Kerberos4Element } from './Kerberos4Element';

const meta: Meta<typeof Kerberos4Element> = {
  title: 'Meatspace/Kerberos4',
  component: Kerberos4Element,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Kerberos4Element>;

export const Default: Story = {
  args: {
    validationState: 'idle',
    showFaces: true,
    showLabels: true,
  },
};

export const Highlighted: Story = {
  args: {
    validationState: 'valid',
    showFaces: true,
    showLabels: true,
  },
};

export const Minimal: Story = {
  args: {
    validationState: 'idle',
    showFaces: false,
    showLabels: false,
  },
};
