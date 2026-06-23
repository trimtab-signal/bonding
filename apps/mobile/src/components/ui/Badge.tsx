import React from 'react';
import styles from './Badge.module.css';
import type { ZoneId } from '@meatspace/shared-types';

export interface BadgeProps {
  variant?: ZoneId | 'default';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', size = 'md', children, className = '' }) => {
  const cls = [styles.badge, styles[variant], styles[size], className].filter(Boolean).join(' ');
  return <span className={cls}>{children}</span>;
};
