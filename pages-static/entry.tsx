import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import '../app/globals.css';
import '../app/identity.css';
import '../app/courses.css';
import '../app/depth-hero.css';
import '../app/course-hub.css';
import '../app/community.css';
import '../app/word-reveal.css';
import '../app/learning-steps-motion.css';
import '../app/learning-photography.css';
import './pages.css';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const locationPath = window.location.pathname;
const pathname = base && (locationPath === base || locationPath.startsWith(`${base}/`))
  ? locationPath.slice(base.length) || '/'
  : locationPath;
const root = document.getElementById('root');
if (!root) throw new Error('The page content container is missing.');
const app = <App pathname={pathname} />;
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
