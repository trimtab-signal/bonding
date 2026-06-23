import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...rest
}) => {
  const cls = [styles.button, styles[variant], styles[size], fullWidth ? styles.fullWidth : '', className].filter(Boolean).join(' ');
  return <button className={cls} {...rest}>{children}</button>;
};
