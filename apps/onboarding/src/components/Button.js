import { jsx as _jsx } from "react/jsx-runtime";
import styles from './Button.module.css';
export const Button = ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...rest }) => {
    const cls = [styles.button, styles[variant], styles[size], fullWidth ? styles.fullWidth : '', className].filter(Boolean).join(' ');
    return _jsx("button", { className: cls, ...rest, children: children });
};
//# sourceMappingURL=Button.js.map