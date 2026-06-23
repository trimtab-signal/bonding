import React from 'react';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default', padding = '1rem', onClick, className = '', children, ...rest
}) => {
  const cls = [styles.card, styles[variant], onClick ? styles.clickable : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ padding }} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} {...rest}>
      {children}
    </div>
  );
};
