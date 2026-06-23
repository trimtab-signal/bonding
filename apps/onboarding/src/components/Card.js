import { jsx as _jsx } from 'react/jsx-runtime';
import styles from './Card.module.css';
export const Card = ({ variant = 'default', className = '', children, ...rest }) => {
  const cls = [styles.card, styles[variant], className].filter(Boolean).join(' ');
  return _jsx('div', { className: cls, ...rest, children: children });
};
//# sourceMappingURL=Card.js.map
