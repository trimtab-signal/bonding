import React from 'react';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps { value: number; color?: string; height?: number; className?: string; }

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color = 'var(--accent)', height = 6, className = '' }) => {
  const c = Math.min(100, Math.max(0, value));
  return (
    <div className={`${styles.bar} ${className}`} style={{ height }} role="progressbar" aria-valuenow={c} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles.fill} style={{ width: `${c}%`, background: color }} />
    </div>
  );
};
