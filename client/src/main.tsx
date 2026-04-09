import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initErrorTracking } from './utils/errorTracker';

initErrorTracking();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Prefetch Dashboard and vendor-charts chunks during idle time
// so they're ready when user navigates after login
const prefetchIdleCallback = window.requestIdleCallback || ((cb: IdleRequestCallback) => setTimeout(cb, 2000));
prefetchIdleCallback(() => {
  import('./pages/Dashboard').catch(() => {});
});
