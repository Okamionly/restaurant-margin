import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import { initErrorTracking } from './utils/errorTracker';

initErrorTracking();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Prefetch the Dashboard chunk during idle time so it's ready when a logged-in
// user navigates after login. Gated on the presence of an auth token: anonymous
// visitors on public/SEO pages (landing, /blog/*, /pricing, crawlers) never reach
// the auth-gated dashboard, so downloading + parsing its chunk on those pages is
// pure waste (hurts TBT/INP on low-end devices and bandwidth). Skip it for them.
if (localStorage.getItem('token')) {
  const prefetchIdleCallback = window.requestIdleCallback || ((cb: IdleRequestCallback) => setTimeout(cb, 2000));
  prefetchIdleCallback(() => {
    import('./pages/Dashboard').catch(() => {});
  });
}
