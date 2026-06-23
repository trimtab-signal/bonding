import type { Meta, StoryObj } from '@storybook/react';
import { Tetrahedron } from './Tetrahedron';
import './Tetrahedron.module.css';

const meta: Meta<typeof Tetrahedron> = {
  title: 'Meatspace/Tetrahedron',
  component: Tetrahedron,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#08080c' }] },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Tetrahedron>;

export const MagnumWalk: Story = {
  args: {
    rotating: true,
    labels: ['BELIEF', 'SOMATIC ACTION', 'STRUCTURAL LOGIC', 'PHYSICAL HEALTH'],
  },
};

export const BlueSteel: Story = {
  args: {
    rotating: false,
    labels: ['BELIEF', 'SOMATIC ACTION', 'STRUCTURAL LOGIC', 'PHYSICAL HEALTH'],
  },
};
