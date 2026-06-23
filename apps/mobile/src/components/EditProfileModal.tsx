import React, { useState } from 'react';
import { Modal, Button, Avatar } from './ui';
import styles from './EditProfileModal.module.css';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  initialName: string;
  onSave: (name: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onClose, initialName, onSave }) => {
  const [name, setName] = useState(initialName);
  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <div className={styles.content}>
        <Avatar size="lg" />
        <input className={styles.input} value={name} onChange={e => setName(e.target.value)} maxLength={32} autoFocus />
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={!name.trim()} onClick={() => { onSave(name.trim()); onClose(); }}>Save</Button>
        </div>
      </div>
    </Modal>
  );
};
