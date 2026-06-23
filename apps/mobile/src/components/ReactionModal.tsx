import React from 'react';
import { Modal } from './ui';
import styles from './ReactionModal.module.css';

interface Reaction { emoji: string; label: string; value: string; }
const REACTIONS: Reaction[] = [
  { emoji: '🧪', label: 'Problem Solved', value: 'problem_solved' },
  { emoji: '📦', label: 'Resource Shared', value: 'resource_shared' },
  { emoji: '🤝', label: 'Collaboration', value: 'collaboration' },
  { emoji: '🔬', label: 'Discovery', value: 'discovery' },
  { emoji: '🌱', label: 'Growth', value: 'growth' },
];

interface ReactionModalProps { open: boolean; onClose: () => void; onReact: (reaction: string, targetUserId: string) => void; targetUserId: string; }

export const ReactionModal: React.FC<ReactionModalProps> = ({ open, onClose, onReact, targetUserId }) => (
  <Modal open={open} onClose={onClose} title="Send Reaction">
    <div className={styles.grid}>
      {REACTIONS.map(r => (
        <button key={r.value} className={styles.reaction} onClick={() => { onReact(r.value, targetUserId); onClose(); }}>
          <span className={styles.emoji}>{r.emoji}</span>
          <span className={styles.label}>{r.label}</span>
        </button>
      ))}
    </div>
  </Modal>
);
