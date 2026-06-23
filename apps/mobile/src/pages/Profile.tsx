import { useState } from 'react';
import { useGameStore } from '../store/game-store';
import { EditProfileModal } from '../components/EditProfileModal';
import { Tabs, Avatar, Card, Badge, ListItem, EmptyState } from '../components/ui';
import styles from './Profile.module.css';

const STAT_TABS = [
  { id: 'bonds', label: 'Bonds' },
  { id: 'log', label: 'Log' },
];

export function Profile() {
  const { userId, bonds, messages, profile, setProfile } = useGameStore();
  const [tab, setTab] = useState('bonds');
  const [editOpen, setEditOpen] = useState(false);

  const stats = [
    ['Bonds', bonds.length],
    ['Type', profile?.atomType || 'friend'],
    ['Zone', profile?.zoneId || 'none'],
    ['Activity', messages.filter(m => m.type === 'success').length],
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Avatar size="lg" emoji="🧬" />
        <h2 className={styles.name}>{profile?.displayName || 'Unnamed Atom'}</h2>
        <button className={styles.editBtn} onClick={() => setEditOpen(true)}>Edit</button>
        <p className={styles.id}>{userId?.slice(0, 12)}...</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map(([label, value]) => (
          <Card key={label as string} padding="0.75rem">
            <div className={styles.stat}>
              <span className={styles.statLabel}>{label}</span>
              <span className={styles.statValue}>{value}</span>
            </div>
          </Card>
        ))}
      </div>

      <Tabs tabs={STAT_TABS} active={tab} onChange={setTab} />

      <div className={styles.body}>
        {tab === 'bonds' ? (
          bonds.length === 0 ? (
            <EmptyState title="No bonds yet" description="Check in at a zone to connect with other atoms." action={{ label: 'Go to Map', onClick: () => {} }} />
          ) : (
            bonds.map(bond => (
              <ListItem
                key={bond.id}
                icon={<Avatar size="sm" emoji="🔗" />}
                title={bond.atomA === userId ? bond.atomB.slice(0, 8) : bond.atomA.slice(0, 8)}
                subtitle={`${bond.status} · ${bond.checkInCount} check-ins`}
                right={<Badge variant="default" size="sm">{bond.status}</Badge>}
              />
            ))
          )
        ) : (
          messages.length === 0 ? (
            <EmptyState title="No activity" description="Your reactions and check-ins will appear here." />
          ) : (
            messages.slice().reverse().map((m, i) => (
              <div key={i} className={styles.logItem}>
                {typeof m.data === 'string' ? m.data : JSON.stringify(m.data)}
              </div>
            ))
          )
        )}
      </div>

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} initialName={profile?.displayName || ''} onSave={(name) => setProfile({ ...profile, displayName: name } as any)} />
    </div>
  );
}
