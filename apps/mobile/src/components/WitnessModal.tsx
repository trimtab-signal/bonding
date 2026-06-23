import React from 'react';
import { Modal, Button } from './ui';
import styles from './WitnessModal.module.css';

export interface WitnessRequest {
  nonce: string;
  requesterId: string;
  requesterName: string;
  timestamp: number;
}

interface WitnessModalProps {
  request: WitnessRequest | null;
  onAccept: (nonce: string) => void;
  onReject: (nonce: string) => void;
}

export const WitnessModal: React.FC<WitnessModalProps> = ({ request, onAccept, onReject }) => {
  if (!request) return null;
  return (
    <Modal open={!!request} onClose={() => onReject(request.nonce)} title="Witness Request">
      <div className={styles.content}>
        <span className={styles.icon}>👁️</span>
        <p>
          <strong>{request.requesterName || request.requesterId.slice(0, 8)}</strong> asks you to
          witness their presence.
        </p>
        <p className={styles.meta}>Verifying they are physically at this zone.</p>
        <div className={styles.actions}>
          <Button variant="ghost" onClick={() => onReject(request.nonce)}>
            Decline
          </Button>
          <Button variant="primary" onClick={() => onAccept(request.nonce)}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};
