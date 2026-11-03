import '@fontsource-variable/archivo/wdth.css';
import './styles/index.css';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { loadMessages, localeInfo } from './i18n';
import { parsePath } from './routes';
import { pageMeta } from './lib/seo';
import { initAnalytics } from './lib/analytics';
import { Smooth } from './motion/gsap';

const route = parsePath(location.pathname);

async function start() {
  if (route.locale === 'ar') await import('./styles/arabic.css');
  const messages = await loadMessages(route.locale);
  const root = document.getElementById('root')!;

  if (root.hasChildNodes()) {
    hydrateRoot(root, <App route={route} messages={messages} />);
  } else {
    // Dev server: no pre-rendered HTML, so set the document basics here.
    const info = localeInfo(route.locale);
    document.documentElement.lang = route.locale;
    document.documentElement.dir = info.dir;
    document.title = pageMeta(route, messages).title;
    createRoot(root).render(<App route={route} messages={messages} />);
  }
  Smooth.init();
  initAnalytics();
}

start();
