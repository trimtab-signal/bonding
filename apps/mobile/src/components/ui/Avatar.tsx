import React from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps { size?: 'sm' | 'md' | 'lg'; emoji?: string; url?: string; online?: boolean; className?: string; }

export const Avatar: React.FC<AvatarProps> = ({ size = 'md', emoji = '🧬', url, online = false, className = '' }) => (
  <div className={`${styles.avatar} ${styles[size]} ${className}`}>
    {url ? <img src={url} alt="" className={styles.image} /> : <span className={styles.emoji}>{emoji}</span>}
    {online && <span className={styles.online} />}
  </div>
);
