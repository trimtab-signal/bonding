import React from 'react';
import styles from './ListItem.module.css';

export interface ListItemProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  icon,
  title,
  subtitle,
  right,
  onClick,
  className = '',
}) => {
  const cls = [styles.item, onClick ? styles.clickable : '', className].filter(Boolean).join(' ');
  return (
    <div
      className={cls}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {right && <div className={styles.right}>{right}</div>}
    </div>
  );
};
