import React from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}
export interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, active, onChange, className = '' }) => (
  <div className={`${styles.tabs} ${className}`} role="tablist">
    {tabs.map((t) => (
      <button
        key={t.id}
        className={`${styles.tab} ${t.id === active ? styles.active : ''}`}
        onClick={() => onChange(t.id)}
        role="tab"
        aria-selected={t.id === active}
      >
        {t.icon && <span className={styles.icon}>{t.icon}</span>}
        <span>{t.label}</span>
      </button>
    ))}
  </div>
);
