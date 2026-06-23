import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: FocusEvent) => {
      if (!modalRef.current?.contains(e.target as Node)) modalRef.current?.focus();
    };
    document.addEventListener('focusin', h);
    return () => document.removeEventListener('focusin', h);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  const handleOverlay = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );
  if (!open) return null;

  return createPortal(
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlay}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} ref={modalRef} tabIndex={-1}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button className={styles.close} onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};
