import React from 'react';
import { Card, ListItem, Avatar, Badge, Button } from './ui';
import styles from './NearbySheet.module.css';
import type { AtomPublic } from '@meatspace/shared-types';

interface NearbySheetProps {
  atoms: AtomPublic[];
  onPing: (userId: string) => void;
  onReact: (userId: string) => void;
}

export const NearbySheet: React.FC<NearbySheetProps> = ({ atoms, onPing, onReact }) => (
  <div className={styles.sheet}>
    <h3 className={styles.title}>Nearby Atoms ({atoms.length})</h3>
    {atoms.length === 0 ? (
      <p className={styles.empty}>No atoms nearby yet. Check in to be seen.</p>
    ) : (
      <div className={styles.list}>
        {atoms.map((a) => (
          <Card key={a.id} padding="0.5rem">
            <ListItem
              icon={<Avatar size="sm" emoji="🧬" />}
              title={a.displayName || a.id.slice(0, 8)}
              subtitle={a.atomType}
              right={
                <div className={styles.actions}>
                  <Badge variant={a.zoneId || 'default'} size="sm">
                    {a.zoneId || 'unknown'}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => onPing(a.id)}>
                    Ping
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onReact(a.id)}>
                    React
                  </Button>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    )}
  </div>
);
