import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showStack: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, showStack: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleOpenCrisp = () => {
    if (typeof window !== 'undefined' && (window as any).$crisp) {
      (window as any).$crisp.push(['do', 'chat:open']);
      (window as any).$crisp.push(['do', 'message:send', ['text', `[Bug Report] Erreur: ${this.state.error?.message || 'Unknown error'}`]]);
    }
  };

  render() {
    if (this.state.hasError) {
      const isDev = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      );

      return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
          <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-8 max-w-lg w-full text-center shadow-lg">
            {/* Error icon */}
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>

            <h2 className="text-xl font-bold text-mono-100 dark:text-white mb-2">
              Une erreur est survenue
            </h2>

            {/* Error message */}
            <div className="bg-mono-975 dark:bg-mono-100 border border-mono-900 dark:border-mono-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-mono-100 dark:text-mono-900 font-mono break-words">
                {this.state.error?.message || 'Erreur inattendue. Veuillez rafraichir la page.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, showStack: false });
                  window.location.reload();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-mono-100 dark:bg-white text-white dark:text-mono-100 px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="w-4 h-4" />
                Rafraichir la page
              </button>

              <button
                onClick={this.handleOpenCrisp}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-mono-900 dark:border-mono-200 text-mono-100 dark:text-white px-5 py-2.5 rounded-xl font-medium hover:bg-mono-975 dark:hover:bg-mono-100 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Signaler le probleme
              </button>
            </div>

            {/* Stack trace (dev only) */}
            {isDev && this.state.error?.stack && (
              <div className="text-left">
                <button
                  onClick={() => this.setState({ showStack: !this.state.showStack })}
                  className="inline-flex items-center gap-1.5 text-xs text-mono-500 dark:text-mono-700 hover:text-mono-100 dark:hover:text-white transition-colors mb-2"
                >
                  {this.state.showStack ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  Stack trace (dev)
                </button>
                {this.state.showStack && (
                  <pre className="bg-mono-975 dark:bg-mono-100 border border-mono-900 dark:border-mono-200 rounded-xl p-4 text-xs text-mono-500 dark:text-mono-700 font-mono overflow-x-auto max-h-48 whitespace-pre-wrap break-words">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
