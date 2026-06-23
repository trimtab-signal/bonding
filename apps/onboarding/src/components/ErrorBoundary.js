import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Component } from 'react';
import styles from './ErrorBoundary.module.css';
export class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return _jsxs('div', {
        className: styles.wrap,
        children: [
          _jsx('span', { className: styles.icon, children: '\uD83E\uDDEC' }),
          _jsx('h2', { className: styles.title, children: 'Something shifted' }),
          _jsx('p', {
            className: styles.desc,
            children: 'An unexpected error occurred. The molecule needs a moment.',
          }),
          _jsx('button', {
            className: styles.btn,
            onClick: () => {
              this.setState({ hasError: false });
              window.location.hash = '#/';
            },
            children: 'Relaunch',
          }),
          this.state.error &&
            _jsxs('details', {
              className: styles.details,
              children: [
                _jsx('summary', { children: 'Technical details' }),
                _jsx('pre', { children: this.state.error.message }),
              ],
            }),
        ],
      });
    }
    return this.props.children;
  }
}
//# sourceMappingURL=ErrorBoundary.js.map
