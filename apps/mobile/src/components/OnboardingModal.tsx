import React, { useState } from 'react';
import { Modal, Button } from './ui';
import { useGameStore } from '../store/game-store';
import styles from './OnboardingModal.module.css';

export const OnboardingModal: React.FC = () => {
  const { profile, setProfile } = useGameStore();
  const [open, setOpen] = useState(!profile);
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    setProfile({ ...profile, displayName: name.trim(), atomType: 'friend', zoneId: 'calm' } as any);
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={() => {}} title="Welcome to BONDING">
      <div className={styles.content}>
        <div className={styles.emoji}>🧬</div>
        <p className={styles.desc}>You are an atom. Set your display name to begin.</p>
        <input
          className={styles.input}
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Your name"
          maxLength={32}
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />
        <Button variant="primary" fullWidth disabled={!name.trim()} onClick={handleSave}>
          Enter BONDING
        </Button>
      </div>
    </Modal>
  );
};
