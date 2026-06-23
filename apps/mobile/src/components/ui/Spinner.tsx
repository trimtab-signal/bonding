import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; color?: string; className?: string; }

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'var(--accent)', className = '' }) => {
  return <span className={`${styles.spinner} ${styles[size]} ${className}`} style={{ '--spinner-color': color } as React.CSSProperties} />;
};
