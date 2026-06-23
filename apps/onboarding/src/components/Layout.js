import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import styles from './Layout.module.css';
export const Layout = ({ children, showFooter = true }) => (_jsxs("div", { className: styles.layout, children: [_jsx(Navigation, {}), _jsx("main", { className: styles.main, children: children }), showFooter && _jsx(Footer, {})] }));
//# sourceMappingURL=Layout.js.map