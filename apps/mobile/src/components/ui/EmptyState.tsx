import React from 'react';
import { Button } from './Button';
import styles from './EmptyState.module.css';

export interface EmptyStateProps { icon?: React.ReactNode; title: string; description?: string; action?: { label: string; onClick: () => void }; }

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className={styles.wrapper}>
    {icon && <div className={styles.icon}>{icon}</div>}
    <h3 className={styles.title}>{title}</h3>
    {description && <p className={styles.desc}>{description}</p>}
    {action && <Button variant="primary" size="md" onClick={action.onClick} className={styles.action}>{action.label}</Button>}
  </div>
);
