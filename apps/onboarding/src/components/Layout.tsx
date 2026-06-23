import { Navigation } from './Navigation';
import { Footer } from './Footer';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => (
  <div className={styles.layout}>
    <Navigation />
    <main className={styles.main}>{children}</main>
    {showFooter && <Footer />}
  </div>
);
