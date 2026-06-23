import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  className = '',
  children,
  ...rest
}) => {
  const cls = [styles.card, styles[variant], className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
};
