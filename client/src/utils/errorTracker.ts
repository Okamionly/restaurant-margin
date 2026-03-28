interface ErrorLog {
  message: string;
  stack?: string;
  url: string;
  timestamp: string;
  userAgent: string;
}

const errorLogs: ErrorLog[] = [];
const MAX_LOGS = 50;

export function trackError(error: Error | string, context?: string) {
  const entry: ErrorLog = {
    message: typeof error === 'string' ? error : error.message,
    stack: typeof error === 'string' ? undefined : error.stack,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  errorLogs.unshift(entry);
  if (errorLogs.length > MAX_LOGS) errorLogs.pop();

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('[ErrorTracker]', context || '', entry);
  }

  // Try to send to backend (fire and forget)
  try {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(entry),
      }).catch(() => {}); // Silent fail
    }
  } catch {}
}

export function getErrorLogs(): ErrorLog[] {
  return [...errorLogs];
}

// Global error handlers
export function initErrorTracking() {
  window.addEventListener('error', (event) => {
    trackError(event.error || event.message, 'window.onerror');
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackError(String(event.reason), 'unhandledrejection');
  });
}
