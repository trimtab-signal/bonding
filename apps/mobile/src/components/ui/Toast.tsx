import React, { useEffect, useRef, useState } from 'react';
import styles from './Toast.module.css';
import type { ToastData } from '../../store/toast-slice';

interface ToastProps extends ToastData { onDismiss: (id: string) => void; }

export const Toast: React.FC<ToastProps> = ({ id, type, title, description, duration = 4000, onDismiss }) => {
  const [leaving, setLeaving] = useState(false);
  const t1 = useRef<ReturnType<typeof setTimeout>>();
  const t2 = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    t1.current = setTimeout(() => { t2.current = setTimeout(() => onDismiss(id), 200); }, duration);
    return () => { clearTimeout(t1.current); clearTimeout(t2.current); };
  }, [duration, id, onDismiss]);

  return (
    <div className={`${styles.toast} ${styles[type]} ${leaving ? styles.exit : styles.enter}`}>
      <div className={styles.icon}>
        {type === 'success' && '✅'}{type === 'error' && '❌'}{type === 'warning' && '⚠️'}{type === 'info' && 'ℹ️'}
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        {description && <div className={styles.desc}>{description}</div>}
      </div>
      <button className={styles.dismiss} onClick={() => { setLeaving(true); setTimeout(() => onDismiss(id), 200); }} aria-label="Dismiss">✕</button>
    </div>
  );
};

import { useToastStore } from '../../store/toast-slice';
export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToastStore();
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2" style={{ position: 'fixed', top: 'calc(1rem + var(--safe-top))', right: '1rem', zIndex: 1100, display: 'flex', flexDirection: 'column', gap: '0.5rem', pointerEvents: 'none', maxWidth: '100%' }}>
      {toasts.map(t => <div key={t.id} style={{ pointerEvents: 'auto' }}><Toast {...t} onDismiss={removeToast} /></div>)}
    </div>
  );
};
