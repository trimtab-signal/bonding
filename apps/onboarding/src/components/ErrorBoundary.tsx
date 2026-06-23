import { Component, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrap}>
          <span className={styles.icon}>🧬</span>
          <h2 className={styles.title}>Something shifted</h2>
          <p className={styles.desc}>An unexpected error occurred. The molecule needs a moment.</p>
          <button
            className={styles.btn}
            onClick={() => {
              this.setState({ hasError: false });
              window.location.hash = '#/';
            }}
          >
            Relaunch
          </button>
          {this.state.error && (
            <details className={styles.details}>
              <summary>Technical details</summary>
              <pre>{this.state.error.message}</pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
