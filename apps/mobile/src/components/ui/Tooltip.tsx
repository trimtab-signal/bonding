import React, { useState } from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [v, setV] = useState(false);
  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setV(true)}
      onMouseLeave={() => setV(false)}
      onFocus={() => setV(true)}
      onBlur={() => setV(false)}
    >
      {children}
      {v && <div className={`${styles.tip} ${styles[position]}`}>{content}</div>}
    </div>
  );
};
